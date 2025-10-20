import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hypurrHealthFactor() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hypurrHealthFactorTrigger = new Trigger(TRIGGERS.LENDING.HYPURR.HEALTH_FACTOR);
  hypurrHealthFactorTrigger.setParams('chainId', 999);
  hypurrHealthFactorTrigger.setParams('abiParams.user', '0x91191d0ebdbf928829c2e66c7bfe23d6d241a260');
  hypurrHealthFactorTrigger.setParams('condition', 'lte');
  hypurrHealthFactorTrigger.setParams('comparisonValue', 1.2);
  hypurrHealthFactorTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'message');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: hypurrHealthFactorTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when my Hypurr health factor is less than 1.2', [hypurrHealthFactorTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Hypurr Health Factor before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hypurr Health Factor after: " + workflow.getState());
}

hypurrHealthFactor();