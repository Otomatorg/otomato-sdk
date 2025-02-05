import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function velodrome() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- X Trigger --------
  const velodromeTrigger = new Trigger(
    TRIGGERS.DEXES.VELODROME.SWAP_IN_CONCENTRATED_POOL
  );
  velodromeTrigger.setChainId(
      CHAINS.MODE
  );
  velodromeTrigger.setParams(
      'contractAddress',
      '0x3Adf15f77F2911f84b0FE9DbdfF43ef60D40012c'
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.WEBHOOK_URL);
  slackMessage.setParams('message', `Velodrome Concentrated Swapped ${velodromeTrigger.getOutputVariableName('amount0')} ${velodromeTrigger.getOutputVariableName('token0')} to ${velodromeTrigger.getOutputVariableName('amount1')} ${velodromeTrigger.getOutputVariableName('token1')}`);

  const edge1 = new Edge({
    source: velodromeTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'Velodrome Concentrated Trigger',
    [
      velodromeTrigger,
      slackMessage,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log('velodrome state before: ' + workflow.getState());

  console.log('Workflow ID: ' + workflow.id);

  const runResult = await workflow.run();

  console.log('velodrome state after: ' + workflow.getState());
}

velodrome();