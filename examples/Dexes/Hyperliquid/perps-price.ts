import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hyperliquid_perps_price() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Redeem trigger --------
  const perpsPriceTrigger = new Trigger(TRIGGERS.DEXES.HYPERLIQUID.PERPS_PRICE);
  perpsPriceTrigger.setParams("asset", "BTC");
  perpsPriceTrigger.setParams("condition", "gte");
  perpsPriceTrigger.setParams("comparisonValue", 100000);

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The BTC perps price on Hyperliquid is " + perpsPriceTrigger.getOutputVariableName('perpsPrice'));
  notificationAction.setParams("subject", "BTC perps price on Hyperliquid");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "BTC perps price on Hyperliquid",
    [
      perpsPriceTrigger,
      notificationAction
    ],
    [new Edge({
      source: perpsPriceTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("BTC perps price on Hyperliquid before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("BTC perps price on Hyperliquid after: " + workflow.getState());
}

hyperliquid_perps_price();