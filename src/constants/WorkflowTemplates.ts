import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, getTokenFromSymbol } from '../index.js';

export const WORKFLOW_TEMPLATES_TAGS = {
    NFTS: 'NFTs',
    SOCIALS: 'Socials',
    TRADING: 'Trading',
    ON_CHAIN_MONITORING: 'On-chain monitoring'
};

const createModeTransferNotificationWorkflow = () => {
    const modeTransferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);

    modeTransferTrigger.setChainId(CHAINS.MODE);
    modeTransferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'MODE').contractAddress);
    modeTransferTrigger.setParams('from', '0x74B847b308BD89Ef15639E6e4a2544E4b8b8C6B4');
    modeTransferTrigger.setPosition(400, 120);

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams("message", "0x74B8....C6B4 transferred $MODE");
    telegramAction.setPosition(400, 240);

    const edge = new Edge({ source: modeTransferTrigger, target: telegramAction });

    return new Workflow('MODE transfer notification', [modeTransferTrigger, telegramAction], [edge]);
}

const createETHFearAndGreedBuy = () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX);

    trigger.setCondition('lt');
    trigger.setComparisonValue(30);
    trigger.setPosition(400, 120);

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams("message", "The market sentiment is extremely fearful. Consider buying ETH.");
    telegramAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: telegramAction });

    return new Workflow('Buy ETH when the market sentiment is extremely fearful', [trigger, telegramAction], [edge]);
}

