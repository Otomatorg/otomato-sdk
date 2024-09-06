import { expect } from 'chai';
import { convertToTokenUnits, getTokenFromSymbol, CHAINS, convertTokenUnitsFromSymbol, convertTokenUnitsFromAddress } from '../src/index.js';

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

describe('convertFromTokenUnits', () => {
  it('should return 1 for 10^6 USDC', async () => {
    const result = await convertTokenUnitsFromSymbol(BigInt(10 ** 6), CHAINS.MODE, 'USDC');
    expect(result).to.equal(1);
  });

  it('should return 1 for 10^18 MODE', async () => {
    const result = await convertTokenUnitsFromSymbol(BigInt(10 ** 18), CHAINS.MODE, 'MODE');
    expect(result).to.equal(1);
  });

  it('should return 1 for 10^18 MODE', async () => {
    const result = await convertTokenUnitsFromAddress(BigInt(10 ** 18), CHAINS.MODE, '0xDfc7C877a950e49D2610114102175A06C2e3167a');
    expect(result).to.equal(1);
  });


});