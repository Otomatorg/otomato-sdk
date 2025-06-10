import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function quickswap_swap() {

  const EMAIL_ADDRESS = "your_email_address@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Quickswap Trigger --------
  const quickswapTrigger = new Trigger(TRIGGERS.DEXES.QUICKSWAP.SWAP);
  quickswapTrigger.setChainId(CHAINS.SOMNIA);
  quickswapTrigger.setParams("contractAddress", "0xdc62e0a2Be944672E48aE4860e6Dfc727362B8E0");

  /// -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The quickswap swap of " + quickswapTrigger.getOutputVariableName('sender') + " is " + quickswapTrigger.getOutputVariableName('transactionHash'));
  notificationAction.setParams("subject", "Quickswap Swap");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const edge1 = new Edge({
    source: quickswapTrigger,
    target: notificationAction,
  });

  const workflow = new Workflow(
    "quickswap swap",
    [
      quickswapTrigger,
      notificationAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("quickswap_swap state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("quickswap_swap state after: " + workflow.getState());
}

quickswap_swap();