import { TRIGGERS, TOKENS, CHAINS, Trigger } from '../src/index';

const generateDefaultTriggers = (): any[] => {
    const triggersList: any[] = [];

    const createDefaultTrigger = (trigger: any) => {
        const triggerInstance = new Trigger(trigger);

        // Set common parameters if they exist
        if (trigger.parameters.some((p: any) => p.key === "chainid")) {
            triggerInstance.setChainId(CHAINS.ETHEREUM);
        }
        if (trigger.parameters.some((p: any) => p.key === "contractAddress")) {
            triggerInstance.setContractAddress(TOKENS.ETHEREUM.USDC);
        }

        return triggerInstance.toJSON();
    };

    // Explicitly create each trigger
    triggersList.push(createDefaultTrigger(TRIGGERS.ERC20.TRANSFER));
    triggersList.push(createDefaultTrigger(TRIGGERS.ERC20.BALANCE));
    triggersList.push(createDefaultTrigger(TRIGGERS.YIELD.SPLICE_FI.SWAP));
    triggersList.push(createDefaultTrigger(TRIGGERS.YIELD.SPLICE_FI.LIQUIDITY_REMOVED));
    triggersList.push(createDefaultTrigger(TRIGGERS.YIELD.SPLICE_FI.MARKET_CREATION));
    triggersList.push(createDefaultTrigger(TRIGGERS.YIELD.SPLICE_FI.INTEREST_RATE_UPDATE));
    triggersList.push(createDefaultTrigger(TRIGGERS.LENDING.ASTARIA.LEND_RECALLED));
    triggersList.push(createDefaultTrigger(TRIGGERS.DEXES.ODOS.SWAP));
    triggersList.push(createDefaultTrigger(TRIGGERS.SOCIALS.MODE_NAME_SERVICE.NAME_REGISTERED));

    return triggersList;
};

const generateSpecificTriggers = (): any[] => {
    // Create individual triggers
    const transferTrigger = new Trigger(TRIGGERS.ERC20.TRANSFER);
    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", 1000);
    transferTrigger.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    transferTrigger.setContractAddress(TOKENS.ETHEREUM.USDC);

    const spliceFiSwapTrigger = new Trigger(TRIGGERS.YIELD.SPLICE_FI.SWAP);
    spliceFiSwapTrigger.setParams("caller", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    spliceFiSwapTrigger.setParams("market", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    spliceFiSwapTrigger.setParams("receiver", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    spliceFiSwapTrigger.setParams("netPtToAccount", 1000);
    spliceFiSwapTrigger.setParams("netSyToAccount", 2000);

    const liquidityRemovedTrigger = new Trigger(TRIGGERS.YIELD.SPLICE_FI.LIQUIDITY_REMOVED);
    liquidityRemovedTrigger.setParams("caller", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    liquidityRemovedTrigger.setParams("market", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    liquidityRemovedTrigger.setParams("receiver", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    liquidityRemovedTrigger.setParams("netLpToRemove", 1000);
    liquidityRemovedTrigger.setParams("netPtOut", 500);
    liquidityRemovedTrigger.setParams("netSyOut", 1500);

    const marketCreationTrigger = new Trigger(TRIGGERS.YIELD.SPLICE_FI.MARKET_CREATION);
    marketCreationTrigger.setParams("market", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    marketCreationTrigger.setParams("PT", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    marketCreationTrigger.setParams("scalarRoot", 1234);
    marketCreationTrigger.setParams("initialAnchor", 5678);
    marketCreationTrigger.setParams("lnFeeRateRoot", 91011);

    const interestRateUpdateTrigger = new Trigger(TRIGGERS.YIELD.SPLICE_FI.INTEREST_RATE_UPDATE);
    interestRateUpdateTrigger.setParams("timestamp", 1627848271);
    interestRateUpdateTrigger.setParams("lastLnImpliedRate", 123456);
    interestRateUpdateTrigger.setContractAddress("0xDE95511418EBD8Bd36294B11C86314DdFA50e212");

    const lendRecalledTrigger = new Trigger(TRIGGERS.LENDING.ASTARIA.LEND_RECALLED);
    lendRecalledTrigger.setParams("loanId", 123456);
    lendRecalledTrigger.setParams("recaller", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    lendRecalledTrigger.setParams("end", 1627848271);

    const odosSwapTrigger = new Trigger(TRIGGERS.DEXES.ODOS.SWAP);
    odosSwapTrigger.setChainId(CHAINS.ETHEREUM);
    odosSwapTrigger.setParams("sender", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    odosSwapTrigger.setParams("inputAmount", 1000);
    odosSwapTrigger.setParams("inputToken", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    odosSwapTrigger.setParams("amountOut", 500);
    odosSwapTrigger.setParams("outputToken", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    odosSwapTrigger.setParams("exchangeRate", 1.23);

    const nameRegisteredTrigger = new Trigger(TRIGGERS.SOCIALS.MODE_NAME_SERVICE.NAME_REGISTERED);
    nameRegisteredTrigger.setParams("id", 123456);
    nameRegisteredTrigger.setParams("owner", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    nameRegisteredTrigger.setParams("expires", 1627848271);

    return [
        transferTrigger.toJSON(),
        spliceFiSwapTrigger.toJSON(),
        liquidityRemovedTrigger.toJSON(),
        marketCreationTrigger.toJSON(),
        interestRateUpdateTrigger.toJSON(),
        lendRecalledTrigger.toJSON(),
        odosSwapTrigger.toJSON(),
        nameRegisteredTrigger.toJSON(),
    ]
};

// Collect all triggers in a list
const triggersList = [
    ...generateDefaultTriggers(),
    ...generateSpecificTriggers()
];

console.log(JSON.stringify(triggersList));
