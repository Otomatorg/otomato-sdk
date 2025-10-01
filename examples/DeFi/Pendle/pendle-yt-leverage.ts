import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function pendleYtLeverage() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const pendleYtImpliedYieldTrigger = new Trigger(TRIGGERS.YIELD.PENDLE.YT_LEVERAGE);
  pendleYtImpliedYieldTrigger.setParams('chainId', 999);
  pendleYtImpliedYieldTrigger.setParams('abiParams.marketAddress', '0x97d985a71131afc02c320b636a268df34c6f42a4');
  pendleYtImpliedYieldTrigger.setParams('condition', 'gt');
  pendleYtImpliedYieldTrigger.setParams('comparisonValue', 60);
  pendleYtImpliedYieldTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Pendle hbHYPE\'s YT leverage  is above 50');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: pendleYtImpliedYieldTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Get notified when when hbHYPE YT leverage above 60', [pendleYtImpliedYieldTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Pendle Yt Leverage before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Pendle Yt Leverage after: " + workflow.getState());
}

pendleYtLeverage();