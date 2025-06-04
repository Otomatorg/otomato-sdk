import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function bitusd_tcr() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- TCR trigger --------
  const tcrTrigger = new Trigger(TRIGGERS.LENDING.BIT_PROTOCOL.TCR);
  tcrTrigger.setChainId(CHAINS.OASIS);
  tcrTrigger.setCondition("gt");
  tcrTrigger.setComparisonValue(0);

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The BitUSD TCR is " + tcrTrigger.getOutputVariableName('tcr'));
  notificationAction.setParams("subject", "BitUSD TCR");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "BitUSD TCR",
    [
      tcrTrigger,
      notificationAction
    ],
    [new Edge({
      source: tcrTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("BitUSD TCR before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("BitUSD TCR after: " + workflow.getState());
}

bitusd_tcr();