import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function pendlePtYield() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const pendlePtImpliedYieldTrigger = new Trigger(TRIGGERS.YIELD.PENDLE.PT_IMPLIED_YIELD);
  pendlePtImpliedYieldTrigger.setParams('chainId', 999);
  pendlePtImpliedYieldTrigger.setParams('abiParams.marketAddress', '0x97d985a71131afc02c320b636a268df34c6f42a4');
  pendlePtImpliedYieldTrigger.setParams('condition', 'gt');
  pendlePtImpliedYieldTrigger.setParams('comparisonValue', 10);
  pendlePtImpliedYieldTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Pendle hbHYPE\'s PT yield is above 10');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: pendlePtImpliedYieldTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Get notified when when hbHYPE PT yield above 10', [pendlePtImpliedYieldTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Pendle PT Yield before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Pendle PT Yield after: " + workflow.getState());
}

pendlePtYield();