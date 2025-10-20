import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hypurrIsolatedLendingRate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hypurrLendingRateIsolatedTrigger = new Trigger(TRIGGERS.LENDING.HYPURR.LENDING_RATE_ISOLATED);
  hypurrLendingRateIsolatedTrigger.setParams('chainId', 999);
  hypurrLendingRateIsolatedTrigger.setParams('market', '0xAeedD5B6d42e0F077ccF3E7A78ff70b8cB217329');
  hypurrLendingRateIsolatedTrigger.setParams('condition', 'gt');
  hypurrLendingRateIsolatedTrigger.setParams('comparisonValue', 5);
  hypurrLendingRateIsolatedTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'message');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: hypurrLendingRateIsolatedTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when my Hypurr isolated lending rate is greater than 5%', [hypurrLendingRateIsolatedTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Hypurr Isolated Lending Rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hypurr Isolated Lending Rate after: " + workflow.getState());
}

hypurrIsolatedLendingRate();