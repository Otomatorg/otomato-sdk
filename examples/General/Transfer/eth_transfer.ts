import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function asset_price_movement() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const wallet = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"

  // -------- Asset price movement trigger --------
  const ethTransferTrigger = new Trigger(TRIGGERS.TOKENS.NATIVE_TRANSFER.ETH_TRANSFER);
  ethTransferTrigger.setChainId(CHAINS.ETHEREUM);
  ethTransferTrigger.setParams("wallet", wallet);
  ethTransferTrigger.setParams("threshold", 0.004);

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "Wallet " + wallet + " has transferred " + ethTransferTrigger.getOutputVariableName('amount') + " ETH");
  notificationAction.setParams("subject", "ETH transfer");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "When the Ethereum foundation transfers ETH",
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

  console.log("When the Ethereum foundation transfers ETH before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("When the Ethereum foundation transfers ETH after: " + workflow.getState());
}

asset_price_movement();