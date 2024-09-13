import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, TOKENS } from '../src/index.js';

const main = async () => {
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    const transferAction = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    const ionicAction = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);

    ionicAction.setChainId(CHAINS.MODE);
    ionicAction.setParams('tokenToDeposit', getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);

    transferAction.setChainId(CHAINS.ETHEREUM)
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDT').contractAddress);

    const edge1 = new Edge({source: transferTrigger, target: slackAction})
    const edge2 = new Edge({source: slackAction, target: transferAction})
    const edge3 = new Edge({source: transferAction, target: ionicAction})

    const workflow = new Workflow("", [transferAction, transferTrigger, slackAction, ionicAction], [edge1, edge2, edge3]);

    // console.log(slackAction.getSessionKeyPermissions());
    // console.log(transferAction.getSessionKeyPermissions());
    console.log(await workflow.getSessionKeyPermissions());
}

main();