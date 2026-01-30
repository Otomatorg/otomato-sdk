/**
 * Find Airdrop Claims for a Specific Address
 *
 * Given an Ethereum address, queries all 43 airdrop claim contracts to find
 * which airdrops the address has claimed.
 *
 * For merkle_claim / token_claim airdrops:
 *   - Queries Claimed/TokensClaimed events filtering by the address
 *
 * For direct_transfer airdrops:
 *   - Queries Transfer events where `to` matches the address
 *
 * Usage:
 *   ADDRESS=0xYourAddress npx ts-node examples/UseCases/AirdropClaimLogs/findClaimsByAddress.ts
 *
 * Environment variables:
 *   ADDRESS                 - Ethereum address to check
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
// Config
// ─────────────────────────────────────────────────────────────

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
// Claim checking logic
// ─────────────────────────────────────────────────────────────

interface AddressClaimResult {
  project: string;
  rank: number;
  chain: string;
  tokenSymbol: string;
  totalValue: string;
  claimed: boolean;
  claimTxHash?: string;
  claimBlock?: number;
  claimAmount?: string;
  distributionType: string;
  error?: string;
}

/**
 * For Transfer-based airdrops: look for Transfer(from, to, value)
 * where `to` is the target address. We search from block 0 (or startBlock)
 * to latest. This is a full-history scan, so we use large ranges.
 */
async function checkTransferClaim(
  airdrop: AirdropInfo,
  address: string,
  provider: ethers.JsonRpcProvider
): Promise<AddressClaimResult> {
  const result: AddressClaimResult = {
    project: airdrop.project,
    rank: airdrop.rank,
    chain: getChainName(airdrop.chainId),
    tokenSymbol: airdrop.tokenSymbol,
    totalValue: airdrop.totalValue,
    claimed: false,
    distributionType: airdrop.distributionType,
  };

  const transferTopic = ethers.id('Transfer(address,address,uint256)');
  const addressTopic = ethers.zeroPadValue(address, 32);

  try {
    // Search for Transfer events where `to` matches our address
    const logs = await provider.getLogs({
      address: airdrop.tokenAddress,
      topics: [transferTopic, null, addressTopic],
      fromBlock: 0,
      toBlock: 'latest',
    });

    if (logs.length > 0) {
      result.claimed = true;
      result.claimTxHash = logs[0].transactionHash;
      result.claimBlock = logs[0].blockNumber;

      // Decode the amount from the first transfer
      const iface = new ethers.Interface([
        'event Transfer(address indexed from, address indexed to, uint256 value)',
      ]);
      const parsed = iface.parseLog({
        topics: logs[0].topics as string[],
        data: logs[0].data,
      });
      if (parsed) {
        result.claimAmount = parsed.args.value.toString();
      }
    }
  } catch (err: any) {
    result.error = err.message?.slice(0, 100);
  }

  return result;
}

/**
 * For merkle_claim / token_claim airdrops: look for claim events
 * that reference the target address.
 */
async function checkEventClaim(
  airdrop: AirdropInfo,
  address: string,
  provider: ethers.JsonRpcProvider
): Promise<AddressClaimResult> {
  const result: AddressClaimResult = {
    project: airdrop.project,
    rank: airdrop.rank,
    chain: getChainName(airdrop.chainId),
    tokenSymbol: airdrop.tokenSymbol,
    totalValue: airdrop.totalValue,
    claimed: false,
    distributionType: airdrop.distributionType,
  };

  for (const claimEvent of airdrop.claimEvents) {
    // Skip Transfer events for event-based check (handled separately)
    if (claimEvent.abi.includes('Transfer')) continue;

    try {
      const iface = new ethers.Interface([claimEvent.abi]);
      const eventFragment = iface.fragments.find(
        (f) => f.type === 'event'
      ) as ethers.EventFragment | undefined;

      if (!eventFragment) continue;

      const topic0 = ethers.id(
        `${eventFragment.name}(${eventFragment.inputs.map((i) => i.type).join(',')})`
      );

      // Check if the event has an indexed address parameter
      const addressParamIndex = eventFragment.inputs.findIndex(
        (i) => i.type === 'address' && i.indexed
      );

      let topics: (string | null)[];
      if (addressParamIndex >= 0) {
        // Build topics with the address filter in the right position
        topics = [topic0];
        for (let i = 0; i < eventFragment.inputs.length; i++) {
          if (i === addressParamIndex) {
            topics.push(ethers.zeroPadValue(address, 32));
          } else if (eventFragment.inputs[i].indexed) {
            topics.push(null);
          }
        }
      } else {
        // No indexed address - fetch all events and filter in code
        topics = [topic0];
      }

      const logs = await provider.getLogs({
        address: airdrop.claimContractAddress,
        topics,
        fromBlock: 0,
        toBlock: 'latest',
      });

      for (const log of logs) {
        try {
          const parsed = iface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          });
          if (!parsed) continue;

          // Check if any argument matches the target address
          const hasMatch = parsed.fragment.inputs.some((input) => {
            if (input.type !== 'address') return false;
            return (
              parsed.args[input.name]?.toString().toLowerCase() ===
              address.toLowerCase()
            );
          });

          if (hasMatch) {
            result.claimed = true;
            result.claimTxHash = log.transactionHash;
            result.claimBlock = log.blockNumber;

            // Try to extract the amount
            const amountParam = parsed.fragment.inputs.find(
              (i) => i.name === 'amount' || i.name === 'value'
            );
            if (amountParam) {
              result.claimAmount = parsed.args[amountParam.name].toString();
            }
            return result;
          }
        } catch {
          // skip
        }
      }
    } catch (err: any) {
      result.error = err.message?.slice(0, 100);
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  const address = process.env.ADDRESS;
  if (!address || !ethers.isAddress(address)) {
    console.error(
      'Please set ADDRESS env var to a valid Ethereum address.\n' +
        'Usage: ADDRESS=0x... npx ts-node examples/UseCases/AirdropClaimLogs/findClaimsByAddress.ts'
    );
    process.exit(1);
  }

  console.log(`=== Checking Airdrop Claims for ${address} ===\n`);

  // Build provider cache
  const providers: Map<number, ethers.JsonRpcProvider> = new Map();
  const skippedChains = new Set<number>();

  for (const airdrop of AIRDROP_CLAIMS) {
    if (
      !providers.has(airdrop.chainId) &&
      !skippedChains.has(airdrop.chainId)
    ) {
      const rpcUrl = getRpcUrl(airdrop.chainId);
      if (rpcUrl) {
        providers.set(airdrop.chainId, new ethers.JsonRpcProvider(rpcUrl));
      } else {
        skippedChains.add(airdrop.chainId);
      }
    }
  }

  const results: AddressClaimResult[] = [];

  for (const airdrop of AIRDROP_CLAIMS) {
    const provider = providers.get(airdrop.chainId);
    if (!provider) {
      results.push({
        project: airdrop.project,
        rank: airdrop.rank,
        chain: getChainName(airdrop.chainId),
        tokenSymbol: airdrop.tokenSymbol,
        totalValue: airdrop.totalValue,
        claimed: false,
        distributionType: airdrop.distributionType,
        error: `No RPC for ${getChainName(airdrop.chainId)}`,
      });
      continue;
    }

    process.stdout.write(
      `  [${airdrop.rank}/${AIRDROP_CLAIMS.length}] ${airdrop.project}...`
    );

    let claimResult: AddressClaimResult;
    if (airdrop.distributionType === 'direct_transfer') {
      claimResult = await checkTransferClaim(airdrop, address, provider);
    } else {
      claimResult = await checkEventClaim(airdrop, address, provider);
      // Fallback to Transfer check if no claim event found
      if (!claimResult.claimed && !claimResult.error) {
        const transferResult = await checkTransferClaim(
          airdrop,
          address,
          provider
        );
        if (transferResult.claimed) {
          claimResult = transferResult;
        }
      }
    }

    results.push(claimResult);
    console.log(claimResult.claimed ? ' CLAIMED' : ' not found');
  }

  // ─── Results ───
  console.log('\n=== Results ===\n');

  const claimed = results.filter((r) => r.claimed);
  const notFound = results.filter((r) => !r.claimed && !r.error);
  const errors = results.filter((r) => !!r.error);

  if (claimed.length > 0) {
    console.log(`Claimed airdrops (${claimed.length}):`);
    for (const r of claimed) {
      console.log(
        `  [${r.rank}] ${r.project} (${r.tokenSymbol}) - ${r.totalValue}`
      );
      if (r.claimTxHash) console.log(`       tx: ${r.claimTxHash}`);
      if (r.claimAmount) console.log(`       amount: ${r.claimAmount}`);
    }
  } else {
    console.log('No claimed airdrops found for this address.');
  }

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const r of errors) {
      console.log(`  [${r.rank}] ${r.project}: ${r.error}`);
    }
  }

  console.log(
    `\nTotal: ${claimed.length} claimed, ${notFound.length} not found, ${errors.length} errors`
  );
}

main().catch(console.error);
