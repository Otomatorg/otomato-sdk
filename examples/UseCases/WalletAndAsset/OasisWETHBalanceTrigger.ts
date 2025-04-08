import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function oasis_weth_transfer() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Balance trigger --------
  const balanceTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE);
  balanceTrigger.setChainId(CHAINS.OASIS);
  balanceTrigger.setParams(
    "contractAddress",
    getTokenFromSymbol(CHAINS.OASIS, "WETH").contractAddress
  );

  const wallet = '0xEaFB04B5d4fB753c32DBb2eC32B3bF7CdC7f5144'
  balanceTrigger.setParams(
    "abiParams.account",
    wallet
  );

  balanceTrigger.setCondition('gte');

  balanceTrigger.setComparisonValue(
    0
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.SLACK_WEBHOOK);
  slackMessage.setParams('message', `Oasis WETH Balance of ${wallet} is ${balanceTrigger.getOutputVariableName('balance')} (balance)`);


  const workflow = new Workflow(
    "Oasis WETH Balance",
    [
      balanceTrigger,
      slackMessage
    ],
    [new Edge({
      source: balanceTrigger,
      target: slackMessage,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Oasis WETH Balance before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Oasis WETH Balance after: " + workflow.getState());
}

oasis_weth_transfer();