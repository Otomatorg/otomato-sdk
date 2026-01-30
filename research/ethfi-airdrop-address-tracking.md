# Technical Research: Determining All Addresses That Received the ETHFI Airdrop

## Context

**Token:** ETHFI (ether.fi governance token)
**Contract:** `0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb` (Ethereum Mainnet)
**Goal:** Determine the process to identify all addresses that received the ETHFI token airdrop.

---

## 1. ETHFI Token Background

- **Total supply:** 1,000,000,000 ETHFI (fixed, no further issuance)
- **Holders:** ~107,000+
- **Total transfers:** ~574,000+
- **Deployer:** `0xf8a86ea1Ac39EC529814c377Bd484387D395421e` (labeled "ether.fi: Deployer")
- **Initial mint recipient (Treasury):** `0x7A6A41F353B3002751d94118aA7f4935dA39bB53`

### Airdrop Seasons

| Season | Supply % | Tokens | Period | Notes |
|--------|----------|--------|--------|-------|
| Season 1 | ~7.5% | ~68M | Mar 18, 2024 (90-day claim window) | Snapshot: 03-15-2024 0:01 UTC |
| Season 2 | ~5.8% | ~58M | Mid-2024 | 3-8M bonus from DAO treasury for small stakers |
| Season 3 | ~2.7% | ~25M | Late 2024 | Final major airdrop from initial allocation |
| Season 5 | 1% | 10M | Feb 1 - May 31, 2025 | Latest season |

Total airdrop allocation: ~16% of supply across all seasons.

---

## 2. Process to Identify All Airdrop Recipients

There are **three complementary approaches**, listed from simplest to most comprehensive.

### Approach A: Query ERC-20 Transfer Events via Etherscan API

This is the most straightforward method. Every ERC-20 token transfer emits a `Transfer(address indexed from, address indexed to, uint256 value)` event. The airdrop claim process triggers these Transfer events.

**Step 1: Identify the airdrop distributor contract(s)**

The ETHFI airdrop used a claim-based model (users claim via `claim.ether.fi`), which means a distributor contract (likely a Merkle Distributor pattern) holds tokens and releases them when users submit valid proofs.

To find the distributor contract:
- Look at early outgoing transfers from the Treasury address `0x7A6A41F353B3002751d94118aA7f4935dA39bB53`
- Filter for large transfers around the airdrop launch date (March 18, 2024, block ~19,460,000)
- The recipient of these large treasury transfers is likely the claim/distributor contract
- Alternatively, inspect any known ETHFI Season 1 claim transaction on Etherscan and check which contract the `claim()` function was called on

Known treasury-related wallets:
- `0x7A6A41F353B3002751d94118aA7f4935dA39bB53` (Ecosystem Fund)
- `0x7D4bBE471369a066186c18bAF33622796A08d5Cd`
- `0x5f0E7A424d306e9E310be4f5Bb347216e473Ae55`
- `0xD022d6bb8B6C1C357ec77D930Dc6A0aD40FFC90b`

**Step 2: Query all transfers FROM the distributor contract**

```
GET https://api.etherscan.io/api
  ?module=account
  &action=tokentx
  &contractaddress=0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb
  &address=<DISTRIBUTOR_CONTRACT_ADDRESS>
  &startblock=19460000
  &endblock=99999999
  &page=1
  &offset=10000
  &sort=asc
  &apikey=YOUR_API_KEY
```

**Step 3: Collect all unique `to` addresses**

Filter results where `from` equals the distributor contract address. Each unique `to` address is an airdrop recipient.

**Important limitation:** Etherscan's free API returns max **10,000 records per query**. For an airdrop with 100,000+ recipients, you need to paginate using `page` and `offset` parameters, or narrow the `startblock`/`endblock` range.

**Pseudocode:**

```python
import requests

API_KEY = "YOUR_ETHERSCAN_API_KEY"
TOKEN = "0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb"
DISTRIBUTOR = "<DISTRIBUTOR_ADDRESS>"  # To be determined

recipients = set()
page = 1

while True:
    url = (
        f"https://api.etherscan.io/api"
        f"?module=account&action=tokentx"
        f"&contractaddress={TOKEN}"
        f"&address={DISTRIBUTOR}"
        f"&startblock=19460000&endblock=99999999"
        f"&page={page}&offset=10000&sort=asc"
        f"&apikey={API_KEY}"
    )
    resp = requests.get(url).json()
    results = resp.get("result", [])

    if not results or isinstance(results, str):
        break

    for tx in results:
        if tx["from"].lower() == DISTRIBUTOR.lower():
            recipients.add(tx["to"].lower())

    if len(results) < 10000:
        break
    page += 1

print(f"Found {len(recipients)} unique airdrop recipients")
```

### Approach B: Query Raw Event Logs via eth_getLogs (RPC or Etherscan)

This approach queries the raw `Transfer` event logs directly from the ETHFI token contract, giving more control and potentially better performance.

**Transfer event signature:**
```
Transfer(address indexed from, address indexed to, uint256 value)
Topic0: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
```

**Using Etherscan getLogs API:**
```
GET https://api.etherscan.io/api
  ?module=logs
  &action=getLogs
  &address=0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb
  &topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
  &topic1=<DISTRIBUTOR_ADDRESS_AS_TOPIC>
  &fromBlock=19460000
  &toBlock=99999999
  &apikey=YOUR_API_KEY
```

Where `topic1` is the `from` address (the distributor) padded to 32 bytes:
```
topic1 = 0x000000000000000000000000<DISTRIBUTOR_ADDRESS_WITHOUT_0x>
```

**Using ethers.js (direct RPC):**
```typescript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY");
const tokenAddress = "0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb";
const distributorAddress = "<DISTRIBUTOR_ADDRESS>";

const transferTopic = ethers.id("Transfer(address,address,uint256)");
const fromTopic = ethers.zeroPadValue(distributorAddress, 32);

const logs = await provider.getLogs({
    address: tokenAddress,
    topics: [transferTopic, fromTopic],
    fromBlock: 19460000,
    toBlock: "latest"
});

const recipients = new Set<string>();
for (const log of logs) {
    // topic[2] is the 'to' address (padded to 32 bytes)
    const toAddress = ethers.getAddress("0x" + log.topics[2].slice(26));
    recipients.add(toAddress.toLowerCase());
}

console.log(`Found ${recipients.size} unique airdrop recipients`);
```

**Limitation:** The Etherscan getLogs endpoint returns max **1,000 results**. For RPC providers (Alchemy, Infura), limits vary but you may need to chunk by block range.

### Approach C: Dune Analytics (SQL-based, Pre-built Dashboards)

Dune Analytics has existing dashboards that track ETHFI airdrop data:

- **[ETHFI Airdrop Season 1 + 2](https://dune.com/0xludic/ethfi-airdrop)** by `0xludic`
- **[ETHFI Claims Season 1 & 2](https://dune.com/yulia_is_here/ethfi)** by `yulia_is_here`
- **[21co EtherFi Airdrop](https://dune.com/21co/etherfi-airdrop)** by 21co

**Writing your own query:**

```sql
-- All unique addresses that received ETHFI from the airdrop distributor
SELECT DISTINCT
    "to" AS recipient,
    COUNT(*) AS claim_count,
    SUM(value / 1e18) AS total_ethfi_received
FROM erc20_ethereum.evt_Transfer
WHERE contract_address = 0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb
  AND "from" = <DISTRIBUTOR_ADDRESS>           -- the claim contract
  AND block_time >= TIMESTAMP '2024-03-18'     -- Season 1 start
GROUP BY 1
ORDER BY total_ethfi_received DESC
```

**Advantage:** Dune has pre-indexed all Ethereum events, so queries run fast with no API rate limits. You can also fork existing dashboards and modify the queries.

---

## 3. Step-by-Step Recommended Process

### Phase 1: Identify the Distributor Contract

1. Go to Etherscan: `https://etherscan.io/token/0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb`
2. Click on the "Transfers" tab
3. Sort by oldest first and look at the first few days of transfers (around March 18, 2024)
4. Identify the address that is the `from` in most claim transactions — this is the distributor contract
5. Alternatively, find any known Season 1 claim transaction and check which contract received the `claim()` call

### Phase 2: Extract All Recipients

Choose one of:

| Method | Best For | Rate Limits | Cost |
|--------|----------|-------------|------|
| **Etherscan API (tokentx)** | Quick prototyping, small-medium datasets | 5 calls/sec (free), 10K results/page | Free tier available |
| **eth_getLogs (RPC)** | Programmatic integration, precise filtering | Provider-dependent | Alchemy/Infura free tiers |
| **Dune Analytics** | Full dataset, SQL exploration, no pagination | None for queries | Free tier available |

### Phase 3: Validate & Deduplicate

1. Collect all unique `to` addresses from Transfer events originating from the distributor
2. Remove any known contracts (exchanges, DEX routers, bridges) if you only want EOAs
3. Cross-reference with the total claimed amount from ether.fi's official data
4. Separate by season if the distributor contracts are different per season

### Phase 4: Enrich Data (Optional)

For each recipient address, you can enrich with:
- Current ETHFI balance (did they hold or sell?)
- ENS name resolution
- Other token holdings (cross-protocol activity)
- Transaction count / wallet age

---

## 4. Key Technical Considerations

### Multi-chain Claims
ETHFI claims were available on Ethereum mainnet, Arbitrum, and Base. To get a complete picture, you need to query Transfer events on all three chains. The token contract addresses may differ across chains.

### Merkle Distributor Pattern
The ether.fi airdrop likely uses a Merkle Distributor contract where:
- A merkle root is stored on-chain representing all eligible (address, amount) pairs
- Users call `claim(index, account, amount, merkleProof)` to receive tokens
- The contract emits a `Claimed(index, account, amount)` event in addition to the ERC-20 `Transfer` event
- Querying the `Claimed` event (if available) gives you cleaner data than filtering Transfer events

### Rate Limiting & Pagination
- Etherscan free tier: 5 calls/second, 10,000 results per page
- Etherscan getLogs: max 1,000 results per query
- RPC providers: typically 10,000 logs per query, chunk by block range
- Dune: no pagination needed, but complex queries may time out

### Token vs. Airdrop Transfers
Not all ETHFI Transfer events are airdrop claims. To isolate airdrop recipients specifically, you must filter by the distributor contract as the `from` address. Otherwise you'll include secondary market transfers, DEX swaps, exchange deposits, etc.

---

## 5. Relevance to Otomato SDK

The Otomato SDK already has several building blocks that could be used to implement airdrop tracking:

- **ERC20 Balance Check trigger** — Monitor if a wallet received ETHFI tokens
- **Balance Movement trigger** — Detect incoming token transfers with directional filtering
- **Token Transfer monitoring** — Track Transfer events with sender/recipient filtering
- **RPC Services** (`src/services/RpcServices.ts`) — Multi-chain RPC provider already supports Ethereum mainnet
- **ethers.js v6** — Already a dependency, can be used for `eth_getLogs` queries

A potential Otomato workflow could:
1. **Trigger** on Transfer events from the ETHFI token contract where `from` = distributor address
2. **Action** to log or store the recipient address
3. **Action** to send a notification or update a database with new recipients

---

## Sources

- [ETHFI Token on Etherscan](https://etherscan.io/token/0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb)
- [Etherscan tokentx API](https://docs.etherscan.io/api-reference/endpoint/tokentx)
- [Dune: ETHFI Airdrop Season 1 + 2](https://dune.com/0xludic/ethfi-airdrop)
- [Dune: ETHFI Claims](https://dune.com/yulia_is_here/ethfi)
- [ether.fi Airdrop Season 1 Docs](https://etherfi.gitbook.io/gov/airdrop-season-1)
- [ether.fi ETHFI Allocations](https://etherfi.gitbook.io/gov/ethfi-allocations)
- [ether.fi Governance Token Announcement](https://etherfi.medium.com/announcing-ethfi-the-ether-fi-governance-token-8cae7327763a)
- [ether.fi Smart Contracts Repo](https://github.com/etherfi-protocol/smart-contracts)
