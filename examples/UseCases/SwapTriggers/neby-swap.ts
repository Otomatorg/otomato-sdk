import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function neby_swap() {

  const EMAIL_ADDRESS = "thuan.vo@aegona.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Moonwell borrowing rate Trigger --------
  const nebySwapTrigger = new Trigger(TRIGGERS.DEXES.NEBY.SWAP);
  nebySwapTrigger.setChainId(CHAINS.OASIS);

  /// -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The neby wROSE/wstROSE swap of " + nebySwapTrigger.getOutputVariableName('sender') + " is " + nebySwapTrigger.getOutputVariableName('transactionHash'));
  notificationAction.setParams("subject", "Neby Swap");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const edge1 = new Edge({
    source: nebySwapTrigger,
    target: notificationAction,
  });

  const workflow = new Workflow(
    "neby swap",
    [
      nebySwapTrigger,
      notificationAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("neby_swap state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("neby_swap state after: " + workflow.getState());
}

neby_swap();