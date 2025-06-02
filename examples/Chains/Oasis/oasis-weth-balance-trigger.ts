import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function oasis_weth_balance() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Balance trigger --------
  const balanceTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE);
  balanceTrigger.setChainId(CHAINS.OASIS);
  balanceTrigger.setParams(
    "contractAddress",
    getTokenFromSymbol(CHAINS.OASIS, "WETH").contractAddress
  );

  const wallet = '0xEaFB04B5d4fB753c32DBb2eC32B3bF7CdC7f5144'
  balanceTrigger.setParams(
    "abiParams.account",
    wallet
  );

  balanceTrigger.setCondition('gte');

  balanceTrigger.setComparisonValue(
    0
  );

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The Oasis WETH balance of " + wallet + " is " + balanceTrigger.getOutputVariableName('balance'));
  notificationAction.setParams("subject", "Oasis WETH Balance");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Oasis WETH Balance",
    [
      balanceTrigger,
      notificationAction
    ],
    [new Edge({
      source: balanceTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Oasis WETH Balance before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Oasis WETH Balance after: " + workflow.getState());
}

oasis_weth_balance();