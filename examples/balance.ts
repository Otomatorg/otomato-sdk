import { getUserProtocolBalances } from '../src/utils/addressBalance.js';

const balances = await getUserProtocolBalances({
  chainId: 8453,
  address: '0x8e379ad0090f45a53a08007536ce2fa0a3f9f93d',
  contractAddress: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
});

console.log(balances);
