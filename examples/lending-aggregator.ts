import { ACTIONS, Action, TRIGGERS, Trigger, CHAINS, getTokenFromSymbol, apiServices, convertToTokenUnitsFromSymbol, LOGIC_OPERATORS, ConditionGroup, Workflow, Edge } from '../src/index.js';
import dotenv from 'dotenv';
// individual deposit
dotenv.config();

const withdrawAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935n';
const smartWallet = '0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d';


enum ProtocolName {
  AAVE = 'AAVE',
  IONIC = 'IONIC',
  MOONWELL = 'MOONWELL',
  COMPOUND = 'COMPOUND',
}

enum BlockType {
  WITHDRAW_ALL = 'WITHDRAW_ALL',
  DEPOSIT = 'DEPOSIT',
}

const protocols = [ProtocolName.IONIC, ProtocolName.AAVE, ProtocolName.COMPOUND, ProtocolName.MOONWELL]; //, ProtocolName.MOONWELL, ProtocolName.AAVE, ProtocolName.COMPOUND

const USDCBalance = '{{external.functions.erc20Balance(8453,0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,,)}}';

// ---------- Map protocols with their lending rate function ----------
const lendingRateFunctions = {
  [ProtocolName.AAVE]: "{{external.functions.aaveLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)}}",
  [ProtocolName.IONIC]: "{{external.functions.ionicLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)}}",
  [ProtocolName.MOONWELL]: "{{external.functions.moonwellLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,0)}}",
  [ProtocolName.COMPOUND]: "{{external.functions.compoundLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,0)}}"
};

// ---------- Map protocols with their lending rate function ----------
const balanceToWithdrawFunction = {
  [ProtocolName.AAVE]: '{{external.functions.erc20Balance(8453,0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d,0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB,,)}}',
  [ProtocolName.IONIC]: '{{external.functions.erc20Balance(8453,0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d,0xa900A17a49Bc4D442bA7F72c39FA2108865671f0,,)}}',
  [ProtocolName.MOONWELL]: '{{external.functions.erc20Balance(8453,0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d,0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22,,)}}',
  [ProtocolName.COMPOUND]: '{{external.functions.erc20Balance(8453,0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d,0xb125E6687d4313864e53df431d5425969c15Eb2F,,)}}'
};

// ---------- Aave Withdraw All ----------
function createAaveWithdrawAll() {
  const aaveWithdrawAll = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);

  aaveWithdrawAll.setChainId(CHAINS.BASE);
  aaveWithdrawAll.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  aaveWithdrawAll.setParams(
    "abiParams.amount", 
    withdrawAmount
  );
  aaveWithdrawAll.setParams(
    "abiParams.to", 
    smartWallet
  );

  return aaveWithdrawAll;
}

// ---------- Ionic Withdraw All ----------
function createIonicWithdrawAll() {
  const ionicWithdrawAll = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);

  ionicWithdrawAll.setChainId(CHAINS.BASE);
  ionicWithdrawAll.setParams(
    "tokenToWithdraw",
    getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  ionicWithdrawAll.setParams(
    "abiParams.amount", 
    withdrawAmount
  );

  return ionicWithdrawAll;
}

// ---------- Moonwell Withdraw All ----------
function createMoonwellWithdrawAll() {
  const moonwellWithdrawAll = new Action(ACTIONS.LENDING.MOONWELL.WITHDRAW);

  moonwellWithdrawAll.setChainId(CHAINS.BASE);
  moonwellWithdrawAll.setParams(
    "tokenToWithdraw",
    getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  moonwellWithdrawAll.setParams(
    "abiParams.amount", 
    withdrawAmount
  );

  return moonwellWithdrawAll;
}

// ---------- Compound Withdraw All ----------
function createCompoundWithdrawAll() {
  const compoundWithdrawAll = new Action(ACTIONS.LENDING.COMPOUND.WITHDRAW);

  compoundWithdrawAll.setChainId(CHAINS.BASE);
  compoundWithdrawAll.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  compoundWithdrawAll.setParams(
    "abiParams.amount", 
    withdrawAmount
  );

  return compoundWithdrawAll;
}

// ---------- Aave Deposit ----------
async function createAaveDeposit() {
  const aaveDeposit = new Action(ACTIONS.LENDING.AAVE.SUPPLY);

  aaveDeposit.setChainId(CHAINS.BASE);
  aaveDeposit.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress);
  aaveDeposit.setParams("abiParams.amount", USDCBalance);
  aaveDeposit.setParams("abiParams.onBehalfOf", smartWallet);
  aaveDeposit.setParams("abiParams.referralCode", 0);

  return aaveDeposit;
}

// ---------- Ionic Deposit ----------
async function createIonicDeposit() {
  const ionicDeposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);

  ionicDeposit.setChainId(CHAINS.BASE);
  ionicDeposit.setParams(
      "abiParams.amount",
      USDCBalance
  );
  ionicDeposit.setParams(
      "tokenToDeposit",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  return ionicDeposit;
}

// ---------- Moonwell Deposit ----------
async function createMoonwellDeposit() {
  const moonwellDeposit = new Action(ACTIONS.LENDING.MOONWELL.DEPOSIT);

  moonwellDeposit.setChainId(CHAINS.BASE);
  moonwellDeposit.setParams(
      "abiParams.amount",
      USDCBalance
  );
  moonwellDeposit.setParams(
      "tokenToDeposit",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  return moonwellDeposit;
}

// ---------- Compound Deposit ----------
async function createCompoundDeposit() {
  const compoundDeposit = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);

  compoundDeposit.setChainId(CHAINS.BASE);
  compoundDeposit.setParams(
      "abiParams.amount",
      USDCBalance
  );
  compoundDeposit.setParams(
      "abiParams.asset",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  return compoundDeposit;
}

// ---------- Function registry ----------
const blockFunctionMap: Record<string, Function> = {
  [`${ProtocolName.IONIC}:${BlockType.DEPOSIT}`]: createIonicDeposit,
  [`${ProtocolName.IONIC}:${BlockType.WITHDRAW_ALL}`]: createIonicWithdrawAll,
  [`${ProtocolName.AAVE}:${BlockType.DEPOSIT}`]: createAaveDeposit,
  [`${ProtocolName.AAVE}:${BlockType.WITHDRAW_ALL}`]: createAaveWithdrawAll,
  [`${ProtocolName.MOONWELL}:${BlockType.DEPOSIT}`]: createMoonwellDeposit,
  [`${ProtocolName.MOONWELL}:${BlockType.WITHDRAW_ALL}`]: createMoonwellWithdrawAll,
  [`${ProtocolName.COMPOUND}:${BlockType.DEPOSIT}`]: createCompoundDeposit,
  [`${ProtocolName.COMPOUND}:${BlockType.WITHDRAW_ALL}`]: createCompoundWithdrawAll,
};

// ---------- Create Withdraw/Supply Block
async function getBlockFromProtocolName(protocol: ProtocolName, blockType: BlockType) {
  const key = `${protocol}:${blockType}`;
  const blockFunction = blockFunctionMap[key];
  
  if (!blockFunction) {
    throw new Error(`No function found for protocol: ${protocol}, blockType: ${blockType}`);
  }
  
  return await blockFunction();
}

// ---------- If condition ----------
function createConditionBlock(protocol: ProtocolName) {
  const conditionBranch = new Action(ACTIONS.CORE.CONDITION.IF);
  conditionBranch.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);

  // Get the lending rate for the input protocol
  const startIndex = protocols.indexOf(protocol);
  if (startIndex === -1) {
    throw new Error(`Protocol ${protocol} is not valid.`);
  }

  // Last one, no need to compare
  if (startIndex === protocols.length - 1) {
    conditionGroup.addConditionCheck("2", 'gt', "1");
    conditionBranch.setParams('groups', [conditionGroup]);
    return conditionBranch;
  }

  const leftRate = lendingRateFunctions[protocol];

  // Iterate over the protocols to the right of the input protocol in the protocol list
  for (let i = startIndex + 1; i < protocols.length; i++) {
    const rightRate = lendingRateFunctions[protocols[i]];
    conditionGroup.addConditionCheck(leftRate, 'gte', rightRate);
  }

  conditionBranch.setParams('groups', [conditionGroup]);

  return conditionBranch;
}

// ---------- If check balance condition ----------
function createBalanceCheckingConditionBlock(protocol: ProtocolName) {
  const conditionBranch = new Action(ACTIONS.CORE.CONDITION.IF);
  conditionBranch.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);

  // Get the lending rate for the input protocol
  const startIndex = protocols.indexOf(protocol);
  if (startIndex === -1) {
    throw new Error(`Protocol ${protocol} is not valid.`);
  }

  conditionGroup.addConditionCheck(balanceToWithdrawFunction[protocol], 'gt', "0");
  conditionBranch.setParams('groups', [conditionGroup]);
  return conditionBranch;
}

// ---------- If none of check balance condition satisfied ----------
function createNoneOfBalanceCheckingSatisfiedConditionBlock() {
  const conditionBranch = new Action(ACTIONS.CORE.CONDITION.IF);
  conditionBranch.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);

  for (const protocol of protocols) {
    conditionGroup.addConditionCheck(balanceToWithdrawFunction[protocol], 'lte', "0");
  }
  conditionBranch.setParams('groups', [conditionGroup]);

  return conditionBranch;
}

// ---------- Split block ----------
function createSplitBlock() {
  return new Action(ACTIONS.CORE.SPLIT.SPLIT);
}

// -------- Fear and Greed trigger --------
function createFearAndGreedTrigger() {
  const fearAndGreedTrigger = new Trigger(
    TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX
  );
  fearAndGreedTrigger.setCondition("gt");
  fearAndGreedTrigger.setComparisonValue(0);
  fearAndGreedTrigger.setPosition(0, 0);

  return fearAndGreedTrigger;
}

// -------- Creating the workflow --------
async function createWorkflow() {

  const actions = [];
  const edges = [];
  
  const trigger = createFearAndGreedTrigger();
  actions.push(trigger);

  // To check and create the right edge. Ex: first protocol's IF connect to trigger, second and later protocol's IF connect to the previous protocol IF
  let previousProtocolIf;
  let triggerEdgeExisted = false;

  // Placeholder action to ensure all deposit action are executed
  const delayAction = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
  delayAction.setParams("time", "1"); // Wait 1 milisecond
  actions.push(delayAction);

  for (const protocol of protocols) {

    // Check case where user doesn't have any available asset to withdraw, go straight to deposit action if TRUE
    const noneBalanceSatisfiedIfBlock = createNoneOfBalanceCheckingSatisfiedConditionBlock();
    actions.push(noneBalanceSatisfiedIfBlock);

    // Compare between protocol
    const ifCondition = createConditionBlock(protocol);

    // Split to withdraw all actions
    const split = createSplitBlock();

    if (triggerEdgeExisted == false) {
      triggerEdgeExisted = true;
      edges.push(new Edge({
        source: trigger,
        target: ifCondition,
      }));
    }

    actions.push(ifCondition);
    actions.push(split);

    // For case users don't have deposited amount on any protocols
    const depositDefault = await getBlockFromProtocolName(protocol, BlockType.DEPOSIT);
    actions.push(depositDefault)

    edges.push(new Edge({
      source: noneBalanceSatisfiedIfBlock,
      target: depositDefault,
      label: "true",
      value: "true",
    }));

    edges.push(new Edge({
      source: depositDefault,
      target: delayAction
    }));

    edges.push(new Edge({
      source: noneBalanceSatisfiedIfBlock,
      target: split,
      label: "false",
      value: "false",
    }));

    const withdrawBalanceCheckBlocks = [];
    for (const protocolInner of protocols) {

      if (protocolInner == protocol) continue;

      // Deposit the all the amount to protocol
      const innerProtocolDeposit = await getBlockFromProtocolName(protocol, BlockType.DEPOSIT);
      actions.push(innerProtocolDeposit)

      // Block to check if user has balance
      const checkWithdrawBalanceCondition = createBalanceCheckingConditionBlock(protocolInner);
      actions.push(checkWithdrawBalanceCondition);
      withdrawBalanceCheckBlocks.push(checkWithdrawBalanceCondition);

      // Withdraw all block for each protocol
      const block = await getBlockFromProtocolName(protocolInner, BlockType.WITHDRAW_ALL);
      actions.push(block);

      // Split - Each of protocols' withdraw all edge
      edges.push(new Edge({
        source: split,
        target: checkWithdrawBalanceCondition,
      }));

      edges.push(new Edge({
        source: checkWithdrawBalanceCondition,
        target: block,
        label: "true",
        value: "true",
      }));

      // Withdraw all - Deposit edge
      edges.push(new Edge({
        source: block,
        target: innerProtocolDeposit,
      }));

      edges.push(new Edge({
        source: innerProtocolDeposit,
        target: delayAction
      }));
    }

    // If the current protocol is the first, create an edge from the trigger
    if (edges.length == 0) {
      edges.push(new Edge({
        source: trigger,
        target: ifCondition,
      }));
    }

    // If the current protocol is not the first, create an edge from the previous protocol
    if (previousProtocolIf) {
      edges.push(new Edge({
        source: previousProtocolIf,
        target: ifCondition,
        label: "false",
        value: "false",
      }));
    }

    // To check user's asset in all protocols at start
    edges.push(new Edge({
      source: ifCondition,
      target: noneBalanceSatisfiedIfBlock,
      label: "true",
      value: "true",
    }));

    previousProtocolIf = ifCondition;
  }

  return new Workflow("Something something compare between protocols", actions, edges);
}

async function lending_aggregator() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const workflow = await createWorkflow();

  const creationResult = await workflow.create();

  console.log("lending_aggregator state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("lending_aggregator state after: " + workflow.getState());
}

lending_aggregator();