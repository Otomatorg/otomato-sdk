import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function binance_usdt_balance() {
  
  const EMAIL_ADDRESS = "your-email@gmail.com";

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Balance trigger --------
  const balanceTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE);
  balanceTrigger.setChainId(CHAINS.BINANCE);
  balanceTrigger.setParams(
    "contractAddress",
    getTokenFromSymbol(CHAINS.BINANCE, "USDT").contractAddress
  );

  const wallet = '0x2cbe5ab92cf0eb50f56117af909ff902ce9b025c'
  balanceTrigger.setParams(
    "abiParams.account",
    wallet
  );
  balanceTrigger.setCondition('gte');
  balanceTrigger.setComparisonValue(
    800
  );

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The Binance USDT balance of " + wallet + " is " + balanceTrigger.getOutputVariableName('balance'));
  notificationAction.setParams("subject", "Binance USDT Balance");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Binance USDT Balance",
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

  console.log("Binance USDT Balance before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Binance USDT Balance after: " + workflow.getState());
}

binance_usdt_balance();