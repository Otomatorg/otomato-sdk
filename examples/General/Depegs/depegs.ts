import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices, WORKFLOW_LOOPING_TYPES } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function depegs() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const depegsDepegsTrigger = new Trigger(TRIGGERS.TOKENS.DEPEGS.DEPEGS);
  depegsDepegsTrigger.setParams('condition', null);
  depegsDepegsTrigger.setParams('comparisonValue', null);
  depegsDepegsTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', `Your asset(s) got depegged: ${depegsDepegsTrigger.getOutputVariableName('depeggedAssets')}`);
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: depegsDepegsTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Get notified when an asset is depegged', [depegsDepegsTrigger, telegramSendMessageAction], [edge1], {
    loopingType: WORKFLOW_LOOPING_TYPES.POLLING,
    period: 28800000,
    limit: 1000
  });
  
  const creationResult = await workflow.create();

  console.log("Depegs before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Depegs after: " + workflow.getState());
}

depegs();