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
  MORPHO: 'MORPHO',
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
      { protocol: PROTOCOLS.MORPHO, token: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A' }, // Spark USDC Vault
      { protocol: PROTOCOLS.MORPHO, token: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca' }, // Moonwell Flagship USDC
      { protocol: PROTOCOLS.MORPHO, token: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738' }, // Seamless USDC Vault
      { protocol: PROTOCOLS.MORPHO, token: '0xc0c5689e6f4D256E861F65465b691aeEcC0dEb12' }, // Gauntlet USDC Core
      { protocol: PROTOCOLS.MORPHO, token: '0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61' }, // Gauntlet USDC Prime
      { protocol: PROTOCOLS.MORPHO, token: '0xcdDCDd18A16ED441F6CB10c3909e5e7ec2B9e8f3' }, // Apostro Resolv USDC
      { protocol: PROTOCOLS.MORPHO, token: '0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183' }, // Steakhouse USDC
      { protocol: PROTOCOLS.MORPHO, token: '0x23479229e52Ab6aaD312D0B03DF9F33B46753B5e' }, // Ionic Ecosystem USDC
      { protocol: PROTOCOLS.MORPHO, token: '0x12AFDeFb2237a5963e7BAb3e2D46ad0eee70406e' }, // Re7 USDC
      { protocol: PROTOCOLS.MORPHO, token: '0xB7890CEE6CF4792cdCC13489D36D9d42726ab863' }, // Universal USDC
      { protocol: PROTOCOLS.MORPHO, token: '0x0FaBfEAcedf47e890c50C8120177fff69C6a1d9B' }, // Pyth USDC
      { protocol: PROTOCOLS.MORPHO, token: '0xdB90A4e973B7663ce0Ccc32B6FbD37ffb19BfA83' }, // Degen USDC
      { protocol: PROTOCOLS.MORPHO, token: '0xCd347c1e7d600a9A3e403497562eDd0A7Bc3Ef21' }, // Ionic Ecosystem USDC2
    ],
    // WETH on Base
    '0x4200000000000000000000000000000000000006': [
      { protocol: PROTOCOLS.AAVE, token: '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7' },
      { protocol: PROTOCOLS.COMPOUND, token: '0x46e6b214b524310239732D51387075E0e70970bf' },
      { protocol: PROTOCOLS.IONIC, token: '0x49420311B518f3d0c94e897592014de53831cfA3' },
      { protocol: PROTOCOLS.MOONWELL, token: '0x628ff693426583D9a7FB391E54366292F509D457' },
      { protocol: PROTOCOLS.WALLET, token: '0x4200000000000000000000000000000000000006' },
      { protocol: PROTOCOLS.MORPHO, token: '0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1' }, // Moonwell Flagship WETH
      { protocol: PROTOCOLS.MORPHO, token: '0x27D8c7273fd3fcC6956a0B370cE5Fd4A7fc65c18' }, // Seamless WETH Vault
      { protocol: PROTOCOLS.MORPHO, token: '0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844' }, // Gauntlet WETH Core
      { protocol: PROTOCOLS.MORPHO, token: '0x5496b42ad0deCebFab0db944D83260e60D54f667' }, // 9Summits WETH Core 1.1
      { protocol: PROTOCOLS.MORPHO, token: '0xA2Cac0023a4797b4729Db94783405189a4203AFc' }, // Re7 WETH
      { protocol: PROTOCOLS.MORPHO, token: '0x5A32099837D89E3a794a44fb131CBbAD41f87a8C' }, // Ionic Ecosystem WETH
      { protocol: PROTOCOLS.MORPHO, token: '0x80D9964fEb4A507dD697b4437Fc5b25b618CE446' }, // Pyth ETH
      { protocol: PROTOCOLS.MORPHO, token: '0xbEEf050a7485865A7a8d8Ca0CC5f7536b7a3443e' }, // Steakhouse ETH
      { protocol: PROTOCOLS.MORPHO, token: '0x9aB2d181E4b87ba57D5eD564D3eF652C4E710707' }, // Ionic Ecosystem WETH 2
      { protocol: PROTOCOLS.MORPHO, token: '0xF540D790413FCFAedAC93518Ae99EdDacE82cb78' }, // 9Summits WETH Core
    ],
    // CBBTC on Base
    '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf': [
      { protocol: PROTOCOLS.AAVE, token: '0xBdb9300b7CDE636d9cD4AFF00f6F009fFBBc8EE6' },
      { protocol: PROTOCOLS.IONIC, token: '0x1De166df671AE6DB4C4C98903df88E8007593748' },
      { protocol: PROTOCOLS.MOONWELL, token: '0xF877ACaFA28c19b96727966690b2f44d35aD5976' },
      { protocol: PROTOCOLS.IRONCLAD, token: '0x58254000eE8127288387b04ce70292B56098D55C' },
      { protocol: PROTOCOLS.WALLET, token: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf' },
      { protocol: PROTOCOLS.MORPHO, token: '0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7' }, // Seamless cbBTC Vault
      { protocol: PROTOCOLS.MORPHO, token: '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796' }, // Moonwell Frontier cbBTC
      { protocol: PROTOCOLS.MORPHO, token: '0x6770216aC60F634483Ec073cBABC4011c94307Cb' }, // Gauntlet cbBTC Core
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
    // USDT on Mode
    '0xf0f161fda2712db8b566946122a5af183995e2ed': [
      { protocol: PROTOCOLS.IONIC, token: '0x94812F2eEa03A49869f95e1b5868C6f3206ee3D3' },
      { protocol: PROTOCOLS.IRONCLAD, token: '0x02CD18c03b5b3f250d2B29C87949CDAB4Ee11488' },
      { protocol: PROTOCOLS.WALLET, token: '0xf0f161fda2712db8b566946122a5af183995e2ed' },
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

    case PROTOCOLS.IRONCLAD:
    case PROTOCOLS.AAVE:
    case PROTOCOLS.COMPOUND:
      return balanceObj.displayValue;

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
    'function convertToAssets(uint256) view returns (uint256)',
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
    let underlyingBalance;
    
    if (protocol == PROTOCOLS.MORPHO) {
      underlyingBalance = ethers.formatUnits(await contract.convertToAssets(rawBalance), underlyingDecimals);
    } else {
      underlyingBalance = await getBalanceInUnderlying(
        protocol,
        chainId,
        address,
        token,
        balanceObj,
        underlyingDecimals,
        provider
      );
    }

    results.push({
      protocol,
      wrapperTokenAddress: token,
      wrapperBalance: displayValue,    // raw wrapper token balance
      underlyingBalance,               // computed by getBalanceInUnderlying
    });
  }

  return results;
}