// test/getUserProtocolBalances.test.ts
import { expect } from 'chai';
import { getUserProtocolBalances, rpcServices } from '../src/index.js';

describe('getUserProtocolBalances', function() {
  // Adjust timeouts if calling real networks
  this.timeout(30000);

  before(() => {
    // Suppose we set the RPC for chain 8453 (Base) and 34443 (Mode)
    rpcServices.setRPCs({
      8453: 'https://base.llamarpc.com',
      34443: 'https://mainnet.mode.network/',
    });
  });

  it('should fetch multiple protocol balances for recognized base token (USDC on Base)', async () => {
    // The user address, chain, etc.
    const chainId = 8453;
    const address = '0x757A004bE766f745fd4CD75966CF6C8Bb84FD7c1'; // Example
    const baseUSDC = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

    const results = await getUserProtocolBalances({
      chainId,
      address,
      contractAddress: baseUSDC,
    });

    // We expect multiple protocol entries: AAVE, COMPOUND, IONIC, MOONWELL, WALLET
    expect(results).to.be.an('array').with.lengthOf.at.least(1);

    // Check each result has the structure
    results.forEach((r : any) => {
      expect(r).to.have.property('protocol');
      expect(r).to.have.property('wrapperTokenAddress');
      expect(r).to.have.property('wrapperBalance');
      expect(r).to.have.property('underlyingBalance');
    });
  });

  it('should fetch multiple protocol balances for recognized base token (USDT on Mode)', async () => {
    // The user address, chain, etc.
    const chainId = 34443;
    const address = '0x9ebf4899c05039a52407d919a63630ccd3f399ae'; // Example
    const modeUSDT = '0xf0f161fda2712db8b566946122a5af183995e2ed';

    const results = await getUserProtocolBalances({
      chainId,
      address,
      contractAddress: modeUSDT,
    });

    // We expect multiple protocol entries: AAVE, COMPOUND, IONIC, MOONWELL, WALLET
    expect(results).to.be.an('array').with.lengthOf.at.least(1);

    // Check each result has the structure
    results.forEach((r : any) => {
      expect(r).to.have.property('protocol');
      expect(r).to.have.property('wrapperTokenAddress');
      expect(r).to.have.property('wrapperBalance');
      expect(r).to.have.property('underlyingBalance');
    });
  });

  it('should fallback to single WALLET if contractAddress not recognized', async () => {
    // e.g. random token address
    const chainId = 8453;
    const address = '0x757A004bE766f745fd4CD75966CF6C8Bb84FD7c1';
    const unknownToken = '0xCc7FF230365bD730eE4B352cC2492CEdAC49383e';

    const results = await getUserProtocolBalances({
      chainId,
      address,
      contractAddress: unknownToken,
    });
    
    expect(results).to.have.lengthOf(1);
    expect(results[0].protocol).to.equal('WALLET');
    expect(results[0].wrapperTokenAddress).to.equal(unknownToken);
  });

  it('should throw if chainTokenProtocolMap has no entry for chainId', async () => {
    try {
      await getUserProtocolBalances({
        chainId: 99999, // Not in your map
        address: '0xSomeUser',
        contractAddress: '0xSomeToken',
      });
      expect.fail('Expected error not thrown');
    } catch (err: any) {
      expect(err.message).to.include('No token map for chainId=99999');
    }
  });
});