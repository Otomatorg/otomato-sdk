import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hypurrIsolatedHealthFactor() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hypurrHealthFactorIsolatedTrigger = new Trigger(TRIGGERS.LENDING.HYPURR.HEALTH_FACTOR_ISOLATED);
  hypurrHealthFactorIsolatedTrigger.setParams('chainId', 999);
  hypurrHealthFactorIsolatedTrigger.setParams('market', '0xE4847Cb23dAd9311b9907497EF8B39d00AC1DE14');
  hypurrHealthFactorIsolatedTrigger.setParams('user', '0xBfB5c62E32E8925af08A3b05009B1ade8556d783');
  hypurrHealthFactorIsolatedTrigger.setParams('condition', 'lte');
  hypurrHealthFactorIsolatedTrigger.setParams('comparisonValue', 1.2);
  hypurrHealthFactorIsolatedTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'message');
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: hypurrHealthFactorIsolatedTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when my Hypurr isolated health factor is less than 1.2', [hypurrHealthFactorIsolatedTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("Hypurr Isolated Health Factor before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hypurr Isolated Health Factor after: " + workflow.getState());
}

hypurrIsolatedHealthFactor();