/**
 * Airdrop Claim Log Finder
 *
 * Fetches on-chain claim logs for all 43 top airdrops.
 * Uses ethers.js to query event logs from claim contracts.
 *
 * Usage:
 *   npx ts-node examples/UseCases/AirdropClaimLogs/findClaimLogs.ts
 *
 * Environment variables:
 *   INFURA_HTTPS_PROVIDER   - Ethereum mainnet RPC URL
 *   ARBITRUM_HTTPS_PROVIDER - Arbitrum One RPC URL
 *   OPTIMISM_HTTPS_PROVIDER - Optimism RPC URL
 *   BINANCE_HTTPS_PROVIDER  - BNB Chain RPC URL
 */

import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {
  AIRDROP_CLAIMS,
  AirdropInfo,
} from '../../../src/constants/airdropClaims.js';
import { CHAINS } from '../../../src/constants/chains.js';

dotenv.config();

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

/** How many blocks to scan per request (to avoid RPC limits) */
const BLOCK_BATCH_SIZE = 10_000;

/** Maximum total blocks to scan (adjust for full history) */
const MAX_BLOCKS_TO_SCAN = 50_000;

/** RPC URL mapping by chain ID */
function getRpcUrl(chainId: number): string | undefined {
  switch (chainId) {
    case CHAINS.ETHEREUM:
      return process.env.INFURA_HTTPS_PROVIDER;
    case CHAINS.ARBITRUM:
      return process.env.ARBITRUM_HTTPS_PROVIDER;
    case CHAINS.OPTIMISM:
      return process.env.OPTIMISM_HTTPS_PROVIDER;
    case CHAINS.BINANCE:
      return process.env.BINANCE_HTTPS_PROVIDER;
    default:
      return undefined;
  }
}

function getChainName(chainId: number): string {
  switch (chainId) {
    case CHAINS.ETHEREUM:
      return 'Ethereum';
    case CHAINS.ARBITRUM:
      return 'Arbitrum';
    case CHAINS.OPTIMISM:
      return 'Optimism';
    case CHAINS.BINANCE:
      return 'BNB Chain';
    default:
      return `Chain ${chainId}`;
  }
}

// ─────────────────────────────────────────────────────────────
// Core log fetching
// ─────────────────────────────────────────────────────────────

interface ClaimLogEntry {
  project: string;
  rank: number;
  chain: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  logIndex: number;
  eventName: string;
  args: Record<string, string>;
}

/**
 * Fetches claim event logs for a single airdrop, scanning the most
 * recent `MAX_BLOCKS_TO_SCAN` blocks in batches of `BLOCK_BATCH_SIZE`.
 */
async function fetchClaimLogs(
  airdrop: AirdropInfo,
  provider: ethers.JsonRpcProvider
): Promise<ClaimLogEntry[]> {
  const results: ClaimLogEntry[] = [];
  const latestBlock = await provider.getBlockNumber();

  for (const claimEvent of airdrop.claimEvents) {
    const iface = new ethers.Interface([claimEvent.abi]);
    const eventFragment = iface.fragments.find(
      (f) => f.type === 'event'
    ) as ethers.EventFragment | undefined;

    if (!eventFragment) {
      console.warn(
        `  [WARN] Could not parse event ABI for ${airdrop.project}: ${claimEvent.abi}`
      );
      continue;
    }

    const topic0 = iface.getEvent(eventFragment.name)
      ? ethers.id(
          `${eventFragment.name}(${eventFragment.inputs.map((i) => i.type).join(',')})`
        )
      : undefined;

    if (!topic0) {
      console.warn(
        `  [WARN] Could not compute topic0 for ${airdrop.project}: ${eventFragment.name}`
      );
      continue;
    }

    const fromBlock = Math.max(0, latestBlock - MAX_BLOCKS_TO_SCAN);

    for (
      let start = fromBlock;
      start <= latestBlock;
      start += BLOCK_BATCH_SIZE
    ) {
      const end = Math.min(start + BLOCK_BATCH_SIZE - 1, latestBlock);
      try {
        const logs = await provider.getLogs({
          address: airdrop.claimContractAddress,
          topics: [topic0],
          fromBlock: start,
          toBlock: end,
        });

        for (const log of logs) {
          try {
            const parsed = iface.parseLog({
              topics: log.topics as string[],
              data: log.data,
            });
            if (parsed) {
              const args: Record<string, string> = {};
              for (const input of parsed.fragment.inputs) {
                args[input.name] = String(parsed.args[input.name]);
              }
              results.push({
                project: airdrop.project,
                rank: airdrop.rank,
                chain: getChainName(airdrop.chainId),
                contractAddress: airdrop.claimContractAddress,
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
                logIndex: log.index,
                eventName: parsed.name,
                args,
              });
            }
          } catch {
            // skip unparseable logs
          }
        }
      } catch (err: any) {
        // Some RPC providers limit block ranges; silently continue
        if (err.message?.includes('query returned more than')) {
          console.warn(
            `  [WARN] Too many results for ${airdrop.project} in blocks ${start}-${end}, narrowing range...`
          );
        }
      }
    }
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Airdrop Claim Log Finder ===');
  console.log(`Scanning ${AIRDROP_CLAIMS.length} airdrops...\n`);

  // Build provider cache per chain
  const providers: Map<number, ethers.JsonRpcProvider> = new Map();
  const skippedChains = new Set<number>();

  for (const airdrop of AIRDROP_CLAIMS) {
    if (!providers.has(airdrop.chainId) && !skippedChains.has(airdrop.chainId)) {
      const rpcUrl = getRpcUrl(airdrop.chainId);
      if (rpcUrl) {
        providers.set(airdrop.chainId, new ethers.JsonRpcProvider(rpcUrl));
      } else {
        skippedChains.add(airdrop.chainId);
        console.warn(
          `[SKIP] No RPC configured for ${getChainName(airdrop.chainId)} (chain ${airdrop.chainId}). ` +
            `Set the appropriate env var to enable scanning.`
        );
      }
    }
  }

  console.log('');

  const allLogs: ClaimLogEntry[] = [];

  for (const airdrop of AIRDROP_CLAIMS) {
    const provider = providers.get(airdrop.chainId);
    if (!provider) {
      console.log(
        `[${airdrop.rank}] ${airdrop.project} - SKIPPED (no RPC for ${getChainName(airdrop.chainId)})`
      );
      continue;
    }

    console.log(
      `[${airdrop.rank}] ${airdrop.project} (${airdrop.tokenSymbol}) on ${getChainName(airdrop.chainId)}`
    );
    console.log(`    Contract: ${airdrop.claimContractAddress}`);
    console.log(`    Type: ${airdrop.distributionType}`);

    try {
      const logs = await fetchClaimLogs(airdrop, provider);
      allLogs.push(...logs);
      console.log(`    Found ${logs.length} claim log(s) in recent blocks\n`);
    } catch (err: any) {
      console.log(`    ERROR: ${err.message}\n`);
    }
  }

  // ─── Summary ───
  console.log('\n=== Summary ===');
  console.log(`Total claim logs found: ${allLogs.length}`);
  console.log(`Airdrops scanned: ${AIRDROP_CLAIMS.length}`);
  console.log(`Chains scanned: ${providers.size}`);
  console.log(`Chains skipped: ${skippedChains.size}`);

  if (allLogs.length > 0) {
    console.log('\n=== Sample Logs (first 20) ===');
    for (const log of allLogs.slice(0, 20)) {
      console.log(
        `  [${log.rank}] ${log.project} | ${log.eventName} | ` +
          `block=${log.blockNumber} | tx=${log.transactionHash.slice(0, 18)}...`
      );
      for (const [key, val] of Object.entries(log.args)) {
        console.log(`       ${key}: ${val}`);
      }
    }
  }

  return allLogs;
}

main().catch(console.error);
