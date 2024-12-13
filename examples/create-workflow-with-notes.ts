import {
    ACTIONS,
    Action,
    TRIGGERS,
    Trigger,
    Workflow,
    CHAINS,
    getTokenFromSymbol,
    Edge,
    apiServices,
    Note
  } from "../src/index.js";
  import dotenv from "dotenv";

  
  // Load environment variables from the .env file
  dotenv.config();
  
  async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;
  
    // Set API services URL and authentication token
    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);
  
    // Create a trigger
    const trigger = new Trigger(
      TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY
    );
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3000);
    trigger.setCondition("lte");
    trigger.setParams("currency", "USD");
    trigger.setContractAddress(
      getTokenFromSymbol(CHAINS.MODE, "WETH").contractAddress
    );
    trigger.setPosition(0, 0);
  
    // Create an action
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams(
      "webhook",
      "https://hooks.slack.com/services/REPLACE_WITH_YOUR_DATA"
    );
    slackAction.setParams(
      "message",
      `The price is below 3000 - price: ${trigger.getOutputVariableName("price")}`
    );
    slackAction.setPosition(0, -10);
  
    // Create a workflow
    const workflow = new Workflow("test from SDK", [trigger, slackAction]);
  
    // Add an edge connecting the trigger to the action
    const edge = new Edge({
      source: trigger,
      target: slackAction,
    });
    workflow.addEdge(edge);
  
    // Add notes to the workflow
    const note1 = new Note("This is the trigger for price movement", { x: 10, y: 20 });
    const note2 = new Note("This is the Slack notification action", { x: 50, y: 100 });
  
    workflow.addNote(note1);
    workflow.addNote(note2);
  
    console.log(JSON.stringify(workflow.toJSON()));
  
    // Create the workflow via the API
    const creationResult = await workflow.create();
    console.log(workflow.getState());
  
    if (!creationResult.success) {
      throw new Error("An error occurred when publishing the workflow");
    }
  
    console.log(workflow.id);
  }
  
  main();