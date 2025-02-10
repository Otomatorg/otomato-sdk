import { ethers } from 'ethers';
import { getToken, getTokenFromSymbol } from '../constants/tokens.js';
import { isAddress, isNumericString } from './typeValidator.js';

export async function convertToTokenUnits(amount: number, chainId: number, contractAddress: string): Promise<ethers.BigNumberish> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;

    // Max BigInt - For Withdraw All from protocols
    if (amount.toString() === "115792089237316195423570985008687907853269984665640564039457584007913129639935n") {
      return amount;
    }
    
    // Calculate the result as a number first
    const result = amount * Math.pow(10, decimals);

    // Check if the result is an integer
    if (!Number.isInteger(result)) {
        throw new Error(`Conversion resulted in a non-integer value: ${result}. Please provide an amount that results in a whole number of token units.`);
    }
    
    // If we've reached here, the result is an integer, so we can safely convert to BigInt
    return BigInt(Math.round(result));
}

export async function convertToTokenUnitsTruncate(amount: number, chainId: number, contractAddress: string): Promise<ethers.BigNumberish> {
    const token = await getToken(chainId, contractAddress);
    const decimals = token.decimals;

    // Max BigInt - For Withdraw All from protocols
    if (amount.toString() === "115792089237316195423570985008687907853269984665640564039457584007913129639935n") {
      return amount;
    }
    
    // Calculate the result as a number first
    const result = amount * Math.pow(10, decimals);

    return BigInt(Math.floor(result));
}

export async function convertToTokenUnitsFromSymbol(amount: number, chainId: number, symbol: string): Promise<ethers.BigNumberish> {
    const token = await getTokenFromSymbol(chainId, symbol);
    const decimals = token.decimals;
    const adjustedAmount = ethers.parseUnits(amount.toString(), decimals);
    return adjustedAmount;
}

export async function convertToTokenUnitsFromDecimals(amount: number, decimals: number): Promise<ethers.BigNumberish> {
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

export async function convertTokenUnitsFromDecimals(amount: bigint, decimals: number): Promise<number> {
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

/**
 * Generates a formula string for dynamically computing the ERC20 amount in the workflow,
 * based on the amount, chain ID, and contract address.
 * If the contract address is valid, it will be wrapped in double quotes.
 * If the amount is a numeric string, it will also be wrapped in double quotes.
 * @param amount - The amount of the ERC20 token to compute.
 * @param chainId - The ID of the blockchain network.
 * @param contractAddress - The contract address of the ERC20 token.
 * @returns string - A formatted string to be used as a variable in the workflow.
 */
export function getComputeERC20Variable(amount: string, chainId: any, contractAddress: string): string {
    // Check if the contract address is a valid Ethereum address and wrap in quotes if it is
    const formattedContractAddress = isAddress(contractAddress) ? `"${contractAddress}"` : contractAddress;

    // Check if the amount is a numeric string and wrap it in quotes if it is
    const formattedAmount = isNumericString(amount) ? `${amount}` : amount;

    // Construct the computeERC20Amount formula
    return `{{computeERC20Amount(${formattedAmount}, ${chainId}, '${formattedContractAddress}')}}`;
}
