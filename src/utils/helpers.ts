import { ethers } from 'ethers';
import { getToken, getTokenFromSymbol } from '../constants/tokens.js';

export async function convertToTokenUnits(amount: number, chainId: number, contractAddress: string): Promise<ethers.BigNumberish> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;
    
    // Calculate the result as a number first
    const result = amount * Math.pow(10, decimals);
    
    console.log("result", result)
    // Check if the result is an integer
    if (!Number.isInteger(result)) {
        console.log("throwing")
        throw new Error(`Conversion resulted in a non-integer value: ${result}. Please provide an amount that results in a whole number of token units.`);
    }

    console.log("is an integer")
    
    // If we've reached here, the result is an integer, so we can safely convert to BigInt
    return BigInt(Math.round(result));
}

export async function convertToTokenUnitsFromSymbol(amount: number, chainId: number, symbol: string): Promise<ethers.BigNumberish> {
    const token = await getTokenFromSymbol(chainId, symbol);
    const decimals = token.decimals;
    const adjustedAmount = ethers.parseUnits(amount.toString(), decimals);
    return adjustedAmount;
}

export async function convertTokenUnitsFromSymbol(amount: bigint, chainId: number, symbol: string): Promise<number> {
    const token = await getTokenFromSymbol(chainId, symbol);
    const decimals = token.decimals;

    // Convert to float using division
    return Number(amount) / Math.pow(10, decimals);
}

export async function convertTokenUnitsFromAddress(amount: bigint, chainId: number, contractAddress: string): Promise<number> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;

    // Convert to float using division
    return Number(amount) / Math.pow(10, decimals);
}

/**
 * Compares two Ethereum addresses after normalizing them to lowercase.
 * @param address1 - The first Ethereum address to compare.
 * @param address2 - The second Ethereum address to compare.
 * @returns boolean - True if the addresses are equal, false otherwise.
 */
export function compareAddresses(address1: string, address2: string): boolean {
    // Normalize the addresses by converting them to lowercase
    const normalizedAddress1 = address1.toLowerCase();
    const normalizedAddress2 = address2.toLowerCase();

    // Compare the normalized addresses
    return normalizedAddress1 === normalizedAddress2;
}