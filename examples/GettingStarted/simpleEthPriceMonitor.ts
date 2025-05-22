import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function simple_eth_price_monitor() {

  const API_URL = "https://api.otomato.xyz/api"
  const EMAIL_ADDRESS = "your-email@gmail.com"
  const AUTH_TOKEN = "your-auth-token"

  if (!API_URL || !AUTH_TOKEN)
    return;

  apiServices.setUrl(API_URL);
  apiServices.setAuth(AUTH_TOKEN); 

  // -------- Eth price trigger --------
  const balanceTrigger = new Trigger(TRIGGERS.TOKENS.PRICE.PRICE_MOVEMENT_AGAINST_CURRENCY);
  balanceTrigger.setChainId(CHAINS.BASE);
  balanceTrigger.setComparisonValue(2500);
  balanceTrigger.setCondition("lte");
  balanceTrigger.setParams("currency", "USD");
  balanceTrigger.setContractAddress(
    getTokenFromSymbol(CHAINS.BASE, "WETH").contractAddress
  );

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The ETH price is now below 2500$. You're losing money by holding it.");
  notificationAction.setParams("subject", "ETH price below 2500$");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Simple ETH Price Monitor",
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

  console.log("Simple ETH Price Monitor before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Simple ETH Price Monitor after: " + workflow.getState());
}

simple_eth_price_monitor();