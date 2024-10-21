import { expect } from 'chai';
import { Trigger, TRIGGERS, getTokenFromSymbol, CHAINS } from '../src/index';

const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

describe('Trigger Class', () => {

  it('should create a transfer trigger without parameters', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    const params = transferTrigger.getParameters();

    expect(params.chainId).to.be.null;
    expect(params.abi.parameters.value).to.equal(null);
    expect(params.abi.parameters.to).to.equal(null);
    expect(params.contractAddress).to.be.null;
  });

  it('should create a transfer trigger and set parameters correctly', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", 1000);
    transferTrigger.setParams("to", DEFAULT_ADDRESS);
    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const params = transferTrigger.getParameters();
    expect(params.chainId).to.equal(CHAINS.ETHEREUM);
    expect(params.abi.parameters.value).to.equal(1000);
    expect(params.abi.parameters.to).to.equal(DEFAULT_ADDRESS);
    expect(params.contractAddress).to.equal(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
  });

  it('should be able to export a trigger as json', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", 1000);
    transferTrigger.setParams("to", DEFAULT_ADDRESS);
    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const json = transferTrigger.toJSON();

    expect(json).to.deep.equal({
      blockId: TRIGGERS.TOKENS.TRANSFER.TRANSFER.blockId,
      ref: transferTrigger.getRef(),
      id: null,
      type: 'trigger',
      state: "inactive",
      parameters: {
        chainId: CHAINS.ETHEREUM,
        abi: {
          parameters: {
            value: 1000,
            to: DEFAULT_ADDRESS,
            from: null
          }
        },
        contractAddress: getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress
      },
      frontendHelpers: {}
    });
  });

  it('should create a balance trigger with polling parameters correctly', () => {
    const balanceTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE);
    balanceTrigger.setChainId(CHAINS.ETHEREUM);
    balanceTrigger.setParams("account", DEFAULT_ADDRESS);
    balanceTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    balanceTrigger.setCondition("gte");
    balanceTrigger.setComparisonValue(45000);

    const params = balanceTrigger.getParameters();
    expect(params.chainId).to.equal(CHAINS.ETHEREUM);
    expect(params.abi.parameters.account).to.equal(DEFAULT_ADDRESS);
    expect(params.contractAddress).to.equal(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    expect(balanceTrigger.toJSON().parameters.condition).to.equal("gte");
    expect(balanceTrigger.toJSON().parameters.comparisonValue).to.equal(45000);
  });

  it('should not be able to set conditions, comparison value for subscription based triggers', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);

    expect(() => transferTrigger.setCondition(">")).to.throw('Condition setting is not applicable for subscription based triggers.');
    expect(() => transferTrigger.setComparisonValue(45000)).to.throw('Comparison value setting is not applicable for subscription based triggers.');
  });

  it('should throw an error for invalid parameter type', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    expect(() => transferTrigger.setParams("value", "invalid")).to.throw('Invalid type for parameter abiParams.value. Expected uint256.');
  });

  it('should throw an error for invalid address', () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    expect(() => transferTrigger.setParams("to", "invalid_address")).to.throw('Invalid type for parameter abiParams.to. Expected address.');
  });

  it('should create a trigger from JSON correctly', async () => {
    const json = {
      "id": "5c87bcd2-8771-417f-aab6-c23998caa9ae",
      "ref": "n-1",
      "blockId": 10,
      "type": "trigger",
      "state": "inactive",
      "position": {
        "x": 0,
        "y": 0
      },
      "parameters": {
        "chainId": 34443,
        "currency": "USD",
        "condition": "gte",
        "comparisonValue": 3550,
        "contractAddress": "0x4200000000000000000000000000000000000006"
      },
      frontendHelpers: {}
    };

    const trigger = await Trigger.fromJSON(json);

    expect(trigger.id).to.equal("5c87bcd2-8771-417f-aab6-c23998caa9ae");
    expect(trigger.getRef()).to.equal("n-1");
    expect(trigger.blockId).to.equal(10);
    expect(trigger.getParameters().chainId).to.equal(34443);
    expect(trigger.getParameters().currency).to.equal("USD");
    expect(trigger.getParameters().condition).to.equal("gte");
    expect(trigger.getParameters().comparisonValue).to.equal(3550);
    expect(trigger.getParameters().contractAddress).to.equal("0x4200000000000000000000000000000000000006");
    expect(trigger.getParentInfo()?.name).to.equal("ON_CHAIN_PRICE_MOVEMENT");
    expect(trigger.toJSON()).to.deep.equal(json);
  });

  it('should create a trigger from JSON correctly - 2', async () => {
    const json = {
      "id": null,
      "ref": "n-1",
      "blockId": 1,
      "type": "trigger",
      "state": "inactive",
      "parameters": {
        "chainId": 1,
        "abi": {
          "parameters": {
            "from": null,
            "value": "1000000n",
            "to": "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6"
          }
        },
        "contractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      frontendHelpers: {}
    };

    const trigger = await Trigger.fromJSON(json);

    expect(trigger.id).to.be.null;
    expect(trigger.getRef()).to.equal("n-1");
    expect(trigger.blockId).to.equal(1);
    expect(trigger.getParameters().chainId).to.equal(1);
    expect(trigger.getParameters().abi.parameters.from).to.be.null;
    expect(trigger.getParameters().abi.parameters.value).to.equal(BigInt(1000000));
    expect(trigger.getParameters().abi.parameters.to).to.equal("0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    expect(trigger.getParameters().contractAddress).to.equal("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    expect(trigger.getParentInfo()?.name).to.equal("TRANSFER");
    expect(trigger.toJSON()).to.deep.equal(json);
  });

});
