import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, convertToTokenUnitsFromSymbol } from '../../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function basicSplit() {
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

    const split = new Action(ACTIONS.CORE.SPLIT.SPLIT);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackAction.setParams("message", "1!");

    const slackAction2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction2.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackAction2.setParams("message", "2!");

    const workflow = new Workflow("swap & deposit", [trigger, split, slackAction, slackAction2]);

    const edge = new Edge({
        source: trigger,
        target: split,
    });
    const edge2 = new Edge({
        source: split,
        target: slackAction,
    });
    const edge3 = new Edge({
        source: split,
        target: slackAction2,
    });

    workflow.addEdges([edge, edge2, edge3]);

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
        throw new Error("An error occurred when running the workflow")
    } else {
        console.log('workflow is running');
    }
}

basicSplit();