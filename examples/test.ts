import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits } from '../src/index.js';

const main = async () => {
    apiServices.setAuth("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDdjRUI4ZDgxNDdBYWE5ZEI4MUFjQkRGRTVjMzA1MERGQ2ZGMTg1MzciLCJzdWIiOiIweDg3RkU4YjRmMkZlODM3MGY2Y0M5YTk2MzQ0MmYwN0IwMmY0OTA5QTciLCJhdWQiOiJvdG9tYXRvLXRlc3QubmV0bGlmeS5hcHAiLCJleHAiOjE3MjMzODMxOTksIm5iZiI6MTcyMDc4OTM5OSwiaWF0IjoxNzIwNzkxMTk5LCJqdGkiOiIweDY4ZDkxOWEyMGZiYjIyNDUwZDZmOTFjMzM2ZTBmYjBjMmYyYTc3MmU3Zjg4NWU1ZjRmNzg1NTM2ZGIyYTY5YTAiLCJjdHgiOnt9fQ.MHgyOTM1NTM3MWYwOWM1YzllNWE3YjI4MjVkZTNjMDljZTkwMTQ3OTQwZmU1ZWRlMjM5YTk0MmFjYTQ5YTcwZWI0MGJlNmJiZDk2MDA4ZTIxMzJmNGM3ZTVlZGIzZDZiZjYyMDE4Mzc1MzUwMTRmNTc0ODM0ZDk4YWU3NDQwNDQzOTFi");

    // Trigger first
    const trigger = new Trigger(TRIGGERS.PRICE_ACTION.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3000);
    trigger.setCondition('gte');
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    trigger.setPosition(0, 0);

    const workflow = new Workflow("Test from SDK", [trigger]);

    const edge = new Edge({
      source: trigger,
      target: trigger,
    });

    workflow.addEdge(edge);
    const creationResult = await workflow.create();

    // Action
    const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("value", 1000);
    transferAction.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    // const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    // slackAction.setParams("webhook", "https://hooks.slack.com/services/REPLACE_WITH_YOUR_DATA");
    // slackAction.setParams("message", "Notification from the SDK");
    // slackAction.setPosition(0, -10);

    if (!creationResult.success) {
        throw new Error("An error occurred when publishing the workflow")
    }

    if(workflow.id) {
      workflow.addNode(transferAction);

      for(let i = 0; i < workflow.nodes.length; i++) {
          if(workflow.nodes[i] && workflow.nodes[i + 1]) {
          const edge = new Edge({
            source: workflow.nodes[i],
            target: workflow.nodes[i + 1],
          })
          workflow.addEdge(edge);
        }
      }
      
      await workflow.update();
    }

    if(workflow.id) {
      const workflowLoaded = await workflow.load(workflow.id);
      console.log("when having Id", workflowLoaded)
    }
}

main();