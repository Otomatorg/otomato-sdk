import { ethers } from 'ethers';
import { getToken, getTokenFromSymbol } from '../constants/tokens.js';
import { isAddress, isNumericString } from './typeValidator.js';
import { CHAINS } from '../constants/chains.js';

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

/**
 * Formats a period in seconds into a human-readable string with days, hours, minutes, and seconds.
 * @param {number} seconds
 * @returns {string}
 */
export const formatPeriod = (seconds: number): string => {
  const sec = Number(seconds);
  if (isNaN(sec) || sec < 0) return '';
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const remainingSeconds = sec % 60;
  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''}`);
  return parts.join(' ');
};

export const formatMilliSecondsToHumanReadable = (milliseconds: number): string => {
  const seconds = milliseconds / 1000;
  return formatPeriod(seconds);
}

/**
 * Converts a millisecond timestamp to a human-readable date string in the user's local timezone.
 * If the input is not a valid number, returns an empty string.
 * @param {number|string} milliseconds - The timestamp in milliseconds.
 * @returns {string} - The formatted date string in the user's local timezone.
 */
export const formatMillisecondsToLocalDate = (milliseconds: number | string): string => {
  const ms = typeof milliseconds === 'string' ? Number(milliseconds) : milliseconds;
  if (isNaN(ms) || ms < 0) return '';
  const date = new Date(ms);
  // Use toLocaleString to format in user's local timezone
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });
};

export const getChainIconUrl = (chainId: number): string => {
  switch (chainId) {
    case CHAINS.ETHEREUM:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_ethereum.webp';
    case CHAINS.BASE:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_base.webp';
    case CHAINS.ARBITRUM:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_arbitrum.webp';
    case CHAINS.MODE:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_mode.webp';
    case CHAINS.SOMNIA:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_somnia.webp';
    case CHAINS.HYPER_EVM:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_hyper_evm.webp';
    case CHAINS.OASIS:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_oasis.webp';
    default:
      throw new Error(`Chain icon not found for chainId: ${chainId}`);
  }
};

export const getChainById = (chainId: number): { name: string; chainIcon: string } => {
  // Find the chain name key by matching the value, skipping 'ALL'
  const chainEntry = Object.entries(CHAINS).find(
    ([key, value]) => key !== 'ALL' && value === chainId
  );
  if (chainEntry) {
    // Lowercase, replace underscores with spaces, capitalize first letter
    let formattedName = chainEntry[0]
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());
    const chainIcon = getChainIconUrl(chainId);

    if (chainId === 999) {
      formattedName = 'Hyper EVM';
    }

    return {
      name: formattedName,
      chainIcon: chainIcon
    };
  }
  return {
    name: 'Unknown',
    chainIcon: ''
  };
};

/**
 * Returns HTML for a token display with a smaller font size.
 * @param chainId - The chain ID.
 * @param tokenAddress - The token address.
 * @returns HTML string for the token.
 */
export const getTokenHTML = async (chainId: number, tokenAddress: string): Promise<string> => {
  const token = await getToken(chainId, tokenAddress);
  return `
    <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; line-height: 20px; color: #fff;">
      <div>${token.symbol}</div>
      <img src="${token.image}" alt="${token.name}" width="14" height="14" />
    </div>
  `
};

/**
 * Returns HTML for a chain display with a smaller font size.
 * @param chainId - The chain ID.
 * @returns HTML string for the chain.
 */
export const getChainHTML = (chainId: number): string => {
  const chain = getChainById(chainId);
  return `
    <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; line-height: 20px; color: #fff;">
      <span>
        <img 
          src="${chain.chainIcon}" 
          alt="${chain.name}" 
          width="14" 
          height="14" 
          style="border-radius: 50%;" 
        />
      </span>
    </span>
  `;
};

/**
 * Wraps dynamic name elements in a styled container with a smaller font size.
 * @param elements - HTML elements to wrap.
 * @returns HTML string for the wrapper.
 */
/**
 * Wraps dynamic name elements in a styled container with a smaller font size.
 * Handles nodeMap references by converting them to HTML links.
 * @param elements - HTML elements or nodeMap references to wrap.
 * @returns HTML string for the wrapper.
 */
export const getDynamicNameWrapperHTML = (...elements: string[]): string => {
  /**
   * Formats a value, converting nodeMap references to HTML links.
   * @param value - The value to format (can be nodeMap reference or literal)
   * @returns Formatted HTML string
   */
  const formatValue = (value: string): string => {
    if (typeof value === 'string' && value.includes('{{nodeMap.')) {
      // Replace only the value inside {{...}} with the HTML link, keep the rest of the string
      return value.replace(/\{\{nodeMap\.(\d+)\.output\.(\w+)\}\}/g, (_match, nodeRef, outputProperty) => {
        return `<a href="#" title="Node ${nodeRef} output">${nodeRef}.${outputProperty}</a>`;
      });
    }
    if (typeof value === 'string' && value.length > 0 && !value.includes('<') && !value.includes('>')) {
      return `<div>${value}</div>`;
    }
    return value;
  };

  const formattedElements = elements.map(formatValue);

  return `
    <div style="display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; font-size: 12px; font-weight: 700; line-height: 20px; color: #fff;">
      ${formattedElements.join('')}
    </div>
  `;
};

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Maps a logic operator in text form to its corresponding symbol.
 * For example, "eq" -> "=", "lt" -> "<", etc.
 * @param operator - The logic operator as text.
 * @returns The corresponding symbol as a string, or the original operator if not found.
 */
export const mapTextToLogicOperator = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    eq: '=',
    neq: '≠',
    lt: '<',
    lte: '≤',
    gt: '>',
    gte: '≥',
  } as const;
  return operatorMap[operator] ?? operator;
};

/**
 * Returns a formatted comparison string using the logic operator and comparison value.
 * If the comparison value is a history reference, returns 'changes'.
 * @param condition - The logic operator as text.
 * @param comparisonValue - The value to compare to.
 * @returns The formatted comparison string or 'changes' if referencing history.
 */
export const getComparisonString = (condition: string, comparisonValue: string): string => {
  if (comparisonValue === '{{history.0.value}}') {
    return 'changes';
  }
  return `${mapTextToLogicOperator(condition)} ${comparisonValue}`;
};