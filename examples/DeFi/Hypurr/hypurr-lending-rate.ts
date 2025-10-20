import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hypurrLendingRate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hypurrLendingRateTrigger = new Trigger(TRIGGERS.LENDING.HYPURR.LENDING_RATE);
  hypurrLendingRateTrigger.setParams('chainId', 999);
  hypurrLendingRateTrigger.setParams('abiParams.asset', '0x5555555555555555555555555555555555555555');
  hypurrLendingRateTrigger.setParams('condition', 'gt');
  hypurrLendingRateTrigger.setParams('comparisonValue', 5);
  hypurrLendingRateTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'message');
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hypurrLendingRateTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Notify me when my Hypurr lending rate is greater than 5%', [hypurrLendingRateTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("Hypurr Lending Rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hypurr Lending Rate after: " + workflow.getState());
}

hypurrLendingRate();