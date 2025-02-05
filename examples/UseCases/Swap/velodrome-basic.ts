import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function velodrome() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Velodrome Concentrated Trigger --------
  const velodromeTrigger = new Trigger(
    TRIGGERS.DEXES.VELODROME.SWAP_IN_BASIC_POOL
  );
  velodromeTrigger.setChainId(
      CHAINS.MODE
  );
  velodromeTrigger.setParams(
      'contractAddress',
      '0x0fba984c97539B3fb49ACDA6973288D0EFA903DB'
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.WEBHOOK_URL);
  slackMessage.setParams('message', `Velodrome Basic: ${velodromeTrigger.getOutputVariableName('amount0In')} (amount0In) ${velodromeTrigger.getOutputVariableName('amount0Out')} (amount0Out) ${velodromeTrigger.getOutputVariableName('token0')} to ${velodromeTrigger.getOutputVariableName('amount1In')} (amount1In) ${velodromeTrigger.getOutputVariableName('amount1Out')} (amount1Out) ${velodromeTrigger.getOutputVariableName('token1')}`);

  const edge1 = new Edge({
    source: velodromeTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'Velodrome Basic Trigger',
    [
      velodromeTrigger,
      slackMessage,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log('Velodrome state before: ' + workflow.getState());

  console.log('Workflow ID: ' + workflow.id);

  const runResult = await workflow.run();

  console.log('velodrome state after: ' + workflow.getState());
}

velodrome();