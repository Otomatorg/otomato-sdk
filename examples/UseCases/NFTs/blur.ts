import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function blur_trigger() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- X Trigger --------
  const blurTrigger = new Trigger(
    TRIGGERS.NFTS.BLUR.LISTING
  );
  blurTrigger.setParams(
      'contract',
      '0xbd3531da5cf5857e7cfaa92426877b022e612cf8'
  );
  blurTrigger.setParams(
      'price',
      '30'
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.WEBHOOK_URL);
  slackMessage.setParams('message', 'New blur listing just dropped: ' + blurTrigger.getOutputVariableName('imageUrl'));

  const edge1 = new Edge({
    source: blurTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'Blur Trigger',
    [
      blurTrigger,
      slackMessage,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log('blur_trigger state before: ' + workflow.getState());

  console.log('Workflow ID: ' + workflow.id);

  const runResult = await workflow.run();

  console.log('blur_trigger state after: ' + workflow.getState());
}

blur_trigger();