import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function projectX() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const projectXIsInRangeTrigger = new Trigger(TRIGGERS.DEXES.PROJECT_X.IS_IN_RANGE);
  projectXIsInRangeTrigger.setParams('chainId', 999);
  projectXIsInRangeTrigger.setParams('abiParams.tokenId', 158259);
  projectXIsInRangeTrigger.setParams('condition', 'eq');
  projectXIsInRangeTrigger.setParams('comparisonValue', false);
  projectXIsInRangeTrigger.setPosition(400, 120);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', `ProjectX position with id ${projectXIsInRangeTrigger.getOutputVariableName('tokenId')} is out of range`);
  telegramSendMessageAction.setPosition(400, 240);
  
  const edge1 = new Edge({ source: projectXIsInRangeTrigger, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Notify me when ProjectX position with id #158259 is out of range', [projectXIsInRangeTrigger, telegramSendMessageAction], [edge1], null);
  
  const creationResult = await workflow.create();

  console.log("projectX before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("projectX after: " + workflow.getState());
}

projectX();