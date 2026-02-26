const HL_NAMES_API_BASE_URL = 'https://api.hlnames.xyz';
const HL_NAMES_API_KEY = 'CPEPKMI-HUSUX6I-SE2DHEA-YYWFG5Y';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const hlNamesHeaders = {
  accept: 'application/json',
  'X-API-Key': HL_NAMES_API_KEY,
};

/**
 * Resolves a HyperLiquid .hl name to its owner's wallet address.
 * Returns null if the name is not registered or the API call fails.
 *
 * @param name - The .hl name to resolve (e.g. "alice.hl")
 * @returns The owner's wallet address, or null if not found
 */
export async function resolveHLName(name: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${HL_NAMES_API_BASE_URL}/resolve/address/${name}`,
      { headers: hlNamesHeaders },
    );
    if (!response.ok) return null;
    const data = await response.json();
    const address: string = data?.address;
    if (!address || address === NULL_ADDRESS) return null;
    return address;
  } catch {
    return null;
  }
}

/**
 * Returns all .hl names owned by a wallet address.
 * Returns an empty array if the wallet owns no names or the API call fails.
 *
 * @param walletAddress - The wallet address to look up
 * @returns Array of .hl name strings
 */
export async function getHLNamesForAddress(walletAddress: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${HL_NAMES_API_BASE_URL}/utils/names_owner/${walletAddress}`,
      { headers: hlNamesHeaders },
    );
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Checks whether the given string looks like a .hl name.
 *
 * @param value - The string to test
 * @returns true if value ends with ".hl"
 */
export function isHLName(value: string): value is `${string}.hl` {
  return typeof value === 'string' && value.toLowerCase().endsWith('.hl');
}

/**
 * Resolves a value that may be either a wallet address or a .hl name.
 * If it is a .hl name, resolves it to an address; otherwise returns the value as-is.
 * Returns null if resolution fails.
 *
 * @param addressOrName - A wallet address or a .hl name
 * @returns The resolved wallet address, or null if resolution failed
 */
export async function resolveAddressOrHLName(addressOrName: string): Promise<string | null> {
  if (isHLName(addressOrName)) {
    return resolveHLName(addressOrName);
  }
  return addressOrName;
}
