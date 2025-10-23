import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ventualsTotalSupply() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const ventualsTotalSupplyTrigger = new Trigger(TRIGGERS.LENDING.VENTUALS.TOTAL_SUPPLY);
  ventualsTotalSupplyTrigger.setParams('condition', 'lt');
  ventualsTotalSupplyTrigger.setParams('comparisonValue', 1000000);
  ventualsTotalSupplyTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Total supply of Ventuals HYPE is below 1,000,000');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: ventualsTotalSupplyTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Ventuals Total Supply', [ventualsTotalSupplyTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("Ventuals Total Supply before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Ventuals Total Supply after: " + workflow.getState());
}

ventualsTotalSupply();