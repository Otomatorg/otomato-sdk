import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function borrowing_rate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hyperlendBorrowingRatesTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.BORROWING_RATES);
  hyperlendBorrowingRatesTrigger.setParams('chainId', CHAINS.HYPER_EVM);
  hyperlendBorrowingRatesTrigger.setParams('abiParams.asset', getTokenFromSymbol(CHAINS.HYPER_EVM, 'wHYPE').contractAddress);
  hyperlendBorrowingRatesTrigger.setParams('condition', 'lt');
  hyperlendBorrowingRatesTrigger.setParams('comparisonValue', 6);
  hyperlendBorrowingRatesTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Hyperlend wHYPE borrowing rate is below 6%');
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hyperlendBorrowingRatesTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Get notified when when wHYPE borrowing rate below 6%', [hyperlendBorrowingRatesTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("Borrowing rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Borrowing rate after: " + workflow.getState());
}

borrowing_rate();