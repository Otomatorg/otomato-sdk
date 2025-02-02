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
 * 2. Protocol-Specific Configurations
 *************************************/
// Update these two configuration objects to switch protocols.
// All protocol-specific constants (action names, token symbols, token addresses) are defined here.
const PROTOCOL1 = {
    yield: `{{external.functions.ionicLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS})}}`,
    balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${getTokenFromSymbol(VARIABLES.CHAIN, 'ion-USDT').contractAddress},,)}}`,
    deposit: (walletBalance, underlyingTokenAddress, chain) => {
        const deposit = new Action(PROTOCOL1.depositAction);
        deposit.setChainId(chain);
        deposit.setParams('abiParams.amount', walletBalance);
        deposit.setParams('tokenToDeposit', underlyingTokenAddress);
        return deposit;
    },
    withdraw: (underlyingTokenAddress, chain) => {
        const withdraw = new Action(PROTOCOL1.withdrawAction);
        withdraw.setChainId(chain);
        withdraw.setParams('tokenToWithdraw', underlyingTokenAddress);
        withdraw.setParams('abiParams.amount', UINT256_MAX);
        return withdraw;
    },
};

const PROTOCOL2 = {
    yield: `{{external.functions.ironcladLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS})}}`,
    balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${getTokenFromSymbol(CHAINS.MODE, 'ironUSDT').contractAddress},,)}}`,
    deposit: (walletBalance, underlyingTokenAddress, chain) => {
        const deposit = new Action(PROTOCOL2.depositAction);
        deposit.setChainId(chain);
        deposit.setParams('abiParams.asset', underlyingTokenAddress);
        deposit.setParams('abiParams.amount', walletBalance);
        deposit.setParams('abiParams.referralCode', 0);
        return deposit;
    },
    withdraw: (underlyingTokenAddress, chain) => {
        const withdraw = new Action(PROTOCOL2.withdrawAction);
        withdraw.setChainId(chain);
        withdraw.setParams('abiParams.asset', underlyingTokenAddress);
        withdraw.setParams('abiParams.amount', UINT256_MAX);
        return withdraw;
    },
};

/*************************************
 * 3. Yield & Balance Expressions
 *************************************/
// Wallet balance of the underlying token:
const WALLET_BALANCE = `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${VARIABLES.TOKEN_ADDRESS},,)}}`;

/*************************************
 * 4. Constant
 *************************************/
const UINT256_MAX =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

/*************************************
 * 6. Workflow Logic Helper Functions
 *************************************/

// Create a periodic trigger.
function createPeriodicTrigger() {
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams('period', VARIABLES.LOOP_PERIOD);
    trigger.setParams('limit', 100000);
    return trigger;
}

// Compare protocol yields (protocol1 yield > protocol2 yield).
function createCompareYieldCondition() {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(PROTOCOL1_YIELD, 'gt', PROTOCOL2_YIELD);
    condition.setParams('groups', [group]);
    return condition;
}

// Check if the user has money market tokens for a given protocol.
function createCheckProtocolBalanceCondition(protocolBalanceExpression) {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(protocolBalanceExpression, 'gt', VARIABLES.BALANCE_THRESHOLD);
    condition.setParams('groups', [group]);
    return condition;
}

// Check if the user has any underlying tokens in their wallet.
function createCheckWalletBalanceCondition() {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(WALLET_BALANCE, 'gt', '0');
    condition.setParams('groups', [group]);
    return condition;
}

// Create a wait action (default 10 seconds).
function createWaitAction(duration = '10000') {
    const waitAction = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    waitAction.setParams('time', duration);
    return waitAction;
}

/*************************************
 * 7. Main Workflow Builder
 *************************************/
export async function aggregatorWorkflow() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

    // Initialize API services.
    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    // Arrays to hold all actions and the edges between them.
    const actions = [];
    const edges = [];

    // STEP 1: Create a periodic trigger.
    const trigger = createPeriodicTrigger();
    actions.push(trigger);

    // STEP 2: Compare protocol yields.
    const compareYieldCondition = createCompareYieldCondition();
    actions.push(compareYieldCondition);
    edges.push(
        new Edge({
            source: trigger,
            target: compareYieldCondition,
        })
    );

    // ----- TRUE BRANCH: protocol1 yield is higher -----
    // Check if the user has money market tokens for protocol2.
    const checkProtocol2Balance = createCheckProtocolBalanceCondition(PROTOCOL2_BALANCE);
    actions.push(checkProtocol2Balance);
    edges.push(
        new Edge({
            source: compareYieldCondition,
            target: checkProtocol2Balance,
            label: 'true',
            value: 'true',
        })
    );

    // If user has protocol2 tokens:
    // Withdraw from protocol2, wait, then deposit on protocol1.
    const withdrawFromProtocol2 = PROTOCOL_ACTIONS.protocol2.withdraw(VARIABLES.TOKEN_ADDRESS, VARIABLES.CHAIN);
    actions.push(withdrawFromProtocol2);

    const waitAfterWithdraw1 = createWaitAction();
    actions.push(waitAfterWithdraw1);

    const depositOnProtocol1 = PROTOCOL_ACTIONS.protocol1.deposit(WALLET_BALANCE, VARIABLES.TOKEN_ADDRESS, VARIABLES.CHAIN);
    actions.push(depositOnProtocol1);

    edges.push(
        new Edge({
            source: checkProtocol2Balance,
            target: withdrawFromProtocol2,
            label: 'true',
            value: 'true',
        })
    );
    edges.push(new Edge({ source: withdrawFromProtocol2, target: waitAfterWithdraw1 }));
    edges.push(new Edge({ source: waitAfterWithdraw1, target: depositOnProtocol1 }));

    // Else if user does not have protocol2 tokens:
    // Check if the user has any underlying tokens in their wallet.
    const checkWalletForProtocol1 = createCheckWalletBalanceCondition();
    actions.push(checkWalletForProtocol1);
    const depositOnProtocol1_Alt = PROTOCOL_ACTIONS.protocol1.deposit(WALLET_BALANCE, VARIABLES.TOKEN_ADDRESS, VARIABLES.CHAIN);
    actions.push(depositOnProtocol1_Alt);

    edges.push(
        new Edge({
            source: checkProtocol2Balance,
            target: checkWalletForProtocol1,
            label: 'false',
            value: 'false',
        })
    );
    edges.push(
        new Edge({
            source: checkWalletForProtocol1,
            target: depositOnProtocol1_Alt,
            label: 'true',
            value: 'true',
        })
    );

    // ----- FALSE BRANCH: protocol1 yield is NOT higher (protocol2 yield is equal/higher) -----
    // Check if the user has money market tokens for protocol1.
    const checkProtocol1Balance = createCheckProtocolBalanceCondition(PROTOCOL1_BALANCE);
    actions.push(checkProtocol1Balance);
    edges.push(
        new Edge({
            source: compareYieldCondition,
            target: checkProtocol1Balance,
            label: 'false',
            value: 'false',
        })
    );

    // If user has protocol1 tokens:
    // Withdraw from protocol1, wait, then deposit on protocol2.
    const withdrawFromProtocol1 = PROTOCOL_ACTIONS.protocol1.withdraw(VARIABLES.TOKEN_ADDRESS, VARIABLES.CHAIN);
    actions.push(withdrawFromProtocol1);

    const waitAfterWithdraw2 = createWaitAction();
    actions.push(waitAfterWithdraw2);

    const depositOnProtocol2 = PROTOCOL_ACTIONS.protocol2.deposit(WALLET_BALANCE, VARIABLES.TOKEN_ADDRESS, VARIABLES.CHAIN);
    actions.push(depositOnProtocol2);

    edges.push(
        new Edge({
            source: checkProtocol1Balance,
            target: withdrawFromProtocol1,
            label: 'true',
            value: 'true',
        })
    );
    edges.push(new Edge({ source: withdrawFromProtocol1, target: waitAfterWithdraw2 }));
    edges.push(new Edge({ source: waitAfterWithdraw2, target: depositOnProtocol2 }));

    // Else if the user does not have protocol1 tokens:
    // Check if the user has any underlying tokens in their wallet, then deposit on protocol2.
    const checkWalletForProtocol2 = createCheckWalletBalanceCondition();
    actions.push(checkWalletForProtocol2);
    const depositOnProtocol2_Alt = PROTOCOL_ACTIONS.protocol2.deposit(WALLET_BALANCE, VARIABLES.TOKEN_ADDRESS, VARIABLES.CHAIN);
    actions.push(depositOnProtocol2_Alt);

    edges.push(
        new Edge({
            source: checkProtocol1Balance,
            target: checkWalletForProtocol2,
            label: 'false',
            value: 'false',
        })
    );
    edges.push(
        new Edge({
            source: checkWalletForProtocol2,
            target: depositOnProtocol2_Alt,
            label: 'true',
            value: 'true',
        })
    );

    // Final Workflow Creation
    const workflow = new Workflow('Aggregator Workflow', actions, edges);
    console.log(JSON.stringify(workflow));

    // Create (and optionally run) the workflow on your platform.
    const creationResult = await workflow.create();
    // To run the workflow immediately, uncomment:
    // const runResult = await workflow.run();
}

// Optional immediate call to test the workflow.
aggregatorWorkflow();