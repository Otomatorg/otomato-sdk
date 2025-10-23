import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hypurrIsolatedBorrowingRate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hypurrBorrowingRatesIsolatedTrigger = new Trigger(TRIGGERS.LENDING.HYPURRFI.BORROWING_RATES_ISOLATED);
  hypurrBorrowingRatesIsolatedTrigger.setParams('chainId', 999);
  hypurrBorrowingRatesIsolatedTrigger.setParams('market', '0xAeedD5B6d42e0F077ccF3E7A78ff70b8cB217329');
  hypurrBorrowingRatesIsolatedTrigger.setParams('condition', 'gt');
  hypurrBorrowingRatesIsolatedTrigger.setParams('comparisonValue', 3);
  hypurrBorrowingRatesIsolatedTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'message');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: hypurrBorrowingRatesIsolatedTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('My new Workflow 2', [hypurrBorrowingRatesIsolatedTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Hypurr Isolated Borrowing Rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hypurr Isolated Borrowing Rate after: " + workflow.getState());
}

hypurrIsolatedBorrowingRate();