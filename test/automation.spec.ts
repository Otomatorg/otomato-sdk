import { expect } from 'chai';
import { Automation } from '../src/models/Automation.js';
import { Trigger } from '../src/models/Trigger.js';
import { Action } from '../src/models/Action.js';
import { TRIGGERS, ACTIONS, getToken, CHAINS } from '../src/index.js';

describe('Automation Class', () => {
  it('should create an automation with a trigger and actions', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);

    const action2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    action2.setParams("webhook", "https://webhook.url");
    action2.setParams("message", "This is a test message");
    action2.setPosition(2, 0);

    const automation = new Automation("Test Automation", [trigger, action1, action2]);

    const json = automation.toJSON();
    expect(json).to.deep.equal({
      name: "Test Automation",
      nodes: [trigger.toJSON(), action1.toJSON(), action2.toJSON()],
      edges: []
    });
  });

  it('should set the name of the automation', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const automation = new Automation("Initial Name", [trigger]);
    automation.setName("Updated Name");

    expect(automation.name).to.equal("Updated Name");
  });

  it('should add a trigger to the automation', () => {
    const initialTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    initialTrigger.setChainId(CHAINS.ETHEREUM);
    initialTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    initialTrigger.setPosition(0, 0);

    const newTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    newTrigger.setChainId(CHAINS.ETHEREUM);
    newTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    newTrigger.setPosition(1, 0);

    const automation = new Automation("Test Automation", [initialTrigger]);
    automation.addNode(newTrigger);

    expect(automation.nodes).to.deep.equal([initialTrigger, newTrigger]);
  });

  it('should add actions to the automation', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);

    const action2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    action2.setParams("webhook", "https://webhook.url");
    action2.setParams("message", "This is a test message");
    action2.setPosition(2, 0);

    const automation = new Automation("Test Automation", [trigger]);
    automation.addNode(action1);
    automation.addNode(action2);

    expect(automation.nodes).to.deep.equal([trigger, action1, action2]);
  });
});
