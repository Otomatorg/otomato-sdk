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
   * 1. Static Constants
   *************************************/
  
  const VARIABLES = {
    CHAIN: CHAINS.BASE,
    TOKEN_BTC: getTokenFromSymbol(CHAINS.BASE, 'cbBTC').contractAddress,
    TOKEN_USDC: getTokenFromSymbol(CHAINS.BASE, 'USDC').contractAddress,
    PERIOD: 1000 * 60 * 60 * 24, // 24 hours
    FEAR_AND_GREED_INDEX: '{{external.functions.btcFearAndGreed()}}',
    SELL_AMOUNT_BTC: 0.0001, // 0.0001 BTC (in 18 decimal format)
    SELL_AMOUNT_USDC: 10, // 10 USDC (in 6 decimal format)
  };
  
  /*************************************
   * 2. Logic/Action Functions
   *************************************/
  
  /** 
   * Periodic Trigger: Executes every 25 hours
   */
  function createPeriodicTrigger(): Trigger {
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams('period', VARIABLES.PERIOD);
    return trigger;
  }
  
  /**
   * SPLIT Action: Creates a branching point in the flow
   */
  function createSplitAction(): Action {
    return new Action(ACTIONS.CORE.SPLIT.SPLIT);
  }
  
  /**
   * Condition: Check if Fear & Greed Index > 75
   */
  function createHighFearAndGreedCondition(): Action {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
  
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(VARIABLES.FEAR_AND_GREED_INDEX, 'gt', '80');
  
    condition.setParams('groups', [group]);
    return condition;
  }
  
  /**
   * Action: Swap 0.003 WETH to USDC
   */
  function createSwapWETHToUSDC(): Action {
    const swap = new Action(ACTIONS.CORE.SWAP.SWAP);
    swap.setChainId(VARIABLES.CHAIN);
  
    swap.setParams('tokenIn', VARIABLES.TOKEN_BTC);
    swap.setParams('tokenOut', VARIABLES.TOKEN_USDC);
    swap.setParams('amount', VARIABLES.SELL_AMOUNT_BTC);
    swap.setParams('slippage', 0.1); // todo: put to 0.1
  
    return swap;
  }
  
  /**
   * Condition: Check if Fear & Greed Index < 25
   */
  function createLowFearAndGreedCondition(): Action {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
  
    const group = new ConditionGroup(LOGIC_OPERATORS.AND);
    group.addConditionCheck(VARIABLES.FEAR_AND_GREED_INDEX, 'lt', '20');
  
    condition.setParams('groups', [group]);
    return condition;
  }
  
  /**
   * Action: Swap 10 USDC to WETH
   */
  function createSwapUSDCToWETH(): Action {
    const swap = new Action(ACTIONS.CORE.SWAP.SWAP);
    swap.setChainId(VARIABLES.CHAIN);
  
    swap.setParams('tokenIn', VARIABLES.TOKEN_USDC);
    swap.setParams('tokenOut', VARIABLES.TOKEN_BTC);
    swap.setParams('amount', VARIABLES.SELL_AMOUNT_USDC);
    swap.setParams('slippage', 0.3);
  
    return swap;
  }
  
  /*************************************
   * 3. Main Workflow Builder
   *************************************/
  export async function fearAndGreedWorkflow() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) return;
  
    // Initialize API services
    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);
  
    const actions: Action[] = [];
    const edges: Edge[] = [];
  
    /********************************
     * STEP 1: Periodic Trigger
     ********************************/
    const periodicTrigger = createPeriodicTrigger();
    actions.push(periodicTrigger);
  
    /********************************
     * STEP 2: SPLIT
     ********************************/
    const splitAction = createSplitAction();
    actions.push(splitAction);
  
    edges.push(
      new Edge({
        source: periodicTrigger,
        target: splitAction,
      })
    );
  
    /********************************
     * BRANCH 1: Fear & Greed > 80
     ********************************/
    const highFearAndGreedCondition = createHighFearAndGreedCondition();
    actions.push(highFearAndGreedCondition);
  
    const swapWETHToUSDC = createSwapWETHToUSDC();
    actions.push(swapWETHToUSDC);
  
    edges.push(
      new Edge({
        source: splitAction,
        target: highFearAndGreedCondition,
      }),
      new Edge({
        source: highFearAndGreedCondition,
        target: swapWETHToUSDC,
        label: 'true',
        value: 'true',
      })
    );
  
    /********************************
     * BRANCH 2: Fear & Greed < 20
     ********************************/
    const lowFearAndGreedCondition = createLowFearAndGreedCondition();
    actions.push(lowFearAndGreedCondition);
  
    const swapUSDCToWETH = createSwapUSDCToWETH();
    actions.push(swapUSDCToWETH);
  
    edges.push(
      new Edge({
        source: splitAction,
        target: lowFearAndGreedCondition,
      }),
      new Edge({
        source: lowFearAndGreedCondition,
        target: swapUSDCToWETH,
        label: 'true',
        value: 'true',
      })
    );
  
    /********************************
     * Final Workflow
     ********************************/
    const workflow = new Workflow('Fear and Greed Workflow', actions, edges);
  
    // Log JSON (optional)
    console.log(JSON.stringify(workflow));
  
    // Optionally create and run the workflow
    //await workflow.create();
    //await workflow.run();
  }
  
  // Execute the workflow for testing
  fearAndGreedWorkflow();