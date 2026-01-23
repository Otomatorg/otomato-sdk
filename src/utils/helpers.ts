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
 * @param maxLeadingZeros - The maximum number of leading zeros after decimal point before rounding (default is -1 for no limit).
 * @returns string - The formatted number as a string.
 */
export function formatNonZeroDecimals(value: number, nonZeroDecimals: number = 2, maxLeadingZeros: number = -1): string {
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
    
    // Count leading zeros after decimal point
    let leadingZeros = 0;
    for (let i = 0; i < decimalPart.length; i++) {
        if (decimalPart[i] === '0') {
            leadingZeros++;
        } else {
            break;
        }
    }
    
    // If leading zeros exceed threshold, round the number
    if (maxLeadingZeros !== -1 && leadingZeros > maxLeadingZeros) {
        const rounded = Math.round(absValue);
        return sign + rounded.toString();
    }
    
    let result = integerPart + ".";
    
    // Add leading zeros
    result += decimalPart.substring(0, leadingZeros);
    
    // Take up to nonZeroDecimals non-zero decimal places after leading zeros
    const remainingDigits = decimalPart.substring(leadingZeros);
    const maxDigits = Math.min(nonZeroDecimals, remainingDigits.length);
    result += remainingDigits.substring(0, maxDigits);

    // Remove trailing zeros and decimal point if needed
    result = result.replace(/\.?0+$/, '');
    if (result.endsWith('.')) {
        result = result.slice(0, -1);
    }

    return sign + result;
}

export const getTokenPrice = async (chainId: number, contractAddress: string): Promise<number> => {
  if (chainId === 999) {
    const tokenPriceList = await fetch(
      `https://li.quest/v1/tokens?chains=999`,
      {
        headers: {
          'x-lifi-api-key': process.env.LIFI_API_KEY ?? ''
        }
      }
    );
    const tokenPriceListJson = await tokenPriceList.json();
    const tokenPrice = tokenPriceListJson.tokens?.[999]?.find((token: any) => token.address === contractAddress);
    return tokenPrice?.priceUSD;
  }
  const tokenPrice = await fetch(`https://api.odos.xyz/pricing/token/${chainId}/${contractAddress}`);
  const tokenPriceJson = await tokenPrice.json();
  return tokenPriceJson?.price;
}

export const getTokenPrices = async (chainId: number, contractAddresses: string[]): Promise<{ contractAddress: string, symbol: string, decimals: number, priceUSD: number }[]> => {
  if (chainId === 999) {
    const tokenPriceList = await fetch(
      `https://li.quest/v1/tokens?chains=999`,
      {
        headers: {
          'x-lifi-api-key': process.env.LIFI_API_KEY ?? ''
        }
      }
    );
    const tokenPriceListJson = await tokenPriceList.json();
    const tokenPrices = tokenPriceListJson.tokens?.[999]?.filter((token: any) => contractAddresses.includes(token.address));
    return tokenPrices.map((token: any) => {
      return {
        contractAddress: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        priceUSD: token.priceUSD
      };
    });
  }
  return [];
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
    252:  "frxETH",
    999:  "ETH"
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
    case CHAINS.ABSTRACT:
      return 'https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_abstract.webp';
    default:
      const chainEntry = Object.entries(CHAINS).find(([_, value]) => value === chainId);
      if (chainEntry) {
        const formattedName = chainEntry[0].toLowerCase();
        return `https://otomato-network-images.s3.eu-west-1.amazonaws.com/chain_${formattedName}.webp`;
      }
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
      <span>${token.symbol}</span>
      <span><img src="${token.image}" alt="${token.name}" width="14" height="14" /></span>
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
    <span>
      <img 
        src="${chain.chainIcon}" 
        alt="${chain.name}" 
        width="14" 
        height="14" 
          style="border-radius: 50%;" 
        />
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
    // if (typeof value === 'string' && value.includes('{{nodeMap.')) {
    //   // Replace only the value inside {{...}} with the HTML link, keep the rest of the string
    //   return value.replace(/\{\{nodeMap\.(\d+)\.output\.(\w+)\}\}/g, (_match, nodeRef, outputProperty) => {
    //     return `<a href="#" title="Node ${nodeRef} output">${nodeRef}.${outputProperty}</a>`;
    //   });
    // }
    if (
      (typeof value === 'string' && value.length > 0 && !value.includes('<') && !value.includes('>')) ||
      (typeof value === 'number')
    ) {
      return `<span>${value}</span>`;
    }
    return `${value}`;
  };

  const formattedElements = elements.map(formatValue);

  return `
    <p class="text-line-clamp-1">
      ${formattedElements.join('')}
    </p>
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
  return `<span>${mapTextToLogicOperator(condition)} ${comparisonValue}</span>`;
};

/**
 * Finds the new elements in an array compared to an old array.
 * @param oldArray - The old array.
 * @param newArray - The new array.
 * @returns The new elements.
 */
export const findNewElements = (oldArray: string[], newArray: string[]): string[] => {
  // Find the first position where arrays start to match
  let matchStartIndex = -1;
  
  for (let i = 0; i < newArray.length; i++) {
    // Check if from position i, the arrays match
    let matches = true;
    for (let j = 0; j < oldArray.length && (i + j) < newArray.length; j++) {
      if (oldArray[j] !== newArray[i + j]) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      matchStartIndex = i;
      break;
    }
  }
  
  // Handle different cases
  if (matchStartIndex === -1) {
    return newArray; // No match found, entire array is new
  }
  return matchStartIndex > 0 ? newArray.slice(0, matchStartIndex) : [];
}

export const createEthersContract = (chainId: number, contractAddress: string, abi: any[], rpcUrl?: string) => {

  let providerUrl; 

  if (rpcUrl) {
    providerUrl = rpcUrl;
  } else {
    const chainName = chainId == 1 ? 'INFURA' : Object.keys(CHAINS).find(key => CHAINS[key as keyof typeof CHAINS] == chainId);

    if (!chainName) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    providerUrl = process.env[`${chainName}_HTTPS_PROVIDER`];
  }

  if (!providerUrl) throw new Error("No provider url found")

  const provider = new ethers.JsonRpcProvider(providerUrl);

  return new ethers.Contract(contractAddress, abi, provider);
}

export const jsonStringifyCircularObject = async (obj: any) => {
  // Attempt to safely stringify obj, omitting circular references
  function getCircularReplacer() {
    const seen = new WeakSet();
    return function (key: any, value: any) {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
  }

  let safeStringifiedEnv;
  try {
    safeStringifiedEnv = JSON.stringify(obj, getCircularReplacer(), 2);
    console.log(safeStringifiedEnv);
  } catch (err) {
    console.log("[obj] Could not stringify obj due to:", err);
  }

  // Additionally, log the object using util.inspect to see non-enumerable and circular structures
  try {
    // Dynamically import util for browser/node compatibility
    let util;
    if (typeof require !== "undefined") {
        util = require("util");
    } else if (typeof window === "undefined") {
        util = (await import("util")).default;
    }
    if (util && util.inspect) {
        console.log(util.inspect(obj, { showHidden: false, depth: 5, colors: true }));
    }
  } catch (err) {
    console.log("[obj] Could not inspect obj object due to:", err);
  }
}

export const callWithRetry = async (callback: () => Promise<any>, maxRetries: number = 3, retryDelayMs: number = 1000) => {
  let retryCount = 0;
  while (retryCount <= maxRetries) {
    try {
      return await callback();
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    }
  }
}

// ============================================================================
// Position Helpers - Generic utilities for DeFi position operations
// ============================================================================

export interface TokenInfo {
  symbol: string;
  decimals: number;
  name: string;
  address: string;
}

const ERC20_ABI = [
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
];

/**
 * Fetches token information from an ERC20 contract.
 * Generic function that works with any ERC20-compliant token.
 */
export async function getTokenInfo(
  tokenAddress: string,
  provider: ethers.Provider
): Promise<TokenInfo> {
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  
  try {
    const [symbol, decimals, name] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.name(),
    ]);
    
    return {
      symbol: String(symbol),
      decimals: Number(decimals),
      name: String(name),
      address: tokenAddress,
    };
  } catch (error: any) {
    throw new Error(
      `Failed to fetch token info for ${tokenAddress}: ${error.message}`
    );
  }
}

/**
 * Fetches token info with fallback values if contract call fails.
 */
export async function getTokenInfoWithFallback(
  tokenAddress: string,
  provider: ethers.Provider
): Promise<TokenInfo> {
  try {
    return await getTokenInfo(tokenAddress, provider);
  } catch (error) {
    const truncatedAddress = `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`;
    return {
      symbol: truncatedAddress,
      decimals: 18,
      name: '',
      address: tokenAddress,
    };
  }
}

/**
 * Fetches multiple token info objects in parallel.
 */
export async function getMultipleTokenInfo(
  tokenAddresses: string[],
  provider: ethers.Provider
): Promise<TokenInfo[]> {
  return Promise.all(
    tokenAddresses.map(address => getTokenInfoWithFallback(address, provider))
  );
}

/**
 * Known stablecoin symbols for token classification.
 */
export const KNOWN_STABLE_SYMBOLS = new Set([
  'USDT', 'USDC', 'DAI', 'BUSD', 'TUSD',
  'USDP', 'GUSD', 'LUSD', 'USDD', 'FRAX',
  'USDC.E', 'USDC.N', 'USDC.B',
  'FDUSD', 'PYUSD', 'XAUT',
  'SUSD', 'MUSD', 'HUSD',
  'USDN', 'USDX', 'USDJ',
  'WUSDT', 'WUSDC', 'WDAI',
  'USDB', 'USDE', 'USDL',
  'USDbC', 'USDT0',
]);

/**
 * Gas asset symbols by chain ID.
 */
export const GAS_ASSET_SYMBOLS: Record<number, string> = {
  [CHAINS.BASE]: 'WETH',
  [CHAINS.BINANCE]: 'WBNB',
  [CHAINS.ETHEREUM]: 'WETH',
  [CHAINS.POLYGON]: 'WMATIC',
  [CHAINS.ARBITRUM]: 'WETH',
  [CHAINS.AVALANCHE]: 'WAVAX',
  [CHAINS.OPTIMISM]: 'WETH',
  [CHAINS.HYPER_EVM]: 'WHYPE',
};

/**
 * Check if a symbol is a known stablecoin.
 */
export function isStableCoin(symbol: string | null | undefined): boolean {
  if (!symbol || typeof symbol !== 'string') {
    return false;
  }
  const upperSymbol = symbol.toUpperCase();
  return upperSymbol.includes('USD') || KNOWN_STABLE_SYMBOLS.has(upperSymbol);
}

/**
 * Check if a symbol is a gas asset for the given chain.
 */
export function isGasAsset(symbol: string | null | undefined, chainId: number): boolean {
  if (!symbol || typeof symbol !== 'string') {
    return false;
  }
  const upperSymbol = symbol.toUpperCase();
  const gasAsset = GAS_ASSET_SYMBOLS[chainId];
  return gasAsset?.toUpperCase() === upperSymbol;
}

/**
 * Get the gas asset symbol for a given chain.
 */
export function getGasAssetSymbol(chainId: number): string | null {
  return GAS_ASSET_SYMBOLS[chainId] || null;
}

/**
 * Converts a Uniswap V3-style tick to a human-readable price.
 * Price formula: price = 1.0001^tick * (10^(decimals1 - decimals0))
 */
export function tickToPrice(tick: number, decimals0: number, decimals1: number): number {
  const tickMathBase = 1.0001;
  const powResult = Math.pow(tickMathBase, tick);
  const decimalsAdjustment = Math.pow(10, decimals0 - decimals1);
  const price = powResult * decimalsAdjustment;
  
  if (!isFinite(price) || isNaN(price)) {
    throw new Error(`Invalid price calculation: tick=${tick}, decimals0=${decimals0}, decimals1=${decimals1}`);
  }
  
  return price;
}

/**
 * Converts a price to the nearest tick.
 */
export function priceToTick(price: number, decimals0: number, decimals1: number): number {
  const decimalsAdjustment = Math.pow(10, decimals0 - decimals1);
  const adjustedPrice = price / decimalsAdjustment;
  const tick = Math.log(adjustedPrice) / Math.log(1.0001);
  return Math.round(tick);
}

/**
 * Calculates price from sqrtPriceX96 (used in Uniswap V3 slot0).
 */
export function calculatePriceFromSqrtPriceX96(
  sqrtPriceX96: bigint | string,
  decimals0: number,
  decimals1: number
): number {
  const sqrtPrice = Number(sqrtPriceX96) / Math.pow(2, 96);
  const price = Math.pow(sqrtPrice, 2);
  const decimalsAdjustment = Math.pow(10, decimals0 - decimals1);
  return price * decimalsAdjustment;
}

/**
 * Inverts a price (converts from token1/token0 to token0/token1).
 */
export function invertPrice(price: number): number {
  if (price === 0) {
    throw new Error('Cannot invert zero price');
  }
  return 1 / price;
}

/**
 * Format a price number to avoid scientific notation and round appropriately.
 */
export function formatPrice(price: number | null | undefined, isStableQuoted: boolean = false): string | null {
  if (price === null || price === undefined || isNaN(price) || !isFinite(price)) {
    return null;
  }
  
  const decimals = isStableQuoted ? 2 : 6;
  const rounded = Number(price.toFixed(decimals));
  return rounded.toString();
}

/**
 * Format two prices based on the difference between them.
 */
export function formatPriceRange(
  price1: number | null | undefined,
  price2: number | null | undefined
): { price1: string | null; price2: string | null } {
  if (
    price1 === null || price1 === undefined || isNaN(price1) || !isFinite(price1) ||
    price2 === null || price2 === undefined || isNaN(price2) || !isFinite(price2)
  ) {
    return {
      price1: price1 !== null && price1 !== undefined ? formatPrice(price1, false) : null,
      price2: price2 !== null && price2 !== undefined ? formatPrice(price2, false) : null,
    };
  }
  
  const diff = Math.abs(price1 - price2);
  let decimalPlaces: number;
  
  if (diff < 0.0001) {
    decimalPlaces = 5;
  } else if (diff < 0.001) {
    decimalPlaces = 4;
  } else if (diff < 0.01) {
    decimalPlaces = 4;
  } else if (diff < 0.1) {
    decimalPlaces = 3;
  } else if (diff < 1) {
    decimalPlaces = 2;
  } else if (diff < 10) {
    decimalPlaces = 1;
  } else {
    decimalPlaces = 0;
  }
  
  const formatted1 = price1.toFixed(decimalPlaces);
  const formatted2 = price2.toFixed(decimalPlaces);
  
  return {
    price1: formatted1,
    price2: formatted2,
  };
}

/**
 * Format a price with a specific number of decimal places.
 */
export function formatPriceWithDecimals(
  price: number | null | undefined,
  decimals: number
): string | null {
  if (price === null || price === undefined || isNaN(price) || !isFinite(price)) {
    return null;
  }
  
  return price.toFixed(decimals);
}

export interface TokenPairInfo {
  symbol: string;
  address?: string;
  decimals?: number;
}

export interface RearrangedPair {
  base: TokenPairInfo;
  quote: TokenPairInfo;
  baseSymbol: string;
  quoteSymbol: string;
}

/**
 * Rearrange token pair so stablecoin or gas asset is the quote token.
 */
export function rearrangeTokenPair(
  token1: string | TokenPairInfo,
  token2: string | TokenPairInfo,
  chainId?: number | null
): RearrangedPair {
  const symbol1 = typeof token1 === 'string' ? token1 : token1?.symbol;
  const symbol2 = typeof token2 === 'string' ? token2 : token2?.symbol;
  
  if (!symbol1 || !symbol2) {
    throw new Error('Both tokens must have valid symbols');
  }
  
  const isToken1Stable = isStableCoin(symbol1);
  const isToken2Stable = isStableCoin(symbol2);
  
  if (isToken1Stable && !isToken2Stable) {
    return {
      base: typeof token2 === 'string' ? { symbol: symbol2 } : token2,
      quote: typeof token1 === 'string' ? { symbol: symbol1 } : token1,
      baseSymbol: symbol2,
      quoteSymbol: symbol1,
    };
  }
  
  if (!isToken1Stable && isToken2Stable) {
    return {
      base: typeof token1 === 'string' ? { symbol: symbol1 } : token1,
      quote: typeof token2 === 'string' ? { symbol: symbol2 } : token2,
      baseSymbol: symbol1,
      quoteSymbol: symbol2,
    };
  }
  
  if (!isToken1Stable && !isToken2Stable && chainId) {
    const chainIdNum = Number(chainId);
    const isToken1Gas = isGasAsset(symbol1, chainIdNum);
    const isToken2Gas = isGasAsset(symbol2, chainIdNum);
    
    if (isToken1Gas && !isToken2Gas) {
      return {
        base: typeof token2 === 'string' ? { symbol: symbol2 } : token2,
        quote: typeof token1 === 'string' ? { symbol: symbol1 } : token1,
        baseSymbol: symbol2,
        quoteSymbol: symbol1,
      };
    }
    
    if (!isToken1Gas && isToken2Gas) {
      return {
        base: typeof token1 === 'string' ? { symbol: symbol1 } : token1,
        quote: typeof token2 === 'string' ? { symbol: symbol2 } : token2,
        baseSymbol: symbol1,
        quoteSymbol: symbol2,
      };
    }
  }
  
  return {
    base: typeof token1 === 'string' ? { symbol: symbol1 } : token1,
    quote: typeof token2 === 'string' ? { symbol: symbol2 } : token2,
    baseSymbol: symbol1,
    quoteSymbol: symbol2,
  };
}

/**
 * Get a formatted pair label from two token symbols.
 */
export function getPairLabel(baseSymbol: string, quoteSymbol: string): string {
  return `${baseSymbol}/${quoteSymbol}`;
}

/**
 * Check if a current tick is within the specified range.
 */
export function isTickInRange(
  currentTick: number | null,
  tickLower: number,
  tickUpper: number
): boolean {
  if (currentTick === null || currentTick === undefined) {
    return false;
  }
  
  return currentTick >= tickLower && currentTick <= tickUpper;
}

/**
 * Calculate the percentage of the range that the current tick occupies.
 */
export function calculateRangePercentage(
  currentTick: number | null,
  tickLower: number,
  tickUpper: number
): number | null {
  if (currentTick === null || currentTick === undefined) {
    return null;
  }
  
  const range = tickUpper - tickLower;
  if (range === 0) {
    return 0.5;
  }
  
  const position = currentTick - tickLower;
  return position / range;
}

export const MAX_BIGINT = BigInt(115792089237316195423570985008687907853269984665640564039457584007913129639935n);

export function isMaxBigInt(value: bigint | string): boolean {
  const valueBigInt = typeof value === 'string' ? BigInt(value) : value;
  return valueBigInt == MAX_BIGINT;
}