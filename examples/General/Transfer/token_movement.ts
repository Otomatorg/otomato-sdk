import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function wallet_balance_movement() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const wallet = "0x9f127b66b1620d97de98746c27e245612e40285c"

  // -------- Asset price movement trigger --------
  const ethTransferTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE_MOVEMENT);
  ethTransferTrigger.setParams("walletAddress", wallet);
  ethTransferTrigger.setParams("threshold", 3);
  ethTransferTrigger.setParams("condition", "eq");
  ethTransferTrigger.setParams("comparisonValue", true);

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", ethTransferTrigger.getOutputVariableName('balanceChanges'));
  notificationAction.setParams("subject", "Balance movement");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "When the wallet transfers tokens",
    [
      ethTransferTrigger,
      notificationAction
    ],
    [new Edge({
      source: ethTransferTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("When the wallet transfers tokens before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("When the wallet transfers tokens after: " + workflow.getState());
}

wallet_balance_movement();