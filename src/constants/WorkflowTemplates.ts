import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, getTokenFromSymbol } from '../index.js';

const createModeTransferNotificationWorkflow = () => {
    const modeTransferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);

    modeTransferTrigger.setChainId(CHAINS.MODE);
    modeTransferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'MODE').contractAddress);
    modeTransferTrigger.setParams('from', '0x74B847b308BD89Ef15639E6e4a2544E4b8b8C6B4');

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams("message", "0x74B8....C6B4 transferred $MODE");

    const edge = new Edge({ source: modeTransferTrigger, target: telegramAction });

    return new Workflow('MODE transfer notification', [modeTransferTrigger, telegramAction], [edge]);
}

const createETHFearAndGreedBuy = () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX);

    trigger.setCondition('lt');
    trigger.setComparisonValue(30);

    // todo: change to swap
    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams("message", "0x74B8....C6B4 transferred $MODE");

    const edge = new Edge({ source: trigger, target: telegramAction });

    return new Workflow('Buy ETH when the market sentiment is fearful', [trigger, telegramAction], [edge]);
}

export const WORKFLOW_TEMPLATES = [
    {
        'name': 'MODE transfer notification',
        'description': 'Receive notifications when a top $MODE holder (0x74B8....C6B4) transfers $MODE',
        createWorkflow: createModeTransferNotificationWorkflow
    },
    {
        'name': 'Buy ETH when the market sentiment is fearful',
        'description': 'Buy eth when the bitcoin fear and greed is below 30',
        createWorkflow: createETHFearAndGreedBuy
    },
]