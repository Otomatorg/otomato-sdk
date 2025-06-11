import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function somnia_susdt_balance() {
  
  const EMAIL_ADDRESS = "your-email@gmail.com";

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Balance trigger --------
  const balanceTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE);
  balanceTrigger.setChainId(CHAINS.SOMNIA);
  balanceTrigger.setParams(
    "contractAddress",
    getTokenFromSymbol(CHAINS.SOMNIA, "sUSDT").contractAddress
  );

  const wallet = '0xd688AaeD4D623FAE7947D4d9cA8D3a011e8790C9'
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
  notificationAction.setParams("body", "The Somnia sUSDT balance of " + wallet + " is " + balanceTrigger.getOutputVariableName('balance'));
  notificationAction.setParams("subject", "Somnia sUSDT Balance");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Somnia sUSDT Balance",
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

  console.log("Somnia sUSDT Balance before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Somnia sUSDT Balance after: " + workflow.getState());
}

somnia_susdt_balance();