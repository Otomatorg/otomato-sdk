import {
    ACTIONS,
    Action,
    Trigger,
    Workflow,
    Edge,
    TRIGGERS,
    apiServices,
    LOGIC_OPERATORS,
    ConditionGroup,
    CHAINS,
    getTokenFromSymbol,
} from '../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

/*************************************
 * 1. Generic Variables
 *************************************/

const VARIABLES = {
    CHAIN: CHAINS.MODE,
    TOKEN_ADDRESS: getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress,
    BALANCE_THRESHOLD: 100000, // for example, 0.1 USDT
    LOOP_PERIOD: 1000 * 60 * 60, // 1 hour (in ms)
};

/*************************************
 * 2. Global Constants
 *************************************/
const UINT256_MAX =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

/*************************************
 * 3. Protocol-Specific Configurations
 *************************************/
// To switch protocols, update only these two objects.
// All protocol-specific constants are defined here.
const PROTOCOL1 = {
    // Yield and balance expressions for protocol1:
    yield: `{{external.functions.ionicLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS})}}`,
    balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${getTokenFromSymbol(VARIABLES.CHAIN, 'ion-USDT').contractAddress},,)}}`,
    // Deposit function for protocol1:
    deposit: () => {
        const deposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
        deposit.setChainId(VARIABLES.CHAIN);
        deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
        deposit.setParams('tokenToDeposit', VARIABLES.TOKEN_ADDRESS);
        return deposit;
    },
    // Withdraw function for protocol1:
    withdraw: () => {
        const withdraw = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);
        withdraw.setChainId(VARIABLES.CHAIN);
        withdraw.setParams('tokenToWithdraw', VARIABLES.TOKEN_ADDRESS);
        withdraw.setParams('abiParams.amount', UINT256_MAX);
        return withdraw;
    },
};

const PROTOCOL2 = {
    // Yield and balance expressions for protocol2:
    yield: `{{external.functions.ironcladLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS})}}`,
    balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${getTokenFromSymbol(VARIABLES.CHAIN, 'ironUSDT').contractAddress},,)}}`,
    // Deposit function for protocol2:
    deposit: () => {
        const deposit = new Action(ACTIONS.LENDING.IRONCLAD.SUPPLY);
        deposit.setChainId(VARIABLES.CHAIN);
        deposit.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
        deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
        deposit.setParams('abiParams.referralCode', 0);
        return deposit;
    },
    // Withdraw function for protocol2:
    withdraw: () => {
        const withdraw = new Action(ACTIONS.LENDING.IRONCLAD.WITHDRAW);
        withdraw.setChainId(VARIABLES.CHAIN);
        withdraw.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
        withdraw.setParams('abiParams.amount', UINT256_MAX);
        return withdraw;
    },
};

/*************************************
 * 4. Yield & Balance Expressions
 *************************************/
// Wallet balance of the underlying token:
const WALLET_USDC_BALANCE = `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${VARIABLES.TOKEN_ADDRESS},,)}}`;

/*************************************
 * 5. Helper Functions
 *************************************/
// Create a periodic trigger.
function createPeriodicTrigger() {
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams('period', VARIABLES.LOOP_PERIOD);
    trigger.setParams('limit', 100000);
    return trigger;
}

// Create a condition comparing protocol1 yield > protocol2 yield.
function createCompareYieldCondition() {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(PROTOCOL1.yield, 'gt', PROTOCOL2.yield);
    condition.setParams('groups', [group]);
    return condition;
}

// Create a condition to check if a protocol's balance exceeds the threshold.
function createCheckProtocolBalanceCondition(balanceExpression: string) {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(balanceExpression, 'gt', VARIABLES.BALANCE_THRESHOLD);
    condition.setParams('groups', [group]);
    return condition;
}

// Create a condition to check if the wallet holds any underlying tokens.
function createCheckWalletBalanceCondition() {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(WALLET_USDC_BALANCE, 'gt', '0');
    condition.setParams('groups', [group]);
    return condition;
}

// Create a wait/delay action (default is 10 seconds).
function createWaitAction(duration = '10000') {
    const waitAction = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    waitAction.setParams('time', duration);
    return waitAction;
}

/*************************************
 * 6. Main Workflow Builder
 *************************************/
export async function aggregatorWorkflow() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

    // Initialize API services.
    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    // Array to hold all actions and edges.
    const actions = [];
    const edges = [];

    // STEP 1: Create periodic trigger.
    const trigger = createPeriodicTrigger();
    actions.push(trigger);

    // STEP 2: Compare yields of protocol1 and protocol2.
    const compareYieldCondition = createCompareYieldCondition();
    actions.push(compareYieldCondition);
    edges.push(new Edge({ source: trigger, target: compareYieldCondition }));

    // ----- TRUE Branch: protocol1 yield > protocol2 yield -----
    // Check if the user holds protocol2 tokens.
    const checkProtocol2Balance = createCheckProtocolBalanceCondition(PROTOCOL2.balance);
    actions.push(checkProtocol2Balance);
    edges.push(new Edge({
        source: compareYieldCondition,
        target: checkProtocol2Balance,
        label: 'true',
        value: 'true',
    }));

    // If protocol2 tokens exist: withdraw from protocol2, wait, then deposit on protocol1.
    const withdrawFromProtocol2 = PROTOCOL2.withdraw();
    actions.push(withdrawFromProtocol2);
    const waitAfterWithdraw1 = createWaitAction();
    actions.push(waitAfterWithdraw1);
    const depositOnProtocol1 = PROTOCOL1.deposit();
    actions.push(depositOnProtocol1);

    edges.push(new Edge({
        source: checkProtocol2Balance,
        target: withdrawFromProtocol2,
        label: 'true',
        value: 'true',
    }));
    edges.push(new Edge({ source: withdrawFromProtocol2, target: waitAfterWithdraw1 }));
    edges.push(new Edge({ source: waitAfterWithdraw1, target: depositOnProtocol1 }));

    // Else, if no protocol2 tokens: check wallet balance then deposit on protocol1.
    const checkWalletForProtocol1 = createCheckWalletBalanceCondition();
    actions.push(checkWalletForProtocol1);
    const depositOnProtocol1_Alt = PROTOCOL1.deposit();
    actions.push(depositOnProtocol1_Alt);
    edges.push(new Edge({
        source: checkProtocol2Balance,
        target: checkWalletForProtocol1,
        label: 'false',
        value: 'false',
    }));
    edges.push(new Edge({
        source: checkWalletForProtocol1,
        target: depositOnProtocol1_Alt,
        label: 'true',
        value: 'true',
    }));

    // ----- FALSE Branch: protocol1 yield is NOT greater (so protocol2 yield is equal/higher) -----
    // Check if the user holds protocol1 tokens.
    const checkProtocol1Balance = createCheckProtocolBalanceCondition(PROTOCOL1.balance);
    actions.push(checkProtocol1Balance);
    edges.push(new Edge({
        source: compareYieldCondition,
        target: checkProtocol1Balance,
        label: 'false',
        value: 'false',
    }));

    // If protocol1 tokens exist: withdraw from protocol1, wait, then deposit on protocol2.
    const withdrawFromProtocol1 = PROTOCOL1.withdraw();
    actions.push(withdrawFromProtocol1);
    const waitAfterWithdraw2 = createWaitAction();
    actions.push(waitAfterWithdraw2);
    const depositOnProtocol2 = PROTOCOL2.deposit();
    actions.push(depositOnProtocol2);

    edges.push(new Edge({
        source: checkProtocol1Balance,
        target: withdrawFromProtocol1,
        label: 'true',
        value: 'true',
    }));
    edges.push(new Edge({ source: withdrawFromProtocol1, target: waitAfterWithdraw2 }));
    edges.push(new Edge({ source: waitAfterWithdraw2, target: depositOnProtocol2 }));

    // Else, if no protocol1 tokens: check wallet balance then deposit on protocol2.
    const checkWalletForProtocol2 = createCheckWalletBalanceCondition();
    actions.push(checkWalletForProtocol2);
    const depositOnProtocol2_Alt = PROTOCOL2.deposit();
    actions.push(depositOnProtocol2_Alt);
    edges.push(new Edge({
        source: checkProtocol1Balance,
        target: checkWalletForProtocol2,
        label: 'false',
        value: 'false',
    }));
    edges.push(new Edge({
        source: checkWalletForProtocol2,
        target: depositOnProtocol2_Alt,
        label: 'true',
        value: 'true',
    }));

    // Final Workflow Creation
    const workflow = new Workflow('Aggregator Workflow', actions, edges);
    console.log(JSON.stringify(workflow));

    // Create the workflow on your platform.
    const creationResult = await workflow.create();
    // Optionally, run the workflow immediately:
    // const runResult = await workflow.run();
}

// Optional immediate call to test the workflow.
aggregatorWorkflow();