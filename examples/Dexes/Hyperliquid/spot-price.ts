import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hyperliquid_spot_price() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Redeem trigger --------
  const spotPriceTrigger = new Trigger(TRIGGERS.DEXES.HYPERLIQUID.SPOT_PRICE);
  spotPriceTrigger.setChainId(CHAINS.HYPER_EVM);
  spotPriceTrigger.setParams("asset", "0x9fdbda0a5e284c32744d2f17ee5c74b284993463");
  spotPriceTrigger.setParams("condition", "gte");
  spotPriceTrigger.setParams("comparisonValue", 100000);

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The BTC spot price on Hyperliquid is " + spotPriceTrigger.getOutputVariableName('spotPrice'));
  notificationAction.setParams("subject", "BTC spot price on Hyperliquid");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "BTC spot price on Hyperliquid",
    [
      spotPriceTrigger,
      notificationAction
    ],
    [new Edge({
      source: spotPriceTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("BTC spot price on Hyperliquid before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("BTC spot price on Hyperliquid after: " + workflow.getState());
}

hyperliquid_spot_price();