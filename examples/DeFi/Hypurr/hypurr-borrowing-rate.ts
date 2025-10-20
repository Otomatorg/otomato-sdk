import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hypurrBorrowingRate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hypurrBorrowingRatesTrigger = new Trigger(TRIGGERS.LENDING.HYPURR.BORROWING_RATES);
  hypurrBorrowingRatesTrigger.setParams('chainId', 999);
  hypurrBorrowingRatesTrigger.setParams('abiParams.asset', '0x5555555555555555555555555555555555555555');
  hypurrBorrowingRatesTrigger.setParams('condition', 'gt');
  hypurrBorrowingRatesTrigger.setParams('comparisonValue', 3);
  hypurrBorrowingRatesTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'message');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: hypurrBorrowingRatesTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when my Hypurr borrowing rate is greater than 3%', [hypurrBorrowingRatesTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Hypurr Borrowing Rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hypurr Borrowing Rate after: " + workflow.getState());
}

hypurrBorrowingRate();