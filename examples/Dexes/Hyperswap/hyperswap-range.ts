import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hyperswap() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hyperswapIsInRangeTrigger = new Trigger(TRIGGERS.DEXES.HYPERSWAP.IS_IN_RANGE);
  hyperswapIsInRangeTrigger.setParams('chainId', 999);
  hyperswapIsInRangeTrigger.setParams('abiParams.tokenId', 146508);
  hyperswapIsInRangeTrigger.setParams('condition', 'eq');
  hyperswapIsInRangeTrigger.setParams('comparisonValue', false);
  hyperswapIsInRangeTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', `Hyperswap position with id ${hyperswapIsInRangeTrigger.getOutputVariableName('tokenId')} is out of range`);
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hyperswapIsInRangeTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Notify me when Hyperswap position with id #146508 is out of range', [hyperswapIsInRangeTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("hyperswap before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("hyperswap after: " + workflow.getState());
}

hyperswap();
