import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, convertToTokenUnitsFromSymbol, LOGIC_OPERATORS, ConditionGroup } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function workflow1() {
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

    const conditionGroup1 = new ConditionGroup(LOGIC_OPERATORS.OR);
    conditionGroup1.addConditionCheck(trigger.getOutputVariableName('price'), 'lte', 18);

    const conditionGroup2 = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup2.addConditionCheck(20, 'lt', 25);
    conditionGroup2.addConditionCheck(trigger.getOutputVariableName('price'), 'lte', 18);

    // Create the condition action
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    condition.setParams('groups', [conditionGroup1, conditionGroup2]);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackAction.setParams("message", "The if went through!");

    const slackAction2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction2.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackAction2.setParams("message", "The if didn't went through!");

    const workflow = new Workflow("test if", [trigger, condition, slackAction, slackAction2]);

    const edge = new Edge({
        source: trigger,
        target: condition,
    });
    const edge2 = new Edge({
        source: condition,
        target: slackAction,
        label: "true",
        value: "true",
    });
    const edge3 = new Edge({
        source: condition,
        target: slackAction2,
        label: "false",
        value: "false",
    });

    workflow.addEdge(edge);
    workflow.addEdge(edge2);
    workflow.addEdge(edge3);

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
}

async function if_price_below_3000() {
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

    const conditionGroup1 = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup1.addConditionCheck(trigger.getOutputVariableName('price'), 'gte', 2900);

    // Create the condition action
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    condition.setParams('groups', [conditionGroup1]);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackAction.setParams("message", "ETH is above 2900!");

    const workflow = new Workflow("test if", [trigger, condition, slackAction]);

    const edge = new Edge({
        source: trigger,
        target: condition,
    });
    const edge2 = new Edge({
        source: condition,
        target: slackAction,
        label: "true",
        value: "true",
    });

    workflow.addEdge(edge);
    workflow.addEdge(edge2);

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
}

async function if_price_below_3000_else() {
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

    const conditionGroup1 = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup1.addConditionCheck(trigger.getOutputVariableName('price'), 'gte', 2900);

    // Create the condition action
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    condition.setParams('groups', [conditionGroup1]);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackAction.setParams("message", "ETH is above 2900!");

    const slackAction2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction2.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackAction2.setParams("message", "ETH is below 2900! Its value is " + trigger.getOutputVariableName('price'));

    const workflow = new Workflow("test if", [trigger, condition, slackAction, slackAction2]);

    const edge = new Edge({
        source: trigger,
        target: condition,
    });
    const edge2 = new Edge({
        source: condition,
        target: slackAction,
        label: "true",
        value: "true",
    });
    const edge3 = new Edge({
        source: condition,
        target: slackAction2,
        label: "false",
        value: "false",
    });

    workflow.addEdge(edge);
    workflow.addEdge(edge2);
    workflow.addEdge(edge3);

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
}

// if_price_below_3000();
//workflow1();
if_price_below_3000_else()