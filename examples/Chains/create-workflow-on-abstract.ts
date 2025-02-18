import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, convertToTokenUnitsFromSymbol } from '../../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    console.log('main');

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ABSTRACT);
    trigger.setContractAddress('0x9ebe3a824ca958e4b3da772d2065518f009cba62'); // PENGU

    const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackMessage.setParams('webhook', process.env.SLACK_WEBHOOK);
    slackMessage.setParams('message', 'A PENGU transfer occurred');
  
    const workflow = new Workflow("Abstract test", [trigger, slackMessage]);

    const edge = new Edge({
        source: trigger,
        target: slackMessage,
    });

    workflow.addEdge(edge);

    console.log(JSON.stringify(workflow.toJSON()))

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
    console.log('main');
}

main();