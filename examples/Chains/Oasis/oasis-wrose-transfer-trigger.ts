import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function oasis_wrose_transfer() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Transfer trigger --------
  const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
  transferTrigger.setChainId(CHAINS.OASIS);
  transferTrigger.setParams(
    "contractAddress",
    getTokenFromSymbol(CHAINS.OASIS, "wROSE").contractAddress
  );

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The Oasis wROSE transfer occurred from " + transferTrigger.getOutputVariableName('from') + " to " + transferTrigger.getOutputVariableName('to') + " with value " + transferTrigger.getOutputVariableName('value'));
  notificationAction.setParams("subject", "Oasis wROSE Transfer");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Oasis wROSE Transfer",
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

  console.log("Oasis wROSE Transfer before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Oasis wROSE Transfer after: " + workflow.getState());
}

oasis_wrose_transfer();