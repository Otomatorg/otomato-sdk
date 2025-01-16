import { ACTIONS, Action, TRIGGERS, Trigger, CHAINS, getTokenFromSymbol, apiServices, convertToTokenUnitsFromSymbol, LOGIC_OPERATORS, ConditionGroup, Workflow, Edge } from '../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

const withdrawAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

const smartAccountAddress = '0x9ebF4899c05039a52407D919A63630Ccd3F399ae';

enum ProtocolName {
  IONIC = 'IONIC',
  IRONCLAD = 'IRONCLAD',
}

enum BlockType {
  WITHDRAW_ALL = 'WITHDRAW_ALL',
  DEPOSIT = 'DEPOSIT',
}

const protocols = [ProtocolName.IONIC, ProtocolName.IRONCLAD];

const USDCBalance = `{{external.functions.erc20Balance(34443,${smartAccountAddress},0xd988097fb8612cc24eeC14542bC03424c656005f,,)}}`;

// ---------- Map protocols with their lending rate function ----------
const lendingRateFunctions = {
  [ProtocolName.IONIC]: `{{external.functions.ionicLendingRate(34443,0xd988097fb8612cc24eeC14542bC03424c656005f)}}`,
  [ProtocolName.IRONCLAD]: `{{external.functions.ironcladLendingRate(34443,0xd988097fb8612cc24eeC14542bC03424c656005f)}}`,
};

// ---------- Map protocols with their lending rate function ----------
const balanceToWithdrawFunction = {
  [ProtocolName.IONIC]: `{{external.functions.erc20Balance(34443,${smartAccountAddress},0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038,,)}}`,
  [ProtocolName.IRONCLAD]: `{{external.functions.erc20Balance(34443,${smartAccountAddress},0xe7334Ad0e325139329E747cF2Fc24538dD564987,,)}}`,
};

// ---------- Ironclad Withdraw All ----------
function createIroncladWithdrawAll() {
  const ironcladWithdrawAll = new Action(ACTIONS.LENDING.IRONCLAD.WITHDRAW);

  ironcladWithdrawAll.setChainId(CHAINS.MODE);
  ironcladWithdrawAll.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.MODE, "USDC").contractAddress
  );
  ironcladWithdrawAll.setParams(
    "abiParams.amount",
    withdrawAmount
  );

  return ironcladWithdrawAll;
}

// ---------- Ionic Withdraw All ----------
function createIonicWithdrawAll() {
  const ionicWithdrawAll = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);

  ionicWithdrawAll.setChainId(CHAINS.MODE);
  ionicWithdrawAll.setParams(
    "tokenToWithdraw",
    getTokenFromSymbol(CHAINS.MODE, "USDC").contractAddress
  );
  ionicWithdrawAll.setParams(
    "abiParams.amount",
    withdrawAmount
  );

  return ionicWithdrawAll;
}

// ---------- Ironclad Deposit ----------
async function createIroncladDeposit() {
  const ironcladDeposit = new Action(ACTIONS.LENDING.IRONCLAD.SUPPLY);

  ironcladDeposit.setChainId(CHAINS.MODE);
  ironcladDeposit.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.MODE, "USDC").contractAddress);
  ironcladDeposit.setParams("abiParams.amount", USDCBalance);
  ironcladDeposit.setParams("abiParams.referralCode", 0);

  return ironcladDeposit;
}

// ---------- Ionic Deposit ----------
async function createIonicDeposit() {
  const ionicDeposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);

  ionicDeposit.setChainId(CHAINS.MODE);
  ionicDeposit.setParams(
    "abiParams.amount",
    USDCBalance
  );
  ionicDeposit.setParams(
    "tokenToDeposit",
    getTokenFromSymbol(CHAINS.MODE, "USDC").contractAddress
  );

  return ionicDeposit;
}

// ---------- Function registry ----------
const blockFunctionMap: Record<string, Function> = {
  [`${ProtocolName.IONIC}:${BlockType.DEPOSIT}`]: createIonicDeposit,
  [`${ProtocolName.IONIC}:${BlockType.WITHDRAW_ALL}`]: createIonicWithdrawAll,
  [`${ProtocolName.IRONCLAD}:${BlockType.DEPOSIT}`]: createIroncladDeposit,
  [`${ProtocolName.IRONCLAD}:${BlockType.WITHDRAW_ALL}`]: createIroncladWithdrawAll,
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

// ---------- If check USDC balance condition ----------
function createUSDCBalanceCheckingConditionBlock() {
  const conditionBranch = new Action(ACTIONS.CORE.CONDITION.IF);
  conditionBranch.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);

  conditionGroup.addConditionCheck(USDCBalance, 'gt', "0");
  conditionBranch.setParams('groups', [conditionGroup]);
  return conditionBranch;
}

// ---------- If none of check balance condition satisfied ----------
function createNoneOfBalanceCheckingSatisfiedConditionBlock(currentProtocol: ProtocolName) {
  const conditionBranch = new Action(ACTIONS.CORE.CONDITION.IF);
  conditionBranch.setParams('logic', LOGIC_OPERATORS.OR);

  const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);

  for (const protocol of protocols) {
    if (currentProtocol == protocol) continue;
    conditionGroup.addConditionCheck(balanceToWithdrawFunction[protocol], 'lt', "1");
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

const BLOCK_WIDTH = 250;
const BLOCK_HEIGHT = 50;

/** Return the bounding box (left, right, top, bottom) of a node,
 *  assuming (x,y) is the center and block size is 100×50.
 */
function getBoundingBox(node: Action) {
  const halfW = BLOCK_WIDTH / 2;
  const halfH = BLOCK_HEIGHT / 2;
  
  // Fallback to 0 if x or y is undefined
  const x = node.position?.x ?? 0;
  const y = node.position?.y ?? 0;

  return {
    left:   x - halfW,
    right:  x + halfW,
    top:    y - halfH,
    bottom: y + halfH,
  };
}

/** Check if two bounding boxes overlap (including touching edges). */
function isOverlap(a: ReturnType<typeof getBoundingBox>, b: ReturnType<typeof getBoundingBox>) {
  // No overlap if one box is entirely to the left/right or above/below the other
  return !(
       a.right < b.left
    || a.left > b.right
    || a.bottom < b.top
    || a.top > b.bottom
  );
}

function initializePositions(actions: Action[], edges: Edge[]) {
  if (actions.length === 0) return;

  // 1. Find the trigger node
  const triggerNode = actions.find(
    (a) => a.blockId === TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX.blockId
  );
  if (!triggerNode) return;

  // 2. Build adjacency (node.ref -> Edge[])
  const adjacency = buildEdgeAdjacencyMap(actions, edges);

  // 3. We'll keep a queue for BFS and a visited set of `ref`s
  const queue: Action[] = [];
  const visited = new Set<string>();

  // 4. Initialize the trigger node’s position
  triggerNode.setPosition(400, 120);
  visited.add(triggerNode.ref);
  queue.push(triggerNode);

  // 5. BFS
  while (queue.length > 0) {
    const parent = queue.shift() as Action;
    if (!parent) continue;

    const parentPos = {
      x: parent.position?.x ?? 0,
      y: parent.position?.y ?? 0,
    };

    // Get all outgoing edges from parent
    const outgoingEdges = adjacency.get(parent.ref) || [];
    if (outgoingEdges.length === 0) {
      continue;
    }

    // -- IF/ELSE
    if (parent.blockId === ACTIONS.CORE.CONDITION.IF.blockId) {
      const trueEdges = outgoingEdges.filter((edge) => edge.label === "true");
      const falseEdges = outgoingEdges.filter((edge) => edge.label === "false");

      if (trueEdges.length > 0 && falseEdges.length > 0) {
        // "true" children => place to the left
        for (const edge of trueEdges) {
          const child = edge.target;
          if (!visited.has(child.ref)) {
            child.setPosition(parentPos.x - 100, parentPos.y + 120);
            visited.add(child.ref);
            queue.push(child);
          }
        }
        // "false" children => place to the right
        for (const edge of falseEdges) {
          const child = edge.target;
          if (!visited.has(child.ref)) {
            child.setPosition(parentPos.x + 100, parentPos.y + 120);
            visited.add(child.ref);
            queue.push(child);
          }
        }
      }
      else if (trueEdges.length > 0) {
        // Only "true" edges
        for (const edge of trueEdges) {
          const child = edge.target;
          if (!visited.has(child.ref)) {
            child.setPosition(parentPos.x, parentPos.y + 120);
            visited.add(child.ref);
            queue.push(child);
          }
        }
      }
      else if (falseEdges.length > 0) {
        // Only "false" edges
        for (const edge of falseEdges) {
          const child = edge.target;
          if (!visited.has(child.ref)) {
            child.setPosition(parentPos.x, parentPos.y + 120);
            visited.add(child.ref);
            queue.push(child);
          }
        }
      }
    }

    // -- SPLIT
    else if (parent.blockId === ACTIONS.CORE.SPLIT.SPLIT.blockId) {
      // Filter out children we haven't visited
      const unvisitedChildren = outgoingEdges.filter((edge) => !visited.has(edge.target.ref));

      // We'll horizontally center them
      const spacing = 150;
      const n = unvisitedChildren.length;
      const totalWidth = (n - 1) * spacing;
      const leftX = parentPos.x - totalWidth / 2;
      const childY = parentPos.y + 120;

      unvisitedChildren.forEach((edge, i) => {
        const child = edge.target;
        const newX = leftX + i * spacing;
        child.setPosition(newX, childY);
        visited.add(child.ref);
        queue.push(child);
      });
    }

    // -- Default logic
    else {
      let childOffsetX = 0;
      const childSpacing = 300;

      for (const edge of outgoingEdges) {
        const child = edge.target;
        if (!visited.has(child.ref)) {
          child.setPosition(parentPos.x + childOffsetX, parentPos.y + 120);
          visited.add(child.ref);
          queue.push(child);
          childOffsetX += childSpacing;
        }
      }
    }
  } // end BFS
}

function buildActionAdjacencyMap(actions: Action[], edges: Edge[]): Map<string, Action[]> {
  const adjacency = new Map<string, Action[]>();

  for (const action of actions) {
    adjacency.set(action.ref, []);
  }

  for (const edge of edges) {
    const sourceRef = edge.source.ref;
    const target = edge.target; // This is an Action
    adjacency.get(sourceRef)?.push(target);
  }

  return adjacency;
}

function buildEdgeAdjacencyMap(actions: Action[], edges: Edge[]): Map<string, Edge[]> {
  const adjacency = new Map<string, Edge[]>();

  // Initialize an empty array for each action.ref
  for (const action of actions) {
    adjacency.set(action.ref, []);
  }

  // Populate adjacency with outgoing edges
  for (const edge of edges) {
    const sourceRef = edge.source.ref;
    adjacency.get(sourceRef)?.push(edge);
  }

  return adjacency;
}

function shiftSubtree(
  root: Action,
  dx: number,
  adjacency: Map<string, Action[]>
) {
  const queue = [root];
  const visited = new Set([root.ref]);

  while (queue.length > 0) {
    const node = queue.shift()!;
    const x = node.position?.x ?? 0;
    const y = node.position?.y ?? 0;

    // shift the node
    node.setPosition(x + dx, y);

    // enqueue children
    const children = adjacency.get(node.ref) || [];
    for (const child of children) {
      if (!visited.has(child.ref)) {
        visited.add(child.ref);
        queue.push(child);
      }
    }
  }
}

function resolveOverlaps(actions: Action[], edges: Edge[]) {
  // adjacency for subtree shifting
  const adjacency = buildActionAdjacencyMap(actions, edges);

  // Sort nodes top->bottom, then left->right
  actions.sort((a, b) => {
    const ay = a.position?.y ?? 0;
    const by = b.position?.y ?? 0;
    if (ay !== by) {
      return ay - by;
    }
    const ax = a.position?.x ?? 0;
    const bx = b.position?.x ?? 0;
    return ax - bx;
  });

  // For each node, compare with the ones after it
  for (let i = 0; i < actions.length; i++) {
    const nA = actions[i];
    const boxA = getBoundingBox(nA);

    for (let j = i + 1; j < actions.length; j++) {
      const nB = actions[j];
      const boxB = getBoundingBox(nB);

      // If overlap, push nB (and its subtree) far enough to the right
      if (isOverlap(boxA, boxB)) {
        const shiftAmount = (boxA.right - boxB.left) + 10; // +10 for a gap
        shiftSubtree(nB, shiftAmount, adjacency);

        // Optionally recalc boxB if you want to avoid repeated collisions
      }
    }
  }
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

  for (const protocol of protocols) {

    // Check case where user doesn't have any available asset to withdraw, go straight to deposit action if TRUE
    const noneBalanceSatisfiedIfBlock = createNoneOfBalanceCheckingSatisfiedConditionBlock(protocol);
    actions.push(noneBalanceSatisfiedIfBlock);

    // Compare between protocols
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

    // Check if account have balance before deposit
    const checkWalletUSDCBalanceForDefault = createUSDCBalanceCheckingConditionBlock();
    actions.push(checkWalletUSDCBalanceForDefault)

    // For case users don't have deposited amount on any protocols
    const depositDefault = await getBlockFromProtocolName(protocol, BlockType.DEPOSIT);
    actions.push(depositDefault)

    edges.push(new Edge({
      source: noneBalanceSatisfiedIfBlock,
      target: checkWalletUSDCBalanceForDefault,
      label: "true",
      value: "true",
    }));

    edges.push(new Edge({
      source: checkWalletUSDCBalanceForDefault,
      target: depositDefault,
      label: "true",
      value: "true",
    }));

    edges.push(new Edge({
      source: noneBalanceSatisfiedIfBlock,
      target: split,
      label: "false",
      value: "false",
    }));


    const withdrawBalanceCheckBlocks = [];
    for (const protocolInner of protocols) {

      // Check if account have balance before deposit
      const checkWalletUSDCBalance = createUSDCBalanceCheckingConditionBlock();
      actions.push(checkWalletUSDCBalance)

      // Deposit the all the amount to protocol
      const innerProtocolDeposit = await getBlockFromProtocolName(protocol, BlockType.DEPOSIT);
      actions.push(innerProtocolDeposit)

      if (protocolInner == protocol) {
        // Split - Each of protocols' withdraw all edge
        edges.push(new Edge({
          source: split,
          target: checkWalletUSDCBalance,
        }));

        edges.push(new Edge({
          source: checkWalletUSDCBalance,
          target: innerProtocolDeposit,
          label: "true",
          value: "true",
        }));

        continue;
      }

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
        target: checkWalletUSDCBalance,
      }));

      // Withdraw all - Deposit edge
      edges.push(new Edge({
        source: checkWalletUSDCBalance,
        target: innerProtocolDeposit,
        label: "true",
        value: "true",
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

  initializePositions(actions, edges);
  resolveOverlaps(actions, edges);

  return new Workflow("Lending aggregator", actions, edges);
}

async function lending_aggregator() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  const workflow = await createWorkflow();

  console.log('Workflow JSON: ', JSON.stringify(workflow.toJSON()));

  const creationResult = await workflow.create();

  console.log("lending_aggregator state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  /*const runResult = await workflow.run();

  console.log("lending_aggregator state after: " + workflow.getState());*/
}

lending_aggregator();