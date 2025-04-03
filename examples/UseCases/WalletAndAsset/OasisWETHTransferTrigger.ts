import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function oasis_weth_transfer() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Transfer trigger --------
  const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
  transferTrigger.setChainId(CHAINS.OASIS);
  transferTrigger.setParams(
    "contractAddress",
    getTokenFromSymbol(CHAINS.OASIS, "wROSE").contractAddress
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.SLACK_WEBHOOK);
  slackMessage.setParams('message', `Oasis WROSE Transfer: ${transferTrigger.getOutputVariableName('from')} to ${transferTrigger.getOutputVariableName('to')} ${transferTrigger.getOutputVariableName('value')} (value)`);


  const workflow = new Workflow(
    "Oasis WROSE Transfer",
    [
      transferTrigger,
      slackMessage
    ],
    [new Edge({
      source: transferTrigger,
      target: slackMessage,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Oasis WROSE Transfer before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Oasis WROSE Transfer after: " + workflow.getState());
}

oasis_weth_transfer();