import { Connection, PublicKey } from "@solana/web3.js";
import type {
  ParsedTransactionWithMeta,
  ConfirmedSignatureInfo,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// ── Configuration ──────────────────────────────────────────────────────────
const PENGU_TOKEN_MINT = "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv";
const DISTRIBUTOR_ADDRESS = "3HA76bpwHuST6Uo9BouJ4A5GpAiDuerr7QBenUqbXZAL";
const AIRDROP_START = new Date("2024-12-17T13:00:00Z");
const TOKEN_DECIMALS = 6;

// Solana RPC endpoint — use a private RPC for production workloads.
// Public endpoints have aggressive rate limits.
const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

// How many signatures to fetch per RPC call (max 1000)
const SIGNATURES_BATCH_SIZE = 1000;

// How many transactions to fetch in parallel per batch
const TX_PARSE_CONCURRENCY = 10;

// Maximum number of signatures to process (set to Infinity for all)
const MAX_SIGNATURES = Number(process.env.MAX_SIGNATURES) || 50;

// Output file path
const OUTPUT_FILE = path.join(
  process.cwd(),
  "pengu_airdrop_addresses.json"
);

// ── Types ──────────────────────────────────────────────────────────────────
interface AirdropRecipient {
  address: string;
  amount: number; // human-readable (divided by 10^decimals)
  signature: string;
  blockTime: number | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch all transaction signatures for the distributor address,
 * paginating backwards from the most recent.
 */
async function fetchSignatures(
  connection: Connection,
  address: PublicKey,
  maxSignatures: number
): Promise<ConfirmedSignatureInfo[]> {
  const allSignatures: ConfirmedSignatureInfo[] = [];
  let before: string | undefined = undefined;

  while (allSignatures.length < maxSignatures) {
    const limit = Math.min(
      SIGNATURES_BATCH_SIZE,
      maxSignatures - allSignatures.length
    );

    console.log(
      `  Fetching signatures batch (before=${before ? before.slice(0, 12) + "..." : "latest"}, limit=${limit})...`
    );

    const batch = await connection.getSignaturesForAddress(address, {
      before,
      limit,
    });

    if (batch.length === 0) break;

    allSignatures.push(...batch);
    before = batch[batch.length - 1].signature;

    console.log(
      `  Got ${batch.length} signatures (total: ${allSignatures.length})`
    );

    // Small delay to avoid rate limiting
    await sleep(500);
  }

  return allSignatures;
}

/**
 * Parse a single transaction and extract PENGU token transfers
 * from the distributor to recipient addresses.
 */
function extractAirdropRecipients(
  tx: ParsedTransactionWithMeta,
  signature: string
): AirdropRecipient[] {
  const recipients: AirdropRecipient[] = [];

  if (!tx?.meta || tx.meta.err) return recipients;

  // Look at inner instructions and main instructions for SPL token transfers
  const allInstructions = [
    ...(tx.transaction.message.instructions || []),
    ...(tx.meta.innerInstructions?.flatMap((ix) => ix.instructions) || []),
  ];

  for (const ix of allInstructions) {
    // We need parsed instructions from the Token Program
    if (!("parsed" in ix)) continue;

    const parsed = ix.parsed;
    if (!parsed || typeof parsed !== "object") continue;

    const { type, info } = parsed;

    // Match transfer or transferChecked instructions
    if (type === "transfer" || type === "transferChecked") {
      const mint =
        info.mint || // transferChecked has mint
        undefined;

      // For regular `transfer`, we can't directly filter by mint from the
      // instruction alone — we check the token amount and authority instead.
      const authority: string = info.authority || info.multisigAuthority || "";
      const source: string = info.source || "";
      const destination: string = info.destination || "";

      // Get the amount
      let amount: number;
      if (type === "transferChecked" && info.tokenAmount) {
        amount = parseFloat(info.tokenAmount.uiAmount || "0");
      } else {
        amount = parseInt(info.amount || "0", 10) / 10 ** TOKEN_DECIMALS;
      }

      if (amount <= 0) continue;

      // We'll collect all token transfers and filter by account owners below
      recipients.push({
        address: destination, // This is the token account, we resolve owner below
        amount,
        signature,
        blockTime: tx.blockTime ?? null,
      });
    }
  }

  return recipients;
}

/**
 * Resolve token account addresses to their owner wallet addresses
 * by inspecting the transaction's account keys and post-token balances.
 */
function resolveOwners(
  tx: ParsedTransactionWithMeta,
  recipients: AirdropRecipient[]
): AirdropRecipient[] {
  if (!tx?.meta?.postTokenBalances || recipients.length === 0) return [];

  const resolved: AirdropRecipient[] = [];

  // Build a map from token account address to owner from postTokenBalances
  const tokenAccountToOwner = new Map<string, string>();
  const tokenAccountToMint = new Map<string, string>();

  for (const balance of tx.meta.postTokenBalances) {
    const accountKey =
      tx.transaction.message.accountKeys[balance.accountIndex];
    if (accountKey) {
      const address =
        typeof accountKey === "string"
          ? accountKey
          : accountKey.pubkey.toBase58();
      tokenAccountToOwner.set(address, balance.owner || "");
      tokenAccountToMint.set(address, balance.mint || "");
    }
  }

  for (const recipient of recipients) {
    const mint = tokenAccountToMint.get(recipient.address);
    const owner = tokenAccountToOwner.get(recipient.address);

    // Filter: must be PENGU token and not a self-transfer back to distributor
    if (
      mint === PENGU_TOKEN_MINT &&
      owner &&
      owner !== DISTRIBUTOR_ADDRESS
    ) {
      resolved.push({
        ...recipient,
        address: owner, // Replace token account with owner wallet
      });
    }
  }

  return resolved;
}

/**
 * Process a batch of transaction signatures, fetching and parsing each.
 */
async function processSignatureBatch(
  connection: Connection,
  signatures: string[]
): Promise<AirdropRecipient[]> {
  const results: AirdropRecipient[] = [];

  // Process in chunks for concurrency control
  for (let i = 0; i < signatures.length; i += TX_PARSE_CONCURRENCY) {
    const chunk = signatures.slice(i, i + TX_PARSE_CONCURRENCY);

    const txPromises = chunk.map(async (sig) => {
      try {
        const tx = await connection.getParsedTransaction(sig, {
          maxSupportedTransactionVersion: 0,
        });
        if (!tx) return [];
        const recipients = extractAirdropRecipients(tx, sig);
        return resolveOwners(tx, recipients);
      } catch (err: any) {
        if (err?.message?.includes("429")) {
          console.warn(`  Rate limited on ${sig.slice(0, 12)}..., retrying after delay...`);
          await sleep(2000);
          try {
            const tx = await connection.getParsedTransaction(sig, {
              maxSupportedTransactionVersion: 0,
            });
            if (!tx) return [];
            const recipients = extractAirdropRecipients(tx, sig);
            return resolveOwners(tx, recipients);
          } catch {
            console.warn(`  Skipping ${sig.slice(0, 12)}... after retry failure`);
            return [];
          }
        }
        console.warn(`  Error parsing tx ${sig.slice(0, 12)}...: ${err.message}`);
        return [];
      }
    });

    const batchResults = await Promise.all(txPromises);
    for (const batch of batchResults) {
      results.push(...batch);
    }

    // Small delay between chunks
    if (i + TX_PARSE_CONCURRENCY < signatures.length) {
      await sleep(300);
    }
  }

  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== PENGU Airdrop Address Fetcher ===\n");
  console.log(`RPC URL: ${SOLANA_RPC_URL}`);
  console.log(`Distributor: ${DISTRIBUTOR_ADDRESS}`);
  console.log(`PENGU Token: ${PENGU_TOKEN_MINT}`);
  console.log(`Max signatures to process: ${MAX_SIGNATURES}`);
  console.log("");

  const connection = new Connection(SOLANA_RPC_URL, {
    commitment: "confirmed",
  });

  // Step 1: Fetch transaction signatures for the distributor
  console.log("Step 1: Fetching transaction signatures from distributor...");
  const distributorPubkey = new PublicKey(DISTRIBUTOR_ADDRESS);
  const signatures = await fetchSignatures(
    connection,
    distributorPubkey,
    MAX_SIGNATURES
  );

  console.log(`\nFound ${signatures.length} total signatures\n`);

  if (signatures.length === 0) {
    console.log("No signatures found. Exiting.");
    return;
  }

  // Filter signatures after the airdrop start time
  const filteredSignatures = signatures.filter((sig) => {
    if (!sig.blockTime) return true; // include if no timestamp
    return sig.blockTime >= Math.floor(AIRDROP_START.getTime() / 1000);
  });

  console.log(
    `Signatures after airdrop start (${AIRDROP_START.toISOString()}): ${filteredSignatures.length}\n`
  );

  // Step 2: Parse transactions and extract recipients
  console.log("Step 2: Parsing transactions for PENGU token transfers...\n");

  const sigStrings = filteredSignatures.map((s) => s.signature);
  const allRecipients = await processSignatureBatch(connection, sigStrings);

  console.log(`\nExtracted ${allRecipients.length} total transfer events\n`);

  // Step 3: Deduplicate and aggregate by address
  console.log("Step 3: Aggregating by recipient address...\n");

  const addressMap = new Map<
    string,
    { totalAmount: number; claimCount: number; firstClaim: number | null; signatures: string[] }
  >();

  for (const recipient of allRecipients) {
    const existing = addressMap.get(recipient.address);
    if (existing) {
      existing.totalAmount += recipient.amount;
      existing.claimCount += 1;
      existing.signatures.push(recipient.signature);
      if (
        recipient.blockTime &&
        (!existing.firstClaim || recipient.blockTime < existing.firstClaim)
      ) {
        existing.firstClaim = recipient.blockTime;
      }
    } else {
      addressMap.set(recipient.address, {
        totalAmount: recipient.amount,
        claimCount: 1,
        firstClaim: recipient.blockTime,
        signatures: [recipient.signature],
      });
    }
  }

  // Sort by total amount descending
  const sortedAddresses = Array.from(addressMap.entries())
    .map(([address, data]) => ({
      address,
      totalAmount: data.totalAmount,
      claimCount: data.claimCount,
      firstClaim: data.firstClaim
        ? new Date(data.firstClaim * 1000).toISOString()
        : null,
      sampleSignature: data.signatures[0],
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // Step 4: Output results
  console.log(`=== Results ===`);
  console.log(`Unique recipient addresses: ${sortedAddresses.length}`);
  console.log(
    `Total PENGU distributed (in sample): ${sortedAddresses.reduce((sum, a) => sum + a.totalAmount, 0).toLocaleString()}`
  );
  console.log("");

  // Print top addresses
  const displayCount = Math.min(20, sortedAddresses.length);
  console.log(`Top ${displayCount} recipients:`);
  console.log("-".repeat(100));
  console.log(
    `${"#".padEnd(5)} ${"Address".padEnd(46)} ${"Amount".padStart(20)} ${"Claims".padStart(8)} First Claim`
  );
  console.log("-".repeat(100));

  for (let i = 0; i < displayCount; i++) {
    const entry = sortedAddresses[i];
    console.log(
      `${String(i + 1).padEnd(5)} ${entry.address.padEnd(46)} ${entry.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }).padStart(20)} ${String(entry.claimCount).padStart(8)} ${entry.firstClaim || "N/A"}`
    );
  }

  // Save to file
  const output = {
    metadata: {
      penguToken: PENGU_TOKEN_MINT,
      distributor: DISTRIBUTOR_ADDRESS,
      airdropStart: AIRDROP_START.toISOString(),
      fetchedAt: new Date().toISOString(),
      totalSignaturesProcessed: filteredSignatures.length,
      uniqueRecipients: sortedAddresses.length,
    },
    recipients: sortedAddresses,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nFull results saved to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
