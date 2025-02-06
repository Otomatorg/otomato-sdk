import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function aerodrome() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Aerodrome Concentrated Trigger --------
  const pendleTrigger = new Trigger(
    TRIGGERS.YIELD.PENDLE.PT_IMPLIED_YIELD
  );
  pendleTrigger.setChainId(
      CHAINS.ETHEREUM
  );
  pendleTrigger.setParams(
      'marketAddress',
      '0x34280882267ffa6383b363e278b027be083bbe3b'
  );
  pendleTrigger.setComparisonValue(1.5);
  pendleTrigger.setCondition('gt');

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.SLACK_WEBHOOK);
  slackMessage.setParams('message', `stETH PT yield (DEC 25, 2025): ${pendleTrigger.getOutputVariableName('ptImpliedYield')}`);

  const edge1 = new Edge({
    source: pendleTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'Pendle Trigger',
    [
      pendleTrigger,
      slackMessage,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log('pendle state before: ' + workflow.getState());

  console.log('Workflow ID: ' + workflow.id);

  const runResult = await workflow.run();

  console.log('pendle state after: ' + workflow.getState());
}

aerodrome();