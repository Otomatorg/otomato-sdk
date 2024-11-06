import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, getTokenFromSymbol, convertToTokenUnitsFromSymbol, convertToTokenUnits } from '../index.js';

export const WORKFLOW_TEMPLATES_TAGS = {
    NFTS: 'NFTs',
    SOCIALS: 'Socials',
    TRADING: 'Trading',
    ON_CHAIN_MONITORING: 'On-chain monitoring',
    YIELD: 'Yield',
    NOTIFICATIONS: 'notifications'
};

const createModeTransferNotificationWorkflow = () => {
    const modeTransferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);

    modeTransferTrigger.setChainId(CHAINS.MODE);
    modeTransferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'MODE').contractAddress);
    modeTransferTrigger.setParams('from', '0x74B847b308BD89Ef15639E6e4a2544E4b8b8C6B4');
    modeTransferTrigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", "0x74B8....C6B4 transferred $MODE");
    notificationAction.setParams("subject", "$MODE transfer alert");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: modeTransferTrigger, target: notificationAction });

    return new Workflow('MODE transfer notification', [modeTransferTrigger, notificationAction], [edge]);
}

const createETHFearAndGreedBuy = async () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX);

    trigger.setCondition('lt');
    trigger.setComparisonValue(30);
    trigger.setPosition(400, 120);

    const odosAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
    const chain = CHAINS.MODE;
    odosAction.setChainId(chain);
    odosAction.setParams("tokenIn", getTokenFromSymbol(chain, 'USDC').contractAddress);
    odosAction.setParams("tokenOut", getTokenFromSymbol(chain, 'WETH').contractAddress);
    odosAction.setParams("amount", await convertToTokenUnitsFromSymbol(100, chain, 'USDC'));
    odosAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: odosAction });

    return new Workflow('Buy ETH when the market sentiment is extremely fearful', [trigger, odosAction], [edge]);
}

const createETHFearAndGreedCapitalEfficientBuy = async () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX);

    trigger.setCondition('lt');
    trigger.setComparisonValue(45);
    trigger.setPosition(400, 120);

    const chain = CHAINS.MODE;
    const tokenIn = 'USDC';
    const tokenOut = 'WETH';

    const ionicWithdraw = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);
    ionicWithdraw.setChainId(chain);
    ionicWithdraw.setParams('tokenToWithdraw', getTokenFromSymbol(chain, tokenIn).contractAddress);
    ionicWithdraw.setParams('amount', await convertToTokenUnitsFromSymbol(1, chain, tokenIn));
    ionicWithdraw.setPosition(400, 240);

    const odosAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
    odosAction.setChainId(chain);
    odosAction.setParams("tokenIn", getTokenFromSymbol(chain, tokenIn).contractAddress);
    odosAction.setParams("tokenOut", getTokenFromSymbol(chain, tokenOut).contractAddress);
    odosAction.setParams("amount", ionicWithdraw.getParameterVariableName('amount'));
    odosAction.setPosition(400, 360);

    const ionicDeposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
    ionicDeposit.setChainId(chain);
    ionicDeposit.setParams('tokenToDeposit', getTokenFromSymbol(chain, tokenOut).contractAddress);
    ionicDeposit.setParams('amount', odosAction.getOutputVariableName('amountOut'));
    ionicDeposit.setPosition(400, 480);

    const edge1 = new Edge({ source: trigger, target: ionicWithdraw });
    const edge2 = new Edge({ source: ionicWithdraw, target: odosAction });
    const edge3 = new Edge({ source: odosAction, target: ionicDeposit });

    return new Workflow('Fear and greed buy ETH (capital efficient)', [trigger, odosAction, ionicWithdraw, ionicDeposit], [edge1, edge2, edge3]);
}

const createSUsdeYieldBuy = async () => {
    const trigger = new Trigger(TRIGGERS.YIELD.ETHENA.SUSDE_YIELD);

    trigger.setCondition('gt');
    trigger.setComparisonValue(20);
    trigger.setPosition(400, 120);

    const odosAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
    const chain = CHAINS.MODE;
    odosAction.setChainId(chain);
    odosAction.setParams("tokenIn", getTokenFromSymbol(chain, 'USDC').contractAddress);
    odosAction.setParams("tokenOut", getTokenFromSymbol(chain, 'sUSDE').contractAddress);
    odosAction.setParams("amount", await convertToTokenUnitsFromSymbol(100, chain, 'USDC'));
    odosAction.setPosition(400, 240);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", "The sUSDE is now negative. You're losing money by holding it.");
    notificationAction.setParams("subject", "sUSDE negative switch");
    notificationAction.setPosition(400, 360);

    const edge = new Edge({ source: trigger, target: odosAction });
    const edge2 = new Edge({ source: odosAction, target: notificationAction });

    return new Workflow('Buy sUSDE when the yield is above 20%', [trigger, odosAction, notificationAction], [edge, edge2]);
}

const createSusdeYieldNotification = async () => {
    const trigger = new Trigger(TRIGGERS.YIELD.ETHENA.SUSDE_YIELD);

    trigger.setCondition('lt');
    trigger.setComparisonValue(0);
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", "The sUSDE is now negative. You're losing money by holding it.");
    notificationAction.setParams("subject", "sUSDE negative switch");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('sUSDE yield notification', [trigger, notificationAction], [edge]);
}

const ionicDepositIfYieldIsHigh = async () => {
    const trigger = new Trigger(TRIGGERS.LENDING.IONIC.LENDING_RATE);

    const tokenIn = (await getTokenFromSymbol(CHAINS.MODE, 'USDT')).contractAddress;

    trigger.setCondition('gte');
    trigger.setComparisonValue(10);
    trigger.setChainId(CHAINS.MODE);
    trigger.setParams('token', tokenIn);
    trigger.setPosition(400, 120);

    const ionicDeposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
    ionicDeposit.setChainId(CHAINS.MODE);
    ionicDeposit.setParams('tokenToDeposit', tokenIn);
    ionicDeposit.setParams('amount', await convertToTokenUnits(1, CHAINS.MODE, tokenIn));
    ionicDeposit.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: ionicDeposit });

    return new Workflow('Deposit USDT on Ionic if yield > 10% APY', [trigger, ionicDeposit], [edge]);
}

const ionicWithdrawIfYieldIsLow = async () => {
    const trigger = new Trigger(TRIGGERS.LENDING.IONIC.LENDING_RATE);

    const tokenIn = (await getTokenFromSymbol(CHAINS.MODE, 'USDC')).contractAddress;

    trigger.setCondition('lte');
    trigger.setComparisonValue(4);
    trigger.setChainId(CHAINS.MODE);
    trigger.setParams('token', tokenIn);
    trigger.setPosition(400, 120);

    const ionicWithdraw = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);
    ionicWithdraw.setChainId(CHAINS.MODE);
    ionicWithdraw.setParams('tokenToWithdraw', tokenIn);
    ionicWithdraw.setParams('amount', await convertToTokenUnits(1, CHAINS.MODE, tokenIn));
    ionicWithdraw.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: ionicWithdraw });

    return new Workflow('Withdraw USDC from Ionic if yield < 4% APY', [trigger, ionicWithdraw], [edge]);
}

const copyTradeVitalikOdos = async () => {
    const trigger = new Trigger(TRIGGERS.DEXES.ODOS.SWAP);

    trigger.setChainId(CHAINS.MODE);
    trigger.setParams('sender', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
    trigger.setPosition(400, 120);

    const tokenIn = (await getTokenFromSymbol(CHAINS.MODE, 'USDC')).contractAddress;

    const swap = new Action(ACTIONS.CORE.SWAP.SWAP);
    swap.setChainId(CHAINS.MODE);
    swap.setParams('tokenIn', tokenIn);
    swap.setParams('tokenOut', trigger.getOutputVariableName('outputToken'));
    swap.setParams('amount', await convertToTokenUnits(1, CHAINS.MODE, tokenIn));
    swap.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: swap });

    return new Workflow('Copy-trade the trades done on Odos by vitalik.eth', [trigger, swap], [edge]);
}

const gasMonitoring = async () => {
    const trigger = new Trigger(TRIGGERS.TECHNICAL.GAS.GAS_API);

    trigger.setComparisonValue(6);
    trigger.setCondition('lt');
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", "Ethereum gas prices have dropped below 6 gwei. Consider making transactions now.");
    notificationAction.setParams("subject", "Ethereum Gas Price Alert: Below 6 Gwei");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('Get notified when the gas price on Ethereum drops below 6 gwei', [trigger, notificationAction], [edge]);
}

export const WORKFLOW_TEMPLATES = [
    {
        'name': 'MODE transfer notification',
        'description': 'Receive notifications when a top $MODE holder (0x74B8....C6B4) transfers $MODE',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/transfer-monitoring.png',
        'image': [
            TRIGGERS.TOKENS.TRANSFER.TRANSFER.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        createWorkflow: createModeTransferNotificationWorkflow
    },
    {
        'name': 'Buy ETH when the market sentiment is extremely fearful',
        'description': 'Buy ETH when the Bitcoin Fear and Greed Index is below 30',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.SOCIALS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/fear_and_greed.jpg',
        'image': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.image,
            ACTIONS.SWAP.ODOS.SWAP.image
        ],
        createWorkflow: createETHFearAndGreedBuy
    },
    {
        'name': 'Buy ETH when the market sentiment is extremely fearful - capital efficient',
        'description': 'Buy ETH when the Bitcoin Fear and Greed Index is below 45. The idle funds are generating yield on Ionic.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.SOCIALS, WORKFLOW_TEMPLATES_TAGS.YIELD],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/fearAndGreed2.png',
        'image': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.image,
            ACTIONS.LENDING.IONIC.WITHDRAW.image,
            ACTIONS.SWAP.ODOS.SWAP.image,
            ACTIONS.LENDING.IONIC.DEPOSIT.image
        ],
        createWorkflow: createETHFearAndGreedCapitalEfficientBuy
    },
    {
        'name': 'Buy sUSDE when the yield is above 20%',
        'description': 'Buy sUSDE when the yield is above 20%',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/buySusde.jpg',
        'image': [
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.image,
            ACTIONS.SWAP.ODOS.SWAP.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        createWorkflow: createSUsdeYieldBuy
    },
    {
        'name': 'sUSDE yield notification',
        'description': 'Notify me when the sUSDe yield becomes negative',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/shortEna.jpg',
        'image': [
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        createWorkflow: createSusdeYieldNotification
    },
    {
        'name': 'Deposit USDT on Ionic if yield > 10% APY',
        'description': 'Deposit USDT on Ionic if the yield gets above 10%',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.YIELD],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/ionic_10.jpg',
        'image': [
            TRIGGERS.LENDING.IONIC.LENDING_RATE.image,
            ACTIONS.LENDING.IONIC.DEPOSIT.image,
        ],
        createWorkflow: ionicDepositIfYieldIsHigh
    },
    {
        'name': 'Withdraw USDC from Ionic if yield < 4% APY',
        'description': 'Withdraw USDC from Ionic if the yield gets below 4%',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.YIELD],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/yield_4.png',
        'image': [
            TRIGGERS.LENDING.IONIC.LENDING_RATE.image,
            ACTIONS.LENDING.IONIC.WITHDRAW.image,
        ],
        createWorkflow: ionicWithdrawIfYieldIsLow
    },
    {
        'name': 'Copy-trade the trades done on Odos by vitalik.eth',
        'description': 'Buy 100$ of each token that vitalik.eth buys using Odos',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.TRADING],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/copyTrading.png',
        'image': [
            TRIGGERS.DEXES.ODOS.SWAP.image,
            ACTIONS.CORE.SWAP.SWAP.image,
        ],
        createWorkflow: copyTradeVitalikOdos
    },
    {
        'name': 'Get Notified When Ethereum Gas is Below 6 Gwei',
        'description': 'Receive an email alert when Ethereum gas prices fall below 6 gwei.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/gasMonitoring.jpg',
        'image': [
            TRIGGERS.TECHNICAL.GAS.GAS_API,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        createWorkflow: gasMonitoring
    }
];