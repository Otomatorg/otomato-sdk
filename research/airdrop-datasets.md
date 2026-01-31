# Public Airdrop Datasets Research

Comprehensive catalog of publicly available airdrop eligibility datasets — address lists, CSV files, JSON merkle trees, and queryable data sources.

---

## Table of Contents

1. [Datasets with Downloadable Address Lists](#1-datasets-with-downloadable-address-lists)
2. [Merkle Tree / JSON Proof Files](#2-merkle-tree--json-proof-files)
3. [On-Chain Queryable Data Sources](#3-on-chain-queryable-data-sources)
4. [Checker Tools (API-based, no raw dump)](#4-checker-tools-api-based-no-raw-dump)
5. [Sybil Detection Datasets](#5-sybil-detection-datasets)
6. [Aggregator / Multi-Airdrop Resources](#6-aggregator--multi-airdrop-resources)
7. [Related Kaggle / Academic Datasets](#7-related-kaggle--academic-datasets)

---

## 1. Datasets with Downloadable Address Lists

These repositories contain actual files (CSV, JSON, TXT) listing eligible wallet addresses that can be downloaded directly.

### Optimism (OP) — Airdrops #1 through #5
- **Repo**: [ethereum-optimism/op-analytics/reference_data/address_lists](https://github.com/ethereum-optimism/op-analytics/tree/main/reference_data/address_lists)
- **Format**: CSV files
- **Files**:
  - `op_airdrop_1_addresses_detailed_list.csv` — 248,699 addresses with category eligibility and total OP eligible
  - `op_airdrop_2_addresses_detailed_list.csv` — 307,965 addresses, 11.7M OP distributed
  - `op_airdrop_3_simple_list.csv` — Governance participation rewards (Jan–Jul 2023 delegation)
  - `op_airdrop_4_simple_list.csv` — NFT creators on Ethereum L1, Base, OP Mainnet, Zora (before Jan 2024)
  - `op_airdrop_5_simple_list.csv` — 54,723 addresses, 10.3M OP (app transactions on 17 Superchain networks, Mar–Sep 2024)
- **Notes**: Official, first-party data. Also mirrored on Dune and Flipside. Numbers in Airdrop #1 are raw (divide by 10^18 for actual OP amounts).
- **Quality**: Official, first-party. Most complete multi-airdrop dataset available anywhere.

### Arbitrum (ARB) — Airdrop
- **Repo**: [benber86/arbitrum-airdrop](https://github.com/benber86/arbitrum-airdrop)
- **Format**: Parsed from on-chain `HasClaim` events
- **Details**: ~625,143 eligible addresses with claimable amounts (625–10,250 ARB). Snapshot: Feb 6, 2023. Airdrop: Mar 23, 2023.
- **Alt**: [0xtoshi/arbichecker](https://github.com/0xtoshi/arbichecker) — Community "Arbitrum Airdrop Data List"

### ENS (Ethereum Name Service) — Airdrop
- **Repo**: [ensdomains/governance-contracts](https://github.com/ensdomains/governance-contracts/blob/master/airdrop.json)
- **Format**: JSON (`airdrop.json`)
- **Details**: ~137,689 eligible addresses. Snapshot: Oct 31, 2021. Based on ENS domain holding duration and registration length.
- **Alt**: [Arachnid's BigQuery Gist](https://gist.github.com/Arachnid/667178e854945abaecb6dfd3b6c0c279) — SQL queries used to generate the original dataset from on-chain data. Authored by Nick Johnson (ENS lead developer).

### Scroll (SCR) — First Airdrop
- **Repo**: [scroll-tech/airdrop-data](https://github.com/scroll-tech/airdrop-data)
- **Format**: Lists within the repository
- **Details**: 570,000+ eligible wallets. 55M SCR (5.5% of supply). Includes contributor lists (open-source repos, ZK papers, hackathon winners, community organizers).
- **Snapshot**: Oct 19, 2024 (minimum 200 Marks required).

### Starknet (STRK) — Provisions
- **Repo**: [starknet-io/provisions-data](https://github.com/starknet-io/provisions-data)
- **Format**: Lists of eligible identities
- **Details**: ~1.3M addresses, 700M+ STRK distributed. Categories: Starknet users (51.3%), StarkEx users, Ethereum stakers/developers, GitHub open-source developers (top 5,000 repos). Snapshot: Nov 15, 2023.
- **Developer allocation**: 10k STRK per qualified Starknet ecosystem dev; 1.8k per Ethereum dev; 111.1 STRK per top-5000-repo contributor.

### zkSync (ZK) — ZKnation
- **Repo**: [zksync-association/zknation-data](https://github.com/zksync-association/zknation-data)
- **Format**: Merkle tree + `github_repo_list.csv` for developer eligibility
- **Details**: 695,232 eligible wallets. 3.675B ZK (17.5% of supply). Snapshot: Mar 24, 2024. Distribution: 0–1k (90,937 users), 1k–5k (477,996), 5k–10k (63,582), 10k–20k (26,871), 20k–50k (18,517), 50k–100k (12,657), >100k (155).
- **Claim instructions** in `/claim-instructions` directory.

### Lido (LDO) — Early Staker Airdrop
- **Repo**: [lidofinance/airdrop-data](https://github.com/lidofinance/airdrop-data)
- **Format**: CSV (`early_stakers_airdrop.csv`)
- **Details**: Retroactive LDO airdrop to early stETH users.
- **Alt**: [lidofinance/lido-retro-airdrop](https://github.com/lidofinance/lido-retro-airdrop) — On-chain implementation.

### Yield Yak — Token Distribution
- **Repo**: [yieldyak/airdrop](https://github.com/yieldyak/airdrop)
- **Format**: CSV files
- **Details**: Initial token distribution CSVs for the Yield Yak protocol.

### StakeDAO — Airdrop
- **Repo**: [StakeDAO/airdrop](https://github.com/StakeDAO/airdrop/blob/main/gr8_addresses.csv)
- **Format**: CSV (`gr8_addresses.csv`)

### Hop Protocol — Airdrop
- **Repo**: [hop-protocol/hop-airdrop](https://github.com/hop-protocol/hop-airdrop)
- **Format**: Full airdrop logic + data + blacklists
- **Details**: Includes sybil attacker reports and blacklist of contract addresses (ParaSwap, 1inch, Uniswap V3, Disperse, Gate.io, MXC, etc.).

### Across Protocol (ACX) — Airdrop
- **Repo**: [across-protocol/acx-drop](https://github.com/across-protocol/acx-drop)
- **Format**: Generated lists + raw event data
- **Details**: 65M ACX to LPs (DAI, ETH/WETH, USDC, WBTC). Pro-rata by USD equivalent size, tokens emitted at each block since protocol inception. Raw event data saved in `/raw` folder for verification.

### ShapeShift (FOX) — Airdrop
- **Repo**: [shapeshift/airdrop](https://github.com/shapeshift/airdrop)
- **Alt**: [shapeshift/airdrop-merkle](https://github.com/shapeshift/airdrop-merkle)
- **Format**: CSV (address + amount)
- **Details**: 340M FOX to 1M+ users. Eligible: ShapeShift customers + governance token holders of 13 DeFi protocols (Gitcoin, Uniswap, SushiSwap, Yearn, Aave, Alchemix, BadgerDAO, 1inch, Compound, Curve, Balancer, Maker, 0x). Threshold: $1,500+ in governance tokens (not staked) as of Jun 9, 2021. Second airdrop: 6.6M FOX to 33,000+ stakers.

### Gelotto — Cosmos Ecosystem Airdrop
- **Repo**: [Gelotto/airdrop-snapshot-info](https://github.com/Gelotto/airdrop-snapshot-info)
- **Format**: TXT files (one address per line)
- **Files**: `atom.txt`, `scrt.txt`, `neta.txt`, plus `GKEY/validators/` subdirectories
- **Details**: Qualified wallet addresses across multiple Cosmos chains (ATOM, SCRT, NETA, KUJI).

### Mars Protocol — Cosmos Airdrop
- **Repo**: [mars-protocol/mars-airdrop-eligibility](https://github.com/mars-protocol/mars-airdrop-eligibility)
- **Format**: Eligible addresses for Mars Airdrop

### APWine — Airdrop
- **Repo**: [APWine/airdrop-addresses](https://github.com/APWine/airdrop-addresses/blob/main/Airdrop.json)
- **Format**: JSON (`Airdrop.json`)

### Composable Finance — Airdrop
- **Repo**: [ComposableFi/airdrop-addresses](https://github.com/ComposableFi/airdrop-addresses)
- **Format**: JSON files (multiple strategies)
- **Details**: Includes addresses from Hop, xPollinate, cBridge v1, and Mosaic users. 51 stars, 192 forks.

### Developer DAO ($CODE) — Airdrop
- **Repo**: [Developer-DAO/token-airdrop-whitelist](https://github.com/Developer-DAO/token-airdrop-whitelist)
- **Format**: Merkle tree whitelist
- **Details**: 906 unique addresses (Devs for Revolution NFT holders before block #13612670).
- **Alt**: [Developer-DAO/member-and-early-contributor-rewards](https://github.com/Developer-DAO/member-and-early-contributor-rewards)

### Shibance — Airdrop
- **Repo**: [shibance/shibance-airdrop](https://github.com/shibance/shibance-airdrop/blob/main/Airdrop_Addresses.csv)
- **Format**: CSV (`Airdrop_Addresses.csv`)

### Divicoin — Airdrops
- **Repo**: [Divicoin/airdrops](https://github.com/Divicoin/airdrops)
- **Format**: Generated files (qualified addresses, quantities, balances)
- **Details**: Includes wallet discovery, balance filtering, and proportional distribution logic.

### Aaron Network — Airdrop Data
- **Repo**: [aaronetwork/airdrop-data](https://github.com/aaronetwork/airdrop-data)
- **Format**: Address lists
- **Details**: Addresses eligible for airdrop and testing rewards, with cumulative rewards.

### OmniBase — LayerZero Airdrop Snapshot
- **Repo**: [OmniBaseXYZ/OmniBase-LayerZero-Airdrop-Snapshot](https://github.com/OmniBaseXYZ/OmniBase-LayerZero-Airdrop-Snapshot)
- **Format**: CSV (`omnibase-layerzero-snapshot.csv`)
- **Details**: Community-compiled LayerZero ZRO airdrop snapshot. ~1.28M qualified users. Snapshot: May 1, 2024.

### Stride Labs — Cosmos stToken Snapshots
- **Repo**: [Stride-Labs/snapshots](https://github.com/Stride-Labs/snapshots)
- **Format**: Regular snapshots
- **Details**: Snapshots of stTIA, stATOM, stOSMO holders. Updated weekly since Feb 2024. Used by projects to include liquid stakers in their airdrops.
- **Alt**: [Stride-Labs/dydx-airdrop](https://github.com/Stride-Labs/dydx-airdrop) — stDYDX holder snapshots (every 14 days).

### Matters — POAP-based Airdrops
- **Repo**: [thematters/airdrops](https://github.com/thematters/airdrops)
- **Format**: Snapshots from POAP and token contracts
- **Details**: Takes snapshots from POAPs and token contracts, distributes tokens to POAP owners. Uses POAP subgraph of The Graph.

---

## 2. Merkle Tree / JSON Proof Files

These contain merkle proofs enabling on-chain claim verification. The full address list is embedded in the tree structure.

### Uniswap (UNI) — Airdrop
- **Repo**: [ajsantander/uni-token-distribution](https://github.com/ajsantander/uni-token-distribution)
- **Format**: ~360MB JSON file via IPFS
- **IPFS**: `curl -X GET "https://ipfs.io/ipfs/Qmegj6pV3qvGE8XWfMPdzXCu2sUoNMGtpbL5vYuAkhnJja" > data.json`
- **Details**: All addresses that interacted with Uniswap before Sep 1, 2020 (including ~12,000 failed txns). 400 UNI per address. 49M UNI to historical LPs. See `data.sample.json` for format.
- **Contract**: [Uniswap/merkle-distributor](https://github.com/Uniswap/merkle-distributor)

### Jito (JTO) — Solana Airdrop
- **Repo**: [jito-foundation/distributor](https://github.com/jito-foundation/distributor)
- **Format**: `merkle_tree.json`
- **Details**: Merkle-based token distributor for Solana. 9,852 unique JitoSOL staker addresses (100+ Jito Points before Nov 25, 2023), 15M JTO to Jito-Solana validators, 5M JTO to MEV searchers.

### Handshake (HNS) — Developer Airdrop
- **Repo**: [handshake-org/hs-airdrop](https://github.com/handshake-org/hs-airdrop)
- **Format**: Merkle tree (SSH/PGP key proofs)
- **Details**: ~175,000 GitHub users with valid SSH/PGP keys (15+ followers as of Feb 4, 2019). 4,246.99 HNS per user. Also: top 100k Alexa domain owners. Includes privacy-preserving encrypted nonces.
- **Gist**: [Handshake airdrop for GitHub users](https://gist.github.com/KoryNunn/7d94d7e630881f99e02626b527e6fe15)

### Aavegotchi — Merkle Airdrop
- **Repo**: [aavegotchi/merkle-airdrop](https://github.com/aavegotchi/merkle-airdrop)
- **Format**: Merkle proofs per address
- **Details**: Supports both Address Airdrops (tokens to wallet) and Token Airdrops (ERC998 composable NFTs into ERC721 tokens).

### Safe (Gnosis Safe) — SAFE Token Allocation
- **Repo**: [safe-global/safe-user-allocation-reports](https://github.com/safe-global/safe-user-allocation-reports)
- **Format**: Allocation reports
- **Details**: 50M SAFE tokens to ~43,000 eligible Safe wallets. Addresses created before Feb 9, 2022 proposal. Average: 2,279 tokens per Safe.

---

## 3. On-Chain Queryable Data Sources

### Dune Analytics — Public Dashboards
All queries on the free tier are public and forkable. Key airdrop dashboards:

| Dashboard | URL |
|-----------|-----|
| ENS Airdrop | [dune.com/hildobby/ENS-Airdrop](https://dune.com/hildobby/ENS-Airdrop) |
| Arbitrum Airdrop Recipients (Public Query) | [dune.com/cryptuschrist/arbitrum-airdrop-public-query-version](https://dune.com/cryptuschrist/arbitrum-airdrop-public-query-version) |
| Arbitrum Airdrop Status & Behavior | [dune.com/0xroll/arbitrum-airdrop](https://dune.com/0xroll/arbitrum-airdrop) |
| Airdrops and Wallets | [dune.com/cypherpepe/airdrops-and-wallets](https://dune.com/cypherpepe/airdrops-and-wallets) |
| Polymarket Potential Airdrop Eligibility | [dune.com/seoul/poly](https://dune.com/seoul/poly) |
| Blockworks Arbitrum Airdrop Research | [dune.com/blockworks_research/arb-airdrop](https://dune.com/blockworks_research/arb-airdrop) |

- Dune maintains curated tables including UNI eligible addresses.
- All public queries exportable to CSV.
- SQL queries can reconstruct any airdrop from on-chain transfer/claim events.

### Flipside Crypto
- **Platform**: [flipsidecrypto.xyz](https://flipsidecrypto.xyz/)
- **GitHub**: [FlipsideCrypto](https://github.com/FlipsideCrypto) (112 repos)
- **SDK**: `pip install flipside` — Programmatic SQL query access, export to CSV/DataFrame.
- **Coverage**: 26+ chains, 2.3T+ rows. Write custom SQL against curated tables.
- **Notes**: Community analysts publish airdrop dashboards with downloadable data.

### Osmosis Airdrop State Export
- **Docs**: [osmosis-labs.github.io/osmosis/integrate/airdrops.html](https://osmosis-labs.github.io/osmosis/integrate/airdrops.html)
- **Details**: Process to create state exports deriving all Osmosis account addresses at a specified block height.

---

## 4. Checker Tools (API-based, no raw dump)

These tools check eligibility via API calls but don't publish raw address lists:

| Tool | URL | Chains/Airdrops |
|------|-----|-----------------|
| Drops.bot | [drops.bot](https://www.drops.bot/) | 314+ airdrops on Cosmos + 7 other networks |
| Jupiter Airdrop Checker | [jup.ag/portfolio/airdrop-checker](https://jup.ag/portfolio/airdrop-checker) | JUP, Solana ecosystem |
| CosmosDrops | [cosmosdrops.io](https://cosmosdrops.io/) | ATOM/OSMO staker airdrops |
| CosmosAirdrops | [cosmosairdrops.io](https://cosmosairdrops.io/) | Full Cosmos ecosystem |
| Airdropped.link | [airdropped.link](https://www.airdropped.link/) | JUP, PYTH, W, JTO, BONK, WEN, DRIFT, ZK, ZRO, etc. |
| Earnifi | [earni.fi](https://earni.fi/) | Multi-chain (tokens, NFTs, POAPs) |
| Diligence DAO Checker | [checker.diligencedao.com](https://checker.diligencedao.com/) | Jupiter, multiple |
| Penumbra Claims | [penumbra.claims](https://penumbra.claims/info) | Cosmos stakers |

### GitHub Checker Scripts
| Script | URL | Target |
|--------|-----|--------|
| JUP checker (Python) | [oscarsebastian/jup-airdrop-checker](https://github.com/oscarsebastian/jup-airdrop-checker) | Jupiter |
| JUP checker (.NET) | [ak1rahunt3r/jupiter-airdrop-checker](https://github.com/ak1rahunt3r/jupiter-airdrop-checker) | Jupiter |
| JUP batch lookup | [bonedaddy/jup-airdrop-check](https://github.com/bonedaddy/jup-airdrop-check) | Jupiter |
| JUP wallet checker (Gist) | [cloakd/ec5b0d9d...](https://gist.github.com/cloakd/ec5b0d9d19badeee17c0d05059c02cb7) | Jupiter (CSV input) |
| UNI checker | [densmirnov/Uniswap-UNI-checker](https://github.com/densmirnov/Uniswap-UNI-checker) | Uniswap |
| ParaSwap checker | [crypt0biwan/paraswap-airdrop-checker](https://github.com/crypt0biwan/paraswap-airdrop-checker) | ParaSwap |
| Wormhole checker | [Axcent-ape/Wormhole-Checker](https://github.com/Axcent-ape/Wormhole-Checker) | Wormhole |
| LayerZero checker (Gist) | [d0zingcat/c81e95fa...](https://gist.github.com/d0zingcat/c81e95fa5cdd43483d42a6cee8836a2e) | LayerZero |
| GRASS checker | [naufaljct48/grass-checker](https://naufaljct48.github.io/grass-checker/) | GRASS |

---

## 5. Sybil Detection Datasets

These contain labeled sybil/non-sybil address datasets, useful for cross-referencing with airdrop data.

### Trusta Labs — Airdrop Sybil Identification
- **Repo**: [TrustaLabs/Airdrop-Sybil-Identification](https://github.com/TrustaLabs/Airdrop-Sybil-Identification)
- **Details**: AI/ML framework for sybil identification. 2-phase approach: graph mining for community detection + behavioral analysis. Includes address tags and analytic codes.

### Arbitrum Foundation — Sybil Detection
- **Repo**: [ArbitrumFoundation/sybil-detection](https://github.com/ArbitrumFoundation/sybil-detection)
- **Details**: Graph-based sybil removal. Uses Louvain Community Detection Algorithm. Partitions into strongly/weakly connected subgraphs.

### LayerZero Labs — Sybil Report
- **Repo**: `LayerZero-Labs/sybil-report` (GitHub)
- **Details**: 198 groups, 7,681 reported sybil addresses. Includes source/destination chains, tx hashes, sender wallets, timestamps, USD values. Snapshot: May 1, 2024.

### Hop Protocol — Sybil Reports
- **Repo**: [hop-protocol/hop-airdrop/issues](https://github.com/hop-protocol/hop-airdrop/issues)
- **Details**: Community-reported sybil clusters in GitHub Issues. Blacklist of contract addresses included in codebase.

### Artemis — Sybil Detection
- **URL**: [research.artemis.xyz](https://research.artemis.xyz/p/announcing-sybil-detection)
- **Details**: ML-based sybil scores trained on pooled data from Arbitrum, Hop, etc. Feature set: transactions, distinct addresses, wallet balances.

### Academic Papers
- **"Detecting Sybil Addresses in Blockchain Airdrops"** (arXiv, May 2025) — [arxiv.org/abs/2505.09313](https://arxiv.org/abs/2505.09313) — Supervised ML on BAB (Binance Account Bound) airdrop dataset.
- **"Toward Resilient Airdrop Mechanisms"** (arXiv, Mar 2025) — [arxiv.org/html/2503.14316](https://arxiv.org/html/2503.14316) — Game theory model of hunter/bounty-hunter/organizer dynamics.
- **"Sybil Detection in Web3 Airdrops"** (Springer, 2026) — Case studies: LayerZero, Uniswap, Optimism, Jupiter.

---

## 6. Aggregator / Multi-Airdrop Resources

### Curated Lists
| Resource | URL | Description |
|----------|-----|-------------|
| awesome-airdrop | [PramodDutta/awesome-airdrop](https://github.com/PramodDutta/awesome-airdrop) | Curated list of cryptocurrency airdrops |
| GitHub "airdrop" topic | [github.com/topics/airdrop](https://github.com/topics/airdrop?o=desc&s=updated) | Aggregated repos tagged airdrop |
| GitHub "airdrop-eligibility-checker" topic | [github.com/topics/airdrop-eligibility-checker](https://github.com/topics/airdrop-eligibility-checker) | Eligibility checker repos |
| airdrops.io | [airdrops.io](https://airdrops.io/) | Verified airdrop aggregator |
| AirdropAlert | [airdropalert.com](https://airdropalert.com/) | Airdrop tracking since 2017 |
| Interchain Info Airdrop List | [interchaininfo.zone](https://interchaininfo.zone/resources/cosmos-airdrop-list-updated-4-26-24) | Cosmos ecosystem airdrop list |

### Airdrop Distribution Tools (accept CSV input)
| Tool | URL | Description |
|------|-----|-------------|
| safe-airdrop | [bh2smith/safe-airdrop](https://github.com/bh2smith/safe-airdrop) | Gnosis Safe app, CSV → multi-transfer |
| iosiro/airdropper | [iosiro/airdropper](https://github.com/iosiro/airdropper) | 113,000+ addresses framework (used for VIO) |
| token-MultiSender | [nicefacer/token-MultiSender](https://github.com/nicefacer/token-MultiSender) | CSV-based batch sender, multi-chain |
| Solana bulk distributor | [Jantaroshi/Solana-SPL-token-bulk-distributor](https://github.com/Jantaroshi/Solana-SPL-token-bulk-distributor-directly-to-wallet) | SPL token airdrop from TXT file |
| Cosmos airdrop-tools | [Reecepbcups/airdrop-tools](https://github.com/Reecepbcups/airdrop-tools) | Suite of Cosmos interchain airdrop tools |
| Cosmos traditional airdrop | [notional-labs/airdrop](https://github.com/notional-labs/airdrop) | Traditional Cosmos airdrop tool with block height selection |
| Merkle airdrop starter | [Anish-Agnihotri/merkle-airdrop-starter](https://github.com/Anish-Agnihotri/merkle-airdrop-starter) | Frontend + contracts + merkle tree generator |

---

## 7. Related Kaggle / Academic Datasets

No Kaggle dataset specifically for airdrop-eligible addresses was found, but these labeled address datasets are useful for cross-referencing:

| Dataset | URL | Description |
|---------|-----|-------------|
| MBAL: 10M Crypto Address Labels | [kaggle.com/datasets/yidongchaintoolai/mbal-10m-crypto-address-label-dataset](https://www.kaggle.com/datasets/yidongchaintoolai/mbal-10m-crypto-address-label-dataset) | 10M labeled crypto addresses |
| Labelled Ethereum Addresses | [kaggle.com/datasets/hamishhall/labelled-ethereum-addresses](https://www.kaggle.com/datasets/hamishhall/labelled-ethereum-addresses) | Categorized ETH addresses |
| Ethereum Transactional Dataset | [kaggle.com/datasets/paul92s/ethereum-data](https://www.kaggle.com/datasets/paul92s/ethereum-data) | 500K transactions with addresses |
| Bitcoin Labeled Addresses | [kaggle.com/datasets/leonidgarin/labeled-bitcoin-addresses-and-transactions](https://www.kaggle.com/datasets/leonidgarin/labeled-bitcoin-addresses-and-transactions) | Labeled BTC addresses |
| Cryptocurrency Scam Dataset | [kaggle.com/datasets/zongaobian/cryptocurrency-scam-dataset](https://www.kaggle.com/datasets/zongaobian/cryptocurrency-scam-dataset) | Known scam addresses |
| Token list with holder counts (Gist) | [tayvano/7f8373a...](https://gist.github.com/tayvano/7f8373a290a21568f2666929677daf54) | Token contract addresses with holder counts |

---

## Summary: Top-Priority Datasets for Download

Ranked by data quality, completeness, and ease of access:

| Priority | Airdrop | Eligible Addresses | Format | Direct Download |
|----------|---------|-------------------|--------|-----------------|
| 1 | Optimism (5 airdrops) | 248K–307K per drop | CSV | Yes |
| 2 | Arbitrum | ~625K | Parsed events | Yes |
| 3 | ENS | ~137K | JSON | Yes |
| 4 | zkSync | ~695K | Merkle + CSV | Yes |
| 5 | Starknet Provisions | ~1.3M | Lists | Yes |
| 6 | Uniswap | All interactors pre-Sep 2020 | JSON (360MB via IPFS) | Yes |
| 7 | Scroll | ~570K | Lists | Yes |
| 8 | Hop Protocol | Community data | Code + data | Yes |
| 9 | Across Protocol | LPs | Raw events + generated | Yes |
| 10 | ShapeShift FOX | ~1M | CSV | Yes |
| 11 | Safe (Gnosis) | ~43K | Allocation reports | Yes |
| 12 | Lido (early stakers) | Early stETH users | CSV | Yes |
| 13 | Handshake | ~175K GitHub devs | Merkle tree | Yes |
| 14 | LayerZero (community) | ~1.28M | CSV (community) | Yes |
| 15 | Jito | ~9.8K stakers + validators | Merkle JSON | Yes |
| 16 | Gelotto (Cosmos) | Multi-chain | TXT files | Yes |
| 17 | Mars Protocol | Cosmos | Address list | Yes |
| 18 | Composable Finance | Bridge users | JSON | Yes |
| 19 | Developer DAO | 906 NFT holders | Merkle whitelist | Yes |
| 20 | Stride (stToken snapshots) | Ongoing | Snapshots | Yes |

### Notable Airdrops WITHOUT Public Address Datasets
These major airdrops do not have publicly downloadable address lists on GitHub:
- **EigenLayer (EIGEN)** — Claims only via claims.eigenfoundation.org
- **Wormhole (W)** — ~400K eligible, no public dump (API-only checker)
- **Pudgy Penguins (PENGU)** — 7M+ wallets, API closed, no public list
- **Jupiter (JUP)** — ~955K eligible, API-only checker
- **Blur (BLUR)** — Dynamic eligibility, no static dataset
- **dYdX (DYDX original)** — 64K addresses, no known public GitHub dataset
- **Celestia (TIA)** — ~576K on-chain + ~7.5K devs, no single downloadable list found
- **1inch** — No public dataset found
- **ParaSwap (PSP)** — No public dataset found (checker tool available)

---

## How to Reconstruct Missing Datasets

For airdrops without published address lists, you can reconstruct them:

1. **Dune Analytics**: Write SQL queries against claim/transfer events on the airdrop contract. All free-tier queries are public and forkable.
2. **Flipside Crypto**: Use SQL Studio or Python SDK (`pip install flipside`) to query 26+ chains.
3. **On-chain parsing**: Use tools like [ethers.js](https://docs.ethers.org/) or [web3.py](https://web3py.readthedocs.io/) to parse `Claimed` events from airdrop distributor contracts.
4. **The Graph**: Many airdrop contracts have subgraphs that index claim events.
5. **BigQuery**: Google BigQuery has public Ethereum datasets. See [Arachnid's ENS example](https://gist.github.com/Arachnid/667178e854945abaecb6dfd3b6c0c279).

---

*Last updated: 2026-01-31*
