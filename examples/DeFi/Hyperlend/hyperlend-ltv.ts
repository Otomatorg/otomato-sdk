import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ltv() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hyperlendLTVTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.LTV);
  hyperlendLTVTrigger.setParams('chainId', 999);
  hyperlendLTVTrigger.setParams('abiParams.user', '0xe6fDce21F9787C2fa04A2CbC11011F77458fCfb4');
  hyperlendLTVTrigger.setParams('condition', 'gte');
  hyperlendLTVTrigger.setParams('comparisonValue', 60);
  hyperlendLTVTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Wallet {{nodeMap.1.parameters.abi.parameters.user}}\'s LTV is above 80');
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hyperlendLTVTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Notify me when LTV reach a treshold on HyperLend', [hyperlendLTVTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("LTV before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("LTV after: " + workflow.getState());
}

ltv();