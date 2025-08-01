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
    {
      contractAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      name: "WBTC",
      symbol: "WBTC",
      decimals: 8,
      image: "https://static.debank.com/image/eth_token/logo_url/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/d3c52e7c7449afa8bd4fad1c93f50d93.png"
    },
    {
      contractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      name: "DAI",
      symbol: "DAI",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x6b175474e89094c44da98b954eedeac495271d0f/549c4205dbb199f1b8b03af783f35e71.png"
    },
    {
      contractAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      name: "LINK",
      symbol: "LINK",
      decimals: 18,
      image: "https://static.debank.com/image/mada_token/logo_url/0xf390830df829cf22c53c8840554b98eafc5dcbc2/69425617db0ef93a7c21c4f9b81c7ca5.png"
    },
    {
      contractAddress: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      name: "AAVE",
      symbol: "AAVE",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9/7baf403c819f679dc1c6571d9d978f21.png"
    },
    {
      contractAddress: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
      name: "cbETH",
      symbol: "cbETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xbe9895146f7af43049ca1c1ae358b0541ea49704/1f287272a7d8439af0f6b281ebf0143e.png"
    },
    {
      contractAddress: "0xae78736Cd615f374D3085123A210448E74Fc6393",
      name: "rETH",
      symbol: "rETH",
      decimals: 18,
      image: "https://static.debank.com/image/arb_token/logo_url/0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8/6c8aa3f550d300ce84e06f95c496af69.png"
    },
    {
      contractAddress: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
      name: "LUSD",
      symbol: "LUSD",
      decimals: 18,
      image: "https://static.debank.com/image/op_token/logo_url/0xc40f949f8a4e094d1b49a23ea9241d289b7b2819/56935bcdcac2e13a87ed36fb11c0fb52.png"
    },
    {
      contractAddress: "0xD533a949740bb3306d119CC777fa900bA034cd52",
      name: "CRV",
      symbol: "CRV",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xd533a949740bb3306d119cc777fa900ba034cd52/38f4cbac8fb4ac70c384a65ae0cca337.png"
    },
    {
      contractAddress: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
      name: "MKR",
      symbol: "MKR",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2/1d0390168de63ca803e8db7990e4f6ec.png"
    },
    {
      contractAddress: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
      name: "SNX",
      symbol: "SNX",
      decimals: 18,
      image: "https://etherscan.io/token/images/synthetix_32.svg"
    },
    {
      contractAddress: "0xba100000625a3754423978a60c9317c58a424e3D",
      name: "BAL",
      symbol: "BAL",
      decimals: 18,
      image: "https://static.debank.com/image/bsc_token/logo_url/0xd4ed60d8368a92b5f1ca33af61ef2a94714b2d46/cb8f7f37cfe1ad827dc5977d841a1294.png"
    },
    {
      contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      name: "UNI",
      symbol: "UNI",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/fcee0c46fc9864f48ce6a40ed1cdd135.png"
    },
    {
      contractAddress: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
      name: "LDO",
      symbol: "LDO",
      decimals: 18,
      image: "https://etherscan.io/token/images/ldo.svg"
    },
    {
      contractAddress: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
      name: "ENS",
      symbol: "ENS",
      decimals: 18,
      image: "https://etherscan.io/token/images/ens.svg"
    },
    {
      contractAddress: "0x111111111117dC0aa78b770fA6A738034120C302",
      name: "1INCH",
      symbol: "1INCH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x111111111117dc0aa78b770fa6a738034120c302/2441b15b32406dc7d163ba4c1c6981d3.png"
    },
    {
      contractAddress: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
      name: "FRAX",
      symbol: "FRAX",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/frax/0bbd098aba20703a84601865177e6d73.png"
    },
    {
      contractAddress: "0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f",
      name: "GHO",
      symbol: "GHO",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f/1fd570eeab44b1c7afad2e55b5545c42.png"
    },
    {
      contractAddress: "0xD33526068D116cE69F19A9ee46F0bd304F21A51f",
      name: "RPL",
      symbol: "RPL",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xd33526068d116ce69f19a9ee46f0bd304f21a51f/0dac0c5e1dd543fb62581f0756e0b11f.png"
    },
    {
      contractAddress: "0x83F20F44975D03b1b09e64809B757c47f942BEeA",
      name: "sDAI",
      symbol: "sDAI",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x83f20f44975d03b1b09e64809b757c47f942beea/78e145e5bbff293bf3332ac746085b80.png"
    },
    {
      contractAddress: "0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6",
      name: "STG",
      symbol: "STG",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6/55886c6280173254776780fd8340cca7.png"
    },
    {
      contractAddress: "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202",
      name: "KNC",
      symbol: "KNC",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202/1d25e188deb06e642ea6f4f4f8eb0a0c.png"
    },
    {
      contractAddress: "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
      name: "FXS",
      symbol: "FXS",
      decimals: 18,
      image: "https://etherscan.io/token/images/fraxfxs_new_32.png"
    },
    {
      contractAddress: "0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E",
      name: "Curve.Fi USD Stablecoin",
      symbol: "crvUSD",
      decimals: 18,
      image: "https://etherscan.io/token/images/crvusd_32.png?v=2"
    },
    {
      contractAddress: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
      name: "PYUSD",
      symbol: "PYUSD",
      decimals: 6,
      image: "https://static.debank.com/image/eth_token/logo_url/0x6c3ea9036406852006290770bedfcaba0e23a0e8/8af98a6a2c36c107eeb4b349fddb51b0.png"
    },
    {
      contractAddress: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
      name: "weETH",
      symbol: "weETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee/6c02f6b3bcd264d433c3676100ad8da6.png"
    },
    {
      contractAddress: "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38",
      name: "Staked ETH",
      symbol: "osETH",
      decimals: 18,
      image: "https://etherscan.io/token/images/stakewise_32.png"
    },
    {
      contractAddress: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
      name: "USDe",
      symbol: "USDe",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x4c9edd5852cd905f086c759e8383e09bff1e68b3/1228d6e73f70f37ec1f6fe02a3bbe6ff.png"
    },
    {
      contractAddress: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
      name: "ETHx",
      symbol: "ETHx",
      decimals: 18,
      image: "https://static.debank.com/image/coin/logo_url/eth/6443cdccced33e204d90cb723c632917.png"
    },
    {
      contractAddress: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
      name: "sUSDe",
      symbol: "sUSDe",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x9d39a5de30e57443bff2a8307a4256c8797a3497/966083165927dd3c1e6b67ff4bd17060.png"
    },
    {
      contractAddress: "0x18084fbA666a33d37592fA2633fD49a74DD93a88",
      name: "tBTC v2",
      symbol: "tBTC",
      decimals: 18,
      image: "https://etherscan.io/token/images/threshold_32.png?v=28"
    },
    {
      contractAddress: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
      name: "Coinbase Wrapped BTC",
      symbol: "cbBTC",
      decimals: 8,
      image: "https://static.debank.com/image/base_token/logo_url/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf/a4ae837a6ca2fc45f07a74898cc4ba45.png"
    },
    {
      contractAddress: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
      name: "USDS",
      symbol: "USDS",
      decimals: 18,
      image: "https://etherscan.io/token/images/skyusds_32.svg"
    },
    {
      contractAddress: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
      name: "rsETH",
      symbol: "rsETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xa1290d69c65a6fe4df752f95823fae25cb99e5a7/9b29efed86aff5a64f238d6d30032f40.png"
    },
    {
      contractAddress: "0x8236a87084f8B84306f72007F36F2618A5634494",
      name: "LBTC",
      symbol: "LBTC",
      decimals: 8,
      image: "https://static.debank.com/image/eth_token/logo_url/0x8236a87084f8b84306f72007f36f2618a5634494/e63f839c2285bae18b83e42853bc0cf2.png"
    },
    {
      contractAddress: "0x657e8C867D8B37dCC18fA4Caead9C45EB088C642",
      name: "ether.fi BTC",
      symbol: "eBTC",
      decimals: 8,
      image: "https://etherscan.io/token/images/eBTC_32.png"
    },
    {
      contractAddress: "0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD",
      name: "RLUSD",
      symbol: "RLUSD",
      decimals: 18,
      image: "https://assets.debank.com/static/media/default.99a115ad939329c9a25b45d3cdecf56f.svg"
    },
    {
      contractAddress: "0x50D2C7992b802Eef16c04FeADAB310f31866a545",
      name: "PT Ethereal eUSDE 29MAY2025",
      symbol: "PT-eUSDE-29MAY2025",
      decimals: 18,
      image: ""
    },
    {
      contractAddress: "0x3b3fB9C57858EF816833dC91565EFcd85D96f634",
      name: "PT-sUSDE-31JUL2025",
      symbol: "PT-sUSDE-31JUL2025",
      decimals: 18,
      image: ""
    }
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
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      nativeCurrency: true,
      equivalentERC20: "0x4200000000000000000000000000000000000006",
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
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
      image: "https://static.debank.com/image/base_token/logo_url/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf/a4ae837a6ca2fc45f07a74898cc4ba45.png"
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
      name: "Wrapped eETH",
      symbol: "weETH",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/33033/small/weETH.png?1701438396"
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
    {
      contractAddress: "0x820C137fa70C8691f0e44Dc420a5e53c168921Dc",
      name: "USDS Stablecoin",
      symbol: "USDS",
      decimals: 18,
      image: "https://basescan.org/token/images/skyusds_32.svg"
    },
    {
      contractAddress: "0x236aa50979d5f3de3bd1eeb40e81137f22ab794b",
      name: "Base tBTC v2",
      symbol: "tBTC",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x236aa50979d5f3de3bd1eeb40e81137f22ab794b/81d0f366026c3480d25d3c1dfa5b60d3.png"
    },
    {
      contractAddress: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
      name: "Virtual Protocol",
      symbol: "VIRTUAL",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x44ff8620b8ca30902395a7bd3f2407e1a091bf73/cbb70834d9442214c846833e47648255.png"
    },
    {
      contractAddress: "0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842",
      name: "Morpho Token",
      symbol: "MORPHO",
      decimals: 18,
      image: "https://static.debank.com/image/base_token/logo_url/0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842/c092d2c513136e17883955cdd2c62ff1.png"
    },
    {
      contractAddress: "0xcb585250f852c6c6bf90434ab21a00f02833a4af",
      name: "Coinbase Wrapped XRP",
      symbol: "cbXRP",
      decimals: 6,
      image: "https://static.debank.com/image/project/logo_url/coinbasewallet/baf3eb82a7f897fe46ba0caf42470342.png"
    }
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
  // Oasis
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
      contractAddress: "0xed57966f1566de1a90042d07403021ea52ad4724",
      name: "stROSE",
      symbol: "stROSE",
      decimals: 18,
      image: "https://resources.accumulated.finance/tokens/23294/0xed57966f1566de1a90042d07403021ea52ad4724.png"
    },
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ROSE",
      symbol: "ROSE",
      nativeCurrency: true,
      equivalentERC20: "0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/13162/standard/200x200_%28Rounded%29.png?1743579893"
    },
    {
      contractAddress: "0xDD629E5241CbC5919847783e6C96B2De4754e438",
      name: "Midas US Treasury Bill Token",
      symbol: "mTBill",
      decimals: 18,
      image: "https://assets.oasis.io/explorer-tokens/mtBILL.svg"
    },
    {
      contractAddress: "0x3cAbbe76Ea8B4e7a2c0a69812CBe671800379eC8",
      name: "wstROSE",
      symbol: "wstROSE",
      decimals: 18,
      image: "https://assets.oasis.io/explorer-tokens/wstROSE.svg"
    }
  ],
  // Optimism
  10: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "Ethereum",
      symbol: "ETH",
      nativeCurrency: true,
      equivalentERC20: "0x4200000000000000000000000000000000000006",
      decimals: 0,
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
    },
    {
      contractAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      image: "https://assets.coingecko.com/coins/images/39807/small/dai.png?1724126571"
    },
    {
      contractAddress: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
      name: "ChainLink Token",
      symbol: "LINK",
      decimals: 18,
      image: "https://static.debank.com/image/arb_token/logo_url/0xf97f4df75117a78c1a5a0dbb814af92458539fb4/69425617db0ef93a7c21c4f9b81c7ca5.png"
    },
    {
      contractAddress: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      image: "https://static.debank.com/image/arb_token/logo_url/0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f/d3c52e7c7449afa8bd4fad1c93f50d93.png"
    },
    {
      contractAddress: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png"
    },
    {
      contractAddress: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png"
    },
    {
      contractAddress: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
      name: "Aave Token",
      symbol: "AAVE",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9/7baf403c819f679dc1c6571d9d978f21.png"
    },
    {
      contractAddress: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
      name: "Synth sUSD",
      symbol: "sUSD",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x57ab1ec28d129707052df4df418d58a2d46d5f51/c699f829018dea55b6b49da32bc9a90d.png"
    },
    {
      contractAddress: "0x4200000000000000000000000000000000000042",
      name: "Optimism",
      symbol: "OP",
      decimals: 18,
      image: "https://static.debank.com/image/op_token/logo_url/0x4200000000000000000000000000000000000042/029a56df18f88f4123120fdcb6bea40b.png"
    },
    {
      contractAddress: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
      name: "Wrapped liquid staked Ether 2.0",
      symbol: "wstETH",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/lido/081388ebc44fa042561749bd5338d49e.png"
    },
    {
      contractAddress: "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
      name: "LUSD Stablecoin",
      symbol: "LUSD",
      decimals: 18,
      image: "https://static.debank.com/image/op_token/logo_url/0xc40f949f8a4e094d1b49a23ea9241d289b7b2819/56935bcdcac2e13a87ed36fb11c0fb52.png"
    },
    {
      contractAddress: "0xdFA46478F9e5EA86d57387849598dbFB2e964b02",
      name: "Mai Stablecoin",
      symbol: "MAI",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/avax_mai/cb30de2ca105456fbb279ef6297cf1dd.png"
    },
    {
      contractAddress: "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D",
      name: "Rocket Pool ETH",
      symbol: "rETH",
      decimals: 18,
      image: "https://static.debank.com/image/op_token/logo_url/0x9bcef72be871e61ed4fbbc7630889bee758eb81d/0a56aa87c04449332f88702b2bd5f45c.png"
    },
    {
      contractAddress: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      image: "https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png"
    },
    {
      contractAddress: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      name: "USD Coin (Bridged from Ethereum)",
      symbol: "USDC.e",
      decimals: 6,
      image: "https://static.debank.com/image/avax_token/logo_url/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664/c1503ade9d53497fe93ca9f2723c56a1.png"
    },
    {
      contractAddress: "0xadDb6A0412DE1BA0F936DCaeb8Aaa24578dcF3B2",
      name: "Coinbase Wrapped Staked ETH",
      symbol: "cbETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xbe9895146f7af43049ca1c1ae358b0541ea49704/1f287272a7d8439af0f6b281ebf0143e.png"
    },
    {
      contractAddress: "0x5A7fACB970D094B6C7FF1df0eA68D99E6e73CBFF",
      name: "weETH",
      symbol: "weETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee/6c02f6b3bcd264d433c3676100ad8da6.png"
    },
    {
      contractAddress: "0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db",
      name: "VelodromeV2",
      symbol: "VELO",
      decimals: 18,
      image: "https://static.debank.com/image/op_token/logo_url/0x9560e827af36c94d2ac33a39bce1fe78631088db/433c39cc788f0e5e31cb00dddd8b3c53.png"
    },
    {
      contractAddress: "0x87eEE96D50Fb761AD85B1c982d28A042169d61b1",
      name: "Wrapped rsETH",
      symbol: "wrsETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xa1290d69c65a6fe4df752f95823fae25cb99e5a7/9b29efed86aff5a64f238d6d30032f40.png"
    },
    {
      contractAddress: "0x01bFF41798a0BcF287b996046Ca68b395DbC1071",
      name: "USDT0",
      symbol: "USDT0",
      decimals: 6,
      image: "https://static.debank.com/image/eth_token/logo_url/0xdac17f958d2ee523a2206206994597c13d831ec7/464c0de678334b8fe87327e527bc476d.png"
    },
    {
      contractAddress: "0x3c8b650257cfb5f272f799f5e2b4e65093a11a05",
      name: "Velodrome",
      symbol: "VELO",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/op_velodrome/91c9c0f782ba8b2faf88e29b31e724fc.png"
    }
  ],
  // Binance
  56: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "BNB",
      symbol: "BNB",
      nativeCurrency: true,
      equivalentERC20: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 0,
      image: "https://static.debank.com/image/coin/logo_url/bnb/9784283a36f23a58982fc964574ea530.png"
    },
    {
      contractAddress: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
      name: "PancakeSwap Token",
      symbol: "Cake",
      decimals: 18,
      image: "https://static.debank.com/image/bsc_token/logo_url/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82/9003539eb61139bd494b7412b785d482.png"
    },
    {
      contractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      name: "Wrapped BNB",
      symbol: "WBNB",
      decimals: 18,
      image: "https://static.debank.com/image/coin/logo_url/bnb/9784283a36f23a58982fc964574ea530.png"
    },
    {
      contractAddress: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      name: "Bitcoin BEP2",
      symbol: "BTCB",
      decimals: 18,
      image: "https://static.debank.com/image/bsc_token/logo_url/0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c/6f9302fa889419e4ce8745931d2e19bf.png"
    },
    {
      contractAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      name: "Binance-Peg Ethereum Token",
      symbol: "ETH",
      decimals: 18,
      image: "https://static.debank.com/image/coin/logo_url/eth/6443cdccced33e204d90cb723c632917.png"
    },
    {
      contractAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png"
    },
    {
      contractAddress: "0x55d398326f99059fF775485246999027B3197955",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 18,
      image: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png"
    },
    {
      contractAddress: "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409",
      name: "First Digital USD",
      symbol: "FDUSD",
      decimals: 18,
      image: "https://static.debank.com/image/bsc_token/logo_url/0xc5f0f7b66764f6ec8c8dff7ba683102295e16409/9c61b134f82d8780005895d8fb6b19ab.png"
    },
    {
      contractAddress: "0x26c5e01524d2E6280A48F2c50fF6De7e52E9611C",
      name: "Wrapped liquid staked Ether 2.0",
      symbol: "wstETH",
      decimals: 18,
      image: "https://static.debank.com/image/manta_token/logo_url/0x2fe3ad97a60eb7c79a976fc18bb5ffd07dd94ba5/2386b46c224a2d3566d418ea7de38471.png"
    }
  ],
  // Polygon
  137: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "MATIC",
      symbol: "MATIC",
      nativeCurrency: true,
      equivalentERC20: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 0,
      image: "https://static.debank.com/image/eth_token/logo_url/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0/20aac20baa9069bd39342edd8c5cc801.png"
    },
    {
      contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/b13487f4a2e0c43d8dc9e98194a2dd39.png"
    },
    {
      contractAddress: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
      name: "ChainLink Token",
      symbol: "LINK",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39/cef6e0d1f77e59becae308dad59a5377.png"
    },
    {
      contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      name: "USD Coin",
      symbol: "USDC.e",
      decimals: 6,
      image: "https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png"
    },
    {
      contractAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      decimals: 8,
      image: "https://static.debank.com/image/eth_token/logo_url/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/d3c52e7c7449afa8bd4fad1c93f50d93.png"
    },
    {
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619/fcbac4ac4814f10386e7b892c3fc0adc.png"
    },
    {
      contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      image: "https://static.debank.com/image/matic_token/logo_url/0xc2132d05d31c914a87c6611c10748aeb04b58e8f/3a2803ff6129961e8fa48f8b66d06735.png"
    },
    {
      contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      name: "Aave Token",
      symbol: "AAVE",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0xd6df932a45c0f255f85145f286ea0b292b21c90b/9ac673ff449bb7b8fbc8b8119caf4a1f.png"
    },
    {
      contractAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      name: "Wrapped MATIC",
      symbol: "WPOL",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270/8c043b86aa8131c15ecf578ce6bf2615.png"
    },
    {
      contractAddress: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
      name: "Curve DAO Token",
      symbol: "CRV",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xd533a949740bb3306d119cc777fa900ba034cd52/38f4cbac8fb4ac70c384a65ae0cca337.png"
    },
    {
      contractAddress: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
      name: "SushiToken",
      symbol: "SUSHI",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a/141f2667ca2ae482227a988afebeeccd.png"
    },
    {
      contractAddress: "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7",
      name: "Aavegotchi",
      symbol: "GHST",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x3f382dbd960e3a9bbceae22651e88158d2791550/68ed965e1498018afc8b8b91e4d43e96.png"
    },
    {
      contractAddress: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
      name: "Balancer",
      symbol: "BAL",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3/92087d366bfe2d2ef1f9108b962cad8e.png"
    },
    {
      contractAddress: "0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369",
      name: "DefiPulse Index",
      symbol: "DPI",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x85955046df4668e1dd369d2de9f3aeb98dd2a369/23c2068d205b6d3d72739c1f9a421366.png"
    },
    {
      contractAddress: "0xE111178A87A3BFf0c8d18DECBa5798827539Ae99",
      name: "STASIS EURO",
      symbol: "EURS",
      decimals: 2,
      image: "https://polygonscan.com/token/images/statiseuro_28.png"
    },
    {
      contractAddress: "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c",
      name: "Jarvis Euro",
      symbol: "jEUR",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x4e3decbb3645551b8a19f0ea1678079fcb33fb4c/c3551ad2d3425983e66bff80d1818573.png"
    },
    {
      contractAddress: "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4",
      name: "agEUR",
      symbol: "agEUR",
      decimals: 18,
      image: "https://polygonscan.com/token/images/ageurpoly_32.png"
    },
    {
      contractAddress: "0xa3Fa99A148fA48D14Ed51d610c367C61876997F1",
      name: "Mai Stablecoin",
      symbol: "miMATIC",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0xa3fa99a148fa48d14ed51d610c367c61876997f1/be77e8e47016b1e9d3f01b7edc9b8d4f.png"
    },
    {
      contractAddress: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      name: "Staked MATIC",
      symbol: "stMATIC",
      decimals: 18,
      image: "https://static.debank.com/image/matic_token/logo_url/0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4/2d5ff76341cf16ae829fcf7711dedd6d.png"
    },
    {
      contractAddress: "0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6",
      name: "Liquid Staking Matic",
      symbol: "MaticX",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xf03a7eb46d01d9ecaa104558c732cf82f6b6b645/49c8b7e2665db48c5cecdc06abe1787c.png"
    },
    {
      contractAddress: "0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD",
      name: "Wrapped liquid staked Ether 2.0",
      symbol: "wstETH",
      decimals: 18,
      image: "https://polygonscan.com/token/images/wsteth_32.png"
    },
    {
      contractAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      image: "https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png"
    }
  ],
  // Sonic
  146: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "SONIC",
      symbol: "SONIC",
      nativeCurrency: true,
      equivalentERC20: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
      decimals: 0,
      image: "https://static.debank.com/image/sonic_token/logo_url/sonic/17d88e82ee2f7243922c0f2d3de580ce.png"
    },
    {
      contractAddress: "0x50c42dEAcD8Fc9773493ED674b675bE577f2634b",
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/sonic_token/logo_url/0x50c42deacd8fc9773493ed674b675be577f2634b/639320e04981204eca87cf9afb5f5c89.png"
    },
    {
      contractAddress: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
      name: "Bridged USDC (Sonic Labs)",
      symbol: "USDC.e",
      decimals: 6,
      image: "https://static.debank.com/image/arb_token/logo_url/0xaf88d065e77c8cc2239327c5edb3a432268e5831/fffcd27b9efff5a86ab942084c05924d.png"
    },
    {
      contractAddress: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
      name: "Wrapped Sonic",
      symbol: "wS",
      decimals: 18,
      image: "https://static.debank.com/image/sonic_token/logo_url/0x039e2fb66102314ce7b64ce5ce3e5183bc94ad38/c4faf4a1f3192ee5dc3184879182d7e3.png"
    },
    {
      contractAddress: "0xE5DA20F15420aD15DE0fa650600aFc998bbE3955",
      name: "Beets Staked Sonic",
      symbol: "stS",
      decimals: 18,
      image: "https://sonicscan.org/token/images/sts_32.png"
    }
  ],
  // Avalanche
  43114: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "AVAX",
      symbol: "AVAX",
      nativeCurrency: true,
      equivalentERC20: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      decimals: 0,
      image: "https://static.debank.com/image/project/logo_url/avax_wavax/e195cdd89f44bf3d0c65d38ce2c6c662.png"
    },
    {
      contractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/avax_wavax/e195cdd89f44bf3d0c65d38ce2c6c662.png"
    },
    {
      contractAddress: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      name: "Dai Stablecoin",
      symbol: "DAI.e",
      decimals: 18,
      image: "https://static.debank.com/image/avax_token/logo_url/0xd586e7f844cea2f87f50152665bcbc2c279d8d70/549c4205dbb199f1b8b03af783f35e71.png"
    },
    {
      contractAddress: "0x5947BB275c521040051D82396192181b413227A3",
      name: "ChainLink Token",
      symbol: "LINK.e",
      decimals: 18,
      image: "https://static.debank.com/image/avax_token/logo_url/0x5947bb275c521040051d82396192181b413227a3/69425617db0ef93a7c21c4f9b81c7ca5.png"
    },
    {
      contractAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      image: "https://static.debank.com/image/arb_token/logo_url/0xaf88d065e77c8cc2239327c5edb3a432268e5831/fffcd27b9efff5a86ab942084c05924d.png"
    },
    {
      contractAddress: "0x50b7545627a5162F82A992c33b87aDc75187B218",
      name: "Wrapped Bitcoin",
      symbol: "WBTC.e",
      decimals: 8,
      image: "https://static.debank.com/image/avax_token/logo_url/0x50b7545627a5162f82a992c33b87adc75187b218/07408c936022cc58f94eeeda4095dd3a.png"
    },
    {
      contractAddress: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      name: "Wrapped Ether",
      symbol: "WETH.e",
      decimals: 18,
      image: "https://static.debank.com/image/avax_token/logo_url/0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab/61844453e63cf81301f845d7864236f6.png"
    },
    {
      contractAddress: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      name: "Tether USD",
      symbol: "USDt",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png"
    },
    {
      contractAddress: "0x63a72806098Bd3D9520cC43356dD78afe5D386D9",
      name: "Aave Token",
      symbol: "AAVE.e",
      decimals: 18,
      image: "https://static.debank.com/image/avax_token/logo_url/0x63a72806098bd3d9520cc43356dd78afe5d386d9/9ac673ff449bb7b8fbc8b8119caf4a1f.png"
    },
    {
      contractAddress: "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE",
      name: "Staked AVAX",
      symbol: "sAVAX",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/avax_wavax/e195cdd89f44bf3d0c65d38ce2c6c662.png"
    },
    {
      contractAddress: "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64",
      name: "Frax",
      symbol: "FRAX",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/frax/0bbd098aba20703a84601865177e6d73.png"
    },
    {
      contractAddress: "0x5c49b268c9841AFF1Cc3B0a418ff5c3442eE3F3b",
      name: "Mai Stablecoin",
      symbol: "MAI",
      decimals: 18,
      image: "https://static.debank.com/image/project/logo_url/avax_mai/cb30de2ca105456fbb279ef6297cf1dd.png"
    },
    {
      contractAddress: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      name: "Bitcoin",
      symbol: "BTC.b",
      decimals: 8,
      image: "https://static.debank.com/image/eth_token/logo_url/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/d3c52e7c7449afa8bd4fad1c93f50d93.png"
    },
    {
      contractAddress: "0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a",
      name: "Axelar USD",
      symbol: "AUSD",
      decimals: 6,
      image: ""
    }
  ],
  50312: [
    {
      contractAddress: "0x0ED782B8079529f7385c3eDA9fAf1EaA0DbC6a17",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      image: ""
    },
    {
      contractAddress: "0x65296738D4E5edB1515e40287B6FDf8320E6eE04",
      name: "sUSDT",
      symbol: "sUSDT",
      decimals: 18,
      image: ""
    },
    {
      contractAddress: "0x68D13B424831dB31e26cAF3D98619eb047B53447",
      name: "WSTT",
      symbol: "WSTT",
      decimals: 18,
      image: ""
    }
  ],
  130: [
    {
        contractAddress: "0x0000000000000000000000000000000000000000",
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png",
        nativeCurrency: true,
        equivalentERC20: "0x4200000000000000000000000000000000000006"
      
    },
    {
        contractAddress: "0x4200000000000000000000000000000000000006",
        name: "Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
        image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    }
  ],
  324: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png",
      nativeCurrency: true,
      equivalentERC20: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91"
    },
    {
      contractAddress: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    }
  ],
  5000: [
      {
      contractAddress: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    }
  ],
  59144: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png",
      nativeCurrency: true,
      equivalentERC20: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f"
    },
    {
      contractAddress: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    }
  ],
  534352: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      image: "https://static.debank.com/image/chain/logo_url/eth/42ba589cd077e7bdd97db6480b0ff61d.png",
      nativeCurrency: true,
      equivalentERC20: "0x5300000000000000000000000000000000000004"
    },
    {
      contractAddress: "0x5300000000000000000000000000000000000004",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png"
    }
  ],
  250: [
    {
      contractAddress: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png",
      nativeCurrency: false,
      equivalentERC20: "0x9E73F99EE061C8807F69f9c6CCc44ea3d8c373ee"
    },
    {
      contractAddress: "0x9E73F99EE061C8807F69f9c6CCc44ea3d8c373ee",
      name: "Frax Ether",
      symbol: "frxETH",
      decimals: 18,
      image: null
    }
  ],
  252: [
    {
      contractAddress: "0xFC00000000000000000000000000000000000006",
      name: "Frax Ether",
      symbol: "frxETH",
      decimals: 18,
      image: null,
    }
  ],
  999: [
    {
      contractAddress: "0x5555555555555555555555555555555555555555",
      name: "wHYPE",
      symbol: "wHYPE",
      decimals: 18,
      image: "https://static.debank.com/image/hyper_token/logo_url/hyper/0b3e288cfe418e9ce69eef4c96374583.png"
    },
    {
      contractAddress: "0x94e8396e0869c9F2200760aF0621aFd240E1CF38",
      name: "Wrapped Staked HYPE",
      symbol: "wstHYPE",
      decimals: 18,
      image: "https://static.debank.com/image/hyper_token/logo_url/0x5555555555555555555555555555555555555555/752e760ec0b1a17b81c7535e09e76ef8.png"
    },
    {
      contractAddress: "0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463",
      name: "Universal Bitcoin",
      symbol: "UBTC",
      decimals: 8,
      image: "https://static.debank.com/image/hyper_token/logo_url/0x9fdbda0a5e284c32744d2f17ee5c74b284993463/0e625d069e829a7e3aa6ef5ea569ae59.png"
    },
    {
      contractAddress: "0xBe6727B535545C67d5cAa73dEa54865B92CF7907",
      name: "Universal Ethereum",
      symbol: "UETH",
      decimals: 18,
      image: "https://static.debank.com/image/hyper_token/logo_url/0xbe6727b535545c67d5caa73dea54865b92cf7907/c3d23de18dc7c3c3c77208c886e8e392.png"
    },
    {
      contractAddress: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
      name: "USDe",
      symbol: "USDe",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x4c9edd5852cd905f086c759e8383e09bff1e68b3/1228d6e73f70f37ec1f6fe02a3bbe6ff.png"
    },
    {
      contractAddress: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
      name: "Tether USD",
      symbol: "USDT0",
      decimals: 6,
      image: "https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png"
    },
    {
      contractAddress: "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2",
      name: "Staked USDe",
      symbol: "sUSDe",
      decimals: 18,
      image: "https://static.debank.com/image/eth_token/logo_url/0x4c9edd5852cd905f086c759e8383e09bff1e68b3/1228d6e73f70f37ec1f6fe02a3bbe6ff.png"
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