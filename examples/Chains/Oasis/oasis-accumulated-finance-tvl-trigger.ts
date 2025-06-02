import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function oasis_accumulated_finance_tvl() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Transfer trigger --------
  const transferTrigger = new Trigger(TRIGGERS.LENDING.ACCUMULATED_FINANCE.TVL);
  transferTrigger.setChainId(CHAINS.OASIS);
  transferTrigger.setParams(
    "asset",
    getTokenFromSymbol(CHAINS.OASIS, "stROSE").contractAddress
  );
  transferTrigger.setParams(
    "condition",
    "gt"
  );
  transferTrigger.setParams(
    "comparisonValue",
    0 // putting 0 as comparison value so that the workflow is triggered instantly
  );

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The Oasis stROSE TVL is " + transferTrigger.getOutputVariableName('tvl'));
  notificationAction.setParams("subject", "Oasis stROSE TVL");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Oasis stROSE TVL",
    [
      transferTrigger,
      notificationAction
    ],
    [new Edge({
      source: transferTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Oasis stROSE TVL before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Oasis stROSE TVL after: " + workflow.getState());
}

oasis_accumulated_finance_tvl();