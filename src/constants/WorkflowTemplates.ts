import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, getTokenFromSymbol, convertToTokenUnitsFromSymbol, convertToTokenUnits, WORKFLOW_LOOPING_TYPES, LOGIC_OPERATORS, ConditionGroup } from '../index.js';

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
    const cbBTCTransferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);

    cbBTCTransferTrigger.setChainId(CHAINS.BASE);
    cbBTCTransferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.BASE, 'cbBTC').contractAddress);
    cbBTCTransferTrigger.setParams('from', '0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb');
    cbBTCTransferTrigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
    notificationAction.setParams("body", "0xbbbb....ffcb transferred cbBTC");
    notificationAction.setParams("subject", "cbBTC transfer alert");
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: cbBTCTransferTrigger, target: notificationAction });

    return new Workflow('cbBTC transfer notification', [cbBTCTransferTrigger, notificationAction], [edge]);
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
    return Workflow.fromJSON({ "id": null, "name": "Daily Fear & Greed-Based cbBTC Trading", "state": "inactive", "dateCreated": null, "dateModified": null, "executionId": null, "agentId": null, "nodes": [{ "id": null, "ref": "1", "blockId": 18, "type": "trigger", "state": "inactive", "parameters": { "period": 86400000, "timeout": null, "limit": 30 }, "frontendHelpers": {}, "position": { "x": 400, "y": 120 } }, { "id": null, "ref": "2", "blockId": 100015, "type": "action", "state": "inactive", "parameters": { "branchesAmount": 2 }, "frontendHelpers": {}, "position": { "x": 400, "y": 240 } }, { "id": null, "ref": "3", "blockId": 100016, "type": "action", "state": "inactive", "parameters": { "logic": "or", "groups": [{ "logic": "and", "checks": [{ "value1": "{{external.functions.btcFearAndGreed()}}", "condition": "gt", "value2": "80" }] }] }, "frontendHelpers": {}, "position": { "x": 150, "y": 360 } }, { "id": null, "ref": "4", "blockId": 100013, "type": "action", "state": "inactive", "parameters": { "chainId": 8453, "tokenIn": "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf", "tokenOut": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", "amount": 0.0001, "slippage": 0.1 }, "frontendHelpers": { "output": { "amountIn": { "formatAmount": false, "erc20Token": { "contractAddress": "{{output.tokenIn}}", "chainId": "{{parameters.chainId}}" } }, "amountOut": { "formatAmount": false, "erc20Token": { "contractAddress": "{{output.tokenOut}}", "chainId": "{{parameters.chainId}}" } } } }, "position": { "x": 150, "y": 480 } }, { "id": null, "ref": "5", "blockId": 100016, "type": "action", "state": "inactive", "parameters": { "logic": "or", "groups": [{ "logic": "and", "checks": [{ "value1": "{{external.functions.btcFearAndGreed()}}", "condition": "lt", "value2": "20" }] }] }, "frontendHelpers": {}, "position": { "x": 650, "y": 360 } }, { "id": null, "ref": "6", "blockId": 100013, "type": "action", "state": "inactive", "parameters": { "chainId": 8453, "tokenIn": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", "tokenOut": "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf", "amount": 10, "slippage": 0.3 }, "frontendHelpers": { "output": { "amountIn": { "formatAmount": false, "erc20Token": { "contractAddress": "{{output.tokenIn}}", "chainId": "{{parameters.chainId}}" } }, "amountOut": { "formatAmount": false, "erc20Token": { "contractAddress": "{{output.tokenOut}}", "chainId": "{{parameters.chainId}}" } } } }, "position": { "x": 650, "y": 480 } }], "edges": [{ "id": null, "source": "1", "target": "2" }, { "id": null, "source": "2", "target": "3" }, { "id": null, "source": "3", "target": "4", "label": "true", "value": "true" }, { "id": null, "source": "2", "target": "5" }, { "id": null, "source": "5", "target": "6", "label": "true", "value": "true" }], "notes": [] });
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

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', `${trigger.getParameterVariableName('streamer')} is live!\n https://portal.abs.xyz/stream/${trigger.getParameterVariableName('streamer')}`);

    const edge = new Edge({ source: trigger, target: telegramAction });

    return new Workflow('Get notified when a given streamer goes live', [trigger, telegramAction], [edge]);
}

const abstractGetNotifiedOnNewAppRelease = async () => {
    const trigger1 = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_NEW_APP_RELEASE);
    trigger1.setParams('category', 'gaming');
    trigger1.setIsOptional(true); // that's a OR logic between triggers

    const trigger2 = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_NEW_APP_RELEASE);
    trigger2.setParams('category', 'social');
    trigger2.setIsOptional(true); // that's a OR logic between triggers

    const trigger3 = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_NEW_APP_RELEASE);
    trigger3.setParams('category', 'trading');
    trigger3.setIsOptional(true); // that's a OR logic between triggers

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', `A new app is available on Abstract`);

    const edge = new Edge({ source: trigger1, target: telegramAction });
    const edge2 = new Edge({ source: trigger2, target: telegramAction });
    const edge3 = new Edge({ source: trigger3, target: telegramAction });

    return new Workflow('Get notified when a new app is available on Abstract', [trigger1, trigger2, trigger3, telegramAction], [edge, edge2, edge3]);
}

const abstractGetNotifiedOnNewUserBadge = async () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_USERS_NEW_BADGE);
    trigger.setParams('walletAddress', "0xbad61ce35c1a02fc59cb690bcde3631083738f8b");

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', `Insider got a new badge ${trigger.getOutputVariableName('newBadges')}`);

    const edge = new Edge({ source: trigger, target: telegramAction });

    return new Workflow('Get notified when a new badge is available on Abstract', [trigger, telegramAction], [edge]);
}

// notify me when I can unstake my stakestone
const createStakestoneUnstakeNotificationWorkflow = async () => {
    const trigger = new Trigger(TRIGGERS.YIELD.STAKESTONE.LATEST_ROUND_ID);
    trigger.setParams('chainId', CHAINS.ETHEREUM);
    trigger.setParams('contractAddress', "0x8f88ae3798e8ff3d0e0de7465a0863c9bbb577f0");
    trigger.setCondition('neq');
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
    const trigger = new Trigger(TRIGGERS.DEXES.UNISWAP.IS_IN_RANGE_V4);
    trigger.setParams('chainId', CHAINS.ETHEREUM);
    trigger.setCondition('eq');
    trigger.setParams('comparisonValue', false);
    trigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    notificationAction.setParams("message", "Your Uniswap position is out of range! https://app.uniswap.org/positions");
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
const createUSDCYieldsStorageWorkflow = async () => {
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
    notificationAction.setParams("mode", "append");
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
        timeout: 31536000000,
        limit: 30,
    });
    return workflow;
}

const createEthereumFoundationTransferNotificationWorkflow = () => {
    const ethTransferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.NATIVE_TRANSFER);
    ethTransferTrigger.setChainId(CHAINS.ETHEREUM);
    ethTransferTrigger.setParams('wallet', '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
    ethTransferTrigger.setParams('threshold', 0.004);
    ethTransferTrigger.setPosition(400, 120);

    const notificationAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    notificationAction.setParams("message", `The Ethereum foundation has sold ${ethTransferTrigger.getOutputVariableName('amount')} ETH`);
    notificationAction.setPosition(400, 240);

    const edge = new Edge({ source: ethTransferTrigger, target: notificationAction });

    return new Workflow('Ethereum Foundation transfer notification', [ethTransferTrigger, notificationAction], [edge]);
}

const createHyperliquidBTCSpotNPerpsThresholdNotificationWorkflow = () => {
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams('period', 3600000); // 1 hour
    trigger.setParams('limit', 10000);
    trigger.setPosition(400, 120);

    const mathAction = new Action(ACTIONS.CORE.MATHEMATICS.MATHEMATICS);
    mathAction.setParams('operator', '/');
    mathAction.setParams('number1', '{{external.functions.hyperliquidSpotPrice(999,UBTC,,)}}');
    mathAction.setParams('number2', '{{external.functions.hyperliquidPerpsPrice(999,BTC,,)}}');
    mathAction.setPosition(400, 240);

    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.OR);
    group.addConditionCheck(mathAction.getOutputVariableName('resultAsFloat'), 'gt', '1.0015');
    group.addConditionCheck(mathAction.getOutputVariableName('resultAsFloat'), 'lt', '0.9985');
    condition.setParams('groups', [group]);
    condition.setPosition(400, 360);

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', 'The difference between BTC spot and perpetual prices exceeds 0.15%.');
    telegramAction.setPosition(400, 480);

    const edge = new Edge({ source: trigger, target: mathAction });
    const edge2 = new Edge({ source: mathAction, target: condition });
    const edge3 = new Edge({ source: condition, target: telegramAction });

    return new Workflow('Get notified when the difference between BTC spot and perpetual prices exceeds 0.15%', [trigger, mathAction, condition, telegramAction], [edge, edge2, edge3]);
}

const createDefillamaRaiseNotificationWorkflow = () => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.DEFILLAMA.ON_NEW_RAISE);
    trigger.setPosition(400, 120);

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', `New raise detected on Defillama: ${trigger.getOutputVariableName('newRaises')}`);
    telegramAction.setPosition(400, 360);

    const edge1 = new Edge({ source: trigger, target: telegramAction });

    const workflow = new Workflow(
        'Get notified when a project announces a new raise',
        [trigger, telegramAction],
        [edge1]
    );

    return workflow;
};

const createTokenMovementNotificationWorkflow = () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE_MOVEMENT);
    // trigger.setParams('walletAddress', '{{smartAccountAddress}}');
    trigger.setPosition(400, 120);

    const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
    telegramAction.setParams('message', trigger.getOutputVariableName('balanceChanges'));
    telegramAction.setPosition(400, 240);

    const edge = new Edge({ source: trigger, target: telegramAction });

    const workflow = new Workflow(
        'Token Movement Notification',
        [trigger, telegramAction],
        [edge]
    );

    return workflow;
};

const createTwitterAiNotificationWorkflow = (username: { display: string, tag: string }, wfData: { prompt: string, notification: string, wfTitle: string }) => {
    return () => {
        const trigger = new Trigger(TRIGGERS.SOCIALS.X.X_POST_TRIGGER);
        trigger.setParams('username', username.tag);
        trigger.setPosition(400, 120);

        const aiAction = new Action(ACTIONS.AI.AI.AI);
        aiAction.setParams('prompt', `Return true if ${wfData.prompt}`);
        aiAction.setParams('context', trigger.getOutputVariableName('tweetContent'));
        aiAction.setPosition(400, 240);

        const ifAction = new Action(ACTIONS.CORE.CONDITION.IF);
        ifAction.setParams('logic', LOGIC_OPERATORS.OR);
        const group = new ConditionGroup(LOGIC_OPERATORS.OR);
        group.addConditionCheck(aiAction.getOutputVariableName('result'), 'eq', 'true');
        ifAction.setParams('groups', [group]);
        ifAction.setPosition(400, 360);

        const telegramAction = new Action(ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE);
        telegramAction.setParams('message', wfData.notification);
        telegramAction.setPosition(400, 480);

        const edge = new Edge({ source: trigger, target: aiAction });
        const edge2 = new Edge({ source: aiAction, target: ifAction });
        const edge3 = new Edge({ source: ifAction, target: telegramAction, label: 'true', value: true });

        const workflow = new Workflow(
            wfData.wfTitle,
            [trigger, aiAction, ifAction, telegramAction],
            [edge, edge2, edge3]
        );

        return workflow;
    }
}

const createTwitterAiNotificationTemplate = (username: { display: string, tag: string }, wfData: { prompt: string, notification: string, wfTitle: string, description: string }, thumbnail: string) => {
    return {
        'name': wfData.wfTitle,
        'description': wfData.description,
        'tags': [WORKFLOW_TEMPLATES_TAGS.SOCIALS, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': thumbnail,
        'image': [
            TRIGGERS.SOCIALS.X.image,
            ACTIONS.AI.AI.image,
            ACTIONS.CORE.CONDITION.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.X.X_POST_TRIGGER.blockId,
            ACTIONS.AI.AI.AI.blockId,
            ACTIONS.CORE.CONDITION.IF.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createTwitterAiNotificationWorkflow(username, wfData)
    }
}


const createBuyBitcoinOnPeterSchiffBearishWorkflow = (): Workflow => {
    const trigger = new Trigger(TRIGGERS.SOCIALS.X.X_POST_TRIGGER);
    trigger.setParams('username', 'PeterSchiff');
    trigger.setPosition(400, 120);

    const aiAction = new Action(ACTIONS.AI.AI.AI);
    aiAction.setParams('prompt', `Return true if the tweet is negative, bearish, or critical about Bitcoin in any way.`);
    aiAction.setParams('context', trigger.getOutputVariableName('tweetContent'));
    aiAction.setPosition(400, 240);

    const ifAction = new Action(ACTIONS.CORE.CONDITION.IF);
    ifAction.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.OR);
    group.addConditionCheck(aiAction.getOutputVariableName('result'), 'eq', 'true');
    ifAction.setParams('groups', [group]);
    ifAction.setPosition(400, 360);

    const swapAction = new Action(ACTIONS.CORE.SWAP.SWAP);
    swapAction.setChainId(CHAINS.BASE);
    swapAction.setParams('tokenIn', getTokenFromSymbol(8453, 'USDC').contractAddress);
    swapAction.setParams('tokenOut', getTokenFromSymbol(8453, 'cbBTC').contractAddress);
    swapAction.setPosition(400, 480);

    const edge = new Edge({ source: trigger, target: aiAction });
    const edge2 = new Edge({ source: aiAction, target: ifAction });
    const edge3 = new Edge({ source: ifAction, target: swapAction, label: 'true', value: true });

    const workflow = new Workflow(
        `Buy cbBTC when PeterSchiff tweets a bearish tweet`,
        [trigger, aiAction, ifAction, swapAction],
        [edge, edge2, edge3]
    );

    return workflow;
}

const createWithdrawOnAaveHackWorkflow = (): Workflow => {
    // Trigger 1: AAVE tweets about being hacked
    const aaveTrigger = new Trigger(TRIGGERS.SOCIALS.X.X_POST_TRIGGER);
    aaveTrigger.setParams('username', 'aave');
    aaveTrigger.setPosition(400, 120);

    // Trigger 2: lookonchain tweets about AAVE being hacked
    const lookonchainTrigger = new Trigger(TRIGGERS.SOCIALS.X.X_POST_TRIGGER);
    lookonchainTrigger.setParams('username', 'lookonchain');
    lookonchainTrigger.setPosition(800, 120);

    const aiAction = new Action(ACTIONS.AI.AI.AI);
    aiAction.setParams('prompt', `Return true if this tweet mentions AAVE being hacked or exploited`);
    aiAction.setParams('context', lookonchainTrigger.getOutputVariableName('tweetContent'));
    aiAction.setPosition(800, 240);

    // IF condition: either AAVE or lookonchain AI detects hack
    const ifAction = new Action(ACTIONS.CORE.CONDITION.IF);
    ifAction.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.OR);
    group.addConditionCheck(aiAction.getOutputVariableName('result'), 'eq', 'true');
    ifAction.setParams('groups', [group]);
    ifAction.setPosition(600, 360);

    // Withdraw action
    const withdrawAction = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);

    withdrawAction.setPosition(600, 480);

    // Edges
    const edge1 = new Edge({ source: aaveTrigger, target: aiAction });
    const edge2 = new Edge({ source: lookonchainTrigger, target: aiAction });
    const edge3 = new Edge({ source: aiAction, target: ifAction });
    const edge5 = new Edge({ source: ifAction, target: withdrawAction, label: 'true', value: true });

    const workflow = new Workflow(
        `Withdraw liquidity from AAVE if hack is detected via AAVE or lookonchain tweets`,
        [aaveTrigger, lookonchainTrigger, aiAction, ifAction, withdrawAction],
        [edge1, edge2, edge3, edge5]
    );

    return workflow;
}

export const WORKFLOW_TEMPLATES = [
    {
        'name': 'Instantly withdraw liquidity from AAVE if a hack is detected',
        'description': 'Instantly withdraw liquidity from AAVE if a hack is announced on Twitter either via AAVE\'s official account or by lookonchain',
        'tags': [WORKFLOW_TEMPLATES_TAGS.LENDING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/aave.webp',
        'image': [
            TRIGGERS.SOCIALS.X.X_POST_TRIGGER.image,
            ACTIONS.AI.AI.image,
            ACTIONS.CORE.CONDITION.image,
            ACTIONS.LENDING.AAVE.WITHDRAW.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.X.X_POST_TRIGGER.blockId,
            ACTIONS.AI.AI.AI.blockId,
            ACTIONS.CORE.CONDITION.IF.blockId,
            ACTIONS.LENDING.AAVE.WITHDRAW.blockId
        ],
        createWorkflow: createWithdrawOnAaveHackWorkflow
    },
    {
        'name': 'Get notified when a given uniswap position is out of range',
        'description': 'Notify me when a given uniswap position is out of range! https://app.uniswap.org/positions',
        'tags': [WORKFLOW_TEMPLATES_TAGS.DEXES, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/uniswap_template.webp',
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
    createTwitterAiNotificationTemplate(
        { display: 'Hyperliquid', tag: 'HyperliquidX' },
        {
            prompt: 'the tweet mentions or hints about a season 2, an airdrop, a liquidity mining campaign, points for trading or using the HyperEVM, or any trading incentives in $Hype',
            notification: 'Hyperliquid announces either a season 2, an airdrop, a liquidity mining or incentives',
            description: 'Get notified when Hyperliquid announces an aidrop',
            wfTitle: 'Get notified when Hyperliquid announces a season 2 or something similar (airdrop, liquidity mining, points, incentives)',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/hyperliquid_template.webp',
    ),
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
        'name': 'When the Ethereum foundation sells ETH, notify me',
        'description': 'Notify me when the Ethereum foundation (0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe) sells ETH',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS, WORKFLOW_TEMPLATES_TAGS.TRADING],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/eth-foundation.webp',
        'image': [
            TRIGGERS.TOKENS.TRANSFER.NATIVE_TRANSFER.image,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.image
        ],
        'blockIDs': [
            TRIGGERS.TOKENS.TRANSFER.NATIVE_TRANSFER.blockId,
            ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId
        ],
        createWorkflow: createEthereumFoundationTransferNotificationWorkflow
    },
    {
        'name': 'Receive alerts for wallet activity',
        'description': 'Get notified when a given wallet receives or sends any token on any chain',
        'tags': [WORKFLOW_TEMPLATES_TAGS.SOCIALS, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/transfer_alert.webp',
        'image': [
            TRIGGERS.TOKENS.BALANCE.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.image
        ],
        'blockIDs': [
            TRIGGERS.TOKENS.BALANCE.BALANCE_MOVEMENT.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createTokenMovementNotificationWorkflow
    },
    createTwitterAiNotificationTemplate(
        { display: 'saylor', tag: 'saylor' },
        {
            prompt: 'the tweet announces that Microstrategy acquired more bitcoin',
            notification: 'saylor announces that Microstrategy acquired more bitcoin',
            description: 'Get notified when saylor announces that Microstrategy acquired more bitcoin',
            wfTitle: 'Get notified when saylor announces that Microstrategy acquired more bitcoin',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/microstrategy.webp'
    ),
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
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/ethena.webp',
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
        'name': 'AAVE borrowing rate notification',
        'description': 'Notify me when the USDC borrowing rate on Base is above 5%',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS, WORKFLOW_TEMPLATES_TAGS.YIELD],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/aave.webp',
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
        'name': 'Get notified when a new app is listed on the abstract portal',
        'description': 'Notify me when a new app is listed on the abstract portal',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ABSTRACT, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/abstract_new_app.webp',
        'image': [
            TRIGGERS.SOCIALS.ABSTRACT.ON_NEW_APP_RELEASE.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.ABSTRACT.ON_NEW_APP_RELEASE.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: abstractGetNotifiedOnNewAppRelease
    },
    {
        'name': 'Get notified when insider gets a new badge',
        'description': 'Get notified when insider gets a new badge',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ABSTRACT, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/abstract_badge.webp',
        'image': [
            TRIGGERS.SOCIALS.ABSTRACT.ON_USERS_NEW_BADGE.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.ABSTRACT.ON_USERS_NEW_BADGE.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: abstractGetNotifiedOnNewUserBadge
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
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/stakestone_unstake_ready_notification.webp',
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
        'name': 'Get notified when Hyperlend raise their deposit cap for stHype',
        'description': 'Notify me when Hyperlend raise their deposit cap for stHype',
        'tags': [WORKFLOW_TEMPLATES_TAGS.LENDING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/hyperlend_cap_rise.webp',
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
    /*{
        'name': 'Get notified when there are more than 50 ETH in available liquidity for instant withdrawal on Stakestone',
        'description': 'Notify me when there are more than 50 ETH in available liquidity for instant withdrawal on Stakestone',
        'tags': [WORKFLOW_TEMPLATES_TAGS.YIELD, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/more_than_50_liq_berastone.webp',
        'image': [
            TRIGGERS.YIELD.STAKESTONE.STAKESTONE_VAULT_LIQUIDITY.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.YIELD.STAKESTONE.STAKESTONE_VAULT_LIQUIDITY.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createStakestoneInstantWithdrawalNotificationWorkflow
    },*/
    {
        'name': 'Get notified when I receive USDC',
        'description': 'Notify me when I receive USDC',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/notify_me_when_receiving_usdc.webp',
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
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/google_sheet_template.webp',
        'image': [
            TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD.image,
            ACTIONS.OTHERS.GSHEET.GSHEET.image
        ],
        'blockIDs': [
            TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD.blockId,
            ACTIONS.OTHERS.GSHEET.GSHEET.blockId
        ],
        createWorkflow: createUSDCYieldsStorageWorkflow
    },
    {
        'name': 'Get notified when the difference between BTC spot and perpetual prices exceeds 0.15%',
        'description': 'Get notified when the difference between BTC spot and perpetual prices exceeds 0.15%',
        'tags': [WORKFLOW_TEMPLATES_TAGS.DEXES, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/hyperliquid_template.webp',
        'image': [
            TRIGGERS.DEXES.HYPERLIQUID.SPOT_PRICE.image,
            TRIGGERS.DEXES.HYPERLIQUID.PERPS_PRICE.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.image
        ],
        'blockIDs': [
            TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD.blockId,
            ACTIONS.CORE.MATHEMATICS.MATHEMATICS.blockId,
            TRIGGERS.DEXES.HYPERLIQUID.SPOT_PRICE.blockId,
            TRIGGERS.DEXES.HYPERLIQUID.PERPS_PRICE.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId

        ],
        createWorkflow: createHyperliquidBTCSpotNPerpsThresholdNotificationWorkflow
    },
    {
        'name': 'Get notified when a project announces a new raise',
        'description': 'Get notified when a project announces raising a new round',
        'tags': [WORKFLOW_TEMPLATES_TAGS.SOCIALS, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dailyYieldUpdates.jpg',
        'image': [
            TRIGGERS.SOCIALS.DEFILLAMA.image,
            ACTIONS.NOTIFICATIONS.TELEGRAM.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.DEFILLAMA.ON_NEW_RAISE.blockId,
            ACTIONS.NOTIFICATIONS.TELEGRAM.SEND_MESSAGE.blockId
        ],
        createWorkflow: createDefillamaRaiseNotificationWorkflow
    },
    {
        'name': 'Buy cbBTC when PeterSchiff tweets a bearish tweet',
        'description': 'Buy cbBTC when PeterSchiff tweets a bearish tweet',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/twitter_yield_strat.webp',
        'image': [
            TRIGGERS.SOCIALS.X.X_POST_TRIGGER.image,
            ACTIONS.AI.AI.image,
            ACTIONS.CORE.CONDITION.image,
            ACTIONS.CORE.SWAP.SWAP.image
        ],
        'blockIDs': [
            TRIGGERS.SOCIALS.X.X_POST_TRIGGER.blockId,
            ACTIONS.AI.AI.AI.blockId,
            ACTIONS.CORE.CONDITION.IF.blockId,
            ACTIONS.CORE.SWAP.SWAP.blockId
        ],
        createWorkflow: createBuyBitcoinOnPeterSchiffBearishWorkflow
    },
    createTwitterAiNotificationTemplate(
        { display: 'Hyperliquid', tag: 'HyperliquidX' },
        {
            prompt: 'the tweet announces a new listing',
            notification: 'Hyperliquid just announced a new listing',
            description: 'Get notified when Hyperliquid announces a new listing',
            wfTitle: 'Get notified when Hyperliquid announces a new listing via their Twitter',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/hyperliquid_template.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'lookonchain', tag: 'lookonchain' },
        {
            prompt: 'the tweet mentions that AAVE has been hacked',
            notification: 'lookonchain mentions that AAVE has been hacked',
            description: 'Get notified when lookonchain mentions that AAVE has been hacked',
            wfTitle: 'Get notified when lookonchain mentions that AAVE has been hacked',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/aave.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'MegaETH', tag: 'megaeth_labs' },
        {
            prompt: 'the tweet announces mainnet or TGE',
            notification: 'MegaETH announces mainnet or TGE',
            description: 'Get notified when MegaETH announces mainnet or TGE',
            wfTitle: 'Get notified when MegaETH announces mainnet or TGE',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/megaeth.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'Somnia', tag: 'Somnia_Network' },
        {
            prompt: 'the tweet announces mainnet or TGE',
            notification: 'Somnia announces mainnet or TGE',
            description: 'Get notified when Somnia announces mainnet or TGE',
            wfTitle: 'Get notified when Somnia announces mainnet or TGE',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/somnia.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'Monad', tag: 'monad' },
        {
            prompt: 'the tweet announces mainnet or TGE',
            notification: 'Monad announces mainnet or TGE',
            description: 'Get notified when Monad announces mainnet or TGE',
            wfTitle: 'Get notified when Monad announces mainnet or TGE',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/monad.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'Binance', tag: 'binance' },
        {
            prompt: 'the tweet announces a new token listing',
            notification: 'Binance announces a new token listing',
            description: 'Get notified when Binance announces a new token listing',
            wfTitle: 'Get notified when Binance announces a new token listing',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/binance.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'VitalikButerin', tag: 'VitalikButerin' },
        {
            prompt: 'the tweet is bullish about Ethereum',
            notification: 'VitalikButerin is bullish about Ethereum',
            description: 'Get notified when VitalikButerin is bullish about Ethereum',
            wfTitle: 'Get notified when VitalikButerin is bullish about Ethereum',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/vitalik.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'Aave', tag: 'aave' },
        {
            prompt: 'the tweet announces a major partnership',
            notification: 'Aave announces a major partnership',
            description: 'Get notified when Aave announces a major partnership',
            wfTitle: 'Get notified when Aave announces a major partnership',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/aave.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'MorphoLabs', tag: 'MorphoLabs' },
        {
            prompt: 'the tweet announces a major partnership',
            notification: 'MorphoLabs announces a major partnership',
            description: 'Get notified when MorphoLabs announces a major partnership',
            wfTitle: 'Get notified when MorphoLabs announces a major partnership',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/morpho.webp'
    ),
    createTwitterAiNotificationTemplate(
        { display: 'phtevenstrong', tag: 'phtevenstrong' },
        {
            prompt: 'the tweet is about yield opportunities',
            notification: 'phtevenstrong mentions yield opportunities',
            description: 'Get notified when phtevenstrong mentions yield opportunities',
            wfTitle: 'Get notified when phtevenstrong mentions yield opportunities',
        },
        'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/twitter_yield_strat.webp'
    ),
    {
        'name': 'Daily Fear & Greed-Based cbBTC Trading',
        'description': 'Automatically trade cbBTC daily based on the Fear & Greed Index—buy when low, sell when high.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.TRADING, WORKFLOW_TEMPLATES_TAGS.SOCIALS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dca_fear_and_greed.webp',
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
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/dca_fear_and_greed_eth.webp',
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
        'name': 'Get Notified When Ethereum Gas drops below 6 Gwei',
        'description': 'Receive an email alert when Ethereum gas prices fall below 6 gwei.',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/gas.webp',
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
        'name': 'cbBTC transfer notification',
        'description': 'Receive notifications when a top cbBTC holder (0xbbbb....ffcb) transfers cbBTC',
        'tags': [WORKFLOW_TEMPLATES_TAGS.ON_CHAIN_MONITORING, WORKFLOW_TEMPLATES_TAGS.NOTIFICATIONS],
        'thumbnail': 'https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/templates/transfer_alert.webp',
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
];