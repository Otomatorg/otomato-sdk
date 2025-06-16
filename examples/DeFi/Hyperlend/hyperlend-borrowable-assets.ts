import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function borrowable_assets() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Hyperlend borrowable assets trigger --------
  const borrowableAssetsTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.BORROWABLE_ASSETS);
  borrowableAssetsTrigger.setChainId(CHAINS.HYPERLIQUID);
  borrowableAssetsTrigger.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.HYPERLIQUID, 'wHYPE').contractAddress);
  borrowableAssetsTrigger.setCondition("gt");
  // compare with value
  borrowableAssetsTrigger.setComparisonValue(2500);
  // compare with history
  // borrowableAssetsTrigger.setComparisonValue('{{history.0.value}}');

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The amount of borrowable assets is " + borrowableAssetsTrigger.getOutputVariableName('borrowableAssets'));
  notificationAction.setParams("subject", "Borrowable assets");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Borrowable assets",
    [
      borrowableAssetsTrigger,
      notificationAction
    ],
    [new Edge({
      source: borrowableAssetsTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Borrowable assets before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Borrowable assets after: " + workflow.getState());
}

borrowable_assets();