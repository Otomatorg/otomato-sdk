import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function borrow_cap() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Asset price movement trigger --------
  const borrowCapTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.BORROW_CAP);
  borrowCapTrigger.setChainId(CHAINS.HYPERLIQUID);
  borrowCapTrigger.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.HYPERLIQUID, 'wHYPE').contractAddress);
  borrowCapTrigger.setCondition("gt");
  // compare with value
  borrowCapTrigger.setComparisonValue(2500000);
  // compare with history
  // borrowCapTrigger.setComparisonValue('{{history.0.value}}');

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The borrow cap is " + borrowCapTrigger.getOutputVariableName('borrowCap'));
  notificationAction.setParams("subject", "Borrow cap");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Borrow cap",
    [
      borrowCapTrigger,
      notificationAction
    ],
    [new Edge({
      source: borrowCapTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Borrow cap before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Borrow cap after: " + workflow.getState());
}

borrow_cap();