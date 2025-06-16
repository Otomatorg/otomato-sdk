import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function supply_cap() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Hyperlend supply cap trigger --------
  const supplyCapTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.SUPPLY_CAP);
  supplyCapTrigger.setChainId(CHAINS.HYPERLIQUID);
  supplyCapTrigger.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.HYPERLIQUID, 'wHYPE').contractAddress);
  supplyCapTrigger.setCondition("gt");
  // compare with value
  supplyCapTrigger.setComparisonValue(5000000);
  // compare with history
  // supplyCapTrigger.setComparisonValue('{{history.0.value}}');

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The supply cap is " + supplyCapTrigger.getOutputVariableName('supplyCap'));
  notificationAction.setParams("subject", "Supply cap");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Supply cap",
    [
      supplyCapTrigger,
      notificationAction
    ],
    [new Edge({
      source: supplyCapTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Supply cap before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Supply cap after: " + workflow.getState());
}

supply_cap();