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
} from '../../src/index.js';

import dotenv from 'dotenv';
dotenv.config();

/*************************************
 * 1. Static Constants
 *************************************/
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;

// Example addresses; replace with your actual ones
const SMART_ACCOUNT_ADDRESS = '{{smartAccountAddress}}';
const USDC_ADDRESS = '0xd988097fb8612cc24eeC14542bC03424c656005f';
const IONIC_USDC_ADDRESS = '0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038';
const IRONCLAD_USDC_ADDRESS = '0xe7334Ad0e325139329E747cF2Fc24538dD564987';

// Balances
const IONIC_USDC_BALANCE = `{{external.functions.erc20Balance(34443,${SMART_ACCOUNT_ADDRESS},${IONIC_USDC_ADDRESS},,)}}`;
const IRONCLAD_USDC_BALANCE = `{{external.functions.erc20Balance(34443,${SMART_ACCOUNT_ADDRESS},${IRONCLAD_USDC_ADDRESS},,)}}`;

const UINT256_MAX =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

/*************************************
 * 2. Slack Message Utility
 *************************************/
function createSlackMessage(message: string): Action {
  const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackAction.setParams('webhook', SLACK_WEBHOOK);
  slackAction.setParams('message', message);
  return slackAction;
}

/*************************************
 * 3. Logic/Action Functions
 *************************************/

/**
 * Condition: Check if user has USDC on Ionic
 */
function createCheckIonicUSDCCondition(): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const group = new ConditionGroup(LOGIC_OPERATORS.AND);
  group.addConditionCheck(IONIC_USDC_BALANCE, 'gt', '10000');

  condition.setParams('groups', [group]);
  return condition;
}

/**
 * Action: Withdraw all from Ionic
 */
function createIonicWithdrawAll(): Action {
  const withdraw = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);
  withdraw.setChainId(CHAINS.MODE);

  // Typically, you'd withdraw "max".
  withdraw.setParams('tokenToWithdraw', USDC_ADDRESS);
  withdraw.setParams('abiParams.amount', UINT256_MAX);

  return withdraw;
}

/**
 * Condition: Check if user has USDC on Ironclad
 */
function createCheckIroncladUSDCCondition(): Action {
  const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  condition.setParams('logic', LOGIC_OPERATORS.OR);

  const group = new ConditionGroup(LOGIC_OPERATORS.AND);
  group.addConditionCheck(IRONCLAD_USDC_BALANCE, 'gt', '10000');

  condition.setParams('groups', [group]);
  return condition;
}

/**
 * Action: Withdraw all from Ironclad
 */
function createIroncladWithdrawAll(): Action {
  const withdraw = new Action(ACTIONS.LENDING.IRONCLAD.WITHDRAW);
  withdraw.setChainId(CHAINS.MODE);
  withdraw.setParams('abiParams.asset', USDC_ADDRESS);
  withdraw.setParams('abiParams.amount', UINT256_MAX);
  return withdraw;
}

/*************************************
 * 4. Build the 'Stop Lending Aggregator' Workflow
 *************************************/
export async function stopLendingAggregator() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;

  // Initialize API services
  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  const actions: Action[] = [];
  const edges: Edge[] = [];

  /********************************
   * Step 1: Initial Slack Message
   ********************************/
  const startMsg = createSlackMessage('Stop Lending Aggregator - Starting...');
  actions.push(startMsg);

  /********************************
   * Step 2: Split
   ********************************/
  const splitMsg = createSlackMessage('Splitting into Ionic path & Ironclad path...');
  actions.push(splitMsg);

  const splitAction = new Action(ACTIONS.CORE.SPLIT.SPLIT);
  actions.push(splitAction);

  edges.push(
    new Edge({
      source: startMsg,
      target: splitMsg,
    }),
    new Edge({
      source: splitMsg,
      target: splitAction,
    })
  );

  /********************************
   * Path 1: Check if user has IONIC USDC
   ********************************/
  const ionicPathMsg = createSlackMessage('Checking if user has USDC on Ionic...');
  actions.push(ionicPathMsg);

  const checkIonicUSDC = createCheckIonicUSDCCondition();
  actions.push(checkIonicUSDC);

  const ionicWithdrawMsg = createSlackMessage('Withdrawing all from Ionic...');
  actions.push(ionicWithdrawMsg);

  const ionicWithdrawAll = createIonicWithdrawAll();
  actions.push(ionicWithdrawAll);

  edges.push(
    new Edge({
      source: splitAction,
      target: ionicPathMsg,
    }),
    new Edge({
      source: ionicPathMsg,
      target: checkIonicUSDC,
    }),
    // If user has USDC, withdraw
    new Edge({
      source: checkIonicUSDC,
      target: ionicWithdrawMsg,
      label: 'true',
      value: 'true',
    }),
    new Edge({
      source: ionicWithdrawMsg,
      target: ionicWithdrawAll,
    })
  );

  /********************************
   * Path 2: Check if user has IRONCLAD USDC
   ********************************/
  const ironcladPathMsg = createSlackMessage('Checking if user has USDC on Ironclad...');
  actions.push(ironcladPathMsg);

  const checkIroncladUSDC = createCheckIroncladUSDCCondition();
  actions.push(checkIroncladUSDC);

  const ironcladWithdrawMsg = createSlackMessage('Withdrawing all from Ironclad...');
  actions.push(ironcladWithdrawMsg);

  const ironcladWithdrawAll = createIroncladWithdrawAll();
  actions.push(ironcladWithdrawAll);

  edges.push(
    new Edge({
      source: splitAction,
      target: ironcladPathMsg,
    }),
    new Edge({
      source: ironcladPathMsg,
      target: checkIroncladUSDC,
    }),
    // If user has USDC, withdraw
    new Edge({
      source: checkIroncladUSDC,
      target: ironcladWithdrawMsg,
      label: 'true',
      value: 'true',
    }),
    new Edge({
      source: ironcladWithdrawMsg,
      target: ironcladWithdrawAll,
    })
  );

  /********************************
   * Create the Workflow
   ********************************/
  const workflow = new Workflow('Stop Lending Aggregator', actions, edges);

  // Log workflow JSON (optional)
  // console.log('Workflow JSON:', JSON.stringify(workflow.toJSON(), null, 2));

  // Create the workflow on the server
  const creationResult = await workflow.create();
  console.log('Creation Result:', creationResult);

  // Optionally run it
  //const runResult = await workflow.run();
  //console.log('Run Result:', runResult);
}

// For local testing:
stopLendingAggregator();