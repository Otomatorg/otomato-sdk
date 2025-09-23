import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function pendlePtExpired() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 


  const pendlePtExpiredTrigger = new Trigger(TRIGGERS.YIELD.PENDLE.PT_EXPIRED);
  pendlePtExpiredTrigger.setParams('chainId', 999);
  pendlePtExpiredTrigger.setParams('marketAddress', '0x810f9d4a751cafd5193617022b35fa0b0c166b4c');
  pendlePtExpiredTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'PT hbHYPE market on HyperEVM expired');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: pendlePtExpiredTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when PT hbHYPE is expired on pendle', [pendlePtExpiredTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Pendle PT Expired before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Pendle PT Expired after: " + workflow.getState());
}

pendlePtExpired();