import { ethers } from 'ethers';

// Public Ethereum mainnet RPC endpoints with ENS contract call support
const ETH_MAINNET_RPCS = [
  'https://ethereum-rpc.publicnode.com',
  'https://eth.llamarpc.com',
  'https://eth-mainnet.public.blastapi.io',
  'https://ethereum.public.blockpi.network/v1/rpc/public',
  'https://eth.rpc.blxrbdn.com',
  'https://0xrpc.io/eth',
];

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
 * Resolves an ENS name to its resolved wallet address.
 * Queries all RPC endpoints in parallel and returns the first successful result.
 * Returns null if the name is not registered or all endpoints fail.
 *
 * @param name - The ENS name to resolve (e.g. "vitalik.eth")
 * @returns The resolved wallet address, or null if not found
 */
export async function resolveENSName(name: string): Promise<string | null> {
  try {
    return await Promise.any(
      ETH_MAINNET_RPCS.map(async (rpc) => {
        const provider = new ethers.JsonRpcProvider(rpc);
        const address = await provider.resolveName(name);
        if (address === null) throw new Error('not found');
        return address;
      })
    );
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
