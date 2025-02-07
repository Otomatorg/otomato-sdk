import { expect } from 'chai';
import { Action, ACTIONS, getTokenFromSymbol, CHAINS } from '../src/index';

const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

describe('Action Class', () => {

  it('should create a transfer action without parameters', () => {
    const transferAction = new Action(ACTIONS.CORE.CONDITION.IF);
    const params = transferAction.getParameters();

    expect(params.chainId).to.be.null;
    expect(params.abi.parameters.value).to.be.null;
    expect(params.abi.parameters.to).to.be.null;
    expect(params.contractAddress).to.be.null;
  });

  it('should create a transfer action and set parameters correctly', () => {
    const transferAction = new Action(ACTIONS.CORE.CONDITION.IF);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("value", 1000);
    transferAction.setParams("to", DEFAULT_ADDRESS);
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const params = transferAction.getParameters();
    expect(params.chainId).to.equal(CHAINS.ETHEREUM);
    expect(params.abi.parameters.value).to.equal(1000);
    expect(params.abi.parameters.to).to.equal(DEFAULT_ADDRESS);
    expect(params.contractAddress).to.equal(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
  });

  it('should be able to export an action as json', () => {
    const transferAction = new Action(ACTIONS.CORE.CONDITION.IF);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("value", 1000);
    transferAction.setParams("to", DEFAULT_ADDRESS);
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const json = transferAction.toJSON();
    expect(json).to.deep.equal({
      blockId: ACTIONS.CORE.CONDITION.IF.blockId,
      ref: transferAction.getRef(),
      type: 'action',
      id: null,
      state: 'inactive',
      parameters: {
        chainId: CHAINS.ETHEREUM,
        abi: {
          parameters: {
            to: DEFAULT_ADDRESS,
            value: 1000
          }
        },
        contractAddress: getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress
      },
      frontendHelpers: {},
    });
  });

  it('should create a Slack action and set parameters correctly', () => {
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    slackAction.setParams("message", "This is a test message!");

    const params = slackAction.getParameters();
    expect(params.webhook).to.equal("https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    expect(params.message).to.equal("This is a test message!");
  });

  it('should throw an error for invalid parameter type', () => {
    const transferAction = new Action(ACTIONS.CORE.CONDITION.IF);
    expect(() => transferAction.setParams("value", "invalid")).to.throw('Invalid type for parameter abiParams.value. Expected uint256.');
  });

  it('should throw an error for invalid address', () => {
    const transferAction = new Action(ACTIONS.CORE.CONDITION.IF);
    expect(() => transferAction.setParams("to", "invalid_address")).to.throw('Invalid type for parameter abiParams.to. Expected address.');
  });

  it('should throw an error for invalid URL', () => {
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    expect(() => slackAction.setParams("webhook", "invalid_url")).to.throw('Invalid type for parameter webhook. Expected url.');
  });

  it('should create an action from JSON correctly', async () => {
    const json = {
      "id": "755671a7-adac-4aeb-a759-73c00dd397bc",
      "ref": "n-2",
      "blockId": 100002,
      "type": "action",
      "state": "inactive",
      "position": {
        "x": 0,
        "y": -10
      },
      "parameters": {
        "message": "ETH is at 3550 :pepe_joy:",
        "webhook": "https://hooks.slack.com/services/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"
      },
      "frontendHelpers": {}
    };

    const action = await Action.fromJSON(json);

    expect(action.id).to.equal("755671a7-adac-4aeb-a759-73c00dd397bc");
    expect(action.getRef()).to.equal("n-2");
    expect(action.blockId).to.equal(100002);
    expect(action.getParameters().message).to.equal("ETH is at 3550 :pepe_joy:");
    expect(action.getParameters().webhook).to.equal("https://hooks.slack.com/services/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");
    expect(action.getParentInfo()?.name).to.equal("SLACK");
    expect(action.toJSON()).to.deep.equal(json);
  });

  it('should create an action with abi parameters from JSON correctly', async () => {
    const json = {
      "id": "d6e6884f-cd8f-4c96-b36c-e5539b3599fc",
      "ref": "n-3",
      "blockId": 100004,
      "type": "action",
      "state": "inactive",
      "parameters": {
        "abi": {
          "parameters": {
            "to": "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6",
            "value": 1000
          }
        },
        "chainId": 1,
        "contractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      "frontendHelpers": {}
    };

    const action = await Action.fromJSON(json);

    expect(action.id).to.equal("d6e6884f-cd8f-4c96-b36c-e5539b3599fc");
    expect(action.getRef()).to.equal("n-3");
    expect(action.blockId).to.equal(100004);
    expect(action.getParameters().chainId).to.equal(1);
    expect(action.getParameters().contractAddress).to.equal("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    expect(action.getParameters().abi.parameters.to).to.equal("0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    expect(action.getParameters().abi.parameters.value).to.equal(1000);
    expect(action.getParentInfo()?.name).to.equal("TRANSFER");
    expect(action.toJSON()).to.deep.equal(json);
  });

});