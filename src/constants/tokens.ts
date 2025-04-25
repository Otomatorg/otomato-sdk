import { rpcServices } from "../services/RpcServices.js";

export interface Token {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  image: string | null;
  hideInUI?: boolean | null;
  nativeCurrency?: boolean | null;
  equivalentERC20?: string | null;
}

export interface Tokens {
  [key: number]: Token[];
}

export const TOKENS: Tokens = {
  1: [
    {
      contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png"
    },
    {
      contractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    },
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      nativeCurrency: true,
      equivalentERC20: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
    },
    {
      contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      name: "USDT",
      symbol: "USDT",
      decimals: 18,
      image: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png"
    },
    {
      contractAddress: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      name: "wstETH",
      symbol: "wstETH",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/lido/081388ebc44fa042561749bd5338d49e.png"
    },
  ],
  34443: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      nativeCurrency: true,
      equivalentERC20: "0x4200000000000000000000000000000000000006",
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
    },
    {
      contractAddress: '0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 8,
      image: "https://static.debank.com/image/eth_token/logo_url/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/d3c52e7c7449afa8bd4fad1c93f50d93.png",
    },
    {
      contractAddress: '0xDfc7C877a950e49D2610114102175A06C2e3167a',
      symbol: 'MODE',
      name: 'Mode',
      decimals: 18,
      image: 'https://static.debank.com/image/chain/logo_url/mode/466e6e12f4fd827f8f497cceb0601a5e.png'
    },
    {
      contractAddress: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      image: 'https://static.debank.com/image/mtr_token/logo_url/0x79a61d3a28f8c8537a3df63092927cfa1150fb3c/61844453e63cf81301f845d7864236f6.png'
    },
    {
      contractAddress: '0x2416092f143378750bb29b79eD961ab195CcEea5',
      symbol: 'ezETH',
      name: 'Renzo Restaked ETH',
      decimals: 18,
      image: 'https://static.debank.com/image/mode_token/logo_url/0x2416092f143378750bb29b79ed961ab195cceea5/a66d77b85dfd99539744bc62966e1fac.png'
    },
    {
      contractAddress: "0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A",
      symbol: "weETH.mode",
      name: "Etherfi Restaked ETH",
      decimals: 18,
      image: 'https://static.debank.com/image/eth_token/logo_url/0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee/6c02f6b3bcd264d433c3676100ad8da6.png'
    },
    {
      contractAddress: "0x80137510979822322193FC997d400D5A6C747bf7",
      symbol: "STONE",
      name: "Stakestone ETH",
      decimals: 18,
      image: 'https://static.debank.com/image/b2_token/logo_url/0x7537c1f80c9e157ed7afd93a494be3e1f04f1462/670162c2c0d81b3d1790e60c78e136e1.png'
    },
    {
      contractAddress: "0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd",
      symbol: "wrsETH",
      name: "Kelp Restaked ETH",
      decimals: 18,
      image: 'https://static.debank.com/image/blast_token/logo_url/0xe7903b1f75c534dd8159b313d92cdcfbc62cb3cd/570bd8c5a7c151124d71d35ccbfaaefb.png'
    },
    {
      contractAddress: "0x59889b7021243dB5B1e065385F918316cD90D46c",
      symbol: "M-BTC",
      name: "Merlin BTC",
      decimals: 18,
      image: 'https://static.debank.com/image/merlin_token/logo_url/0xb880fd278198bd590252621d4cd071b1842e9bcd/ef8e2efb7606de9fb88463282c0cbef0.png'
    },

    // stables
    {
      contractAddress: "0xd988097fb8612cc24eeC14542bC03424c656005f",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png"
    },
    {
      contractAddress: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png"
    },
    {
      contractAddress: '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
      symbol: 'USDe',
      name: 'USDe',
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x4c9edd5852cd905f086c759e8383e09bff1e68b3/734064e545eabfc501b9d0e752644b7d.png"
    },
    {
      contractAddress: '0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2',
      symbol: 'sUSDe',
      name: 'sUSDe',
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x9d39a5de30e57443bff2a8307a4256c8797a3497/966083165927dd3c1e6b67ff4bd17060.png"
    },

    // ironclad
    {
      contractAddress: '0x9c29a8eC901DBec4fFf165cD57D4f9E03D4838f7',
      symbol: 'ironETH',
      name: 'Ironclad ETH',
      decimals: 18,
      image: null
    },
    {
      contractAddress: '0xe7334Ad0e325139329E747cF2Fc24538dD564987',
      symbol: 'ironUSDC',
      name: 'Ironclad USDC',
      decimals: 18,
      image: null
    },
    {
      contractAddress: '0x02CD18c03b5b3f250d2B29C87949CDAB4Ee11488',
      symbol: 'ironUSDT',
      name: 'Ironclad USDT',
      decimals: 18,
      image: null
    },

    // ionic
    {
      contractAddress: "0x94812F2eEa03A49869f95e1b5868C6f3206ee3D3",
      symbol: "ion-USDT",
      name: "ionic USDT",
      decimals: 6,
      image: null
    },
    {
      contractAddress: "0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038",
      symbol: "ion-USDC",
      name: "ionic USDC",
      decimals: 6,
      image: null
    },
    {
      contractAddress: "0x59e710215d45F584f44c0FEe83DA6d43D762D857",
      symbol: "ion-ezETH",
      name: "ionic ezETH",
      decimals: 18,
      image: null
    },
    {
      contractAddress: "0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2",
      symbol: "ion-WETH",
      name: "ionic WETH",
      decimals: 18,
      image: null
    },
    {
      contractAddress: "0xd70254C3baD29504789714A7c69d60Ec1127375C",
      symbol: "ion-WBTC",
      name: "ionic WBTC",
      decimals: 8,
      image: null
    },
    {
      contractAddress: "0x959FA710CCBb22c7Ce1e59Da82A247e686629310",
      symbol: "ion-STONE",
      name: "ionic STONE",
      decimals: 18,
      image: null
    },
    {
      contractAddress: "0x49950319aBE7CE5c3A6C90698381b45989C99b46",
      symbol: "ion-wrsETH",
      name: "ionic wrsETH",
      decimals: 18,
      image: null
    },
    {
      contractAddress: "0xA0D844742B4abbbc43d8931a6Edb00C56325aA18",
      symbol: "ion-weETH.mode",
      name: "ionic weETH.mode",
      decimals: 18,
      image: null
    },
    {
      contractAddress: "0x19F245782b1258cf3e11Eda25784A378cC18c108",
      symbol: "ion-M-BTC",
      name: "ionic M-BTC",
      decimals: 18,
      image: null
    },
  ],
  8453: [
    {
      contractAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png"
    },
    {
      contractAddress: "0x2416092f143378750bb29b79eD961ab195CcEea5",
      name: "Renzo Restaked ETH",
      symbol: "ezETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/34753/small/Ezeth_logo_circle.png?1713496404"
    },
    {
      contractAddress: "0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452",
      name: "Wrapped liquid staked Ether 2.0",
      symbol: "wstETH",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/lido/081388ebc44fa042561749bd5338d49e.png"
    },
    {
      contractAddress: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39950/small/WETH.PNG?1724902237"
    },
    {
      contractAddress: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
      name: "USDe",
      symbol: "USDe",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/ethena/bb8bd15480078225e9eca0f9b52415d4.png"
    },
    {
      contractAddress: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
      name: "Coinbase Wrapped BTC",
      symbol: "cbBTC",
      decimals: 8,
      image: "https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp?1726136727"
    },
    {
      contractAddress: "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
      name: "Aerodrome",
      symbol: "AERO",
      decimals: 18,
      image: "https://static.debank.com/image/base_token/logo_url/0x940181a94a35a4569e4529a3cdfb74e38fd98631/bb455b8557be5d08ad67f4314f899e15.png"
    },
    {
      contractAddress: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
      name: "Coinbase Wrapped Staked ETH",
      symbol: "cbETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/27008/small/cbeth.png?1709186989"
    },
    {
      contractAddress: "0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A",
      name: "Wrapped Ethereum",
      symbol: "weETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39950/small/WETH.PNG?1724902237"
    },
    {
      contractAddress: "0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4",
      name: "Electronic Dollar",
      symbol: "eUSD",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/28445/small/0xa0d69e286b938e21cbf7e51d71f6a4c8918f482f.png?1696527441"
    },
    {
      contractAddress: "0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff",
      name: "Based ETH",
      symbol: "bsdETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/35774/small/Icon_White_on_Blue.png?1709793654"
    },
    {
      contractAddress: "0xCc7FF230365bD730eE4B352cC2492CEdAC49383e",
      name: "High Yield USD",
      symbol: "hyUSD",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/33636/small/hyusdlogo.png?1702536133"
    },
    {
      contractAddress: "0xaB36452DbAC151bE02b16Ca17d8919826072f64a",
      name: "Reserve Rights",
      symbol: "RSR",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/8365/small/RSR_Blue_Circle_1000.png?1721777856"
    },
    {
      contractAddress: "0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3",
      name: "Super OETH",
      symbol: "superOETHb",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39828/small/Super_OETH.png?1724208268"
    },
    {
      contractAddress: "0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C",
      name: "Mountain Protocol USD",
      symbol: "wUSDM",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/31719/small/usdm.png?1696530540"
    },
    {
      contractAddress: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
      name: "Euro Coin",
      symbol: "EURC",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/eurc.png"
    },
    {
      contractAddress: "0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7",
      name: "OriginToken",
      symbol: "OGN",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/3296/small/op.jpg?1696504006"
    },
    {
      contractAddress: "0xb79dd08ea68a908a97220c76d19a6aa9cbde4376",
      name: "USD+",
      symbol: "USD+",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdplus.png"
    },
    {
      contractAddress: "0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938",
      name: "USDz",
      symbol: "USDz",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/38039/small/usdz-image-200x200.png?1716334412"
    },
    {
      contractAddress: "0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028",
      name: "Wrapped USD+",
      symbol: "wUSD+",
      decimals: 6,
      image: null
    },
    {
      contractAddress: "0xe31eE12bDFDD0573D634124611e85338e2cBF0cF",
      name: "Stable USDz",
      symbol: "sUSDz",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/38040/small/susdz-symbol-200x200.png?1716334492"
    },
    {
      contractAddress: "0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55",
      name: "Solana (Universal)",
      symbol: "uSOL",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39987/small/UA-SOL_1.png?1725027946"
    },
    {
      contractAddress: "0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4",
      name: "Sui (Universal)",
      symbol: "uSUI",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/50482/small/UA-SUI-PAD.png?1727888681"
    },
    {
      contractAddress: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39807/small/dai.png?1724126571"
    },
    {
      contractAddress: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
      name: "USD Base Coin",
      symbol: "USDbC",
      decimals: 6,
      image: "https://assets.coingecko.com/coins/images/31164/small/baseusdc.jpg?1696529993"
    },
    {
      contractAddress: "0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c",
      name: "Rocket Pool ETH",
      symbol: "rETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/20764/small/reth.png?1696520159"
    },
    {
      contractAddress: "0xEDfa23602D0EC14714057867A78d01e94176BEA0",
      name: "Wrapped rsETH",
      symbol: "wrsETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/37919/small/rseth.png?1715936438"
    },
    {
      contractAddress: "0xA88594D404727625A9437C3f886C7643872296AE",
      name: "WELL",
      symbol: "WELL",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/26133/small/WELL.png?1696525221"
    },
    {
      contractAddress: "0xecac9c5f704e954931349da37f60e39f515c11c1",
      name: "LBTC",
      symbol: "LBTC",
      decimals: 8,
      image: "https://assets.coingecko.com/coins/images/39969/standard/LBTC_Logo.png?1724959872"
    },
    {
      contractAddress: "0x7fcd174e80f264448ebee8c88a7c4476aaf58ea6",
      name: "wsuperOETHb",
      symbol: "wsuperOETHb",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39829/standard/Wrapped_Super_OETH.png?1724208632"
    },
    {
      contractAddress: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
      name: "DEGEN",
      symbol: "DEGEN",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/base_degen/a9e31f68d950d60e7613b6f26c52c428.png"
    },
    {
      contractAddress: "0x7Ba6F01772924a82D9626c126347A28299E98c98",
      name: "Metronome Synth ETH",
      symbol: "msETH",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/mseth.svg"
    },
    {
      contractAddress: "0xbf1aeA8670D2528E08334083616dD9C5F3B087aE",
      name: "Mai Stablecoin",
      symbol: "MAI",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/mai.svg"
    },
    {
      contractAddress: "0xC0D3700000987C99b3C9009069E4f8413fD22330",
      name: "Cod3x USD",
      symbol: "cdxUSD",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/cdxusd.svg"
    },
    {
      contractAddress: "0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9",
      name: "Resolv USD",
      symbol: "USR",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/usr.svg"
    },
    {
      contractAddress: "0x5875eEE11Cf8398102FdAd704C9E96607675467a",
      name: "Savings USDS",
      symbol: "sUSDS",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/susds.svg"
    },
    {
      contractAddress: "0x59aaF835D34b1E3dF2170e4872B785f11E2a964b",
      name: "Verified USDC",
      symbol: "verUSDC",
      decimals: 6,
      image: "https://cdn.morpho.org/assets/logos/verusdc.svg"
    },
    {
      contractAddress: "0x9c0e042d65a2e1fF31aC83f404E5Cb79F452c337",
      name: "Aptos (Universal)",
      symbol: "uAPT",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/uapt.svg"
    },
    {
      contractAddress: "0x2615a94df961278DcbC41Fb0a54fEc5f10a693aE",
      name: "XRP (Universal)",
      symbol: "uXRP",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/uxrp.svg"
    },
    {
      contractAddress: "0x0000206329b97DB379d5E1Bf586BbDB969C63274",
      name: "USDA",
      symbol: "USDA",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/usda.svg"
    },
    {
      contractAddress: "0xA61BeB4A3d02decb01039e378237032B351125B4",
      name: "EURA (previously agEUR)",
      symbol: "EURA",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/eura.svg"
    },
    {
      contractAddress: "0x004626A008B1aCdC4c74ab51644093b155e59A23",
      name: "Staked EURA",
      symbol: "stEUR",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/steur.svg"
    },
    {
      contractAddress: "0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776",
      name: "Staked USDA",
      symbol: "stUSD",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/stusd.svg"
    },
    {
      contractAddress: "0xDD629E5241CbC5919847783e6C96B2De4754e438",
      name: "Midas US Treasury Bill Token",
      symbol: "mTBILL",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/mtbill.svg"
    },
    {
      contractAddress: "0x1C2757c1FeF1038428b5bEF062495ce94BBe92b2",
      name: "Midas Basis Trading Token",
      symbol: "mBASIS",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/mbasis.svg"
    },
    {
      contractAddress: "0xC31389794Ffac23331E0D9F611b7953f90AA5fDC",
      name: "Resolv Liquidity Provider Token",
      symbol: "RLP",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/rlp.svg"
    },
    {
      contractAddress: "0xec443e7E0e745348E500084892C89218B3ba4683",
      name: "PT Resolv USD 24APR2025",
      symbol: "PT-USR-24APR2025",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/ptusr.svg"
    },
    {
      contractAddress: "0x5d746848005507DA0b1717C137A10C30AD9ee307",
      name: "PT Lombard LBTC 29MAY2025",
      symbol: "PT-LBTC-29MAY2025",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg"
    },
    {
      contractAddress: "0xeeE7aF832440884d2b693B4193FA2ec26A48C7d3",
      name: "US Yield Coin",
      symbol: "USYC",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/usyc.svg"
    },
    {
      contractAddress: "0x8c213ee79581Ff4984583C6a801e5263418C4b86",
      name: "Janus Henderson Anemoy Treasury Fund",
      symbol: "JTRSY",
      decimals: 18,
      image: "https://cdn.morpho.org/assets/logos/jtrsy.svg"
    },
    {
      contractAddress: "0x6bb7a212910682dcfdbd5bcbb3e28fb4e8da10ee",
      name: "Gho Token",
      symbol: "GHO",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f/1fd570eeab44b1c7afad2e55b5545c42.png"
    },
  ],
  2741: [
    {
      contractAddress: "0x3439153eb7af838ad19d56e1571fbd09333c2809",
      name: "WETH",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    },
    {
      contractAddress: "0x84a71ccd554cc1b02749b35d22f684cc8ec987e1",
      name: "USDC",
      symbol: "USDC.e",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png"
    },
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      nativeCurrency: true,
      equivalentERC20: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
    }
  ],
  42161: [ // Arbitrum
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      nativeCurrency: true,
      equivalentERC20: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
    },
    {
      contractAddress: "0x17fc002b466eec40dae837fc4be5c67993ddbd6f",
      name: "FRAX",
      symbol: "FRAX",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/frax/0bbd098aba20703a84601865177e6d73.png"
    },
    {
      contractAddress: "0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
      name: "ChainLink",
      symbol: "LINK",
      decimals: 18,
      image: "https://static.debank.com/image/arb_token/logo_url/0xf97f4df75117a78c1a5a0dbb814af92458539fb4/69425617db0ef93a7c21c4f9b81c7ca5.png"
    },
    {
      contractAddress: "0x912ce59144191c1204e64559fe8253a0e49e6548",
      name: "Arbitrum",
      symbol: "ARB",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/arb_arbitrum/854f629937ce94bebeb2cd38fb336de7.png"
    },
    {
      contractAddress: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39807/small/dai.png?1724126571"
    },
    {
      contractAddress: "0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8",
      name: "Rocket Pool ETH",
      symbol: "rETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/20764/small/reth.png?1696520159"
    },
    {
      contractAddress: "0xba5ddd1f9d7f570dc94a51479a000e3bce967196",
      name: "Aave Token",
      symbol: "AAVE",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9/7baf403c819f679dc1c6571d9d978f21.png"
    },
    {
      contractAddress: "0x7dff72693f6a4149b17e7c6314655f6a9f7c8b33",
      name: "Gho Token",
      symbol: "GHO",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f/1fd570eeab44b1c7afad2e55b5545c42.png"
    },
    {
      contractAddress: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
      name: "Bridged USDC",
      symbol: "USDC.e",
      decimals: 6,
      image: "https://static.debank.com/image/arb_token/logo_url/0xaf88d065e77c8cc2239327c5edb3a432268e5831/fffcd27b9efff5a86ab942084c05924d.png"
    },
    {
      contractAddress: "0x93b346b6bc2548da6a1e7d98e9a421b42541425b",
      name: "LUSD Stablecoin",
      symbol: "LUSD",
      decimals: 18,
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/9566.png"
    },
    {
      contractAddress: "0x2416092f143378750bb29b79ed961ab195cceea5",
      name: "Renzo Restaked ETH",
      symbol: "ezETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xbf5495efe5db9ce00f80364c8b423567e58d2110/e4cac3df2fe7caa7122de22911e72a41.png"
    },
    {
      contractAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/arb_token/logo_url/0x82af49447d8a07e3bd95bd0d56f35241523fbab1/61844453e63cf81301f845d7864236f6.png"
    },
    {
      contractAddress: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      image: "https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png"
    },
    {
      contractAddress: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      image: "https://static.debank.com/image/arb_token/logo_url/0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f/d3c52e7c7449afa8bd4fad1c93f50d93.png"
    },
    {
      contractAddress: "0x35751007a407ca6feffe80b3cb397736d2cf4dbe",
      name: "Wrapped eETH",
      symbol: "weETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee/6c02f6b3bcd264d433c3676100ad8da6.png"
    },
    {
      contractAddress: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      name: "USDT",
      symbol: "USDT",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png"
    },
    {
      contractAddress: "0x5979d7b546e38e414f7e9822514be443a4800529",
      name: "Wrapped liquid staked Ether 2.0",
      symbol: "wstETH",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/lido/081388ebc44fa042561749bd5338d49e.png"
    }
  ],
  23294: [
    {
      contractAddress: "0xB6dc6C8b71e88642cEAD3be1025565A9eE74d1C6",
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    },
    {
      contractAddress: "0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3",
      name: "Wrapped ROSE",
      symbol: "wROSE",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/13162/standard/200x200_%28Rounded%29.png?1743579893"
    },
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ROSE",
      symbol: "ROSE",
      nativeCurrency: true,
      equivalentERC20: "0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/13162/standard/200x200_%28Rounded%29.png?1743579893"
    }
  ]
};

export interface NFT {
  contractAddress: string;
  name: string;
  image: string | null;
}

export interface NFTs {
  [key: number]: NFT[];
}

export const NFTS: NFTs = {
  1: [
    {
      contractAddress: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
      name: "MutantApeYachtClub",
      image: "https://images.blur.io/_blur-prod/0x60e4d786628fea6478f785a6d7e704777c86a7c6/4647-3c64c4804b4cd5fe?w=128"
    },
    {
      contractAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
      name: "BoredApeYachtClub",
      image: "https://images.blur.io/_blur-prod/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/8321-69a4c46a6e8e5b07?w=128"
    },

    {
      contractAddress: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
      name: "Pudgy Penguins",
      image: "https://images.blur.io/_blur-prod/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/760-b91995265fdeb95a?w=128"
    },
    {
      contractAddress: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
      name: "Doodles",
      image: "https://images.blur.io/_blur-prod/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e/7522-a0e3ae3f8d77961e?w=128"
    },
    {
      contractAddress: "0x524cab2ec69124574082676e6f654a18df49a048",
      name: "Lil Pudgies",
      image: "https://images.blur.io/_blur-prod/0x524cab2ec69124574082676e6f654a18df49a048/17176-05eebb761a566d53?w=128"
    },

  ],
  34443: [
    {
      contractAddress: "0x2ad86eeec513ac16804bb05310214c3fd496835b",
      name: "Space id",
      image: "https://s.nfte.so/asset/collection/featured/4e4e0173-77d8-42fd-86a5-b5ab4a6ac394.png?x-oss-process=image/resize,m_fill,w_300,h_300,type_6/ignore-error,1"
    }
  ]
};

export async function getToken(chain: number, contractAddress: string): Promise<Token> {
  if (!(chain in TOKENS)) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  let token = TOKENS[chain].find(token => token.contractAddress.toLowerCase() === contractAddress.toLowerCase());

  if (!token) {
    try {
      token = await rpcServices.getTokenDetails(chain, contractAddress);
    } catch (e) {
      throw new Error(`Token with contract address ${contractAddress} not found on chain ${chain}`);
    }
  }

  return token;
}

export function getTokenFromSymbol(chain: number, symbol: string): Token {
  if (!(chain in TOKENS)) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const token = TOKENS[chain].find(token => token.symbol.toLowerCase() === symbol.toLowerCase());

  if (!token) {
    throw new Error(`Token ${symbol} not found on chain ${chain}`);
  }

  return token;
}

export function getNFT(chain: number, name: string): NFT {
  if (!(chain in NFTS)) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const nft = NFTS[chain].find(nft => nft.name === name);

  if (!nft) {
    throw new Error(`NFT ${name} not found on chain ${chain}`);
  }

  return nft;
}