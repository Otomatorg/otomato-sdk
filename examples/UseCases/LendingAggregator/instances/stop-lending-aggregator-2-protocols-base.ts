/*************************************
 * File: stop-lending-aggregator.ts
 *************************************/

import {
  ACTIONS,
  Action,
  Workflow,
  Edge,
  apiServices,
  LOGIC_OPERATORS,
  ConditionGroup,
  CHAINS,
  getTokenFromSymbol,
} from '../../../../src/index.js';

import dotenv from 'dotenv';
dotenv.config();

/*************************************
 * 1. Centralized Variables
 *************************************/
const chain = CHAINS.BASE;
const VARIABLES = {
  // WETH
  /*TOKEN_ADDRESS: getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress,
  MONEY_MARKET_1_TOKEN: getTokenFromSymbol(CHAINS.MODE, 'ion-WETH').contractAddress,
  MONEY_MARKET_2_TOKEN: getTokenFromSymbol(CHAINS.MODE, 'ironETH').contractAddress,*/
  // USDC/ USDT
  TOKEN_ADDRESS: getTokenFromSymbol(chain, 'USDC').contractAddress,
  MONEY_MARKET_1_TOKEN: '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB', // aave USDC
  MONEY_MARKET_2_TOKEN: '0xb125E6687d4313864e53df431d5425969c15Eb2F', // compound USDC
  BALANCE_THRESHOLD: '10000',
};

// Balances
const MONEY_MARKET_1_BALANCE = `{{external.functions.erc20Balance(34443,{{smartAccountAddress}},${VARIABLES.MONEY_MARKET_1_TOKEN},,)}}`;
const MONEY_MARKET_2_BALANCE = `{{external.functions.erc20Balance(34443,{{smartAccountAddress}},${VARIABLES.MONEY_MARKET_2_TOKEN},,)}}`;

const UINT256_MAX =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

/*************************************
 * 2. Logic/Action Functions
 *************************************/

/**
 * Condition: Check if user has tokens in MoneyMarket1
 */
function createCheckMoneyMarket1Condition(): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const group = new ConditionGroup(LOGIC_OPERATORS.AND);
  group.addConditionCheck(MONEY_MARKET_1_BALANCE, 'gt', VARIABLES.BALANCE_THRESHOLD);

  condition.setParams('groups', [group]);
  return condition;
}

/**
 * Action: Withdraw all from MoneyMarket1
 */
function createMoneyMarket1WithdrawAll(): Action {
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
 * Condition: Check if user has tokens in MoneyMarket2
 */
function createCheckMoneyMarket2Condition(): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const group = new ConditionGroup(LOGIC_OPERATORS.AND);
  group.addConditionCheck(MONEY_MARKET_2_BALANCE, 'gt', VARIABLES.BALANCE_THRESHOLD);

  condition.setParams('groups', [group]);
  return condition;
}

/**
 * Action: Withdraw all from MoneyMarket2
 */
function createMoneyMarket2WithdrawAll(): Action {
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

/*************************************
 * 3. Build the 'Stop Lending Aggregator' Workflow
 *************************************/
export async function stopLendingAggregator() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

  // Initialize API services
  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  const actions: Action[] = [];
  const edges: Edge[] = [];

  /********************************
   * Step 1: Split
   ********************************/
  const splitAction = new Action(ACTIONS.CORE.SPLIT.SPLIT);
  actions.push(splitAction);

  /********************************
   * Path 1: Check MoneyMarket1
   ********************************/
  const checkMoneyMarket1 = createCheckMoneyMarket1Condition();
  actions.push(checkMoneyMarket1);

  const moneyMarket1WithdrawAll = createMoneyMarket1WithdrawAll();
  actions.push(moneyMarket1WithdrawAll);

  edges.push(
    new Edge({
      source: splitAction,
      target: checkMoneyMarket1,
    }),
    // If user has tokens, withdraw
    new Edge({
      source: checkMoneyMarket1,
      target: moneyMarket1WithdrawAll,
      label: 'true',
      value: 'true',
    })
  );

  /********************************
   * Path 2: Check MoneyMarket2
   ********************************/
  const checkMoneyMarket2 = createCheckMoneyMarket2Condition();
  actions.push(checkMoneyMarket2);

  const moneyMarket2WithdrawAll = createMoneyMarket2WithdrawAll();
  actions.push(moneyMarket2WithdrawAll);

  edges.push(
    new Edge({
      source: splitAction,
      target: checkMoneyMarket2,
    }),
    // If user has tokens, withdraw
    new Edge({
      source: checkMoneyMarket2,
      target: moneyMarket2WithdrawAll,
      label: 'true',
      value: 'true',
    })
  );

  /********************************
   * Create the Workflow
   ********************************/
  const workflow = new Workflow('Stop Lending Aggregator', actions, edges);

  // Log workflow JSON (optional)
  console.log(JSON.stringify(workflow));

  // Create the workflow on the server
  /*const creationResult = await workflow.create();
  console.log('Creation Result:', creationResult);

  // Optionally run it
  const runResult = await workflow.run();
  console.log('Run Result:', runResult);*/
}

// For local testing:
stopLendingAggregator();