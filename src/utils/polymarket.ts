import { ethers } from 'ethers';

// Polymarket Safe Wallet (browser wallet: MetaMask, Rainbow, Coinbase Wallet, etc.)
const SAFE_FACTORY = '0xaacFeEa03eb1561C4e67d661e40682Bd20E3541b';
const SAFE_INIT_CODE_HASH = '0x2bce2127ff07fb632d16c8347c4ebf501f4841168bed00d9e6ef715ddb6fcecf';

const POLYMARKET_DATA_API_URL = 'https://data-api.polymarket.com';

export type PolymarketAddressType = 'EOA' | 'POLYMARKET_DIRECT';

/**
 * Derives the Polymarket Safe wallet address from an EOA using CREATE2.
 * Used for browser wallet users (MetaMask, Rainbow, Coinbase Wallet, etc.).
 *
 * CREATE2: keccak256(0xff ++ factory ++ salt ++ initCodeHash)[12:]
 * Salt: keccak256(abi.encode(eoaAddress))
 *
 * @param eoaAddress - User's externally owned account address
 * @returns The Polymarket Safe wallet address on Polygon
 */
export function derivePolymarketSafeAddress(eoaAddress: string): string {
    const salt = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(['address'], [eoaAddress]));
    return ethers.getCreate2Address(SAFE_FACTORY, salt, SAFE_INIT_CODE_HASH);
}

/**
 * Detects whether the given address is an EOA (from which we derive the Polymarket Safe)
 * or a Polymarket wallet address provided directly by the user (Magic/email users).
 *
 * Detection logic:
 * 1. Check if the address itself has positions on Polymarket → POLYMARKET_DIRECT
 * 2. Derive the Safe address and check if it has positions → EOA
 * 3. No activity on either → default to EOA
 *
 * @param address - The address to detect
 * @returns The address type and the resolved Polymarket wallet address
 */
export async function detectAddressType(address: string): Promise<{
    type: PolymarketAddressType;
    polymarketAddress: string;
}> {
    // Check if this address has positions on Polymarket directly
    const directPositions = await fetchPolymarketPositions(address);
    if (directPositions !== null && directPositions.length > 0) {
        return { type: 'POLYMARKET_DIRECT', polymarketAddress: address };
    }

    // Derive the Safe address and check that
    const derivedSafe = derivePolymarketSafeAddress(address);
    const derivedPositions = await fetchPolymarketPositions(derivedSafe);
    if (derivedPositions !== null && derivedPositions.length > 0) {
        return { type: 'EOA', polymarketAddress: derivedSafe };
    }

    // No activity found on either → assume EOA (will be checked again later)
    return { type: 'EOA', polymarketAddress: derivedSafe };
}

/**
 * Resolves the Polymarket wallet address from any input address.
 * Handles both EOA (derives Safe) and direct Polymarket addresses.
 *
 * @param address - EOA or direct Polymarket address
 * @returns The Polymarket wallet address to use for API calls
 */
export async function resolvePolymarketAddress(address: string): Promise<string> {
    const { polymarketAddress } = await detectAddressType(address);
    return polymarketAddress;
}

async function fetchPolymarketPositions(address: string): Promise<any[] | null> {
    try {
        const response = await fetch(`${POLYMARKET_DATA_API_URL}/positions?user=${address}`);
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}
