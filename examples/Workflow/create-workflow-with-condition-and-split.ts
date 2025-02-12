import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup } from '../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ethPriceWorkflowWithSplit() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    // Step 1: Trigger to monitor ETH price
    const trigger = new Trigger(TRIGGERS.TOKENS.PRICE.PRICE_MOVEMENT_AGAINST_CURRENCY);
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3000);
    trigger.setCondition('lt'); // 'lt' for less than
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'ETH').contractAddress);
    trigger.setPosition(0, 0);

    // Step 2: Split action to create two branches
    const split = new Action(ACTIONS.CORE.SPLIT.SPLIT);

    // Branch 1: Simple if condition with Slack message
    const conditionBranch1 = new Action(ACTIONS.CORE.CONDITION.IF);
    conditionBranch1.setParams('logic', LOGIC_OPERATORS.OR);
    const conditionGroup1 = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup1.addConditionCheck(trigger.getOutputVariableName('price'), 'lt', 3000);
    conditionBranch1.setParams('groups', [conditionGroup1]);

    const slackActionBranch1 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackActionBranch1.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackActionBranch1.setParams("message", "Branch 1: ETH price is below $3000!");

    // Branch 2: If-else condition with Slack messages for both true and false
    const conditionBranch2 = new Action(ACTIONS.CORE.CONDITION.IF);
    conditionBranch2.setParams('logic', LOGIC_OPERATORS.OR);
    const conditionGroup2 = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup2.addConditionCheck(trigger.getOutputVariableName('price'), 'gte', 2000);
    conditionBranch2.setParams('groups', [conditionGroup2]);

    const slackActionBranch2True = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackActionBranch2True.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackActionBranch2True.setParams("message", "Branch 2: ETH price is above or equal to $2000!");

    const slackActionBranch2False = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackActionBranch2False.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackActionBranch2False.setParams("message", "Branch 2: ETH price is below $2000!");

    // Step 3: Build the workflow with edges connecting the trigger, split, conditions, and actions
    const workflow = new Workflow("ETH Price Monitoring with Split", [trigger, split, conditionBranch1, slackActionBranch1, conditionBranch2, slackActionBranch2True, slackActionBranch2False]);

    const edgeTriggerToSplit = new Edge({
        source: trigger,
        target: split,
    });

    // Branch 1 edges
    const edgeSplitToConditionBranch1 = new Edge({
        source: split,
        target: conditionBranch1,
    });
    const edgeConditionBranch1ToSlack = new Edge({
        source: conditionBranch1,
        target: slackActionBranch1,
        label: "true",
        value: "true",
    });

    // Branch 2 edges
    const edgeSplitToConditionBranch2 = new Edge({
        source: split,
        target: conditionBranch2,
    });
    const edgeConditionBranch2ToSlackTrue = new Edge({
        source: conditionBranch2,
        target: slackActionBranch2True,
        label: "true",
        value: "true",
    });
    const edgeConditionBranch2ToSlackFalse = new Edge({
        source: conditionBranch2,
        target: slackActionBranch2False,
        label: "false",
        value: "false",
    });

    workflow.addEdges([
        edgeTriggerToSplit,
        edgeSplitToConditionBranch1,
        edgeConditionBranch1ToSlack,
        edgeSplitToConditionBranch2,
        edgeConditionBranch2ToSlackTrue,
        edgeConditionBranch2ToSlackFalse,
    ]);

    // Log the workflow JSON
    console.log(JSON.stringify(workflow.toJSON()));

    // Step 4: Create and run the workflow
    const creationResult = await workflow.create();
    console.log(workflow.getState());

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

ethPriceWorkflowWithSplit();