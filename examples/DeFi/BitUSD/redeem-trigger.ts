import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function bitusd_redeem() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Redeem trigger --------
  const redeemTrigger = new Trigger(TRIGGERS.LENDING.BIT_PROTOCOL.REDEMPTION);
  redeemTrigger.setChainId(CHAINS.OASIS);
  redeemTrigger.setParams("collateralToken", getTokenFromSymbol(CHAINS.OASIS, "ROSE").contractAddress);

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The BitUSD Redeem transaction hash for ROSE is " + redeemTrigger.getOutputVariableName('transactionHash'));
  notificationAction.setParams("subject", "BitUSD Redeem");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "BitUSD Redeem",
    [
      redeemTrigger,
      notificationAction
    ],
    [new Edge({
      source: redeemTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("BitUSD Redeem before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("BitUSD Redeem after: " + workflow.getState());
}

bitusd_redeem();