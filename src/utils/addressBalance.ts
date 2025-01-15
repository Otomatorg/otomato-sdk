// getUserProtocolBalances.ts
import { ethers } from 'ethers';
import { rpcServices } from '../index.js';

// -------------- PROTOCOLS ENUM --------------
export const PROTOCOLS = {
  AAVE: 'AAVE',
  COMPOUND: 'COMPOUND',
  IONIC: 'IONIC',
  MOONWELL: 'MOONWELL',
  IRONCLAD: 'IRONCLAD',
  WALLET: 'WALLET',
} as const;
export type Protocol = typeof PROTOCOLS[keyof typeof PROTOCOLS];

// -------------- TYPE DEFINITIONS --------------

// Each entry in your chain map
interface TokenMapEntry {
  protocol: Protocol;
  token: string;
}

// The entire chain map type
type ChainTokenProtocolMap = Record<
  number,
  Record<string, TokenMapEntry[]>
>;

// Minimal ABIs
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const COMPOUNDV2_EXCHANGERATE_ABI = [
  'function exchangeRateCurrent() view returns (uint)',
];

// -------------- ACTUAL MAP --------------
const chainTokenProtocolMap: ChainTokenProtocolMap = {
  8453: {
    // USDC on Base
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': [
      { protocol: PROTOCOLS.AAVE, token: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB' },
      { protocol: PROTOCOLS.COMPOUND, token: '0xb125E6687d4313864e53df431d5425969c15Eb2F' },
      { protocol: PROTOCOLS.IONIC, token: '0xa900A17a49Bc4D442bA7F72c39FA2108865671f0' },
      { protocol: PROTOCOLS.MOONWELL, token: '0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22' },
      { protocol: PROTOCOLS.WALLET, token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' },
    ],
    // WETH on Base
    '0x4200000000000000000000000000000000000006': [
      { protocol: PROTOCOLS.AAVE, token: '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7' },
      { protocol: PROTOCOLS.COMPOUND, token: '0x46e6b214b524310239732D51387075E0e70970bf' },
      { protocol: PROTOCOLS.IONIC, token: '0x49420311B518f3d0c94e897592014de53831cfA3' },
      { protocol: PROTOCOLS.MOONWELL, token: '0x628ff693426583D9a7FB391E54366292F509D457' },
      { protocol: PROTOCOLS.WALLET, token: '0x4200000000000000000000000000000000000006' },
    ],
  },
  34443: {
    // USDC on Mode
    '0xd988097fb8612cc24eec14542bc03424c656005f': [
      { protocol: PROTOCOLS.IONIC, token: '0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038' },
      { protocol: PROTOCOLS.IRONCLAD, token: '0xe7334Ad0e325139329E747cF2Fc24538dD564987' },
      { protocol: PROTOCOLS.WALLET, token: '0xd988097fb8612cc24eeC14542bC03424c656005f' },
    ],
    // WETH on Mode
    '0x4200000000000000000000000000000000000006': [
      { protocol: PROTOCOLS.IONIC, token: '0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2' },
      { protocol: PROTOCOLS.IRONCLAD, token: '0x9c29a8eC901DBec4fFf165cD57D4f9E03D4838f7' },
      { protocol: PROTOCOLS.WALLET, token: '0x4200000000000000000000000000000000000006' },
    ],
  },
};

// -------------- PARAMS & RESULT --------------
export interface GetUserProtocolBalancesParams {
  chainId: number;
  address: string;         // user address
  contractAddress: string; // base token address
}

export interface ProtocolBalanceResult {
  protocol: Protocol;
  wrapperTokenAddress: string;
  wrapperBalance: string;    // e.g. "42.5" => the wrapper's raw balance
  underlyingBalance: string; // conversion if needed
}

// -------------- EXACT getBalanceInUnderlying LOGIC --------------
async function executeReadContract(
  address: string,
  abi: string[],
  method: string,
  params: any[],
  provider: ethers.JsonRpcProvider
) {
  const contract = new ethers.Contract(address, abi, provider);
  return contract[method](...params);
}

/**
 * The function that does your protocol-specific "wrapper => underlying" logic
 * using BigInt(10) instead of 10n for older TS targets.
 */
async function getBalanceInUnderlying(
  protocol: Protocol,
  chainId: number,
  smartAccountAddress: string,
  contractAddress: string,
  balanceObj: {
    value: bigint;
    decimals: number;
    symbol: string;
    displayValue: string;
  },
  decimals: number,
  provider: ethers.JsonRpcProvider
): Promise<string> {
  switch (protocol) {
    case PROTOCOLS.WALLET:
      return balanceObj.displayValue;

    case PROTOCOLS.AAVE:
      return balanceObj.displayValue;

    case PROTOCOLS.COMPOUND: {
      return balanceObj.displayValue;
    }

    case PROTOCOLS.IONIC:
    case PROTOCOLS.MOONWELL: {
      // read exchangeRateCurrent
      const rawExRate = await executeReadContract(
        contractAddress,
        COMPOUNDV2_EXCHANGERATE_ABI,
        'exchangeRateCurrent',
        [],
        provider
      );

      const exRateBN = BigInt(rawExRate.toString());

      // For IONIC => scale = 18 - decimals + 6
      // For MOONWELL => you used scale=18. Let's handle them with logic or keep it simple
      let scale = 18;

      // Fix: BigInt(10) instead of 10n
      const TEN = BigInt(10);
      const divisor = TEN ** BigInt(scale);

      const rawBalanceInAssetBN = (balanceObj.value * exRateBN) / divisor;
      const balanceInAssetString = ethers.formatUnits(rawBalanceInAssetBN, decimals);

      return balanceInAssetString;
    }

    default:
      return balanceObj.displayValue;
  }
}

// -------------- MAIN FUNCTION --------------
export async function getUserProtocolBalances(
  params: GetUserProtocolBalancesParams
): Promise<ProtocolBalanceResult[]> {
  const { chainId, address, contractAddress } = params;

  const chainMap = chainTokenProtocolMap[chainId];
  if (!chainMap || chainId === undefined) {
    throw new Error(`No token map for chainId=${chainId}`);
  }

  // If recognized => read all wrappers
  const protocolWrappers = chainMap[contractAddress.toLowerCase()];
  let addressesToCheck: { protocol: Protocol; token: string }[];

  if (protocolWrappers) {
    addressesToCheck = protocolWrappers;
  } else {
    // fallback => just WALLET
    addressesToCheck = [
      {
        protocol: PROTOCOLS.WALLET,
        token: contractAddress,
      },
    ];
  }

  // Setup provider from rpcServices
  const rpcUrl = rpcServices.getRPC(chainId);
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Minimal read ABI
  const readABI = [
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
  ];

  const results: ProtocolBalanceResult[] = [];

  for (const { protocol, token } of addressesToCheck) {
    const contract = new ethers.Contract(token, readABI, provider);

    const [rawBalanceBN, decimals, symbol] = await Promise.all([
      contract.balanceOf(address),
      contract.decimals(),
      contract.symbol(),
    ]);

    const rawBalance = BigInt(rawBalanceBN.toString());
    const displayValue = ethers.formatUnits(rawBalance, decimals);

    // We'll guess the underlying decimals from the symbol or fallback
    // In your snippet, you explicitly used the WALLET decimals for USDC => 6
    let underlyingDecimals = decimals;
    if (symbol.toLowerCase().includes('usdc')) {
      underlyingDecimals = 6;
    } else if (symbol.toLowerCase().includes('weth') || symbol.toLowerCase().includes('eth')) {
      underlyingDecimals = 18;
    }

    // Build the "balanceObj"
    const balanceObj = {
      value: rawBalance,
      decimals,
      symbol,
      displayValue,
    };

    // Now do your conversion
    const underlyingBalance = await getBalanceInUnderlying(
      protocol,
      chainId,
      address,
      token,
      balanceObj,
      underlyingDecimals,
      provider
    );

    results.push({
      protocol,
      wrapperTokenAddress: token,
      wrapperBalance: displayValue,    // raw wrapper token balance
      underlyingBalance,               // computed by getBalanceInUnderlying
    });
  }

  return results;
}