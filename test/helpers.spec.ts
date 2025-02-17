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

  it('should correctly convert float values to token units', async () => {
    const usdcContractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;
    const result1 = await convertToTokenUnits(1.5, CHAINS.ETHEREUM, usdcContractAddr);
    expect(result1).to.equal(BigInt(1500000)); // 1.5 USDC = 1,500,000 units

    const ethContractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'ETH').contractAddress;
    const result2 = await convertToTokenUnits(0.1, CHAINS.ETHEREUM, ethContractAddr);
    expect(result2).to.equal(BigInt('100000000000000000')); // 0.1 ETH = 10^17 wei

    const result3 = await convertToTokenUnits(2.75, CHAINS.ETHEREUM, ethContractAddr);
    expect(result3).to.equal(BigInt('2750000000000000000')); // 2.75 ETH = 2.75 * 10^18 wei

    const result4 = await convertToTokenUnits(0.000001, CHAINS.ETHEREUM, usdcContractAddr);
    expect(result4).to.equal(BigInt(1)); // 0.000001 USDC = 1 unit
  });

  it('should round the result', async () => {
    const usdcContractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;
    
    try {
      const result = await convertToTokenUnits(1.5000001, CHAINS.ETHEREUM, usdcContractAddr);
      expect(result).to.be.eq(1500000n);
    } catch (err: any) {
      expect(err.message).to.include('Conversion resulted in a non-integer value');
    }

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

describe('convertTokenUnitsFromSymbol', () => {
  it('should return 1 for 10^6 USDC', async () => {
    const result = await convertTokenUnitsFromSymbol(BigInt(10 ** 6), CHAINS.ETHEREUM, 'USDC');
    expect(result).to.equal(1);
  });

  it('should return 1 for 10^18 ETH', async () => {
    const result = await convertTokenUnitsFromSymbol(BigInt(10 ** 18), CHAINS.ETHEREUM, 'ETH');
    expect(result).to.equal(1);
  });

  it('should correctly convert token units to float values', async () => {
    const result1 = await convertTokenUnitsFromSymbol(BigInt(1500000), CHAINS.ETHEREUM, 'USDC');
    expect(result1).to.equal(1.5);

    const result2 = await convertTokenUnitsFromSymbol(BigInt('100000000000000000'), CHAINS.ETHEREUM, 'ETH');
    expect(result2).to.equal(0.1);

    const result3 = await convertTokenUnitsFromSymbol(BigInt('2750000000000000000'), CHAINS.ETHEREUM, 'ETH');
    expect(result3).to.equal(2.75);

    const result4 = await convertTokenUnitsFromSymbol(BigInt(1), CHAINS.ETHEREUM, 'USDC');
    expect(result4).to.equal(0.000001);
  });

  it('should handle very small fractions correctly', async () => {
    const result = await convertTokenUnitsFromSymbol(BigInt(1), CHAINS.ETHEREUM, 'ETH');
    expect(result).to.equal(1e-18);
  });
});

describe('convertTokenUnitsFromAddress', () => {
  let usdcContractAddr: string;
  let ethContractAddr: string;

  before(() => {
    usdcContractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;
    ethContractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'ETH').contractAddress;
  });

  it('should return 1 for 10^6 USDC', async () => {
    const result = await convertTokenUnitsFromAddress(BigInt(10 ** 6), CHAINS.ETHEREUM, usdcContractAddr);
    expect(result).to.equal(1);
  });

  it('should return 1 for 10^18 ETH', async () => {
    const result = await convertTokenUnitsFromAddress(BigInt(10 ** 18), CHAINS.ETHEREUM, ethContractAddr);
    expect(result).to.equal(1);
  });

  it('should correctly convert token units to float values', async () => {
    const result1 = await convertTokenUnitsFromAddress(BigInt(1500000), CHAINS.ETHEREUM, usdcContractAddr);
    expect(result1).to.equal(1.5);

    const result2 = await convertTokenUnitsFromAddress(BigInt('100000000000000000'), CHAINS.ETHEREUM, ethContractAddr);
    expect(result2).to.equal(0.1);

    const result3 = await convertTokenUnitsFromAddress(BigInt('2750000000000000000'), CHAINS.ETHEREUM, ethContractAddr);
    expect(result3).to.equal(2.75);

    const result4 = await convertTokenUnitsFromAddress(BigInt(1), CHAINS.ETHEREUM, usdcContractAddr);
    expect(result4).to.equal(0.000001);
  });

  it('should handle very small fractions correctly', async () => {
    const result = await convertTokenUnitsFromAddress(BigInt(1), CHAINS.ETHEREUM, ethContractAddr);
    expect(result).to.equal(1e-18);
  });
});