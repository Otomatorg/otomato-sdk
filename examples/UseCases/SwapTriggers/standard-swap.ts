import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function standard_swap() {

  const EMAIL_ADDRESS = "your_email_address@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Standard swap Trigger --------
  const standardSwapTrigger = new Trigger(TRIGGERS.DEXES.STANDARD.SWAP);
  standardSwapTrigger.setChainId(CHAINS.SOMNIA);

  /// -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The standard swap of " + standardSwapTrigger.getOutputVariableName('sender') + " is " + standardSwapTrigger.getOutputVariableName('transactionHash'));
  notificationAction.setParams("subject", "Standard Swap");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const edge1 = new Edge({
    source: standardSwapTrigger,
    target: notificationAction,
  });

  const workflow = new Workflow(
    "standard swap",
    [
      standardSwapTrigger,
      notificationAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("standard_swap state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("standard_swap state after: " + workflow.getState());
}

standard_swap();