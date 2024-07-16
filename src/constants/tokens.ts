export interface Token {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
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
      decimals: 6
    },
  ],
  43334: [
    {
      contractAddress: "0x0000000000000000000000000000000000000000",
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    {
      contractAddress: "0xd988097fb8612cc24eeC14542bC03424c656005f",
      name: "USDC",
      symbol: "USDC",
      decimals: 6
    },
    {
      contractAddress: '0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 8
    },
    {
      contractAddress: '0xf0F161fDA2712DB8b566946122a5af183995e2eD',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 6
    },
    {
      contractAddress: '0xDfc7C877a950e49D2610114102175A06C2e3167a',
      symbol: 'MODE',
      name: 'Mode',
      decimals: 18
    },
    {
      contractAddress: '0x71ef7EDa2Be775E5A7aa8afD02C45F059833e9d2',
      symbol: 'ionWETH',
      name: 'Ionic Wrapped Ether',
      decimals: 18
    },
    {
      contractAddress: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18
    },
    {
      contractAddress: '0x59e710215d45F584f44c0FEe83DA6d43D762D857',
      symbol: 'ionezETH',
      name: 'Ionic Renzo Restaked ETH',
      decimals: 18
    },
    {
      contractAddress: '0x2416092f143378750bb29b79eD961ab195CcEea5',
      symbol: 'ezETH',
      name: 'Renzo Restaked ETH',
      decimals: 18
    },
    {
      contractAddress: '0x9c29a8eC901DBec4fFf165cD57D4f9E03D4838f7',
      symbol: 'ironETH',
      name: 'Ironclad ETH',
      decimals: 18
    },
  ]
};

export interface NFT {
  contractAddress: string;
  name: string;
}

export interface NFTs {
  [key: number]: NFT[];
}

export const NFTS: NFTs = {
  1: [
    {
      contractAddress: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
      name: "MutantApeYachtClub"
    },
    {
      contractAddress: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
      name: "BoredApeYachtClub"
    },

    {
      contractAddress: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
      name: "Pudgy Penguins"
    },
    {
      contractAddress: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
      name: "Doodles"
    },
    {
      contractAddress: "0x524cab2ec69124574082676e6f654a18df49a048",
      name: "Lil Pudgies"
    },

  ],
  43334: [
    {
      contractAddress: "0x2ad86eeec513ac16804bb05310214c3fd496835b",
      name: "Space id"
    }
  ]
};

export function getToken(chain: number, contractAddress: string): Token {
  if (!(chain in TOKENS)) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const token = TOKENS[chain].find(token => token.contractAddress.toLowerCase() === contractAddress.toLowerCase());

  if (!token) {
    throw new Error(`Token with contract address ${contractAddress} not found on chain ${chain}`);
  }

  return token;
}

export function getTokenFromSymbol(chain: number, symbol: string): Token {
  if (!(chain in TOKENS)) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const token = TOKENS[chain].find(token => token.symbol === symbol);

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