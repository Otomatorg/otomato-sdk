import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function suppliable_assets() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Asset price movement trigger --------
  const suppliableAssetsTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.SUPPLIABLE_ASSETS);
  suppliableAssetsTrigger.setChainId(CHAINS.HYPERLIQUID);
  suppliableAssetsTrigger.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.HYPERLIQUID, 'wHYPE').contractAddress);
  suppliableAssetsTrigger.setCondition("gt");
  // compare with value
  suppliableAssetsTrigger.setComparisonValue(50000);
  // compare with history
  // suppliableAssetsTrigger.setComparisonValue('{{history.0.value}}');

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The amount of suppliable assets is " + suppliableAssetsTrigger.getOutputVariableName('suppliableAssets'));
  notificationAction.setParams("subject", "Suppliable assets");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Suppliable assets",
    [
      suppliableAssetsTrigger,
      notificationAction
    ],
    [new Edge({
      source: suppliableAssetsTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Suppliable assets before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Suppliable assets after: " + workflow.getState());
}

suppliable_assets();