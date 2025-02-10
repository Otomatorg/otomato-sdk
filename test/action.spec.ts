import { expect } from 'chai';
import { Action, ACTIONS, getTokenFromSymbol, CHAINS } from '../src/index';

const MAX_BIGINT = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

describe('Action Class', () => {

  it('should create a transfer action without parameters', () => {
    const transferAction = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    const params = transferAction.getParameters();

    expect(params.chainId).to.be.null;
    expect(params.abi.parameters.asset).to.be.null;
    expect(params.abi.parameters.amount).to.be.null;
  });

  it('should create a transfer action and set parameters correctly', () => {
    const transferAction = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("amount", 1);
    transferAction.setParams("asset", getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const params = transferAction.getParameters();
    expect(params.chainId).to.equal(CHAINS.ETHEREUM);
    expect(params.abi.parameters.amount).to.equal(1);
    expect(params.abi.parameters.asset).to.equal(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
  });

  it('should be able to export an action as json', () => {
    const transferAction = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("amount", 1);
    transferAction.setParams("asset", getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const json = transferAction.toJSON();
    expect(json).to.deep.equal({
      blockId: ACTIONS.LENDING.COMPOUND.DEPOSIT.blockId,
      ref: transferAction.getRef(),
      type: 'action',
      id: null,
      state: 'inactive',
      parameters: {
        chainId: CHAINS.ETHEREUM,
        abi: {
          parameters: {
            asset: getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress,
            amount: 1
          }
        }
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
    const transferAction = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    expect(() => transferAction.setParams("amount", "invalid")).to.throw('Invalid type for parameter abiParams.amount. Expected float.');
  });

  it('should accept max uint256 for floats', () => {
    const transferAction = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    transferAction.setParams("amount", MAX_BIGINT);
  });

  it('should throw an error for invalid address', () => {
    const transferAction = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    expect(() => transferAction.setParams("asset", "invalid_address")).to.throw('Invalid type for parameter abiParams.asset. Expected erc20.');
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
      "blockId": ACTIONS.LENDING.COMPOUND.DEPOSIT.blockId,
      "type": "action",
      "state": "inactive",
      "parameters": {
        "abi": {
          "parameters": {
            "asset": "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6",
            "amount": 1000
          }
        },
        "chainId": 1,
      },
      "frontendHelpers": {}
    };

    const action = await Action.fromJSON(json);

    expect(action.id).to.equal("d6e6884f-cd8f-4c96-b36c-e5539b3599fc");
    expect(action.getRef()).to.equal("n-3");
    expect(action.blockId).to.equal(ACTIONS.LENDING.COMPOUND.DEPOSIT.blockId);
    expect(action.getParameters().chainId).to.equal(1);
    expect(action.getParameters().abi.parameters.asset).to.equal("0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    expect(action.getParameters().abi.parameters.amount).to.equal(1000);
    expect(action.toJSON()).to.deep.equal(json);
  });

});