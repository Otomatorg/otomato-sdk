import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function x_trigger() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- X Trigger --------
  const xTrigger = new Trigger(
    TRIGGERS.SOCIALS.X.X_POST_TRIGGER
  );
  xTrigger.setParams(
      'username',
      'Cbb0fe'
  );
  xTrigger.setParams(
      'includeRetweets',
      'true'
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.WEBHOOK_URL);
  slackMessage.setParams('message', xTrigger.getOutputVariableName('account') + ' new tweet: ' + xTrigger.getOutputVariableName('tweetContent'));

  const edge1 = new Edge({
    source: xTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'X Trigger',
    [
      xTrigger,
      slackMessage,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log('x_trigger state before: ' + workflow.getState());

  console.log('Workflow ID: ' + workflow.id);

  const runResult = await workflow.run();

  console.log('x_trigger state after: ' + workflow.getState());
}

x_trigger();