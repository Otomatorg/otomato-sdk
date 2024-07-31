import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, TOKENS } from '../src/index.js';

const main = async () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const transferAction = new Action(ACTIONS.TOKENS.ERC20.TRANSFER);

    transferAction.setChainId(CHAINS.ETHEREUM)
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDT').contractAddress);

    const edge1 = new Edge({source: transferTrigger, target: slackAction})
    const edge2 = new Edge({source: slackAction, target: transferAction})

    const workflow = new Workflow("", [transferAction, transferTrigger, slackAction], [edge1, edge2]);

    // console.log(slackAction.getSessionKeyPermissions());
    // console.log(transferAction.getSessionKeyPermissions());
    console.log(workflow.getSessionKeyPermissions());
}

main();