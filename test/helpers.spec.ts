import { expect } from 'chai';
import { convertToTokenUnits, getTokenFromSymbol, CHAINS } from '../src/index.js';

describe('convertToTokenUnits', () => {
  it('should return 10^6 for 1 USDC', async () => {
    const usdcContractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;
    const result = await convertToTokenUnits(1, CHAINS.ETHEREUM, usdcContractAddr);
    expect(result).to.equal(BigInt(10 ** 6));
  });

  it('should return 10^18 for 1 MODE', async () => {
    const modeContractAddr = getTokenFromSymbol(CHAINS.MODE, 'MODE').contractAddress;
    const result = await convertToTokenUnits(1, CHAINS.MODE, modeContractAddr);
    expect(result).to.equal(BigInt(10 ** 18));
  });
});