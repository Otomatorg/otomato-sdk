import { ACTIONS, Action, TRIGGERS, Trigger, Automation, CHAINS, getToken } from '../src/index.js';

const usdcTransferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
usdcTransferTrigger.setChainId(CHAINS.ETHEREUM);
usdcTransferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);

const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK);
slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
slackAction.setParams("text", "USDC has been transferred!");

const automation = new Automation("USDC Transfer Notification", usdcTransferTrigger, [slackAction]);

console.log(JSON.stringify(automation.toJSON(), null, 2));
