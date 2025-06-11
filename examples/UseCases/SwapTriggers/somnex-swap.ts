import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function somnex_swap() {

  const EMAIL_ADDRESS = "your_email_address@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Somnex swap Trigger --------
  const somnexSwapTrigger = new Trigger(TRIGGERS.DEXES.SOMNEX.SWAP);
  somnexSwapTrigger.setChainId(CHAINS.SOMNIA);

  /// -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The somnex swap of " + somnexSwapTrigger.getOutputVariableName('sender') + " is " + somnexSwapTrigger.getOutputVariableName('transactionHash'));
  notificationAction.setParams("subject", "Somnex Swap");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const edge1 = new Edge({
    source: somnexSwapTrigger,
    target: notificationAction,
  });

  const workflow = new Workflow(
    "somnex swap",
    [
      somnexSwapTrigger,
      notificationAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("somnex_swap state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("somnex_swap state after: " + workflow.getState());
}

somnex_swap();