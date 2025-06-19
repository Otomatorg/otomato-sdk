import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, getTokenFromSymbol, convertToTokenUnitsFromSymbol, convertToTokenUnits, WORKFLOW_LOOPING_TYPES } from '../index.js';

export const WORKFLOW_TEMPLATES_TAGS = {
    NFTS: 'NFTs',
    SOCIALS: 'Socials',
    TRADING: 'Trading',
    ON_CHAIN_MONITORING: 'On-chain monitoring',
    YIELD: 'Yield',
    NOTIFICATIONS: 'notifications',
    ABSTRACT: 'Abstract',
    DEXES: 'Dexes',
    LENDING: 'Lending'
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

const createDCAFearAndGreed = async () => {
    // created with examples/UseCases/FearAndGreedDCA
    return Workflow.fromJSON({"id":null,"name":"Daily Fear & Greed-Based cbBTC Trading","state":"inactive","dateCreated":null,"dateModified":null,"executionId":null,"agentId":null,"nodes":[{"id":null,"ref":"1","blockId":18,"type":"trigger","state":"inactive","parameters":{"period":86400000,"timeout":null,"limit":30},"frontendHelpers":{},"position":{"x":400,"y":120}},{"id":null,"ref":"2","blockId":100015,"type":"action","state":"inactive","parameters":{"branchesAmount":2},"frontendHelpers":{},"position":{"x":400,"y":240}},{"id":null,"ref":"3","blockId":100016,"type":"action","state":"inactive","parameters":{"logic":"or","groups":[{"logic":"and","checks":[{"value1":"{{external.functions.btcFearAndGreed()}}","condition":"gt","value2":"80"}]}]},"frontendHelpers":{},"position":{"x":150,"y":360}},{"id":null,"ref":"4","blockId":100013,"type":"action","state":"inactive","parameters":{"chainId":8453,"tokenIn":"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf","tokenOut":"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913","amount":0.0001,"slippage":0.1},"frontendHelpers":{"output":{"amountIn":{"formatAmount":false,"erc20Token":{"contractAddress":"{{output.tokenIn}}","chainId":"{{parameters.chainId}}"}},"amountOut":{"formatAmount":false,"erc20Token":{"contractAddress":"{{output.tokenOut}}","chainId":"{{parameters.chainId}}"}}}},"position":{"x":150,"y":480}},{"id":null,"ref":"5","blockId":100016,"type":"action","state":"inactive","parameters":{"logic":"or","groups":[{"logic":"and","checks":[{"value1":"{{external.functions.btcFearAndGreed()}}","condition":"lt","value2":"20"}]}]},"frontendHelpers":{},"position":{"x":650,"y":360}},{"id":null,"ref":"6","blockId":100013,"type":"action","state":"inactive","parameters":{"chainId":8453,"tokenIn":"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913","tokenOut":"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf","amount":10,"slippage":0.3},"frontendHelpers":{"output":{"amountIn":{"formatAmount":false,"erc20Token":{"contractAddress":"{{output.tokenIn}}","chainId":"{{parameters.chainId}}"}},"amountOut":{"formatAmount":false,"erc20Token":{"contractAddress":"{{output.tokenOut}}","chainId":"{{parameters.chainId}}"}}}},"position":{"x":650,"y":480}}],"edges":[{"id":null,"source":"1","target":"2"},{"id":null,"source":"2","target":"3"},{"id":null,"source":"3","target":"4","label":"true","value":"true"},{"id":null,"source":"2","target":"5"},{"id":null,"source":"5","target":"6","label":"true","value":"true"}],"notes":[]});
}

const createETHFearAndGreedCapitalEfficientBuy = async () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX);

    trigger.setCondition('lt');
    trigger.setComparisonValue(45);
    trigger.setPosition(400, 120);

    const chain = CHAINS.BASE;
    const tokenIn = 'USDC';
    const tokenOut = 'WETH';
    const ionicWithdraw = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);
    ionicWithdraw.setChainId(chain);
    ionicWithdraw.setParams('asset', getTokenFromSymbol(chain, tokenIn).contractAddress);
    ionicWithdraw.setParams('amount', 10);
    ionicWithdraw.setPosition(400, 240);

    const odosAction = new Action(ACTIONS.CORE.SWAP.SWAP);
    odosAction.setChainId(chain);
    odosAction.setParams("tokenIn", getTokenFromSymbol(chain, tokenIn).contractAddress);
    odosAction.setParams("tokenOut", getTokenFromSymbol(chain, tokenOut).contractAddress);
    odosAction.setParams("amount", ionicWithdraw.getParameterVariableName('amount'));
    odosAction.setPosition(400, 360);

    const ionicDeposit = new Action(ACTIONS.LENDING.AAVE.SUPPLY);
    ionicDeposit.setChainId(chain);
    ionicDeposit.setParams('asset', getTokenFromSymbol(chain, tokenOut).contractAddress);
    ionicDeposit.setParams('amount', odosAction.getOutputVariableName('amountOut'));
    ionicDeposit.setPosition(400, 480);

    const edge1 = new Edge({ source: trigger, target: ionicWithdraw });
    const edge2 = new Edge({ source: ionicWithdraw, target: odosAction });
    const edge3 = new Edge({ source: odosAction, target: ionicDeposit });

    return new Workflow('Buy ETH when the market sentiment is extremely fearful - capital efficient', [trigger, odosAction, ionicWithdraw, ionicDeposit], [edge1, edge2, edge3]);
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

    trigger.setCondition('lte');
    trigger.setComparisonValue(0.001);
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", "The sUSDE is now negative. You're losing money by holding it.");
    notificationAction.setParams("subject", "sUSDE negative switch");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('sUSDE yield notification', [trigger, notificationAction], [edge]);
}

const createAAVEBorrowingRateNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.LENDING.AAVE.BORROWING_RATES);

    trigger.setCondition('gte');
    trigger.setComparisonValue(5);
    trigger.setChainId(CHAINS.BASE);
    trigger.setParams('asset', getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", "The USDC borrowing rate on AAVE is above 5%");
    notificationAction.setParams("subject", "AAVE rates increased!");

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('AAVE borrowing rate notification', [trigger, notificationAction], [edge]);
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

    return new Workflow('Get Notified When Ethereum Gas drops below 6 Gwei', [trigger, notificationAction], [edge]);
}

const dailyYieldEmail = async () => {
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams('period', 86400000)
    trigger.setParams('limit', 30)
    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", `Daily Yield Report 🚀

------------------      USDC     ------------------------

📍 On Base
    •   IONIC: {{external.functions.ionicLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)}}%
    •   AAVE: {{external.functions.aaveLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)}}%
    •   Compound: {{external.functions.compoundLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,0)}}%
    •   Ironclad: {{external.functions.ironcladLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)}}%
    •   Moonwell: {{external.functions.moonwellLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)}}%

------------------      ETH     ------------------------

📍 On Base
    •   IONIC: {{external.functions.ionicLendingRate(8453,0x4200000000000000000000000000000000000006)}}%
    •   AAVE: {{external.functions.aaveLendingRate(8453,0x4200000000000000000000000000000000000006)}}%
    •   Compound: {{external.functions.compoundLendingRate(8453,0x4200000000000000000000000000000000000006,0)}}%
    •   Ironclad: {{external.functions.ironcladLendingRate(8453,0x4200000000000000000000000000000000000006)}}%
    •   Moonwell: {{external.functions.moonwellLendingRate(8453,0x4200000000000000000000000000000000000006)}}%

The gas price on Ethereum is currently {{external.functions.mainnetGasPrice(,)}} gwei.

See you tomorrow!`);
    notificationAction.setParams("subject", "Daily yield updates");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('Daily yield updates', [trigger, notificationAction], [edge]);
}

const abstractGetNotifiedOnNewFlashBadge = async () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ABSTRACT_FLASH_BADGE);
    trigger.setCondition('neq');
    trigger.setComparisonValue('{{history.0.value}}');

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', 'A new flash badge is available on Abstract');

    const edge = new Edge({ source: trigger, target: telegramAction });

    return new Workflow('Get notified when a new flash badge is available on Abstract', [trigger, telegramAction], [edge]);
}

const abstractGetNotifiedWhenStreamerIsLive = async () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_STREAMER_LIVE);
    trigger.setParams('streamer', 'pudgyholder');
    trigger.setCondition('eq');
    trigger.setComparisonValue("true");

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', `${trigger.getParameterVariableName('streamer')} is live!\n https://portal.abs.xyz/stream/${trigger.getParameterVariableName('streamer')}`);

    const edge = new Edge({ source: trigger, target: telegramAction });

    return new Workflow('Get notified when a given streamer goes live', [trigger, telegramAction], [edge]);
}

// notify me when I can unstake my stakestone
const createStakestoneUnstakeNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.YIELD.STAKESTONE.LATEST_ROUND_ID);
    trigger.setParams('chainId', CHAINS.ETHEREUM);
    trigger.setParams('contractAddress', "0x8f88ae3798e8ff3d0e0de7465a0863c9bbb577f0");
    trigger.setCondition('gte');
    trigger.setComparisonValue('{{history.0.value}}');
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    notificationAction.setParams("message", "You can now unstake your Stakestone position!");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('Get notified when you can unstake your Stakestone position', [trigger, notificationAction], [edge]);
}

// notify me when a given uniswap position is out of range [looping enabled - 5 times]
const createUniswapPositionOutOfRangeNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.DEXES.UNISWAP.IS_IN_RANGE);
    trigger.setParams('chainId', CHAINS.ETHEREUM);
    // trigger.setParams('abiParams.tokenId', '');
    trigger.setCondition('eq');
    trigger.setParams('comparisonValue', false);
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    notificationAction.setParams("message", "Your Uniswap position is out of range!");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    const workflow = new Workflow('Get notified when a given uniswap position is out of range', [trigger, notificationAction], [edge]);
    workflow.setSettings({
      loopingType: WORKFLOW_LOOPING_TYPES.POLLING,
      period: 600000,
      limit: 5,
    });
    return workflow;
}

// notify me when Hyperlend raise their deposit cap for stHype [looping enabled - 10 times]
const createHyperLendDepositCapNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.SUPPLY_CAP);
    trigger.setParams('chainId', CHAINS.HYPER_EVM);
    trigger.setParams('asset', getTokenFromSymbol(CHAINS.HYPER_EVM, 'wstHYPE').contractAddress);
    trigger.setCondition('gt');
    trigger.setComparisonValue('{{history.0.value}}');
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    notificationAction.setParams("message", "Hyperlend has raised their deposit cap for stHype!");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    const workflow = new Workflow('Get notified when Hyperlend raise their deposit cap for stHype', [trigger, notificationAction], [edge]);
    workflow.setSettings({
      loopingType: WORKFLOW_LOOPING_TYPES.POLLING,
      period: 600000,
      limit: 10,
    });
    return workflow;
}

// Save all the current yields for USDC on base (AAVE, Compound, Moonwell & top 5 USDC morpho vault) every hour [repeat 100 times, every hour]
const createUSDCYieldsNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams('period', 3600000);
    trigger.setParams('limit', 100);
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.OTHERS.GSHEET.GSHEET);
    notificationAction.setParams("data", [
        ["aave", "moonwell", "compound", "Spark USDC Vault", "Moonwell Flagship USDC", "Seamless USDC Vault", "Steakhouse USDC", "Gauntlet USDC Prime"],
        [
            "{{external.functions.aaveLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,,)}}",
            "{{external.functions.moonwellLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,,)}}",
            "{{external.functions.compoundLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,,,)}}",
            "{{external.functions.morphoLendingRate(8453,0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A)}}",
            "{{external.functions.morphoLendingRate(8453,0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca)}}",
            "{{external.functions.morphoLendingRate(8453,0x616a4E1db48e22028f6bbf20444Cd3b8e3273738)}}",
            "{{external.functions.morphoLendingRate(8453,0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183)}}",
            "{{external.functions.morphoLendingRate(8453,0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61)}}"
        ]
    ]);
    // notificationAction.setParams("mode", "append");
    // notificationAction.setParams("role", "writer");
    // notificationAction.setParams("sheetId", "0");
    // notificationAction.setParams("spreadsheetId", "1NxqGqgtUQkojBOl9g7CBkbqc7bB6mBkZxHWMPsu1uQY");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('Save all the current yields for USDC on base (AAVE, Compound, Moonwell, Spark USDC Vault, Moonwell Flagship USDC, Seamless USDC Vault, Steakhouse USDC, Gauntlet USDC Prime) every hour', [trigger, notificationAction], [edge]);
}

// notify me when there are more than 50 ETH in available liquidity for instant withdrawal on Stakestone
const createStakestoneInstantWithdrawalNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.YIELD.STAKESTONE.STAKESTONE_VAULT_LIQUIDITY);
    trigger.setParams('chainId', CHAINS.ETHEREUM);
    trigger.setCondition('gt');
    trigger.setComparisonValue('50');
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    notificationAction.setParams("message", "There are more than 50 ETH in available liquidity for instant withdrawal on Stakestone!");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    return new Workflow('Get notified when there are more than 50 ETH in available liquidity for instant withdrawal on Stakestone', [trigger, notificationAction], [edge]);
}

// notify me when I receive USDC [looping enabled - 30 times]
const createUSDCReceiveNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setParams('chainId', CHAINS.BASE);
    trigger.setParams('contractAddress', getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress);
    // TODO: add smart account address
    trigger.setParams('abiParams.to', '{{smartAccountAddress}}');
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    notificationAction.setParams("message", "You received USDC!");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: notificationAction });

    const workflow = new Workflow('Get notified when I receive USDC', [trigger, notificationAction], [edge]);
    workflow.setSettings({
      loopingType: WORKFLOW_LOOPING_TYPES.SUBSCRIPTION,
      timeout: 600000,
      limit: 30,
    });
    return workflow;
const createEthereumFoundationTransferNotificationWorkflow = () => {
    const ethTransferTrigger = new Trigger(TRIGGERS.TOKENS.NATIVE_TRANSFER.ETH_TRANSFER);
    ethTransferTrigger.setChainId(CHAINS.ETHEREUM);
    ethTransferTrigger.setParams('wallet', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
    ethTransferTrigger.setParams('threshold', 0.004);
    ethTransferTrigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams(
      "body",
      `The Ethereum foundation has sold ${ethTransferTrigger.getOutputVariableName('amount')} ETH`
    );
    notificationAction.setParams("subject", "Ethereum foundation sells ETH");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: ethTransferTrigger, target: notificationAction });

    return new Workflow('Ethereum Foundation transfer notification', [ethTransferTrigger, notificationAction], [edge]);
}

export const WORKFLOW_TEMPLATES = [
    {
        'name': 'Get Notified When Ethereum Gas drops below 6 Gwei',
        'description': 'Receive an email alert when Ethereum gas prices fall below 6 gwei.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/gasMonitoring.jpg',
        'image': [
            TRIGGERS.TECHNICAL.GAS.GAS_API.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        'blockIDs': [
            TRIGGERS.TECHNICAL.GAS.GAS_API.blockId,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId
        ],
        createWorkflow: gasMonitoring
    },
    {
        'name': 'Daily yield updates',
        'description': 'Receive an email every day with a recap from all the money market yields for ETH and USDC & the current gas price.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
        'image': [
            TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        'blockIDs': [
            TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD.blockId,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId
        ],
        createWorkflow: dailyYieldEmail
    },
    {
        'name': 'Daily Fear & Greed-Based cbBTC Trading',
        'description': 'Automatically trade cbBTC daily based on the Fear & Greed Index—buy when low, sell when high.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.SOCIALS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dcaFearAndGreed.png',
        'image': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.image,
            ACTIONS.CORE.SWAP.SWAP.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.blockId,
            ACTIONS.CORE.SWAP.SWAP.blockId
        ],
        createWorkflow: createDCAFearAndGreed
    },
    {
        'name': 'Buy ETH when the market sentiment is extremely fearful - capital efficient',
        'description': 'Buy ETH when the Bitcoin Fear and Greed Index is below 45. The idle funds are generating yield on AAVE.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.SOCIALS, WORKFLOW_TEMPLATES_TAGS.YIELD],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/fearAndGreed2.png',
        'image': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.image,
            ACTIONS.LENDING.AAVE.WITHDRAW.image,
            ACTIONS.CORE.SWAP.SWAP.image,
            ACTIONS.LENDING.AAVE.SUPPLY.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.blockId,
            ACTIONS.LENDING.AAVE.WITHDRAW.blockId,
            ACTIONS.CORE.SWAP.SWAP.blockId,
            ACTIONS.LENDING.AAVE.SUPPLY.blockId
        ],
        createWorkflow: createETHFearAndGreedCapitalEfficientBuy
    },
    /*{
        'name': 'Buy sUSDE when the yield is above 20%',
        'description': 'Buy sUSDE when the yield is above 20%',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/buySusde.jpg',
        'image': [
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.image,
            ACTIONS.SWAP.ODOS.SWAP.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        'blockIDs': [
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.blockId,
            ACTIONS.SWAP.ODOS.SWAP.blockId,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId
        ],
        createWorkflow: createSUsdeYieldBuy
    },*/
    {
        'name': 'sUSDE yield notification',
        'description': 'Notify me when the sUSDe yield becomes negative',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/shortEna.jpg',
        'image': [
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        'blockIDs': [
            TRIGGERS.YIELD.ETHENA.SUSDE_YIELD.blockId,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId
        ],
        createWorkflow: createSusdeYieldNotification
    },
    {
        'name': 'MODE transfer notification',
        'description': 'Receive notifications when a top $MODE holder (0x74B8....C6B4) transfers $MODE',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/transfer-monitoring.png',
        'image': [
            TRIGGERS.TOKENS.TRANSFER.TRANSFER.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        'blockIDs': [
            TRIGGERS.TOKENS.TRANSFER.TRANSFER.blockId,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId
        ],
        createWorkflow: createModeTransferNotificationWorkflow
    },
    {
        'name': 'AAVE borrowing rate notification',
        'description': 'Notify me when the USDC borrowing rate on Base is above 5%',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS, WORKFLOW_TEMPLATES_TAGS.YIELD],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/shortEna.jpg',
        'image': [
            TRIGGERS.LENDING.AAVE.BORROWING_RATES.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        'blockIDs': [
            TRIGGERS.LENDING.AAVE.BORROWING_RATES.blockId,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId
        ],
        createWorkflow: createAAVEBorrowingRateNotificationWorkflow
    },
    {
        'name': 'Get notified when a new flash badge is available on Abstract',
        'description': 'Notify me when a new flash badge is available on Abstract',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ABSTRACT, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/abstract-flash-badge-noti.webp',
        'image': [
            TRIGGERS.SOCIALS.ABSTRACT.ABSTRACT_FLASH_BADGE.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.ABSTRACT.ABSTRACT_FLASH_BADGE.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: abstractGetNotifiedOnNewFlashBadge
    },
    {
        'name': 'Get notified when a given streamer goes live',
        'description': 'Notify me when a given streamer goes live',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ABSTRACT, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/abstract-streamer-live-noti.webp',
        'image': [
            TRIGGERS.SOCIALS.ABSTRACT.ON_STREAMER_LIVE.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.ABSTRACT.ON_STREAMER_LIVE.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: abstractGetNotifiedWhenStreamerIsLive
    },
    {
        name: 'When the Ethereum foundation sells ETH, notify me',
        description: 'Notify me when the Ethereum foundation (0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe) sells ETH',
        tags: [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS, WORKFLOW_TEMPLATES_TAGS.TRADING],
        thumbnail: 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/transfer-monitoring.png',
        image: [
            TRIGGERS.TOKENS.NATIVE_TRANSFER.ETH_TRANSFER.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        createWorkflow: createEthereumFoundationTransferNotificationWorkflow
    },
    /*{
        'name': 'Buy ETH when the market sentiment is extremely fearful',
        'description': 'Buy ETH when the Bitcoin Fear and Greed Index is below 30',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.SOCIALS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/fear_and_greed.jpg',
        'image': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.image,
            ACTIONS.SWAP.ODOS.SWAP.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.blockId,
            ACTIONS.SWAP.ODOS.SWAP.blockId
        ],
        createWorkflow: createETHFearAndGreedBuy
    },*/
    
    /*{
        'name': 'Copy-trade the trades done on Odos by vitalik.eth',
        'description': 'Buy 100$ of each token that vitalik.eth buys using Odos',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.TRADING],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/copyTrading.png',
        'image': [
            TRIGGERS.DEXES.ODOS.SWAP.image,
            ACTIONS.CORE.SWAP.SWAP.image,
        ],
        'blockIDs': [
            TRIGGERS.DEXES.ODOS.SWAP.blockId,
            ACTIONS.CORE.SWAP.SWAP.blockId,
        ],
        createWorkflow: copyTradeVitalikOdos
    },*/

    {
        'name': 'Get notified when you can unstake your Stakestone position',
        'description': 'Notify me when you can unstake your Stakestone position',
        'tags': [WORKFLOW_TEMPLATES_TAGS.YIELD, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
        'image': [
            TRIGGERS.YIELD.STAKESTONE.STAKESTONE_VAULT_LIQUIDITY.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.YIELD.STAKESTONE.STAKESTONE_VAULT_LIQUIDITY.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createStakestoneUnstakeNotificationWorkflow
    },
    {
        'name': 'Get notified when a given uniswap position is out of range',
        'description': 'Notify me when a given uniswap position is out of range',
        'tags': [WORKFLOW_TEMPLATES_TAGS.DEXES, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
        'image': [
            TRIGGERS.DEXES.UNISWAP.IS_IN_RANGE.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.DEXES.UNISWAP.IS_IN_RANGE.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createUniswapPositionOutOfRangeNotificationWorkflow
    },
    {
        'name': 'Get notified when Hyperlend raise their deposit cap for stHype',
        'description': 'Notify me when Hyperlend raise their deposit cap for stHype',
        'tags': [WORKFLOW_TEMPLATES_TAGS.LENDING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
        'image': [
            TRIGGERS.LENDING.HYPERLEND.SUPPLY_CAP.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.LENDING.HYPERLEND.SUPPLY_CAP.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createHyperLendDepositCapNotificationWorkflow
    },
    {
        'name': 'Get notified when there are more than 50 ETH in available liquidity for instant withdrawal on Stakestone',
        'description': 'Notify me when there are more than 50 ETH in available liquidity for instant withdrawal on Stakestone',
        'tags': [WORKFLOW_TEMPLATES_TAGS.YIELD, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
        'image': [
            TRIGGERS.YIELD.STAKESTONE.STAKESTONE_VAULT_LIQUIDITY.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.YIELD.STAKESTONE.STAKESTONE_VAULT_LIQUIDITY.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createStakestoneInstantWithdrawalNotificationWorkflow
    },
    {
        'name': 'Get notified when I receive USDC',
        'description': 'Notify me when I receive USDC',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
        'image': [
            TRIGGERS.TOKENS.TRANSFER.TRANSFER.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.TOKENS.TRANSFER.TRANSFER.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createUSDCReceiveNotificationWorkflow
    },
    {
      'name': 'Save all the current yields for USDC on base (AAVE, Compound, Moonwell, Spark USDC Vault, Moonwell Flagship USDC, Seamless USDC Vault, Steakhouse USDC, Gauntlet USDC Prime) every hour',
      'description': 'Save all the current yields for USDC on base (AAVE, Compound, Moonwell, Spark USDC Vault, Moonwell Flagship USDC, Seamless USDC Vault, Steakhouse USDC, Gauntlet USDC Prime) every hour',
      'tags': [WORKFLOW_TEMPLATES_TAGS.YIELD, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
      'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
      'image': [
          TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD.image,
          ACTIONS.OTHERS.GSHEET.GSHEET.image
      ],
      'blockIDs': [
          TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD.blockId,
          ACTIONS.OTHERS.GSHEET.GSHEET.blockId
      ],
      createWorkflow: createUSDCYieldsNotificationWorkflow
  },
];