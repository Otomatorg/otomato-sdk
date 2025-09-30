import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function pendleLPExpired() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const pendleLpExpiredTrigger = new Trigger(TRIGGERS.YIELD.PENDLE.LP_EXPIRED);
  pendleLpExpiredTrigger.setParams('chainId', 999);
  pendleLpExpiredTrigger.setParams('marketAddress', '0x97d985a71131afc02c320b636a268df34c6f42a4');
  pendleLpExpiredTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'LP hbHYPE market on Pendle HyperEVM expired');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: pendleLpExpiredTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when LP hbHYPE is expired on pendle', [pendleLpExpiredTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Pendle LP Expired before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Pendle LP Expired after: " + workflow.getState());
}

pendleLPExpired();