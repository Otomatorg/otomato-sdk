import { ACTIONS, Action, TRIGGERS, Trigger, Automation, CHAINS, getToken } from '../src/index.js';

const main = async () => {
    const usdcTransferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    usdcTransferTrigger.setChainId(CHAINS.ETHEREUM);
    usdcTransferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    usdcTransferTrigger.setPosition(0, 0);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK);
    slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    slackAction.setParams("text", "USDC has been transferred!");
    slackAction.setPosition(0, -10);

    const automation = new Automation("USDC Transfer Notification", usdcTransferTrigger, [slackAction]);

    console.log(JSON.stringify(automation.toJSON(), null, 2));

    //await automation.save();
}

main();