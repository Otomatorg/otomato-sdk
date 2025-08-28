import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function binance_usdt_transfer() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Transfer trigger --------
  const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
  transferTrigger.setChainId(CHAINS.BINANCE);
  transferTrigger.setParams(
    "contractAddress",
    getTokenFromSymbol(CHAINS.BINANCE, "USDT").contractAddress
  );

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The Binance USDT transfer occurred from " + transferTrigger.getOutputVariableName('from') + " to " + transferTrigger.getOutputVariableName('to') + " with value " + transferTrigger.getOutputVariableName('value'));
  notificationAction.setParams("subject", "Binance USDT Transfer");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Binance USDT Transfer",
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

  console.log("Binance USDT Transfer before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Binance USDT Transfer after: " + workflow.getState());
}

binance_usdt_transfer();