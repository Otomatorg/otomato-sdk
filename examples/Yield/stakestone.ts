import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function tokensTransfer() { 
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- tokens transfer trigger --------
  const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
  trigger.setParams('chainId', CHAINS.BASE);
  trigger.setParams('contractAddress', getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress);
  trigger.setParams('abiParams.to', '{{smartAccountAddress}}');
  trigger.setPosition(400, 120);

  // -------- telegram send message --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
  notificationAction.setParams("message", "The tokens transfer: " + trigger.getOutputVariableName('value'));

  const workflow = new Workflow(
    "Tokens transfer",
    [
      trigger,
      notificationAction
    ],
    [new Edge({
      source: trigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Tokens transfer before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Tokens transfer after: " + workflow.getState());
}

tokensTransfer();