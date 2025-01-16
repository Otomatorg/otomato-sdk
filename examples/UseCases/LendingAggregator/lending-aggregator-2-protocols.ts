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
    CHAIN: CHAINS.MODE,
    TOKEN_ADDRESS: getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress,
    MONEY_MARKET_1_TOKEN: getTokenFromSymbol(CHAINS.MODE, 'ion-WETH').contractAddress,
    MONEY_MARKET_2_TOKEN: getTokenFromSymbol(CHAINS.MODE, 'ironETH').contractAddress,
    // BALANCE_THRESHOLD: 100000, // 0.1 USDC
    BALANCE_THRESHOLD: 1000000000000, // 0.000001 ETH = 0.03 USDC
    LOOP_PERIOD: 1000*60*60, // 1 hour
  };
  
  const IONIC_YIELD = `{{external.functions.ionicLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS})}}`;
  const IRONCLAD_YIELD = `{{external.functions.ironcladLendingRate(${VARIABLES.CHAIN},${VARIABLES.TOKEN_ADDRESS})}}`;
  
  // Balances
  const IONIC_USDC_BALANCE = `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${VARIABLES.MONEY_MARKET_1_TOKEN},,)}}`;
  const IRONCLAD_USDC_BALANCE = `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${VARIABLES.MONEY_MARKET_2_TOKEN},,)}}`;
  const WALLET_USDC_BALANCE = `{{external.functions.erc20Balance(${VARIABLES.CHAIN},{{smartAccountAddress}},${VARIABLES.TOKEN_ADDRESS},,)}}`;

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
    return trigger;
  }
  
  /** 
   * Condition: Compare Ionic yield > Ironclad yield
   * True path => Ionic yield is higher
   * False path => Ironclad yield is equal or higher
   */
  function createCompareIonicVsIroncladCondition(): Action {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
  
    const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup.addConditionCheck(IONIC_YIELD, 'gt', IRONCLAD_YIELD);
  
    condition.setParams('groups', [conditionGroup]);
    return condition;
  }
  
  /**
   * Condition: Check if user has Ironclad USDC
   */
  function createCheckIroncladUSDCCondition(): Action {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
  
    const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup.addConditionCheck(IRONCLAD_USDC_BALANCE, 'gt', VARIABLES.BALANCE_THRESHOLD);
  
    condition.setParams('groups', [conditionGroup]);
    return condition;
  }
  
  /**
   * Action: Withdraw from Ironclad
   */
  function createIroncladWithdrawAll(): Action {
    const withdraw = new Action(ACTIONS.LENDING.IRONCLAD.WITHDRAW);
    withdraw.setChainId(CHAINS.MODE);
    // Typically, you'd withdraw "max" by specifying a large number (2^256-1).
    withdraw.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    withdraw.setParams(
      'abiParams.amount',
      UINT256_MAX
    );
    return withdraw;
  }
  
  /**
   * Action: Wait 10 seconds
   */
  function createWaitAction10Seconds(): Action {
    const waitAction = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    // "time" is in milliseconds
    waitAction.setParams('time', '10000'); // 10 seconds
    return waitAction;
  }
  
  /**
   * Action: Deposit USDC on Ionic
   */
  function createDepositOnIonic(): Action {
    const deposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
    deposit.setChainId(CHAINS.MODE);
  
    deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
    deposit.setParams('tokenToDeposit', VARIABLES.TOKEN_ADDRESS);
  
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
   * === NEW for Ironclad yield better ===
   * Condition: Check if user has IONIC USDC 
   */
  function createCheckIonicUSDCCondition(): Action {
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
    condition.setParams('logic', LOGIC_OPERATORS.OR);
  
    const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup.addConditionCheck(IONIC_USDC_BALANCE, 'gt', VARIABLES.BALANCE_THRESHOLD);
  
    condition.setParams('groups', [conditionGroup]);
    return condition;
  }
  
  /**
   * === NEW for Ironclad yield better ===
   * Action: Withdraw from Ionic
   */
  function createIonicWithdrawAll(): Action {
    const withdraw = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);
    withdraw.setChainId(CHAINS.MODE);
  
    // Typically, you'd withdraw "max".
    withdraw.setParams('tokenToWithdraw', VARIABLES.TOKEN_ADDRESS);
    withdraw.setParams(
      'abiParams.amount',
      UINT256_MAX
    );
  
    return withdraw;
  }
  
  /**
   * === NEW for Ironclad yield better ===
   * Action: Deposit on Ironclad
   */
  function createDepositOnIronclad(): Action {
    const deposit = new Action(ACTIONS.LENDING.IRONCLAD.SUPPLY);
    deposit.setChainId(CHAINS.MODE);
  
    deposit.setParams('abiParams.asset', VARIABLES.TOKEN_ADDRESS);
    deposit.setParams('abiParams.amount', WALLET_USDC_BALANCE);
    deposit.setParams('abiParams.referralCode', 0);
  
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
     * STEP 2: Compare Ionic vs Ironclad
     ********************************/

    const compareCondition = createCompareIonicVsIroncladCondition();
    actions.push(compareCondition);
  
    edges.push(
      new Edge({
        source: fearAndGreedTrigger,
        target: compareCondition,
      })
    );
  
    /********************************
     * STEP 3 (True): Ionic yield is higher
     * => Check if user has Ironclad USDC
     ********************************/
    const checkIroncladCondition = createCheckIroncladUSDCCondition();
    actions.push(checkIroncladCondition);
  
    edges.push(
      // True path from compareCondition => Ionic yield is higher
      new Edge({
        source: compareCondition,
        target: checkIroncladCondition,
        label: 'true',
        value: 'true',
      })
    );
  
    /********************************
     * STEP 4A: If user DOES have USDC on Ironclad
     * => Withdraw, wait 10s, deposit on Ionic
     ********************************/
    const ironcladWithdraw = createIroncladWithdrawAll();
    actions.push(ironcladWithdraw);
  
    const wait10seconds = createWaitAction10Seconds();
    actions.push(wait10seconds);
  
    const depositOnIonic = createDepositOnIonic();
    actions.push(depositOnIonic);
  
    edges.push(
      new Edge({
        source: checkIroncladCondition,
        target: ironcladWithdraw,
        label: 'true',
        value: 'true',
      }),
      new Edge({
        source: ironcladWithdraw,
        target: wait10seconds,
      }),
      new Edge({
        source: wait10seconds,
        target: depositOnIonic,
      })
    );
  
    /********************************
     * STEP 4B: If user does NOT have USDC on Ironclad
     * => Check if user has USDC in wallet
     ********************************/
    const checkWalletUSDC = createCheckWalletUSDCCondition();
    actions.push(checkWalletUSDC);
  
    edges.push(
      new Edge({
        source: checkIroncladCondition,
        target: checkWalletUSDC,
        label: 'false',
        value: 'false',
      })
    );
  
    /********************************
     * STEP 4C: If user does have USDC in wallet
     * => Deposit on Ionic
     ********************************/
    const depositOnIonic2 = createDepositOnIonic();
    actions.push(depositOnIonic2);
  
    edges.push(
      new Edge({
        source: checkWalletUSDC,
        target: depositOnIonic2,
        label: 'true',
        value: 'true',
      })
    );
  
    /***************************************************************************
     * === NEW for Ironclad yield better (False Path from compareCondition) ===
     * STEP 5: Ironclad yield is equal/higher => Check if user has Ionic USDC
     **************************************************************************/
  
    const checkIonicUSDC = createCheckIonicUSDCCondition();
    actions.push(checkIonicUSDC);
  
    edges.push(
      // False path from compareCondition => Ironclad yield is equal or higher
      new Edge({
        source: compareCondition,
        target: checkIonicUSDC,
        label: 'false',
        value: 'false',
      })
    );
  
    const ionicWithdraw = createIonicWithdrawAll();
    actions.push(ionicWithdraw);
  
    const wait10seconds2 = createWaitAction10Seconds();
    actions.push(wait10seconds2);
  
    const depositOnIronclad = createDepositOnIronclad();
    actions.push(depositOnIronclad);
  
    edges.push(
      new Edge({
        source: checkIonicUSDC,
        target: ionicWithdraw,
        label: 'true',
        value: 'true',
      }),
      new Edge({
        source: ionicWithdraw,
        target: wait10seconds2,
      }),
      new Edge({
        source: wait10seconds2,
        target: depositOnIronclad,
      })
    );
  
    /********************************
     * STEP 5B: If user does NOT have USDC on Ionic
     * => Check if user has USDC in wallet
     ********************************/
    const checkWalletUSDC2 = createCheckWalletUSDCCondition();
    actions.push(checkWalletUSDC2);
  
    edges.push(
      new Edge({
        source: checkIonicUSDC,
        target: checkWalletUSDC2,
        label: 'false',
        value: 'false',
      }),
    );
  
    /********************************
     * STEP 5C: If user does have USDC in wallet
     * => Deposit on Ironclad
     ********************************/
    const depositOnIronclad2 = createDepositOnIronclad();
    actions.push(depositOnIronclad2);
  
    edges.push(
      new Edge({
        source: checkWalletUSDC2,
        target: depositOnIronclad2,
        label: 'true',
        value: 'true',
      })
    );
  
    /********************************
     * Final Workflow
     ********************************/
    const workflow = new Workflow('Aggregator Workflow', actions, edges);
  
    // Log JSON (optional)
    console.log(JSON.stringify(workflow));
  
    // Create/run on your platform:
    //const creationResult = await workflow.create();
    // console.log("Creation result:", creationResult);
    // console.log("Workflow ID:", workflow.id);
  
    //const runResult = await workflow.run();
    //console.log("Run result:", runResult);
  }
  
  // Optional immediate call to test
  aggregatorWorkflow();