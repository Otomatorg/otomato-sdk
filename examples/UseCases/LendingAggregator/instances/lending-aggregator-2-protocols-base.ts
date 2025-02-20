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
} from '../../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

/*************************************
 * 1. Static Constants
 *************************************/

const chain = CHAINS.BASE;

const VARIABLES = {
  CHAIN: chain,
  TOKEN_ADDRESS: getTokenFromSymbol(chain, 'WETH').contractAddress,
  // MONEY_MARKET_1_TOKEN: "0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB", // aBasUSDC
  MONEY_MARKET_1_TOKEN: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7", // aBasWETH
  // MONEY_MARKET_2_TOKEN: "0xb125E6687d4313864e53df431d5425969c15Eb2F", // compound USDC on Base
  MONEY_MARKET_2_TOKEN: "0x46e6b214b524310239732D51387075E0e70970bf", // compound WETH on Base
  BALANCE_THRESHOLD: 0.00003, // 0.1 USDC
  LOOP_PERIOD: 1000 * 60 * 60, // 1 hour
  NAME: "SmartYield WETH",
  YIELD_BUFFER: 1.1, // 10% buffer
};

const WALLET_USDC_BALANCE = `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${VARIABLES.TOKEN_ADDRESS},,)}}`

const P1_PROOF_OF_DEPOSIT_TOKEN = '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7';
const P1 = {
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

const P2_PROOF_OF_DEPOSIT_TOKEN = '0x46e6b214b524310239732D51387075E0e70970bf';
const P2 = {
  yield: `{{external.functions.compoundLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS},,)}}`,
  balance: `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${P2_PROOF_OF_DEPOSIT_TOKEN},,)}}`,
  deposit: (): Action => {
    const deposit = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    deposit.setChainId(chain);
    deposit.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    deposit.setParams('abiParams.amount', VARIABLES.TOKEN_ADDRESS);
    return deposit;
  },
  withdraw: (): Action => {
    const withdraw = new Action(ACTIONS.LENDING.COMPOUND.WITHDRAW);
    withdraw.setChainId(chain);
    withdraw.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    return withdraw;
  }
};

const UINT256_MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

/*************************************
 * 3. Logic/Action Functions
 *************************************/

/** 
 * Fear & Greed Trigger: triggers when index is above 0
 */
function createFearAndGreedTrigger(): Trigger {
  const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
  // Condition: index must be > 0
  trigger.setParams('period', VARIABLES.LOOP_PERIOD);
  trigger.setParams('limit', 1);
  trigger.setParams('limit', 100000);
  return trigger;
}

function createYieldBufferBlock(yieldExpression: string): Action {
  const mathBlock = new Action(ACTIONS.CORE.MATHEMATICS.MATHEMATICS);
  mathBlock.setParams('number1', yieldExpression);
  mathBlock.setParams('operator', '*');
  mathBlock.setParams('number2', VARIABLES.YIELD_BUFFER);
  return mathBlock;
}

/** 
 * Condition: Compare p1 yield > p2 yield
 * True path => p1 yield is higher
 * False path => p2 yield is equal or higher
 */
function createCompareP1VSP2Condition(yield1: any, yield2: any): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  conditionGroup.addConditionCheck(yield1, 'gt', yield2);

  condition.setParams('groups', [conditionGroup]);
  return condition;
}

/**
 * Condition: Check if user has P2 USDC
 */
function createCheckP2USDCCondition(): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  conditionGroup.addConditionCheck(P2.balance, 'gt', VARIABLES.BALANCE_THRESHOLD);

  condition.setParams('groups', [conditionGroup]);
  return condition;
}

/**
 * Action: Withdraw from P2
 */
function createP2WithdrawAll(): Action {
  const withdraw = new Action(ACTIONS.LENDING.COMPOUND.WITHDRAW);
  withdraw.setChainId(chain);
  // Typically, you'd withdraw "max" by specifying a large number (2^256-1).
  withdraw.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
  withdraw.setParams(
    'abiParams.amount',
    UINT256_MAX
  );
  return withdraw;
}

/**
 * Action: Deposit USDC on P1
 */
function createDepositOnP1(): Action {
  const deposit = new Action(ACTIONS.LENDING.AAVE.SUPPLY);
  deposit.setChainId(chain);

  deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
  deposit.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);

  return deposit;
}

/**
 * Condition: Check if user has any USDC in wallet
 */
function createCheckWalletUSDCCondition(): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  conditionGroup.addConditionCheck(WALLET_USDC_BALANCE, 'gt', '0');

  condition.setParams('groups', [conditionGroup]);
  return condition;
}

/** 
 * === NEW for P2 yield better ===
 * Condition: Check if user has USDC on P1
 */
function createCheckP1USDCCondition(): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  conditionGroup.addConditionCheck(P1.balance, 'gt', VARIABLES.BALANCE_THRESHOLD);

  condition.setParams('groups', [conditionGroup]);
  return condition;
}

/**
 * === NEW for P2 yield better ===
 * Action: Withdraw from P1
 */
function createP1WithdrawAll(): Action {
  const withdraw = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);
  withdraw.setChainId(chain);

  // Typically, you'd withdraw "max".
  withdraw.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
  withdraw.setParams(
    'abiParams.amount',
    UINT256_MAX
  );

  return withdraw;
}

/**
 * === NEW for P2 yield better ===
 * Action: Deposit on P2
 */
function createDepositOnP2(): Action {
  const deposit = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
  deposit.setChainId(chain);
  deposit.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
  deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
  return deposit;
}

/*************************************
 * 4. Main Workflow Builder
 *************************************/
export async function aggregatorWorkflow() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

  // Initialize API services
  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  // Create arrays for actions and edges
  const actions: Action[] = [];
  const edges: Edge[] = [];

  /********************************
   * STEP 1: Fear & Greed Trigger
   ********************************/
  const fearAndGreedTrigger = createFearAndGreedTrigger();
  actions.push(fearAndGreedTrigger);

  /********************************
   * STEP 2: Compare p1 vs p2 yields
   ********************************/

  const p1YieldMath = createYieldBufferBlock(P1.yield);
  const p2YieldMath = createYieldBufferBlock(P2.yield);
  
  actions.push(p1YieldMath, p2YieldMath);
  edges.push(
    new Edge({ source: fearAndGreedTrigger, target: p1YieldMath }),
    new Edge({ source: p1YieldMath, target: p2YieldMath })
  );

  const compareCondition = createCompareP1VSP2Condition(
    p1YieldMath.getParameterVariableName('number1'),
    p2YieldMath.getParameterVariableName('number1'),
  );
  actions.push(compareCondition);

  edges.push(
    new Edge({
      source: p2YieldMath,
      target: compareCondition,
    })
  );

  /********************************
   * STEP 3 (True): P1 yield is higher
   * => Check if user has P2 USDC
   ********************************/
  const checkP2Condition = createCheckP2USDCCondition();
  actions.push(checkP2Condition);

  edges.push(
    // True path from compareCondition => P1 yield is higher
    new Edge({
      source: compareCondition,
      target: checkP2Condition,
      label: 'true',
      value: 'true',
    })
  );

  /********************************
   * STEP 4A: If user DOES have USDC on p2
   * => Withdraw, deposit on p1
   ********************************/
  const checkYieldIsWorthTheMove = createCompareP1VSP2Condition(
    p1YieldMath.getParameterVariableName('number1'),
    p2YieldMath.getOutputVariableName('resultAsFloat'),
  );
  actions.push(checkYieldIsWorthTheMove);

  const withdrawFromP2 = P2.withdraw();
  actions.push(withdrawFromP2);

  const depositToP1 = P1.deposit();
  actions.push(depositToP1);

  edges.push(
    new Edge({
      source: checkP2Condition,
      target: checkYieldIsWorthTheMove,
      label: 'true',
      value: 'true',
    }),
    new Edge({
      source: checkYieldIsWorthTheMove,
      target: withdrawFromP2,
      label: 'true',
      value: 'true',
    }),
    new Edge({
      source: withdrawFromP2,
      target: depositToP1,
    })
  );

  /********************************
   * STEP 4B: If user does NOT have USDC on P2
   * => Check if user has USDC in wallet
   ********************************/
  const checkWalletUSDC = createCheckWalletUSDCCondition();
  actions.push(checkWalletUSDC);

  edges.push(
    new Edge({
      source: checkP2Condition,
      target: checkWalletUSDC,
      label: 'false',
      value: 'false',
    })
  );

  /********************************
   * STEP 4C: If user does have USDC in wallet
   * => Deposit on P1
   ********************************/
  const depositToP1_2 = P1.deposit();
  actions.push(depositToP1_2);

  edges.push(
    new Edge({
      source: checkWalletUSDC,
      target: depositToP1_2,
      label: 'true',
      value: 'true',
    })
  );

  /***************************************************************************
   * === NEW for P2 yield better (False Path from compareCondition) ===
   * STEP 5: P2 yield is equal/higher => Check if user has USDC on P1
   **************************************************************************/
  const checkP1USDC = createCheckP1USDCCondition();
  actions.push(checkP1USDC);

  edges.push(
    // False path from compareCondition => P2 yield is equal or higher
    new Edge({
      source: compareCondition,
      target: checkP1USDC,
      label: 'false',
      value: 'false',
    })
  );

  const checkYieldIsWorthTheMove2 = createCompareP1VSP2Condition(
    p2YieldMath.getParameterVariableName('number1'),
    p1YieldMath.getOutputVariableName('resultAsFloat'),
  );
  actions.push(checkYieldIsWorthTheMove2);

  const withdrawFromP1 = P1.withdraw();
  actions.push(withdrawFromP1);

  const depositToP2 = P2.deposit();
  actions.push(depositToP2);

  edges.push(
    new Edge({
      source: checkP1USDC,
      target: checkYieldIsWorthTheMove2,
      label: 'true',
      value: 'true',
    }),
    new Edge({
      source: checkYieldIsWorthTheMove2,
      target: withdrawFromP1,
      label: 'true',
      value: 'true',
    }),
    new Edge({
      source: withdrawFromP1,
      target: depositToP2,
    })
  );

  /********************************
   * STEP 5B: If user does NOT have USDC on P1
   * => Check if user has USDC in wallet
   ********************************/
  const checkWalletUSDC2 = createCheckWalletUSDCCondition();
  actions.push(checkWalletUSDC2);

  edges.push(
    new Edge({
      source: checkP1USDC,
      target: checkWalletUSDC2,
      label: 'false',
      value: 'false',
    }),
  );

  /********************************
   * STEP 5C: If user does have USDC in wallet
   * => Deposit on P2
   ********************************/
  const depositToP2_2 = P2.deposit();
  actions.push(depositToP2_2);

  edges.push(
    new Edge({
      source: checkWalletUSDC2,
      target: depositToP2_2,
      label: 'true',
      value: 'true',
    })
  );

  /********************************
   * Final Workflow
   ********************************/
  const workflow = new Workflow(VARIABLES.NAME, actions, edges);

  // Log JSON (optional)
  console.log(JSON.stringify(workflow));

  // Create/run on your platform:
  const creationResult = await workflow.create();
  // console.log("Creation result:", creationResult);
  //console.log("Workflow ID:", workflow.id);

  const runResult = await workflow.run();
  //console.log("Run result:", runResult);
}

// Optional immediate call to test
aggregatorWorkflow();