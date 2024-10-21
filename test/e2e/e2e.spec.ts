import { expect } from 'chai';
import { config as dotenvConfig } from 'dotenv';
import { Workflow, Trigger, Action, Edge, apiServices, CHAINS, getTokenFromSymbol, TRIGGERS, ACTIONS } from '../../src/index';

dotenvConfig(); // Load environment variables from .env file

describe('E2E Workflow Test', async function () {
  this.timeout(10000);
  
  before(async () => {
    // Set API URL and Authorization Token from environment variables
    const apiUrl = process.env.API_URL;
    const authToken = process.env.AUTH_TOKEN;

    if (!apiUrl || !authToken) {
      throw new Error('API_URL or AUTH_TOKEN is not defined in .env file.');
    }

    // Set up API services
    apiServices.setUrl(apiUrl);
    apiServices.setAuth(authToken);
  });

  it('should create a simple workflow and verify session key permissions', async () => {
    // Create a trigger (transfer of USDT)
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    transferTrigger.setChainId(CHAINS.MODE);
    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferTrigger.setPosition(100, 100);

    // Create a transfer action
    const transferAction = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    transferAction.setChainId(CHAINS.MODE);
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferAction.setParams('to', "0x356696BFBd8aaa37f4526f0eD6391999E53a9857");
    transferAction.setParams('value', 1);
    transferAction.setPosition(100, 200);

    // Create an edge between the trigger and the action
    const edge = new Edge({ source: transferTrigger, target: transferAction });

    // Create the workflow with the trigger, action, and edge
    const workflow = new Workflow('E2E Test Workflow', [transferTrigger, transferAction], [edge]);

    // Publish the workflow
    const result = await workflow.create();
    expect(result.success).to.be.true;
    expect(workflow.id).to.be.a('string');
    
    // Fetch and verify session key permissions
    const sessionKeyPermissions = await workflow.getSessionKeyPermissions();
    expect(sessionKeyPermissions).to.have.keys('isValid', 'approvedTargets', 'label', 'labelNotAuthorized');
    // Here you can further compare if the actual values match the expectedPermission structure as needed
    expect(sessionKeyPermissions.approvedTargets).to.include("0xf0F161fDA2712DB8b566946122a5af183995e2eD");
  });

  it('should create a complex workflow and verify session key permissions', async () => {
    // Create a trigger (transfer of USDT)
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    transferTrigger.setChainId(CHAINS.MODE);
    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferTrigger.setPosition(100, 100);

    // Create another trigger (approval of USDT)
    const ionicDepositAction = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
    ionicDepositAction.setChainId(CHAINS.MODE);
    ionicDepositAction.setParams('tokenToDeposit', getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    ionicDepositAction.setParams('amount', 1);
    ionicDepositAction.setPosition(200, 100);

    // Create a transfer action
    const transferAction = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    transferAction.setChainId(CHAINS.MODE);
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferAction.setParams('to', "0x356696BFBd8aaa37f4526f0eD6391999E53a9857");
    transferAction.setParams('value', 1);
    transferAction.setPosition(100, 200);

    // Create another action (Slack notification)
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams('message', "Transfer of USDT.");
    slackAction.setParams('webhook', "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    slackAction.setPosition(200, 200);

    // Create edges between nodes
    const edge1 = new Edge({ source: transferTrigger, target: transferAction });
    const edge2 = new Edge({ source: ionicDepositAction, target: slackAction });

    // Create the workflow with multiple nodes and edges
    const workflow = new Workflow('Complex Workflow Test', [transferTrigger, ionicDepositAction, transferAction, slackAction], [edge1, edge2]);

    // Publish the workflow
    const result = await workflow.create();
    expect(result.success).to.be.true;
    expect(workflow.id).to.be.a('string');

    // Fetch and verify session key permissions
    const sessionKeyPermissions = await workflow.getSessionKeyPermissions();
    expect(sessionKeyPermissions).to.have.keys('isValid', 'approvedTargets', 'label', 'labelNotAuthorized');
    
    // Verify that the approved targets contain specific addresses
    expect(sessionKeyPermissions.approvedTargets).to.include("0xf0F161fDA2712DB8b566946122a5af183995e2eD");
    expect(sessionKeyPermissions.approvedTargets).to.include("0x356696BFBd8aaa37f4526f0eD6391999E53a9857");  // Another example address
  });
});