import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

export async function abstract_streamer_live_multiple_triggers() {

  const EMAIL_ADDRESS = "abc@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
    console.warn("API_URL or AUTH_TOKEN not set, skipping API interaction for example");
    // Allow example to run without API for positioning test purposes
    // apiServices.setUrl("dummy_url");
    // apiServices.setAuth("dummy_token");
  } else {
    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);
  }


  // -------- First Trigger - Abstract Streamer Live --------
  const abstractSwapTrigger = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_STREAMER_LIVE);
  abstractSwapTrigger.setParams("streamer", "pudgyholder");
  abstractSwapTrigger.setParams("condition", "eq");
  abstractSwapTrigger.setParams("comparisonValue", true); // Changed "true" to true
  // -------- Second Trigger - AAVE Lending Rate --------
  const aaveTrigger = new Trigger(TRIGGERS.LENDING.AAVE.LENDING_RATE);
  aaveTrigger.setChainId(CHAINS.ETHEREUM);
  aaveTrigger.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.ETHEREUM, "USDC").contractAddress
  );
  aaveTrigger.setParams(
    "condition",
    "gt"
  );
  aaveTrigger.setParams(
    "comparisonValue",
    0
  );

  /// -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "workflow triggered");
  notificationAction.setParams("subject", "workflow triggered");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const edge1 = new Edge({
    source: abstractSwapTrigger,
    target: notificationAction,
  });

  const edge2 = new Edge({
    source: aaveTrigger,
    target: notificationAction,
  });

  const workflow = new Workflow(
    "abstract streamer live multiple triggers",
    [
      abstractSwapTrigger,
      aaveTrigger,
      notificationAction,
    ],
    [edge1, edge2]
  );

  // The Workflow constructor already calls positionWorkflowNodes.
  // For testing, we might call it again if we manipulate nodes/edges post-construction,
  // but here it's done internally.

  // console.log("Workflow JSON for testing:", JSON.stringify(workflow.toJSON(), null, 2));

  // The rest of the original example (API calls, run) can be kept if needed,
  // but for positioning test, they are not strictly necessary.
  // if (process.env.API_URL && process.env.AUTH_TOKEN) {
  //   const creationResult = await workflow.create();
  //   console.log("abstract streamer live state before: " + workflow.getState());
  //   console.log("Workflow ID: " + workflow.id);
  //   const runResult = await workflow.run();
  //   console.log("abstract streamer live state after: " + workflow.getState());
  // } else {
  //   console.log("Skipping create/run due to missing API_URL/AUTH_TOKEN");
  // }
  return workflow; // Return workflow for testing purposes
}

// Call the function if the script is run directly, e.g. for manual testing
if (typeof require !== 'undefined' && require.main === module) {
    abstract_streamer_live_multiple_triggers().then(workflow => {
        console.log("Example workflow created. Node positions:");
        workflow.nodes.forEach(node => {
            console.log(`Node ${node.getRef()}: x=${node.position?.x}, y=${node.position?.y}`);
        });
    }).catch(console.error);
}
