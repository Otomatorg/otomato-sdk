import { expect } from 'chai';
import { Action, ACTIONS, getToken, CHAINS } from '../src/index';

const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

describe('Action Class', () => {

  it('should create a transfer action without parameters', () => {
    const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    const params = transferAction.getParameters();

    expect(params.chainId).to.be.null;
    expect(params['abiParams.value']).to.be.null;
    expect(params['abiParams.to']).to.be.null;
    expect(params.contractAddress).to.be.null;
  });

  it('should create a transfer action and set parameters correctly', () => {
    const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("value", 1000);
    transferAction.setParams("to", DEFAULT_ADDRESS);
    transferAction.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const params = transferAction.getParameters();
    expect(params.chainId).to.equal(CHAINS.ETHEREUM);
    expect(params['abiParams.value']).to.equal(1000);
    expect(params['abiParams.to']).to.equal(DEFAULT_ADDRESS);
    expect(params.contractAddress).to.equal(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
  });

  it('should be able to export an action as json', () => {
    const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("value", 1000);
    transferAction.setParams("to", DEFAULT_ADDRESS);
    transferAction.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const json = transferAction.toJSON();
    expect(json).to.deep.equal({
      id: ACTIONS.TOKENS.ERC20.TRANSFER.id,
      parameters: {
        chainId: CHAINS.ETHEREUM,
        'abiParams.value': 1000,
        'abiParams.to': DEFAULT_ADDRESS,
        contractAddress: getToken(CHAINS.ETHEREUM, 'USDC').contractAddress
      }
    });
  });

  it('should create an SMS action and set parameters correctly', () => {
    const smsAction = new Action(ACTIONS.NOTIFICATIONS.SMS);
    smsAction.setParams("phoneNumber", "+1234567890");
    smsAction.setParams("text", "Hello, this is a test message!");

    const params = smsAction.getParameters();
    expect(params.phoneNumber).to.equal("+1234567890");
    expect(params.text).to.equal("Hello, this is a test message!");
  });

  it('should create a Slack action and set parameters correctly', () => {
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK);
    slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    slackAction.setParams("text", "This is a test message!");

    const params = slackAction.getParameters();
    expect(params.webhook).to.equal("https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    expect(params.text).to.equal("This is a test message!");
  });

  it('should throw an error for invalid parameter type', () => {
    const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    expect(() => transferAction.setParams("value", "invalid")).to.throw('Invalid type for parameter abiParams.value. Expected uint256.');
  });

  it('should throw an error for invalid address', () => {
    const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    expect(() => transferAction.setParams("to", "invalid_address")).to.throw('Invalid type for parameter abiParams.to. Expected address.');
  });

  it('should throw an error for invalid URL', () => {
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK);
    expect(() => slackAction.setParams("webhook", "invalid_url")).to.throw('Invalid type for parameter webhook. Expected url.');
  });

  it('should throw an error for invalid phone number', () => {
    const smsAction = new Action(ACTIONS.NOTIFICATIONS.SMS);
    expect(() => smsAction.setParams("phoneNumber", "invalid_phone_number")).to.throw('Invalid type for parameter phoneNumber. Expected phone_number.');
  });
});
