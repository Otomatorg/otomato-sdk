import { TRIGGERS, getTokenFromSymbol, TOKENS, CHAINS, Trigger } from '../../src/index.js';

const generateDefaultTriggers = (): any[] => {
    const triggersList: any[] = [];

    const createDefaultTrigger = (trigger: any) => {
        const triggerInstance = new Trigger(trigger);

        // Set common parameters if they exist
        if (trigger.parameters.some((p: any) => p.key === "chainId")) {
            triggerInstance.setChainId(CHAINS.ETHEREUM);
        }
        if (trigger.parameters.some((p: any) => p.key === "contractAddress")) {
            triggerInstance.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
        }
        if (trigger.parameters.some((p: any) => p.key === "condition")) {
            triggerInstance.setCondition('>');
        }
        if (trigger.parameters.some((p: any) => p.key === "comparisonValue")) {
            triggerInstance.setComparisonValue(1000);
        }
        if (trigger.parameters.some((p: any) => p.key === "abiParams.account")) {
            triggerInstance.setParams('account', '0x888888888889758f76e7103c6cbf23abbf58f946');
        }

        return triggerInstance.toJSON();
    };

    // Explicitly create each trigger
    triggersList.push(createDefaultTrigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER));
    triggersList.push(createDefaultTrigger(TRIGGERS.LENDING.ASTARIA.LEND_RECALLED));
    triggersList.push(createDefaultTrigger(TRIGGERS.DEXES.ODOS.SWAP));
    triggersList.push(createDefaultTrigger(TRIGGERS.SOCIALS.MODE_NAME_SERVICE.NAME_REGISTERED));

    return triggersList;
};

function generateTriggersForAllTokens(chain: number) {
    if (!(chain in TOKENS)) {
        throw new Error(`Unsupported chain: ${chain}`);
    }

    const tokens = TOKENS[chain];
    const triggersList: any[] = [];

    tokens.forEach(token => {
        // Generate transfer trigger
        const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
        transferTrigger.setChainId(chain);
        // transferTrigger.setParams("value", 1000);
        // transferTrigger.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
        transferTrigger.setContractAddress(token.contractAddress);
        triggersList.push(transferTrigger);

        // Generate balance trigger
        const balanceTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE);
        balanceTrigger.setChainId(chain);
        balanceTrigger.setParams("account", "0x888888888889758f76e7103c6cbf23abbf58f946");
        balanceTrigger.setContractAddress(token.contractAddress);
        balanceTrigger.setCondition(">");
        balanceTrigger.setComparisonValue(10);
        triggersList.push(balanceTrigger);
    });

    return triggersList.map(t => t.toJSON());
}

const generateSpecificTriggers = (): any[] => {
    // Create individual triggers
    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", 1000);
    transferTrigger.setParams("to", "0x888888888889758f76e7103c6cbf23abbf58f946");
    transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const balanceTrigger = new Trigger(TRIGGERS.TOKENS.BALANCE.BALANCE);
    balanceTrigger.setChainId(CHAINS.ETHEREUM);
    balanceTrigger.setParams("account", "0x888888888889758f76e7103c6cbf23abbf58f946");
    balanceTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    balanceTrigger.setCondition(">");
    balanceTrigger.setComparisonValue(45000);

    const lendRecalledTrigger = new Trigger(TRIGGERS.LENDING.ASTARIA.LEND_RECALLED);
    lendRecalledTrigger.setParams("loanId", 123456);
    lendRecalledTrigger.setParams("recaller", "0x888888888889758f76e7103c6cbf23abbf58f946");
    lendRecalledTrigger.setParams("end", 1627848271);

    const odosSwapTrigger = new Trigger(TRIGGERS.DEXES.ODOS.SWAP);
    odosSwapTrigger.setChainId(CHAINS.ETHEREUM);
    odosSwapTrigger.setParams("sender", "0x888888888889758f76e7103c6cbf23abbf58f946");
    odosSwapTrigger.setParams("inputAmount", 1000);
    odosSwapTrigger.setParams("inputToken", "0x888888888889758f76e7103c6cbf23abbf58f946");
    odosSwapTrigger.setParams("amountOut", 500);
    odosSwapTrigger.setParams("outputToken", "0x888888888889758f76e7103c6cbf23abbf58f946");
    odosSwapTrigger.setParams("exchangeRate", 1.23);

    const nameRegisteredTrigger = new Trigger(TRIGGERS.SOCIALS.MODE_NAME_SERVICE.NAME_REGISTERED);
    nameRegisteredTrigger.setParams("id", 123456);
    nameRegisteredTrigger.setParams("owner", "0x888888888889758f76e7103c6cbf23abbf58f946");
    nameRegisteredTrigger.setParams("expires", 1627848271);

    return [
        transferTrigger.toJSON(),
        balanceTrigger.toJSON(),
        lendRecalledTrigger.toJSON(),
        odosSwapTrigger.toJSON(),
        nameRegisteredTrigger.toJSON(),
    ]
};

// Collect all triggers in a list
const triggersList = [
    ...generateTriggersForAllTokens(CHAINS.ETHEREUM),
    ...generateTriggersForAllTokens(CHAINS.MODE),
    ...generateDefaultTriggers(),
    ...generateSpecificTriggers()
];

console.log(triggersList);
