import { 
    ACTIONS, 
    Action, 
    TRIGGERS, 
    Trigger, 
    Workflow, 
    CHAINS, 
    Edge, 
    apiServices,
  } from '../../../src/index.js';
  import dotenv from 'dotenv';
  
  dotenv.config();
  
  async function aave_trigger_ltv_slack() {
    // Check for required environment variables
    if (!process.env.API_URL || !process.env.AUTH_TOKEN || !process.env.SLACK_WEBHOOK) {
      console.error("Missing API_URL, AUTH_TOKEN, or SLACK_WEBHOOK in environment.");
      return;
    }
  
    // Set up API services
    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);
  
    // -------- AAVE LTV trigger --------
    const aaveLTVTrigger = new Trigger(TRIGGERS.LENDING.AAVE.LTV);
    // Set the chain ID (using Aave on Base in this example)
    aaveLTVTrigger.setChainId(CHAINS.ETHEREUM);
    // Set the wallet address to fetch account data for
    aaveLTVTrigger.setParams("abiParams.user", "0x9332D0cE5D45184515e0EA85bf9f4af09Cbf10Af");
    aaveLTVTrigger.setCondition('gte');
    aaveLTVTrigger.setComparisonValue(10);
  
    // -------- Slack Message Action --------
    const slackMessageAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    // Set the webhook and message; here you could include trigger output details if needed.
    slackMessageAction.setParams("webhook", process.env.SLACK_WEBHOOK);
    slackMessageAction.setParams("message", "AAVE LTV trigger fired for wallet 0x9332D0cE5D45184515e0EA85bf9f4af09Cbf10Af on Ethereum");
  
    // -------- Connect Trigger to Action --------
    const edge = new Edge({
      source: aaveLTVTrigger,
      target: slackMessageAction,
    });
  
    // Create the workflow with the trigger and action
    const workflow = new Workflow(
      "AAVE LTV Trigger and Slack Notification",
      [aaveLTVTrigger, slackMessageAction],
      [edge]
    );
  
    console.log("Workflow before creation: " + workflow.getState());
  
    const creationResult = await workflow.create();
    if (!creationResult.success) {
      console.error("Workflow creation failed:", creationResult);
      return;
    }
  
    console.log("Workflow ID: " + workflow.id);
    console.log("Workflow state after creation: " + workflow.getState());
  
    const runResult = await workflow.run();
    if (!runResult.success) {
      console.error("Workflow run failed:", runResult);
      return;
    }
  
    console.log("Workflow state after running: " + workflow.getState());
  }
  
  aave_trigger_ltv_slack();