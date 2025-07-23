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

/**
 * Formats a number to a string with a specified number of non-zero decimal digits.
 * If the number is less than 1 and starts with zeros after the decimal point,
 * it will show decimals until the first N non-zero digits are reached.
 * Otherwise, it will show up to N decimal digits.
 * 
 * @param value - The number to format.
 * @param nonZeroDecimals - The number of non-zero decimal digits to show (default is 2).
 * @returns string - The formatted number as a string.
 */
export function formatNonZeroDecimals(value: number, nonZeroDecimals: number = 2): string {
    if (value === 0) {
        return "0";
    }

    const sign = value < 0 ? "-" : "";
    const absValue = Math.abs(value);
    
    // Convert to string, handling scientific notation
    let str = absValue.toString();
    
    // Handle scientific notation
    if (str.includes('e')) {
        const [mantissa, exponent] = str.split('e');
        const exp = parseInt(exponent);
        
        if (exp < 0) {
            // Convert scientific notation to decimal
            const decimalPlaces = Math.abs(exp) + mantissa.replace('.', '').length - 1;
            str = absValue.toFixed(decimalPlaces);
        }
    }

    const decimalIndex = str.indexOf('.');
    
    if (decimalIndex === -1) {
        return sign + str;
    }

    const integerPart = str.substring(0, decimalIndex);
    const decimalPart = str.substring(decimalIndex + 1);
    
    let nonZeroCount = 0;
    let result = integerPart + ".";
    
    for (let i = 0; i < decimalPart.length; i++) {
        result += decimalPart[i];
        
        if (decimalPart[i] !== '0') {
            nonZeroCount++;
            if (nonZeroCount === nonZeroDecimals) {
                break;
            }
        }
    }

    // Remove trailing zeros and decimal point if needed
    result = result.replace(/\.?0+$/, '');
    if (result.endsWith('.')) {
        result = result.slice(0, -1);
    }

    return sign + result;
}

export const getTokenPrice = async (chainId: number, contractAddress: string): Promise<number> => {
  const tokenPrice = await fetch(`https://api.odos.xyz/pricing/token/${chainId}/${contractAddress}`);
  const tokenPriceJson = await tokenPrice.json();
  return tokenPriceJson?.price;
}

export const getETHAlternativeTokensSymbols = () => {
  return {
    1:  "ETH",
    130:  "ETH",
    324:  "ETH",
    8453:  "ETH",
    5000:  "WETH",
    137:  "WETH",
    10:  "ETH",
    34443:  "ETH",
    43114:  "WETH.e",
    59144:  "ETH",
    534352:  "ETH",
    42161:  "ETH",
    146:  "WETH",
    56:  "ETH",
    250:  "ETH",
    252:  "frxETH"
  }
}