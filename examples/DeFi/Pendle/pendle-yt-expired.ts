import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function pendleYtExpired() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 


  const pendleYtExpiredTrigger = new Trigger(TRIGGERS.YIELD.PENDLE.YT_EXPIRED);
  pendleYtExpiredTrigger.setParams('chainId', 999);
  pendleYtExpiredTrigger.setParams('marketAddress', '0x2b55b35d9be63d016ee902d87af29d2c4f397dc1');
  pendleYtExpiredTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'YT hbHYPE market on HyperEVM expired');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: pendleYtExpiredTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when YT hbHYPE is expired on pendle', [pendleYtExpiredTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Pendle YT Expired before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Pendle YT Expired after: " + workflow.getState());
}

pendleYtExpired();