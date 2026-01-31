/**
 * Airdrop Claim Contract Registry
 *
 * Contains claim contract addresses, chains, event signatures, and metadata
 * for top airdrops by total value. This registry enables querying
 * on-chain claim logs for each airdrop.
 *
 * Distribution types:
 *  - "merkle_claim"    : Dedicated MerkleDistributor or claim contract with a Claimed event
 *  - "token_claim"     : Claim functionality built into the token contract itself
 *  - "direct_transfer" : Tokens sent directly to recipients (no claim needed; track via Transfer events)
 *  - "nft_mint"        : NFT free-mint (Loot style); claim logs are mint Transfer events
 *  - "voucher_redeem"  : Voucher token (vTORN) redeemed 1:1 for the real token
 *  - "non_evm"         : Not standard EVM events; see notes/claimResource for details
 */

import { CHAINS } from './chains.js';

export interface AirdropClaimEvent {
  /** Human-readable ABI fragment for the claim event */
  abi: string;
  /** Keccak-256 topic0 of the event (set at runtime or hardcoded) */
  topic0?: string;
}

export interface AirdropInfo {
  /** Rank by total airdrop value */
  rank: number;
  /** Project name */
  project: string;
  /** Total airdrop value (USD at time of distribution) */
  totalValue: string;
  /** Token symbol */
  tokenSymbol: string;
  /** Token contract address */
  tokenAddress: string;
  /** Chain ID where the claim contract lives */
  chainId: number;
  /** Address to query logs from (claim contract or token contract) */
  claimContractAddress: string;
  /** How the airdrop was distributed */
  distributionType:
    | 'merkle_claim'
    | 'token_claim'
    | 'direct_transfer'
    | 'nft_mint'
    | 'voucher_redeem'
    | 'non_evm';
  /** Event(s) emitted when tokens are claimed */
  claimEvents: AirdropClaimEvent[];
  /** Optional: for direct_transfer airdrops, the sender address to filter Transfer from */
  distributorAddress?: string;
  /** Optional notes about the airdrop */
  notes?: string;
  /** Optional: URL or resource to find claim data for non-EVM or non-standard airdrops */
  claimResource?: string;
}

// ─────────────────────────────────────────────────────────────
// Standard event ABI fragments reused across many airdrops
// ─────────────────────────────────────────────────────────────

const CLAIMED_INDEX_ACCOUNT_AMOUNT =
  'event Claimed(uint256 index, address account, uint256 amount)';

const CLAIMED_ACCOUNT_AMOUNT =
  'event Claimed(address account, uint256 amount)';

const TRANSFER =
  'event Transfer(address indexed from, address indexed to, uint256 value)';

const TOKENS_CLAIMED =
  'event TokensClaimed(uint256 claimID, address claimant, uint256 amount)';

const CLAIMED_ACCOUNT_REWARD_AMOUNT =
  'event Claimed(address indexed account, address indexed reward, uint256 amount)';

const HAS_CLAIMED =
  'event HasClaimed(address indexed recipient, uint256 amount)';

// ─────────────────────────────────────────────────────────────
// Full registry
// ─────────────────────────────────────────────────────────────

export const AIRDROP_CLAIMS: AirdropInfo[] = [
  // ───── 1. Uniswap ─────
  {
    rank: 1,
    project: 'Uniswap',
    totalValue: '$6,432,614,493',
    tokenSymbol: 'UNI',
    tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x090D4613473dEE047c3f2706764f49E0821D256e',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_INDEX_ACCOUNT_AMOUNT }],
    notes: 'Uniswap MerkleDistributor. ~250k addresses. 400 UNI per wallet.',
  },

  // ───── 2. Apecoin ─────
  {
    rank: 2,
    project: 'Apecoin',
    totalValue: '$3,544,345,703',
    tokenSymbol: 'APE',
    tokenAddress: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x025C6da5BD0e6A5dd1350fda9e3B6a614B205a1F',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_ACCOUNT_AMOUNT }],
    notes:
      'NFT-gated claim for BAYC/MAYC holders. 150M APE distributed. 90-day claim period.',
  },

  // ───── 3. dYdX ─────
  {
    rank: 3,
    project: 'dYdX',
    totalValue: '$2,009,935,493',
    tokenSymbol: 'DYDX',
    tokenAddress: '0x92D6C1e31e14520e676a687F0a93788B716BEff5',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x01d3348601968aB85b4bb028979006eac235a588',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_INDEX_ACCOUNT_AMOUNT },
    ],
    notes:
      'MerkleDistributorV1. Chainlink oracle-based Merkle root updates each epoch.',
  },

  // ───── 4. Arbitrum ─────
  {
    rank: 4,
    project: 'Arbitrum',
    totalValue: '$1,969,296,101',
    tokenSymbol: 'ARB',
    tokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    chainId: CHAINS.ARBITRUM,
    claimContractAddress: '0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: HAS_CLAIMED },
    ],
    notes:
      'TokenDistributor on Arbitrum One. Uses storage-based claims (not Merkle proofs). Self-destructed after claim period.',
  },

  // ───── 5. Ethereum Name Service ─────
  {
    rank: 5,
    project: 'Ethereum Name Service',
    totalValue: '$1,878,605,813',
    tokenSymbol: 'ENS',
    tokenAddress: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
    distributionType: 'token_claim',
    claimEvents: [
      { abi: TOKENS_CLAIMED },
    ],
    notes:
      'Claim built into token contract via claimTokens(). Merkle proof based. Claim ended May 4, 2022.',
  },

  // ───── 6. LooksRare ─────
  {
    rank: 6,
    project: 'LooksRare',
    totalValue: '$712,335,336',
    tokenSymbol: 'LOOKS',
    tokenAddress: '0xf4d2888d29D722226FafA5d9B24F9164c092421E',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xa35dce3e0e6ceb67a30b8d7f4aee721c949b5970',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: 'event AirdropRewardsClaim(address indexed user, uint256 amount)' },
    ],
    notes:
      'LooksRareAirdrop contract. 126,811 transactions. Required listing NFT on LooksRare first.',
  },

  // ───── 7. 1inch Network (Airdrop 1) ─────
  {
    rank: 7,
    project: '1inch Network (Airdrop 1)',
    totalValue: '$670,872,722',
    tokenSymbol: '1INCH',
    tokenAddress: '0x111111111117dC0aa78b770fA6A738034120C302',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xe295aD71242373C37C5FdA7B57F26f9eA1088AFE',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_INDEX_ACCOUNT_AMOUNT }],
    notes: 'Standard MerkleDistributor. Wallets that interacted before Dec 24, 2020.',
  },

  // ───── 8. Optimism (Airdrop 1) ─────
  {
    rank: 8,
    project: 'Optimism (Airdrop 1)',
    totalValue: '$666,493,792',
    tokenSymbol: 'OP',
    tokenAddress: '0x4200000000000000000000000000000000000042',
    chainId: CHAINS.OPTIMISM,
    claimContractAddress: '0xFeDFAF1A10335448b7FA0268F56D2B44DBD357de',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_INDEX_ACCOUNT_AMOUNT }],
    notes: 'MerkleDistributor on OP Mainnet. ~248,699 eligible addresses.',
  },

  // ───── 9. Blur (Airdrop 1) ─────
  {
    rank: 9,
    project: 'Blur (Airdrop 1)',
    totalValue: '$446,197,003',
    tokenSymbol: 'BLUR',
    tokenAddress: '0x5283D291DBCF85356A21bA090E6db59121208b44',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xF2d15C0A89428C9251d71A0E29b39FF1e86bce25',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_ACCOUNT_AMOUNT }],
    notes:
      'BlurAirdrop contract. Merkle proof based. Same contract used for multiple seasons via setMerkleRoot.',
  },

  // ───── 10. Loot (Adventure Gold) ─────
  {
    rank: 10,
    project: 'Loot',
    totalValue: '$387,786,055',
    tokenSymbol: 'AGLD',
    tokenAddress: '0x32353A6C91143bfd6C7d363B546e62a9A2489A20',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x32353A6C91143bfd6C7d363B546e62a9A2489A20',
    distributionType: 'token_claim',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'AGLD token with claimById(). Loot NFT holders claimed 10,000 AGLD per bag. Track via Transfer events from zero address (mints).',
  },

  // ───── 11. Blur (Airdrop 2) ─────
  {
    rank: 11,
    project: 'Blur (Airdrop 2)',
    totalValue: '$371,830,836',
    tokenSymbol: 'BLUR',
    tokenAddress: '0x5283D291DBCF85356A21bA090E6db59121208b44',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xF2d15C0A89428C9251d71A0E29b39FF1e86bce25',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_ACCOUNT_AMOUNT }],
    notes:
      'Same BlurAirdrop contract as Airdrop 1. Merkle root updated for Season 2. 300M+ BLUR distributed.',
  },

  // ───── 12. Gitcoin ─────
  {
    rank: 12,
    project: 'Gitcoin',
    totalValue: '$283,807,338',
    tokenSymbol: 'GTC',
    tokenAddress: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xde3e5a990bce7fc60a6f017e7c4a95fc4939299e',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_INDEX_ACCOUNT_AMOUNT },
    ],
    notes:
      'GTC Distributor. Custom design (not a direct Uniswap MerkleDistributor fork). EIP-712 signed claims.',
  },

  // ───── 13. ParaSwap ─────
  {
    rank: 13,
    project: 'ParaSwap',
    totalValue: '$232,604,859',
    tokenSymbol: 'PSP',
    tokenAddress: '0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5',
    distributionType: 'token_claim',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'PSP retroactive airdrop. 150M PSP to ~20,000 accounts. Track via Transfer events from distributor.',
  },

  // ───── 14. Tornado Cash ─────
  {
    rank: 14,
    project: 'Tornado Cash',
    totalValue: '$204,072,778',
    tokenSymbol: 'TORN',
    tokenAddress: '0x77777FeDdddFfC19Ff86DB637967013e6C6A116C',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x3efa30704d2b8bbac821307230376556cf8cc39e',
    distributionType: 'voucher_redeem',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'vTORN voucher token redeemed 1:1 for TORN at app.tornado.cash/airdrop. Track vTORN Transfer events.',
  },

  // ───── 15. CoW Protocol ─────
  {
    rank: 15,
    project: 'CoW Protocol',
    totalValue: '$193,484,442',
    tokenSymbol: 'COW',
    tokenAddress: '0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xD057B63f5E69CF1B929b356b579Cba08D7688048',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_INDEX_ACCOUNT_AMOUNT },
    ],
    notes:
      'CowProtocolVirtualToken (vCOW) contract. Inherits MerkleDistributor. Multiple claim types: Airdrop, GnoOption, UserOption.',
  },

  // ───── 16. WorldCoin ─────
  {
    rank: 16,
    project: 'WorldCoin',
    totalValue: '$181,911,990',
    tokenSymbol: 'WLD',
    tokenAddress: '0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1',
    chainId: CHAINS.OPTIMISM,
    claimContractAddress: '0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'WLD on Optimism. Claimed via World App with World ID verification. Track Transfer events from grant contracts.',
  },

  // ───── 17. Aidoge ─────
  {
    rank: 17,
    project: 'Aidoge',
    totalValue: '$174,850,390',
    tokenSymbol: 'AIDOGE',
    tokenAddress: '0x09E18590E8f76b6Cf471b3cd75fE1A1a9D2B2c2b',
    chainId: CHAINS.ARBITRUM,
    claimContractAddress: '0x09E18590E8f76b6Cf471b3cd75fE1A1a9D2B2c2b',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'ArbDoge AI. 95% distributed to ARB airdrop recipients. Track Transfer from token contract.',
  },

  // ───── 18. The Graph ─────
  {
    rank: 18,
    project: 'The Graph',
    totalValue: '$172,286,023',
    tokenSymbol: 'GRT',
    tokenAddress: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'GRT distributed via vesting contracts to curators, delegators, and indexers. Track Transfer from vesting contracts.',
  },

  // ───── 19. Memecoin ─────
  {
    rank: 19,
    project: 'Memecoin',
    totalValue: '$146,564,771',
    tokenSymbol: 'MEME',
    tokenAddress: '0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xb1911D8fFCc2d8ca6C5eA4f4F18be6ea675C1CE7',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_ACCOUNT_AMOUNT },
    ],
    notes:
      'Memecoin: Airdrop Claim contract by 9GAG/Memeland. 69B total supply.',
  },

  // ───── 20. HashFlow ─────
  {
    rank: 20,
    project: 'HashFlow',
    totalValue: '$144,334,654',
    tokenSymbol: 'HFT',
    tokenAddress: '0xb3999F658C0391d94A37f7FF328F3feC942BcaDC',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x6ad3dac99c9a4a480748c566ce7b3503506e3d71',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_INDEX_ACCOUNT_AMOUNT },
    ],
    notes:
      'Hashflow airdrop contract holding HFT tokens for distribution.',
  },

  // ───── 21. ZigZag ─────
  {
    rank: 21,
    project: 'ZigZag',
    totalValue: '$139,767,571',
    tokenSymbol: 'ZZ',
    tokenAddress: '0xC91A71A1fFA3d8B22ba615BA1B9c01b2BBBf55AD',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xC91A71A1fFA3d8B22ba615BA1B9c01b2BBBf55AD',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'ZZ tokens distributed directly to wallets across 7 airdrops. 35M ZZ total. Track Transfer events.',
  },

  // ───── 22. Instadapp ─────
  {
    rank: 22,
    project: 'Instadapp',
    totalValue: '$138,611,088',
    tokenSymbol: 'INST',
    tokenAddress: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'INST airdrop integrated into DSA v2 upgrade. 11M INST to Maker, Compound & Aave users. Track Transfer events.',
  },

  // ───── 23. Ribbon Finance ─────
  {
    rank: 23,
    project: 'Ribbon Finance',
    totalValue: '$132,370,223',
    tokenSymbol: 'RBN',
    tokenAddress: '0x6123B0049F904d730dB3C36a31167D9d4121fA6B',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x6123B0049F904d730dB3C36a31167D9d4121fA6B',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'RBN airdrop: 30M RBN (3% of supply) to Hegic, Opyn, Charm, Primitive users and vault depositors. Track Transfer events from distributor.',
  },

  // ───── 24. 1inch Network (Airdrop 2) ─────
  {
    rank: 24,
    project: '1inch Network (Airdrop 2)',
    totalValue: '$111,812,120',
    tokenSymbol: '1INCH',
    tokenAddress: '0x111111111117dC0aa78b770fA6A738034120C302',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x111111111117dC0aa78b770fA6A738034120C302',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'Community Rewards Wave 2. ~15M 1INCH to Mooniswap users, limit order users, wallet relayer users, and Uniswap-only traders.',
  },

  // ───── 25. Botto ─────
  {
    rank: 25,
    project: 'Botto',
    totalValue: '$111,695,841',
    tokenSymbol: 'BOTTO',
    tokenAddress: '0x9DFAD1b7102D46b1b197b90095B5c4E9f5845BBA',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xed39DAFd2B2a624fE43A5BbE76e0Dae4E4E621ef',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_INDEX_ACCOUNT_AMOUNT },
    ],
    notes:
      'Botto: Airdrop contract. Merkle tree based. 10,402 transactions. 22,066 eligible recipients. 4 tiers. Self-destructed.',
  },

  // ───── 26. Dogechain ─────
  {
    rank: 26,
    project: 'Dogechain',
    totalValue: '$95,542,882',
    tokenSymbol: 'DC',
    tokenAddress: '0x7b4328c127b85369d9f82ca0503b000d09cf9180',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x7b4328c127b85369d9f82ca0503b000d09cf9180',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'DC tokens distributed on Dogechain L2 to wDOGE holders. Track Transfer events.',
  },

  // ───── 27. Galxe ─────
  {
    rank: 27,
    project: 'Galxe',
    totalValue: '$62,420,883',
    tokenSymbol: 'GAL',
    tokenAddress: '0x5fAa989Af96Af85384b8a938c2EdE4A7378D9875',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x5fAa989Af96Af85384b8a938c2EdE4A7378D9875',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'GAL (Project Galaxy) tokens. 200M total supply. Track Transfer events from treasury.',
  },

  // ───── 28. Optimism (Airdrop 3) ─────
  {
    rank: 28,
    project: 'Optimism (Airdrop 3)',
    totalValue: '$60,240,246',
    tokenSymbol: 'OP',
    tokenAddress: '0x4200000000000000000000000000000000000042',
    chainId: CHAINS.OPTIMISM,
    claimContractAddress: '0x4200000000000000000000000000000000000042',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'Airdrop 3: 9.4M OP sent directly to 31,870 addresses on Sep 18, 2023. No claim contract. Track Transfer events.',
  },

  // ───── 29. Bank (Airdrop 1) ─────
  {
    rank: 29,
    project: 'Bank (Airdrop 1)',
    totalValue: '$46,784,703',
    tokenSymbol: 'BANK',
    tokenAddress: '0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'Bankless DAO. 35,000 BANK per Bankless premium subscriber. Sent directly. Track Transfer events.',
  },

  // ───── 30. Space ID ─────
  {
    rank: 30,
    project: 'Space ID',
    totalValue: '$44,391,466',
    tokenSymbol: 'ID',
    tokenAddress: '0x2dfF88A56767223A5529eA5960Da7A3F5f766406',
    chainId: CHAINS.BINANCE,
    claimContractAddress: '0x046fcfb05d717851006c0f336d10afa3b7c3f58e',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_INDEX_ACCOUNT_AMOUNT },
    ],
    notes:
      'Space ID airdrop on BNB Chain. Season 1 (Mar-Apr 2023) and Season 2 (Jun-Jul 2023).',
  },

  // ───── 31. Optimism (Airdrop 2) ─────
  {
    rank: 31,
    project: 'Optimism (Airdrop 2)',
    totalValue: '$36,440,485',
    tokenSymbol: 'OP',
    tokenAddress: '0x4200000000000000000000000000000000000042',
    chainId: CHAINS.OPTIMISM,
    claimContractAddress: '0x4200000000000000000000000000000000000042',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'Airdrop 2: 11.7M OP sent directly to 300K+ addresses in Feb 2023. No claim contract. Track Transfer events.',
  },

  // ───── 32. CyberConnect ─────
  {
    rank: 32,
    project: 'CyberConnect',
    totalValue: '$28,358,596',
    tokenSymbol: 'CYBER',
    tokenAddress: '0x14778860E937f509e651192a90589dE711Fb88a9',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x14778860E937f509e651192a90589dE711Fb88a9',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'CYBER claimed via CyberAccount. Available on Optimism, Ethereum, BSC. 30-day window from Aug 15, 2023.',
  },

  // ───── 33. Arkham ─────
  {
    rank: 33,
    project: 'Arkham',
    totalValue: '$18,983,672',
    tokenSymbol: 'ARKM',
    tokenAddress: '0x6E2a43be0B1d33b726f0CA3b8de60b3482B8b050',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x08c7676680f187a31241e83e6d44c03a98adab05',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_ACCOUNT_AMOUNT },
    ],
    notes:
      'Arkham: Airdrop contract. MerkleProof + Ownable. Still holds ~603K ARKM.',
  },

  // ───── 34. Maverick Protocol ─────
  {
    rank: 34,
    project: 'Maverick Protocol',
    totalValue: '$15,688,404',
    tokenSymbol: 'MAV',
    tokenAddress: '0x7448c7456a97769F6cD04F1E83A4a23cCdC46aBD',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x7448c7456a97769F6cD04F1E83A4a23cCdC46aBD',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'MAV Pre-Season Airdrop. 30M MAV (1.5% of supply). Claimed via governance.mav.xyz. Track Transfer events.',
  },

  // ───── 35. Notional Finance ─────
  {
    rank: 35,
    project: 'Notional Finance',
    totalValue: '$14,846,311',
    tokenSymbol: 'NOTE',
    tokenAddress: '0xCFEAead4947f0705A14ec42aC3D44129E1Ef3eD5',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xCFEAead4947f0705A14ec42aC3D44129E1Ef3eD5',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'NOTE airdrop. 0.75% of supply to 741 addresses. Claimed via notional.finance/airdrop. Track Transfer events.',
  },

  // ───── 36. Unlock Protocol ─────
  {
    rank: 36,
    project: 'Unlock Protocol',
    totalValue: '$14,802,806',
    tokenSymbol: 'UDT',
    tokenAddress: '0x90DE74265a416e1393A450752175AED98fe11517',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x90DE74265a416e1393A450752175AED98fe11517',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'UDT airdrop to contributors before Sep 1, 2021. Up to 7,314 UDT. Claimed via airdrop.unlock-protocol.com.',
  },

  // ───── 37. Forefront ─────
  {
    rank: 37,
    project: 'Forefront',
    totalValue: '$14,799,284',
    tokenSymbol: 'FF',
    tokenAddress: '0x7E9D8f07A64e363e97A648904a89fb4cd5fB94CD',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x7E9D8f07A64e363e97A648904a89fb4cd5fB94CD',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'FF token airdrop. Snapshot Mar 12, 2021. Claim period ended Apr 14, 2021. 10M total supply.',
  },

  // ───── 38. Bank (Airdrop 2) ─────
  {
    rank: 38,
    project: 'Bank (Airdrop 2)',
    totalValue: '$13,567,564',
    tokenSymbol: 'BANK',
    tokenAddress: '0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'Bankless DAO second distribution. Sent directly to eligible wallets.',
  },

  // ───── 39. Hop Protocol ─────
  {
    rank: 39,
    project: 'Hop Protocol',
    totalValue: '$12,454,044',
    tokenSymbol: 'HOP',
    tokenAddress: '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC',
    distributionType: 'token_claim',
    claimEvents: [
      { abi: TOKENS_CLAIMED },
    ],
    notes:
      'Claim built into HOP token contract via claimTokens(). Merkle proof based. 8% of supply to early users.',
  },

  // ───── 40. Index Cooperative ─────
  {
    rank: 40,
    project: 'Index Cooperative',
    totalValue: '$6,703,150',
    tokenSymbol: 'INDEX',
    tokenAddress: '0x0954906da0Bf32d5479e25f46056d22f08464CAB',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xDD111F0fc07F4D89ED6ff96DBAB19a61450b8435',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_INDEX_ACCOUNT_AMOUNT }],
    notes:
      'Index Protocol: Early Community Rewards. Standard MerkleDistributor.',
  },

  // ───── 41. Spectra (APWine) ─────
  {
    rank: 41,
    project: 'Spectra',
    totalValue: '$3,188,386',
    tokenSymbol: 'APW',
    tokenAddress: '0x4104b135DBC9609Fc1A9490E61369036497660c8',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x4104b135DBC9609Fc1A9490E61369036497660c8',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'APWine (now Spectra) token. Migrated to SPECTRA token on Dec 17, 2024. Track Transfer events.',
  },

  // ───── 42. Snowswap ─────
  {
    rank: 42,
    project: 'Snowswap',
    totalValue: '$2,307,087',
    tokenSymbol: 'SNOW',
    tokenAddress: '0xfe9A29aB92522D14Fc65880d817214261D8479AE',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xfe9A29aB92522D14Fc65880d817214261D8479AE',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'SNOW token. 500,000 total supply. Track Transfer events from deployer/treasury.',
  },

  // ───── 43. DappRadar ─────
  {
    rank: 43,
    project: 'DappRadar',
    totalValue: '$500,814',
    tokenSymbol: 'RADAR',
    tokenAddress: '0x44709a920FccF795FbC57BAA433cc3dd53C44Dbe',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x2e424a4953940Ae99F153a50d0139e7CD108c071',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_ACCOUNT_AMOUNT },
    ],
    notes:
      'DappRadar: Airdrop Claim. ECDSA-signed claims (not Merkle). Claim period until Mar 14, 2022.',
  },

  // ═══════════════════════════════════════════════════════════════
  //  Additional airdrops (newer / non-ranked)
  // ═══════════════════════════════════════════════════════════════

  // ───── 44. LayerZero ─────
  {
    rank: 44,
    project: 'LayerZero',
    totalValue: '',
    tokenSymbol: 'ZRO',
    tokenAddress: '0x6985884C4392D348587B19cb9eAAf157F13271cd',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xf19ccb20726Eab44754A59EFC4Ad331e3bF4F248',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_ACCOUNT_AMOUNT },
    ],
    notes:
      'LayerZero: Airdrop Claim (multichain). Same address deployed on Ethereum, Arbitrum, Optimism, Base, Polygon, BSC, Avalanche. ' +
      '85M ZRO distributed to ~1.28M users. Proof-of-Donation mechanism ($0.10/ZRO to Protocol Guild). Claim: Jun 20 - Sep 20, 2024. ' +
      'Ethereum-specific claim contract: 0xc28c2b2f5a9b2af1ad5878e5b1af5f9baea2f971. ' +
      'BSC-specific: 0x9c26831a80ef7fb60ca940eb9aa22023476b3468.',
    claimResource: 'https://layerzero.foundation/claim',
  },

  // ───── 45. Hyperliquid ─────
  {
    rank: 45,
    project: 'Hyperliquid',
    totalValue: '',
    tokenSymbol: 'HYPE',
    tokenAddress: '',
    chainId: CHAINS.HYPER_EVM,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'HYPE is the native token of Hyperliquid L1 — NOT an ERC-20. 310M tokens airdropped to 90K+ users via Genesis Portal on Nov 29, 2024. ' +
      'No on-chain claim contract. Distributed natively through the Hyperliquid platform. ' +
      'WHYPE (Wrapped HYPE) on HyperEVM: 0x5555555555555555555555555555555555555555.',
    claimResource: 'https://hyperfoundation.org/',
  },

  // ───── 46. Pengu (Pudgy Penguins) ─────
  {
    rank: 46,
    project: 'Pengu',
    totalValue: '',
    tokenSymbol: 'PENGU',
    tokenAddress: '2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv',
    chainId: 0,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'PENGU is a Solana SPL token — NOT an ERC-20. 88.8B total supply. 50% airdropped to NFT holders + communities. ' +
      'Launched Dec 17, 2024. Claim window 88 days until Mar 15, 2025. Claimed via claim.pudgypenguins.com connecting both Solana and Ethereum wallets. ' +
      'Solana token address: 2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv. ' +
      'Related Ethereum NFTs: Pudgy Penguins 0xBd3531dA5CF5857e7CfAA92426877b022e612cf8.',
    claimResource: 'https://claim.pudgypenguins.com/',
  },

  // ───── 47. Morpho ─────
  {
    rank: 47,
    project: 'Morpho',
    totalValue: '',
    tokenSymbol: 'MORPHO',
    tokenAddress: '0x58D97B57BB95320F9a05dC918Aef65434969c2B2',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x330eefa8a787552DC5cAd3C3cA644844B1E61Ddb',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_ACCOUNT_REWARD_AMOUNT },
    ],
    notes:
      'Morpho uses Universal Rewards Distributor (URD) contracts. Multiple URD instances exist. ' +
      'URD Factory: 0x9baA51245CDD28D8D74Afe8B3959b616E9ee7c8D. ' +
      'Example MORPHO URD: 0x330eefa8a787552DC5cAd3C3cA644844B1E61Ddb. ' +
      'New rewards distributed via Merkl (0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae). ' +
      'Claim event: Claimed(address indexed account, address indexed reward, uint256 amount). ' +
      'API: https://rewards.morpho.org/docs',
    claimResource: 'https://docs.morpho.org/build/rewards/tutorials/claim-rewards',
  },

  // ───── 48. Scroll ─────
  {
    rank: 48,
    project: 'Scroll',
    totalValue: '',
    tokenSymbol: 'SCR',
    tokenAddress: '0xd29687c813d741e2f938f4ac377128810e217b1b',
    chainId: CHAINS.SCROLL,
    claimContractAddress: '0xe8be8eb940c0ca3bd19d911cd3bebc97bea0ed62',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_INDEX_ACCOUNT_AMOUNT },
    ],
    notes:
      'Scroll: Token Distributor on Scroll L2. MerkleProof-based. 7% of SCR supply to 570K+ wallets. ' +
      'Snapshot: Oct 19, 2024. Claim: Oct 22, 2024 - Jan 20, 2025. ' +
      'Merkle Root: 0x69f36c589fe3a8daf0d835c4e7717460d22fdcd512765653dec5e8e302d3b8c0. ' +
      'Query via Scroll RPC (chainId 534352) or scrollscan.com.',
    claimResource: 'https://scrollscan.com/address/0xe8be8eb940c0ca3bd19d911cd3bebc97bea0ed62',
  },

  // ───── 49. Berachain ─────
  {
    rank: 49,
    project: 'Berachain',
    totalValue: '',
    tokenSymbol: 'BERA',
    tokenAddress: '',
    chainId: CHAINS.BERACHAIN,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'BERA is the native gas token of Berachain L1 (like ETH on Ethereum) — no ERC-20 contract. ' +
      '15.75% of supply airdropped to community on Feb 6, 2025. ~79M BERA. ' +
      'Claim via airdrop.berachain.com (Feb 6 - Mar 20, 2025). ' +
      'WBERA: 0x6969696969696969696969696969696969696969. ' +
      'Explorer: berascan.com.',
    claimResource: 'https://docs.berachain.com/learn/claim-bera-airdrop',
  },

  // ───── 50. Linea ─────
  {
    rank: 50,
    project: 'Linea',
    totalValue: '',
    tokenSymbol: 'LINEA',
    tokenAddress: '0x1789e0043623282D5DCc7F213d703C6D8BAfBB04',
    chainId: CHAINS.LINEA,
    claimContractAddress: '0x87bAa1694381aE3eCaE2660d97fe60404080Eb64',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: CLAIMED_ACCOUNT_AMOUNT },
    ],
    notes:
      'Linea: Airdrop Contract (TokenAirdrop) on Linea mainnet by Consensys. ' +
      '9.36B LINEA to ~750K addresses. Claim: Sep 10 - Dec 9, 2025. ' +
      'Requires min 2,000 LXP or 15,000 LXP-L + Proof of Humanity. ' +
      'LXP soulbound token: 0xd83af4fbD77f3AB65C3B1Dc4B38D7e67AEcf599A. ' +
      'Query via Linea RPC (chainId 59144) or lineascan.build.',
    claimResource: 'https://lineascan.build/address/0x87baa1694381ae3ecae2660d97fe60404080eb64',
  },

  // ───── 51. Mode ─────
  {
    rank: 51,
    project: 'Mode',
    totalValue: '',
    tokenSymbol: 'MODE',
    tokenAddress: '0xDfc7C877a950e49D2610114102175A06C2e3167a',
    chainId: CHAINS.MODE,
    claimContractAddress: '0xDfc7C877a950e49D2610114102175A06C2e3167a',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'MODE token on Mode Network L2 (OP Stack, chainId 34443). ' +
      'Season 1 claim via claim.mode.network (May 7, 2024). Season 2: Oct 18, 2024. ' +
      'Ethereum address: 0x084382d1cc4f4dfd1769b1cc1ac2a9b1f8365e90. ' +
      'Mode Explorer: explorer.mode.network.',
    claimResource: 'https://explorer.mode.network/token/0xDfc7C877a950e49D2610114102175A06C2e3167a',
  },

  // ───── 52. Zircuit ─────
  {
    rank: 52,
    project: 'Zircuit',
    totalValue: '',
    tokenSymbol: 'ZRC',
    tokenAddress: '0xfd418e42783382e86ae91e445406600ba144d162',
    chainId: CHAINS.ZIRCUIT,
    claimContractAddress: '0xfd418e42783382e86ae91e445406600ba144d162',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'ZRC token on both Ethereum and Zircuit (chainId 48900). 10B total supply. ' +
      '7% for Season 1 (262K addresses). Claimed via claim.zircuit.com. ' +
      'Ethereum address: 0xfd418e42783382e86ae91e445406600ba144d162 (same address). ' +
      'Snapshot: Jul 7, 2024.',
    claimResource: 'https://claim.zircuit.com',
  },

  // ───── 53. Optimism (Airdrop 4) ─────
  {
    rank: 53,
    project: 'Optimism (Airdrop 4)',
    totalValue: '',
    tokenSymbol: 'OP',
    tokenAddress: '0x4200000000000000000000000000000000000042',
    chainId: CHAINS.OPTIMISM,
    claimContractAddress: '0xFeDFAF1A10335448b7FA0268F56D2B44DBD357de',
    distributionType: 'merkle_claim',
    claimEvents: [{ abi: CLAIMED_INDEX_ACCOUNT_AMOUNT }],
    notes:
      'Airdrop 4: Superchain Creators. 10.3M OP to 22K+ NFT creator addresses. ' +
      'Same MerkleDistributor contract as Airdrop 1. Claim via app.optimism.io/airdrops/4. ' +
      'Eligibility: NFT creators on Ethereum L1, Base, OP Mainnet, Zora before Jan 10, 2024.',
    claimResource: 'https://app.optimism.io/airdrops/4',
  },

  // ───── 54. Spark ─────
  {
    rank: 54,
    project: 'Spark',
    totalValue: '',
    tokenSymbol: 'SPK',
    tokenAddress: '0xc20059e0317DE91738d13af027DfC4a50781b066',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0xc20059e0317DE91738d13af027DfC4a50781b066',
    distributionType: 'merkle_claim',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'Spark (formerly MakerDAO/Sky lending). SPK token: 10B total supply. ' +
      'Ignition airdrop: 300M SPK on Jun 17, 2025 (claim until Jul 29, 2025). ' +
      'Pre-farming: claim until Dec 17, 2025. Ethereum mainnet only. ' +
      'Claim via app.spark.fi/spk/airdrop. Exact claim contract TBD — check sparkdotfi/spark-address-registry on GitHub.',
    claimResource: 'https://app.spark.fi/spk/airdrop',
  },

  // ───── 55. Sonic ─────
  {
    rank: 55,
    project: 'Sonic',
    totalValue: '',
    tokenSymbol: 'S',
    tokenAddress: '',
    chainId: CHAINS.SONIC,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'S is the native token of Sonic L1 (formerly Fantom, chainId 146). FTM converts to S at 1:1 ratio. ' +
      '190.5M S airdrop via Sonic Points/Gems. Season 1 ended Jun 18, 2025; claim window Jul 15-22, 2025. ' +
      '25% unlocked immediately, 75% vests over 270 days as a tradable NFT position. ' +
      'Official claim: airdrop.soniclabs.com.',
    claimResource: 'https://airdrop.soniclabs.com/',
  },

  // ───── 56. Lighter ─────
  {
    rank: 56,
    project: 'Lighter',
    totalValue: '',
    tokenSymbol: 'LIT',
    tokenAddress: '0x232ce3bd40fcd6f80f3d55a522d03f25df784ee2',
    chainId: CHAINS.ETHEREUM,
    claimContractAddress: '0x232ce3bd40fcd6f80f3d55a522d03f25df784ee2',
    distributionType: 'direct_transfer',
    claimEvents: [
      { abi: TRANSFER },
    ],
    notes:
      'Lighter DEX (Ethereum L2 perps). LIT token: 1B total supply. ' +
      '25% (250M) airdropped from Seasons 1 & 2 at token launch (Dec 30, 2025). ' +
      'Tokens directly distributed to Lighter wallets. No separate claim contract.',
    claimResource: 'https://lighter.xyz/',
  },

  // ───── 57. Monad ─────
  {
    rank: 57,
    project: 'Monad',
    totalValue: '',
    tokenSymbol: 'MON',
    tokenAddress: '',
    chainId: 0,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'MON is the native token of Monad L1. 4.73B MON allocated to 289K eligible accounts. ' +
      'Claim: Oct 14 - Nov 3, 2025 via claim.monad.xyz. 3.33B claimed (70.4%). ' +
      'Escrowed Nov 9, 2025; released at mainnet launch Nov 24, 2025. ' +
      'Not a standard EVM ERC-20 airdrop — MON is Monad\'s native gas token.',
    claimResource: 'https://www.monad.xyz/announcements/the-mon-airdrop-results',
  },

  // ───── 58. Plasma ─────
  {
    rank: 58,
    project: 'Plasma',
    totalValue: '',
    tokenSymbol: 'XPL',
    tokenAddress: '',
    chainId: 0,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'Plasma is a dedicated stablecoin L1. XPL: 10B total supply. ' +
      'Mainnet beta launch: Sep 25, 2025. Binance HODLer airdrop: 75M XPL (0.75%). ' +
      'Pre-depositors received allocations automatically. ' +
      'No standard EVM claim contract — tokens distributed via Plasma mainnet and Binance.',
    claimResource: 'https://www.plasma.to/',
  },

  // ───── 59. Stable ─────
  {
    rank: 59,
    project: 'Stable',
    totalValue: '',
    tokenSymbol: 'STABLE',
    tokenAddress: '',
    chainId: 0,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'Stable is a stablechain (USDT-native L1). STABLE: 100B max supply, 17.6B initial. ' +
      'Airdrop via Merkl on Stable network. Claim: Dec 8, 2025 - Mar 2, 2026. ' +
      'Eligible: vault receipt holders from staking deposit phases. ' +
      'Requires gUSDT for gas on Stable network. ' +
      'Claim only via official Merkl portal.',
    claimResource: 'https://blog.stable.xyz/the-stable-airdrop',
  },

  // ───── 60. Somnia ─────
  {
    rank: 60,
    project: 'Somnia',
    totalValue: '',
    tokenSymbol: 'SOMI',
    tokenAddress: '',
    chainId: CHAINS.SOMNIA,
    claimContractAddress: '',
    distributionType: 'non_evm',
    claimEvents: [],
    notes:
      'Somnia L1 (chainId 5031). SOMI: 1B total supply with deflationary gas burning. ' +
      '~5% airdropped to testnet users, community contributors, and NFT holders. ' +
      '20% unlocked at claim, 80% vests over 60 days via weekly quests. 90-day claim window. ' +
      'TGE expected Q4 2025. Requires EVM-compatible wallet for claim.',
    claimResource: 'https://docs.somnia.network/concepts/miscellaneous/legal/airdrop-policy',
  },
];

/**
 * Utility: look up an airdrop by project name (case-insensitive partial match)
 */
export function findAirdropByProject(name: string): AirdropInfo[] {
  const lower = name.toLowerCase();
  return AIRDROP_CLAIMS.filter((a) => a.project.toLowerCase().includes(lower));
}

/**
 * Utility: look up an airdrop by rank
 */
export function findAirdropByRank(rank: number): AirdropInfo | undefined {
  return AIRDROP_CLAIMS.find((a) => a.rank === rank);
}

/**
 * Utility: get all airdrops on a specific chain
 */
export function findAirdropsByChain(chainId: number): AirdropInfo[] {
  return AIRDROP_CLAIMS.filter((a) => a.chainId === chainId);
}

/**
 * Utility: get all airdrops with a dedicated claim contract (merkle_claim or token_claim)
 */
export function getClaimableAirdrops(): AirdropInfo[] {
  return AIRDROP_CLAIMS.filter(
    (a) =>
      a.distributionType === 'merkle_claim' ||
      a.distributionType === 'token_claim' ||
      a.distributionType === 'voucher_redeem'
  );
}
