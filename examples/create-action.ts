import { ACTIONS, getToken, CHAINS, Action } from '../src/index.js';

const createAction = () => {
  // Create an ERC20 transfer action
  const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);
  transferAction.setChainId(CHAINS.ETHEREUM);
  transferAction.setParams("value", 1000);
  transferAction.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
  transferAction.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);

  console.log(transferAction.toJSON());

  // Create an SMS notification action
  const smsAction = new Action(ACTIONS.NOTIFICATIONS.DISCORD.SEND_MESSAGE);
  smsAction.setParams("phoneNumber", "+1234567890");
  smsAction.setParams("text", "This is a test message");

  console.log(smsAction.toJSON());

  // Create a Slack notification action
  const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
  slackAction.setParams("text", "This is a test message");

  console.log(slackAction.toJSON());
};

createAction();