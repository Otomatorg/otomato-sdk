import { expect } from 'chai';
import { Trigger, TRIGGERS, getToken, CHAINS } from '../src/index';

const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

describe('Trigger Class', () => {

  it('should create a transfer trigger without parameters', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    const params = transferTrigger.getParameters();

    expect(params.chainId).to.be.null;
    expect(params['abiParams.value']).to.be.null;
    expect(params['abiParams.to']).to.be.null;
    expect(params.contractAddress).to.be.null;
  });

  it('should create a transfer trigger and set parameters correctly', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", 1000);
    transferTrigger.setParams("to", DEFAULT_ADDRESS);
    transferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const params = transferTrigger.getParameters();
    expect(params.chainId).to.equal(CHAINS.ETHEREUM);
    expect(params['abiParams.value']).to.equal(1000);
    expect(params['abiParams.to']).to.equal(DEFAULT_ADDRESS);
    expect(params.contractAddress).to.equal(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
  });

  it('should be able to export a trigger as json', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", 1000);
    transferTrigger.setParams("to", DEFAULT_ADDRESS);
    transferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const json = transferTrigger.toJSON();
    expect(json).to.deep.equal({
      id: TRIGGERS.TOKENS.ERC20.TRANSFER.id,
      parameters: {
        chainId: CHAINS.ETHEREUM,
        'abiParams.value': 1000,
        'abiParams.to': DEFAULT_ADDRESS,
        contractAddress: getToken(CHAINS.ETHEREUM, 'USDC').contractAddress
      }
    });
  });

  it('should create a balance trigger with polling parameters correctly', () => {
    const balanceTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.BALANCE);
    balanceTrigger.setChainId(CHAINS.ETHEREUM);
    balanceTrigger.setParams("account", DEFAULT_ADDRESS);
    balanceTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    balanceTrigger.setCondition(">");
    balanceTrigger.setComparisonValue(45000);
    balanceTrigger.setInterval(5000);

    const params = balanceTrigger.getParameters();
    expect(params.chainId).to.equal(CHAINS.ETHEREUM);
    expect(params['abiParams.account']).to.equal(DEFAULT_ADDRESS);
    expect(params.contractAddress).to.equal(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    expect(balanceTrigger.toJSON().condition).to.equal(">");
    expect(balanceTrigger.toJSON().comparisonValue).to.equal(45000);
    expect(balanceTrigger.toJSON().interval).to.equal(5000);
  });

  it('should not be able to set conditions, comparison value and interval for subscription based triggers', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);

    expect(() => transferTrigger.setCondition(">")).to.throw('Condition setting is not applicable for subscription based triggers.');
    expect(() => transferTrigger.setComparisonValue(45000)).to.throw('Comparison value setting is not applicable for subscription based triggers.');
    expect(() => transferTrigger.setInterval(5000)).to.throw('Interval setting is not applicable for subscription based triggers.');
  });

  it('should throw an error for invalid parameter type', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    expect(() => transferTrigger.setParams("value", "invalid")).to.throw('Invalid type for parameter abiParams.value. Expected uint256.');
  });

  it('should throw an error for invalid address', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    expect(() => transferTrigger.setParams("to", "invalid_address")).to.throw('Invalid type for parameter abiParams.to. Expected address.');
  });
});
