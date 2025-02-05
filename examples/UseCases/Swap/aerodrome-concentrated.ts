import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function aerodrome() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Aerodrome Concentrated Trigger --------
  const aerodromeTrigger = new Trigger(
    TRIGGERS.DEXES.AERODROME.SWAP_IN_CONCENTRATED_POOL
  );
  aerodromeTrigger.setChainId(
      CHAINS.BASE
  );
  aerodromeTrigger.setParams(
      'contractAddress',
      '0xb2cc224c1c9feE385f8ad6a55b4d94E92359DC59'
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.WEBHOOK_URL);
  slackMessage.setParams('message', `Aerodrome Concentrated Swapped ${aerodromeTrigger.getOutputVariableName('amount0')} ${aerodromeTrigger.getOutputVariableName('token0')} to ${aerodromeTrigger.getOutputVariableName('amount1')} ${aerodromeTrigger.getOutputVariableName('token1')}`);

  const edge1 = new Edge({
    source: aerodromeTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'Aerodrome Concentrated Trigger',
    [
      aerodromeTrigger,
      slackMessage,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log('aerodrome state before: ' + workflow.getState());

  console.log('Workflow ID: ' + workflow.id);

  const runResult = await workflow.run();

  console.log('aerodrome state after: ' + workflow.getState());
}

aerodrome();