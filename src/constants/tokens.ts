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
      contractAddress: "0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452",
      name: "Wrapped liquid staked Ether 2.0",
      symbol: "wstETH",
      decimals: 18,
      image: "https://basescan.org/token/images/wsteth3_32.png"
    },
    
    {
      contractAddress: "0x4200000000000000000000000000000000000006",
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      image: "https://basescan.org/token/images/weth_28.png"
    },
    {
      contractAddress: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
      name: "USDe",
      symbol: "USDe",
      decimals: 18,
      image: "https://basescan.org/token/images/ethenausde_32.png"
    },
    {
      contractAddress: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
      name: "Coinbase Wrapped BTC",
      symbol: "cbBTC",
      decimals: 8,
      image: "https://basescan.org/token/images/cbbtc_32.png"
    },
    {
      contractAddress: "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
      name: "Aerodrome",
      symbol: "AERO",
      decimals: 18,
      image: "https://basescan.org/token/images/aerodrome_32.png"
    },


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