import {
  ACTIONS,
  Action,
  Trigger,
  Workflow,
  TRIGGERS,
  apiServices,
  LOGIC_OPERATORS,
  ConditionGroup,
  CHAINS,
  getTokenFromSymbol,
} from '../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

/////////////////////
// 1. Generic Variables
/////////////////////
const VARIABLES = {
  CHAIN: CHAINS.BASE,
  TOKEN_ADDRESS: getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress,
  BALANCE_THRESHOLD: 0.1, // for example, 0.1 USDC
  LOOP_PERIOD: 1000 * 60 * 60, // 1 hour (in ms)
  YIELD_BUFFER: 1.1,
};

/////////////////////
// 2. Global Constants
/////////////////////
const UINT256_MAX: string =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

/////////////////////
// 3. Protocol-Specific Configurations
/////////////////////
const WALLET_USDC_BALANCE: string = `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${VARIABLES.TOKEN_ADDRESS},,)}}`;

const P1_PROOF_OF_DEPOSIT_TOKEN = '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB';
const PROTOCOL1 = {
  yield: `{{external.functions.aaveLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS},,)}}`,
  balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${P1_PROOF_OF_DEPOSIT_TOKEN},,)}}`,
  deposit: (): Action => {
    const deposit: Action = new Action(ACTIONS.LENDING.AAVE.SUPPLY);
    deposit.setChainId(VARIABLES.CHAIN);
    deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
    deposit.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    return deposit;
  },
  withdraw: (): Action => {
    const withdraw: Action = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);
    withdraw.setChainId(VARIABLES.CHAIN);
    withdraw.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    withdraw.setParams('abiParams.amount', UINT256_MAX);
    return withdraw;
  },
};

const P2_PROOF_OF_DEPOSIT_TOKEN = '0xb125E6687d4313864e53df431d5425969c15Eb2F';
const PROTOCOL2 = {
  yield: `{{external.functions.compoundLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS},,,)}}`,
  balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${P2_PROOF_OF_DEPOSIT_TOKEN},,)}}`,
  deposit: (): Action => {
    const deposit: Action = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    deposit.setChainId(VARIABLES.CHAIN);
    deposit.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
    return deposit;
  },
  withdraw: (): Action => {
    const withdraw: Action = new Action(ACTIONS.LENDING.COMPOUND.WITHDRAW);
    withdraw.setChainId(VARIABLES.CHAIN);
    withdraw.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    withdraw.setParams('abiParams.amount', UINT256_MAX);
    return withdraw;
  },
};

const P3_PROOF_OF_DEPOSIT_TOKEN = '0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22';
const PROTOCOL3 = {
  yield: `{{external.functions.moonwellLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS},,)}}`,
  balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${P3_PROOF_OF_DEPOSIT_TOKEN},,)}}`,
  deposit: (): Action => {
    const deposit: Action = new Action(ACTIONS.LENDING.MOONWELL.DEPOSIT);
    deposit.setChainId(VARIABLES.CHAIN);
    deposit.setParams('tokenToDeposit', VARIABLES.TOKEN_ADDRESS);
    deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
    return deposit;
  },
  withdraw: (): Action => {
    const withdraw: Action = new Action(ACTIONS.LENDING.MOONWELL.WITHDRAW);
    withdraw.setChainId(VARIABLES.CHAIN);
    withdraw.setParams('tokenToWithdraw', VARIABLES.TOKEN_ADDRESS);
    withdraw.setParams('abiParams.amount', UINT256_MAX);
    return withdraw;
  },
};

/////////////////////
// 4. Helper Functions
/////////////////////
function createPeriodicTrigger(): Action {
  const trigger: Action = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
  trigger.setParams('period', VARIABLES.LOOP_PERIOD);
  trigger.setParams('limit', 100000);
  return trigger;
}

function createSplitAction(): Action {
  return new Action(ACTIONS.CORE.SPLIT.SPLIT);
}

function createYieldBufferBlock(yieldExpression: string): Action {
  const mathBlock = new Action(ACTIONS.CORE.MATHEMATICS.MATHEMATICS);
  mathBlock.setParams('number1', yieldExpression);
  mathBlock.setParams('operator', '*');
  mathBlock.setParams('number2', VARIABLES.YIELD_BUFFER);
  return mathBlock;
}

function createHighestYieldCondition(
  winningYield: string,
  otherYield1: string,
  otherYield2: string
): Action {
  const condition: Action = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.AND);
  const group: ConditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  group.addConditionCheck(winningYield, 'gt', otherYield1);
  group.addConditionCheck(winningYield, 'gt', otherYield2);
  condition.setParams('groups', [group]);
  return condition;
}

function createCheckProtocolBalanceConditionAndYieldAbove10Percent(balanceExpression: string, actualYield: string, protocolYield: string): Action {
  const condition: Action = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);
  const group: ConditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  group.addConditionCheck(balanceExpression, 'gt', VARIABLES.BALANCE_THRESHOLD);
  group.addConditionCheck(protocolYield, 'lte', actualYield);
  condition.setParams('groups', [group]);
  return condition;
}

function createCheckWalletBalanceCondition(): Action {
  const condition: Action = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);
  const group: ConditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  group.addConditionCheck(WALLET_USDC_BALANCE, 'gt', '0');
  condition.setParams('groups', [group]);
  return condition;
}

/////////////////////
// 5. Main Workflow Builder
/////////////////////
export async function lendingAggregatorWorkflow(): Promise<void> {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

  // 1) Initialize API services
  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  // 2) Create a new, empty workflow
  const workflow = new Workflow('Three-Protocol Lending Aggregator');

  // 3) Add a root node: the periodic trigger
  const periodicTrigger = createPeriodicTrigger();
  workflow.addNode(periodicTrigger);

  const bufferedYieldP1 = createYieldBufferBlock(PROTOCOL1.yield);
  const bufferedYieldP2 = createYieldBufferBlock(PROTOCOL2.yield);
  const bufferedYieldP3 = createYieldBufferBlock(PROTOCOL3.yield);

  workflow.insertNode(bufferedYieldP1, periodicTrigger);
  workflow.insertNode(bufferedYieldP2, bufferedYieldP1);
  workflow.insertNode(bufferedYieldP3, bufferedYieldP2);

  const currentYieldP1 = bufferedYieldP1.getParameterVariableName('number1')
  const currentYieldP2 = bufferedYieldP2.getParameterVariableName('number1')
  const currentYieldP3 = bufferedYieldP3.getParameterVariableName('number1')
  const bumpedYieldP1 = bufferedYieldP1.getOutputVariableName('resultAsFloat');
  const bumpedYieldP2 = bufferedYieldP2.getOutputVariableName('resultAsFloat');
  const bumpedYieldP3 = bufferedYieldP3.getOutputVariableName('resultAsFloat');

  const telegramAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  telegramAction.setParams("message", `
    AAVE yield: ${currentYieldP1} | ${bumpedYieldP1}
    Compound yield: ${currentYieldP2} | ${bumpedYieldP2}
    Moonwell yield: ${currentYieldP3} | ${bumpedYieldP3}
    `);
  telegramAction.setParams("webhook", process.env.SLACK_WEBHOOK);
  
  workflow.insertNode(telegramAction, bufferedYieldP3);

  // 4) Insert a "primary split" after the 3rd mathematics block
  const primarySplit = createSplitAction();
  workflow.insertNode(primarySplit, telegramAction);

  // 5) Insert three "best yield" conditions from the same parent (primarySplit)
  const bestYieldP1 = createHighestYieldCondition(PROTOCOL1.yield, PROTOCOL2.yield, PROTOCOL3.yield);
  const bestYieldP2 = createHighestYieldCondition(PROTOCOL2.yield, PROTOCOL1.yield, PROTOCOL3.yield);
  const bestYieldP3 = createHighestYieldCondition(PROTOCOL3.yield, PROTOCOL1.yield, PROTOCOL2.yield);

  workflow.insertNode(bestYieldP1, primarySplit);
  workflow.insertNode(bestYieldP2, primarySplit);
  workflow.insertNode(bestYieldP3, primarySplit);

  // 6) For each "best yield" node, insert a sub-split that branches to 3 sub-scenarios:
  //    - Move funds from Protocol X
  //    - Move funds from Protocol Y
  //    - Wait and deposit from wallet

  // ========== Protocol 1 Wins ==========
  const splitP1 = createSplitAction();
  workflow.insertNode(splitP1, bestYieldP1, undefined, 'true', 'true');

  // Sub-branch A: Insert an IF to check for Protocol2 balance
  const checkP2ForP1 = createCheckProtocolBalanceConditionAndYieldAbove10Percent(PROTOCOL2.balance, currentYieldP1, bumpedYieldP2);
  workflow.insertNode(checkP2ForP1, splitP1); 
  // Then chain withdraw -> deposit
  const withdrawP2ForP1 = PROTOCOL2.withdraw();
  workflow.insertNode(withdrawP2ForP1, checkP2ForP1, undefined, 'true', 'true');
  const depositP1FromP2 = PROTOCOL1.deposit();
  workflow.insertNode(depositP1FromP2, withdrawP2ForP1);

  // Sub-branch B: Insert an IF to check for Protocol3 balance
  const checkP3ForP1 = createCheckProtocolBalanceConditionAndYieldAbove10Percent(PROTOCOL3.balance, currentYieldP1, bumpedYieldP3);
  workflow.insertNode(checkP3ForP1, splitP1);
  const withdrawP3ForP1 = PROTOCOL3.withdraw();
  workflow.insertNode(withdrawP3ForP1, checkP3ForP1, undefined, 'true', 'true');
  const depositP1FromP3 = PROTOCOL1.deposit();
  workflow.insertNode(depositP1FromP3, withdrawP3ForP1);

  // Sub-branch C: Check wallet funds directly (remove wait)
  const checkWalletForP1 = createCheckWalletBalanceCondition();
  workflow.insertNode(checkWalletForP1, splitP1);
  const depositWalletToP1 = PROTOCOL1.deposit();
  workflow.insertNode(depositWalletToP1, checkWalletForP1, undefined, 'true', 'true');

  // ========== Protocol 2 Wins ==========
  const splitP2 = createSplitAction();
  workflow.insertNode(splitP2, bestYieldP2, undefined, 'true', 'true');

  // Sub-branch A
  const checkP1ForP2 = createCheckProtocolBalanceConditionAndYieldAbove10Percent(PROTOCOL1.balance, currentYieldP2, bumpedYieldP1);
  workflow.insertNode(checkP1ForP2, splitP2);
  const withdrawP1ForP2 = PROTOCOL1.withdraw();
  workflow.insertNode(withdrawP1ForP2, checkP1ForP2, undefined, 'true', 'true');
  const depositP2FromP1 = PROTOCOL2.deposit();
  workflow.insertNode(depositP2FromP1, withdrawP1ForP2);

  // Sub-branch B
  const checkP3ForP2 = createCheckProtocolBalanceConditionAndYieldAbove10Percent(PROTOCOL3.balance, currentYieldP2, bumpedYieldP3);
  workflow.insertNode(checkP3ForP2, splitP2);
  const withdrawP3ForP2 = PROTOCOL3.withdraw();
  workflow.insertNode(withdrawP3ForP2, checkP3ForP2, undefined, 'true', 'true');
  const depositP2FromP3 = PROTOCOL2.deposit();
  workflow.insertNode(depositP2FromP3, withdrawP3ForP2);

  // Sub-branch C: Check wallet funds directly (remove wait)
  const checkWalletForP2 = createCheckWalletBalanceCondition();
  workflow.insertNode(checkWalletForP2, splitP2);
  const depositWalletToP2 = PROTOCOL2.deposit();
  workflow.insertNode(depositWalletToP2, checkWalletForP2, undefined, 'true', 'true');

  // ========== Protocol 3 Wins ==========
  const splitP3 = createSplitAction();
  workflow.insertNode(splitP3, bestYieldP3, undefined, 'true', 'true');

  // Sub-branch A
  const checkP1ForP3 = createCheckProtocolBalanceConditionAndYieldAbove10Percent(PROTOCOL1.balance, currentYieldP3, bumpedYieldP1);
  workflow.insertNode(checkP1ForP3, splitP3);
  const withdrawP1ForP3 = PROTOCOL1.withdraw();
  workflow.insertNode(withdrawP1ForP3, checkP1ForP3, undefined, 'true', 'true');
  const depositP3FromP1 = PROTOCOL3.deposit();
  workflow.insertNode(depositP3FromP1, withdrawP1ForP3);

  // Sub-branch B
  const checkP2ForP3 = createCheckProtocolBalanceConditionAndYieldAbove10Percent(PROTOCOL2.balance, currentYieldP3, bumpedYieldP2);
  workflow.insertCondition(checkP2ForP3, splitP3, undefined, false, false);
  const withdrawP2ForP3 = PROTOCOL2.withdraw();
  workflow.insertNode(withdrawP2ForP3, checkP2ForP3, undefined, 'true', 'true');
  const depositP3FromP2 = PROTOCOL3.deposit();
  workflow.insertNode(depositP3FromP2, withdrawP2ForP3);

  // Sub-branch C: Check wallet funds directly (remove wait)
  const checkWalletForP3 = createCheckWalletBalanceCondition();
  workflow.insertCondition(checkWalletForP3, splitP3, undefined, false, false);
  const depositWalletToP3 = PROTOCOL3.deposit();
  workflow.insertNode(depositWalletToP3, checkWalletForP3, undefined, 'true', 'true');

  // 7) Create the final workflow on the server
  console.log('Final aggregator workflow:', JSON.stringify(workflow, null, 2));
  const creationResult = await workflow.create();

  // Optionally, run it:
  const runResult = await workflow.run();
}
lendingAggregatorWorkflow();
