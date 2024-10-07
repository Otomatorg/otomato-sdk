import { expect } from 'chai';
import { Workflow } from '../src/models/Workflow.js';
import { Trigger } from '../src/models/Trigger.js';
import { Action } from '../src/models/Action.js';
import { TRIGGERS, ACTIONS, getTokenFromSymbol, CHAINS, Edge } from '../src/index.js';

describe('Workflow Class', () => {
  it('should create a workflow with a trigger and actions', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);

    const action2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    action2.setParams("webhook", "https://webhook.url");
    action2.setParams("message", "This is a test message");
    action2.setPosition(2, 0);

    const workflow = new Workflow("Test Workflow", [trigger, action1, action2]);

    const json = workflow.toJSON();
    expect(json).to.deep.equal({
      name: "Test Workflow",
      id: null,
      dateCreated: null,
      dateModified: null,
      executionId: null,
      nodes: [trigger.toJSON(), action1.toJSON(), action2.toJSON()],
      edges: [],
      state: 'inactive'
    });
  });

  it('should set the name of the workflow', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const workflow = new Workflow("Initial Name", [trigger]);
    workflow.setName("Updated Name");

    expect(workflow.name).to.equal("Updated Name");
  });

  it('should add a trigger to the workflow', () => {
    const initialTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    initialTrigger.setChainId(CHAINS.ETHEREUM);
    initialTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    initialTrigger.setPosition(0, 0);

    const newTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    newTrigger.setChainId(CHAINS.ETHEREUM);
    newTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    newTrigger.setPosition(1, 0);

    const workflow = new Workflow("Test Workflow", [initialTrigger]);
    workflow.addNode(newTrigger);

    expect(workflow.nodes).to.deep.equal([initialTrigger, newTrigger]);
  });

  it('should add actions to the workflow', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);

    const action2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    action2.setParams("webhook", "https://webhook.url");
    action2.setParams("message", "This is a test message");
    action2.setPosition(2, 0);

    const workflow = new Workflow("Test Workflow", [trigger]);
    workflow.addNode(action1);
    workflow.addNode(action2);

    expect(workflow.nodes).to.deep.equal([trigger, action1, action2]);
  });

  it('should update an edge in the workflow', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action.setChainId(CHAINS.ETHEREUM);
    action.setParams("value", 1000);
    action.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action.setPosition(1, 0);

    const edge = new Edge({
      id: 'e-1',
      source: trigger,
      target: action,
    });

    const workflow = new Workflow("Test Workflow", [trigger, action], [edge]);

    const newEdge = new Edge({
      id: 'e-1',
      source: action,
      target: trigger,
    });

    workflow.updateEdge('e-1', newEdge);

    const updatedEdge = workflow.edges.find(e => e.id === 'e-1');

    expect(updatedEdge).to.deep.equal(newEdge);
  });

  it('should get session key permissions from a workflow', async () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    transferTrigger.setPosition(0, 0);

    const transferAction1 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    transferAction1.setChainId(CHAINS.ETHEREUM);
    transferAction1.setParams("value", 1000);
    transferAction1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    transferAction1.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDT').contractAddress);
    transferAction1.setPosition(1, 0);

    const transferAction2 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    transferAction2.setChainId(CHAINS.ETHEREUM);
    transferAction2.setParams("value", 2000);
    transferAction2.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    transferAction2.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    transferAction2.setPosition(2, 0);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", "https://webhook.url");
    slackAction.setParams("message", "This is a test message");
    slackAction.setPosition(3, 0);

    const edge1 = new Edge({ source: transferTrigger, target: transferAction1 });
    const edge2 = new Edge({ source: transferAction1, target: transferAction2 });
    const edge3 = new Edge({ source: transferAction2, target: slackAction });

    const workflow = new Workflow("Test Workflow", [transferTrigger, transferAction1, transferAction2, slackAction], [edge1, edge2, edge3]);

    const permissions = await workflow.getSessionKeyPermissions();

    expect(permissions.approvedTargets).to.deep.equal([
      getTokenFromSymbol(CHAINS.ETHEREUM, 'USDT').contractAddress,
      getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress
    ]);
    expect(permissions.label).to.deep.equal([
      'Transfer USDT',
      'Transfer USDC',
    ])
    expect(permissions.labelNotAuthorized).to.deep.equal([
      'Transfer WETH',
    ])
  });
});