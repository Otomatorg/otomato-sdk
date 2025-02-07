import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, TOKENS } from '../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

const workflow_complex = async () => {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    

    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const transferAction = new Action(ACTIONS.CORE.CONDITION.IF);
    const ionicAction = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);

    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferTrigger.setChainId(CHAINS.MODE)
    transferTrigger.setPosition(120, 120)

    ionicAction.setChainId(CHAINS.MODE);
    ionicAction.setParams('tokenToDeposit', getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    ionicAction.setParams('amount', 1);
    ionicAction.setPosition(120, 240);

    transferAction.setChainId(CHAINS.MODE)
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferAction.setParams('to', "0x356696BFBd8aaa37f4526f0eD6391999E53a9857");
    transferAction.setParams('value', 1);
    transferAction.setPosition(120, 360)

    slackAction.setParams('message', "test");
    slackAction.setParams('webhook', "https://slack.com");
    slackAction.setPosition(120, 360)

    const edge1 = new Edge({source: transferTrigger, target: slackAction})
    const edge2 = new Edge({source: slackAction, target: transferAction})
    const edge3 = new Edge({source: transferAction, target: ionicAction})

    const workflow = new Workflow("test", [transferAction, transferTrigger, slackAction, ionicAction], [edge1, edge2, edge3]);

    const result = await workflow.create();
    console.log(result)

    if (!result.success)
        throw new Error("An error occurred when publishing the workflow")

    console.log(workflow.id);
    // console.log(slackAction.getSessionKeyPermissions());
    // console.log(transferAction.getSessionKeyPermissions());
    console.log(await workflow.getSessionKeyPermissions());
}

const workflow_simple = async () => {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    // Create a transfer trigger
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);

    // Create a transfer action
    const transferAction = new Action(ACTIONS.CORE.CONDITION.IF);

    // Set trigger properties
    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferTrigger.setChainId(CHAINS.MODE);
    transferTrigger.setPosition(120, 120);

    // Set action properties
    transferAction.setChainId(CHAINS.MODE);
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    transferAction.setParams('to', "0x356696BFBd8aaa37f4526f0eD6391999E53a9857");
    transferAction.setParams('value', 1);
    transferAction.setPosition(120, 240);

    // Create a single edge connecting the trigger to the transfer action
    const edge = new Edge({ source: transferTrigger, target: transferAction });

    // Create the workflow with the two nodes and one edge
    const workflow = new Workflow("simple-transfer-workflow", [transferTrigger, transferAction], [edge]);

    const result = await workflow.create();
    console.log(result);

    if (!result.success)
        throw new Error("An error occurred when publishing the workflow");

    console.log(workflow.id);
    console.log(await workflow.getSessionKeyPermissions());
};

workflow_complex();