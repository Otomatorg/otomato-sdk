import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ethPriceWorkflowWithTelegram() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    // Step 1: Trigger to monitor ETH price
    const trigger = new Trigger(TRIGGERS.TOKENS.PRICE.PRICE_MOVEMENT_AGAINST_CURRENCY);
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3500);
    trigger.setCondition('lt'); // 'lt' for less than
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'ETH').contractAddress);

    // Step 3: Telegram notification action
    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams("message", "🚨 ETH price alert: ETH is below $3500! 🚨");

    // Step 4: Build the workflow
    const workflow = new Workflow("ETH Price Telegram Alert", [trigger, telegramAction]);

    const edgeTriggerToCondition = new Edge({
        source: trigger,
        target: telegramAction
    });

    workflow.addEdges([edgeTriggerToCondition]);

    // Step 5: Create and run the workflow
    const creationResult = await workflow.create();

    if (!creationResult.success) {
        throw new Error("An error occurred when publishing the workflow");
    }

    console.log(workflow.id);

    const runResult = await workflow.run();
    console.log(workflow.getState());

    if (!runResult.success) {
        throw new Error("An error occurred when running the workflow");
    } else {
        console.log('Workflow is running');
    }
}

ethPriceWorkflowWithTelegram();