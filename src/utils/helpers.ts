import { ethers } from 'ethers';
import { getToken, getTokenFromSymbol } from '../constants/tokens.js';

export async function convertToTokenUnits(amount: number, chainId: number, contractAddress: string): Promise<ethers.BigNumberish> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;
    const adjustedAmount = ethers.parseUnits(amount.toString(), decimals);
    return adjustedAmount;
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

    // Divide by 10^decimals to get the original amount
    const divisor = BigInt(10) ** BigInt(decimals);
    const adjustedAmount = amount / divisor;

    // Convert the result to a number
    return Number(adjustedAmount);
}

export async function convertTokenUnitsFromAddress(amount: bigint, chainId: number, contractAddress: string): Promise<number> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;

    // Divide by 10^decimals to get the original amount
    const divisor = BigInt(10) ** BigInt(decimals);
    const adjustedAmount = amount / divisor;

    // Convert the result to a number
    return Number(adjustedAmount);
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