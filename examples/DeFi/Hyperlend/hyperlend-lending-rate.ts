import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function lending_rate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hyperlendLendingRateTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.LENDING_RATE);
  hyperlendLendingRateTrigger.setParams('chainId', CHAINS.HYPER_EVM);
  hyperlendLendingRateTrigger.setParams('abiParams.asset', getTokenFromSymbol(CHAINS.HYPER_EVM, 'wHYPE').contractAddress);
  hyperlendLendingRateTrigger.setParams('condition', 'gt');
  hyperlendLendingRateTrigger.setParams('comparisonValue', 7);
  hyperlendLendingRateTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Hyperlend wHYPE lending rate is above 7%');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: hyperlendLendingRateTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Get notified when when wHYPE lending rate above 7%', [hyperlendLendingRateTrigger, telegramSendMessageAction], [edge1], null);  

  const creationResult = await workflow.create();

  console.log("Lending rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Lending rate after: " + workflow.getState());
}

lending_rate();