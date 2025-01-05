import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits } from '../../src/index.js';
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
    trigger.setCondition('gte');
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    trigger.setPosition(0, 0);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", "https://hooks.slack.com/services/REPLACE_WITH_YOUR_DATA");
    slackAction.setParams("message", "Notification from the SDK - testing the state");
    slackAction.setPosition(0, -10);

    const slackAction2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction2.setParams("webhook", "https://hooks.slack.com/services/REPLACE_WITH_YOUR_DATA");
    slackAction2.setParams("message", "Notification from the SDK - message 2");
    slackAction2.setPosition(0, -10);
  
    const edge = new Edge({
        source: trigger,
        target: slackAction,
    });

    const edge2 = new Edge({
        source: slackAction,
        target: slackAction2,
    });
    let workflow = new Workflow("test from SDK", [trigger, slackAction, slackAction2], [edge, edge2]);

    const creationResult = await workflow.create();
    console.log("creationResult: ", creationResult)

    console.log(JSON.stringify(workflow));

    // now let's delete the second slack action
    const deleteResult = await edge2.delete();

    console.log(deleteResult);
    
    await workflow.reload(); // let's reload not to have the slackAction2 locally anymore
    console.log(JSON.stringify(workflow));
}

main();