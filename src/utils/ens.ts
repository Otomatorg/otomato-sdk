import { ethers } from 'ethers';

// Public Ethereum mainnet RPC (publicnode supports ENS contract calls)
const ETH_MAINNET_RPC = 'https://ethereum.publicnode.com';

/**
 * Checks whether the given string looks like an ENS name.
 *
 * @param value - The string to test
 * @returns true if value ends with ".eth"
 */
export function isENSName(value: string): boolean {
  return typeof value === 'string' && value.toLowerCase().endsWith('.eth');
}

/**
 * Resolves an ENS name to its owner's wallet address.
 * Returns null if the name is not registered or the resolution fails.
 *
 * @param name - The ENS name to resolve (e.g. "vitalik.eth")
 * @returns The owner's wallet address, or null if not found
 */
export async function resolveENSName(name: string): Promise<string | null> {
  try {
    const provider = new ethers.JsonRpcProvider(ETH_MAINNET_RPC);
    return await provider.resolveName(name);
  } catch {
    return null;
  }
}

/**
 * Resolves a value that may be either a wallet address or an ENS name.
 * If it is an ENS name, resolves it to an address; otherwise returns the value as-is.
 * Returns null if resolution fails.
 *
 * @param addressOrName - A wallet address or an ENS name
 * @returns The resolved wallet address, or null if resolution failed
 */
export async function resolveAddressOrENSName(addressOrName: string): Promise<string | null> {
  if (isENSName(addressOrName)) {
    return resolveENSName(addressOrName);
  }
  return addressOrName;
}
