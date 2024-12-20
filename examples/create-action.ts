import { ACTIONS, getTokenFromSymbol, CHAINS, Action, isAddress } from '../src/index.js';

const createAction = () => {
  // Create an ERC20 transfer action
  const transferAction = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
  transferAction.setChainId(CHAINS.ETHEREUM);
  transferAction.setParams("value", "1000n");
  transferAction.setParams("to", "0x888888888889758f76e7103c6cbf23abbf58f946");
  transferAction.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

  console.log(JSON.stringify(transferAction.toJSON()));

  // Create an SMS notification action
  const smsAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
  //smsAction.setParams("webhook", "https://url");
  //smsAction.setParams("message", "This is a test message");

  console.log(smsAction.toJSON());

  // Create a Slack notification action
  const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
  slackAction.setParams("message", "This is a test message");

  console.log(slackAction.toJSON());
  console.log(slackAction.parentInfo?.name);
};

createAction();