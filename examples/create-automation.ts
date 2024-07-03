import { ACTIONS, Action, TRIGGERS, Trigger, Automation, CHAINS, getToken, Edge } from '../src/index.js';

const main = async () => {
    const usdcTransferTrigger = new Trigger({
        id: TRIGGERS.TOKENS.ERC20.TRANSFER.id,
        name: TRIGGERS.TOKENS.ERC20.TRANSFER.name,
        description: TRIGGERS.TOKENS.ERC20.TRANSFER.description,
        type: TRIGGERS.TOKENS.ERC20.TRANSFER.type,
        parameters: TRIGGERS.TOKENS.ERC20.TRANSFER.parameters,
        ref: 'n-1',
    });
    usdcTransferTrigger.setChainId(CHAINS.ETHEREUM);
    usdcTransferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    usdcTransferTrigger.setPosition(0, 0);

    const slackAction = new Action({
        id: ACTIONS.NOTIFICATIONS.SLACK.id,
        name: ACTIONS.NOTIFICATIONS.SLACK.name,
        description: ACTIONS.NOTIFICATIONS.SLACK.description,
        parameters: ACTIONS.NOTIFICATIONS.SLACK.parameters,
        // not forced to provide a ref id, it will generate it
    });
    slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    slackAction.setParams("text", "USDC has been transferred!");
    slackAction.setPosition(0, -10);

    const automation = new Automation("USDC Transfer Notification", [usdcTransferTrigger, slackAction]);

    const edge = new Edge({
        source: usdcTransferTrigger,
        target: slackAction,
    });

    automation.addEdge(edge);

    console.log(JSON.stringify(automation.toJSON(), null, 2));

    //await automation.save();
}

main();
