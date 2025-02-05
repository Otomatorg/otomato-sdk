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
    TRIGGERS.DEXES.AERODROME.SWAP_IN_BASIC_POOL
  );
  aerodromeTrigger.setChainId(
      CHAINS.BASE
  );
  aerodromeTrigger.setParams(
      'contractAddress',
      '0x6cDcb1C4A4D1C3C6d054b27AC5B77e89eAFb971d'
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.WEBHOOK_URL);
  slackMessage.setParams('message', `Aerodrome Basic: ${aerodromeTrigger.getOutputVariableName('amount0In')} (amount0In) ${aerodromeTrigger.getOutputVariableName('amount0Out')} (amount0Out) ${aerodromeTrigger.getOutputVariableName('token0')} to ${aerodromeTrigger.getOutputVariableName('amount1In')} (amount1In) ${aerodromeTrigger.getOutputVariableName('amount1Out')} (amount1Out) ${aerodromeTrigger.getOutputVariableName('token1')}`);

  const edge1 = new Edge({
    source: aerodromeTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'Aerodrome Basic Trigger',
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