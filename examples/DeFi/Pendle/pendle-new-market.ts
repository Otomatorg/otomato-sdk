import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function pendleNewMarket() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const pendleNewMarketTrigger = new Trigger(TRIGGERS.YIELD.PENDLE.NEW_MARKET);
  pendleNewMarketTrigger.setParams('chainId', 999);
  pendleNewMarketTrigger.setParams('marketAddress', '0x97d985a71131afc02c320b636a268df34c6f42a4');
  pendleNewMarketTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'A new hbHYPE market appeared on Pendle HyperEVM');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: pendleNewMarketTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Get notified when a new hbHYPE market appears', [pendleNewMarketTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Pendle New Market before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Pendle New Market after: " + workflow.getState());
}

pendleNewMarket();