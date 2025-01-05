import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, getComputeERC20Variable } from '../../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    
    const trigger = new Trigger(TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3000);
    trigger.setCondition('lte');
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    trigger.setPosition(0, 0);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", "https://hooks.slack.com/services/REPLACE_WITH_YOUR_DATA");
    slackAction.setParams("message", `The price is below 3000 - price: ${trigger.getOutputVariableName('price')}`);
    slackAction.setPosition(0, -10);
  
    const workflow = new Workflow("test from SDK", [trigger, slackAction]);

    const edge = new Edge({
        source: trigger,
        target: slackAction,
    });

    workflow.addEdge(edge);

    console.log(JSON.stringify(workflow.toJSON()));

    const creationResult = await workflow.create();
    console.log(workflow.getState());

    if (!creationResult.success) {
        throw new Error("An error occurred when publishing the workflow")
    }

    console.log(workflow.id);

    const runResult = await workflow.run();
    console.log(workflow.getState());

    if (!runResult.success) {
        throw new Error("An error occurred when running the workflow");
    }

    console.log(`Workflow ${workflow.id} is running`);
    console.log(workflow.getState());

    workflow.setName("ABC");

    const patchResult = await workflow.update();
    console.log(patchResult);
    console.log(workflow.getState());
}

async function withERC20FormattedAmount() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    
    const trigger = new Trigger(TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3000);
    trigger.setCondition('lte');
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    trigger.setPosition(400, 120);

    const swap = new Action(ACTIONS.SWAP.ODOS.SWAP);
    swap.setChainId(CHAINS.MODE)
    swap.setParams("tokenIn", getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    swap.setParams("tokenOut", getTokenFromSymbol(CHAINS.MODE, 'USDC').contractAddress);
    swap.setParams("slippage", 1);
    swap.setParams("amount", getComputeERC20Variable('0.0000001', trigger.getParameterVariableName('chainId'), getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress));
    swap.setPosition(400, 240);
  
    const workflow = new Workflow("test from SDK", [trigger, swap]);

    const edge = new Edge({
        source: trigger,
        target: swap,
    });

    workflow.addEdge(edge);

    console.log(JSON.stringify(workflow.toJSON()));

    const creationResult = await workflow.create();
    console.log(workflow.getState());

    if (!creationResult.success) {
        throw new Error("An error occurred when publishing the workflow")
    }

    console.log(workflow.id);

    const runResult = await workflow.run();
    console.log(workflow.getState());

    if (!runResult.success) {
        throw new Error("An error occurred when running the workflow");
    }

    console.log(`Workflow ${workflow.id} is running`);
    console.log(workflow.getState());
}

withERC20FormattedAmount();