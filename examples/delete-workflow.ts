import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits } from '../src/index.js';

const main = async () => {
    apiServices.setAuth("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDdjRUI4ZDgxNDdBYWE5ZEI4MUFjQkRGRTVjMzA1MERGQ2ZGMTg1MzciLCJzdWIiOiIweDg3RkU4YjRmMkZlODM3MGY2Y0M5YTk2MzQ0MmYwN0IwMmY0OTA5QTciLCJhdWQiOiJvdG9tYXRvLXRlc3QubmV0bGlmeS5hcHAiLCJleHAiOjE3MjMzODMxOTksIm5iZiI6MTcyMDc4OTM5OSwiaWF0IjoxNzIwNzkxMTk5LCJqdGkiOiIweDY4ZDkxOWEyMGZiYjIyNDUwZDZmOTFjMzM2ZTBmYjBjMmYyYTc3MmU3Zjg4NWU1ZjRmNzg1NTM2ZGIyYTY5YTAiLCJjdHgiOnt9fQ.MHgyOTM1NTM3MWYwOWM1YzllNWE3YjI4MjVkZTNjMDljZTkwMTQ3OTQwZmU1ZWRlMjM5YTk0MmFjYTQ5YTcwZWI0MGJlNmJiZDk2MDA4ZTIxMzJmNGM3ZTVlZGIzZDZiZjYyMDE4Mzc1MzUwMTRmNTc0ODM0ZDk4YWU3NDQwNDQzOTFi");

    const trigger = new Trigger(TRIGGERS.PRICE_ACTION.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
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
    
    const deletionResult = await workflow.delete();
    console.log(deletionResult)
}

main();