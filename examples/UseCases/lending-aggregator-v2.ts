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
  } from '../../src/index.js';
  import dotenv from 'dotenv';
  dotenv.config();
  
  /*************************************
   * 1. Static Constants
   *************************************/
  const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
  
  const SMART_ACCOUNT_ADDRESS = '0x9ebF4899c05039a52407D919A63630Ccd3F399ae';
  const USDC_ADDRESS = '0xd988097fb8612cc24eeC14542bC03424c656005f';
  
  // For Ironclad
  const IRONCLAD_USDC_ADDRESS = '0xe7334Ad0e325139329E747cF2Fc24538dD564987';
  
  // === NEW for Ironclad yield better ===
  // For Ionic
  // Typically, the “cToken” address for USDC on Ionic. 
  // (You might need to confirm the exact address in your environment)
  const IONIC_USDC_ADDRESS = '0x2BE717340023C9e14C1Bb12cb3ecBcfd3c3fB038';
  
  const IONIC_YIELD = `{{external.functions.ionicLendingRate(34443,${USDC_ADDRESS})}}`;
  const IRONCLAD_YIELD = `{{external.functions.ironcladLendingRate(34443,${USDC_ADDRESS})}}`;
  
  // Balances
  const IRONCLAD_USDC_BALANCE = `{{external.functions.erc20Balance(34443,${SMART_ACCOUNT_ADDRESS},${IRONCLAD_USDC_ADDRESS},,)}}`;
  const WALLET_USDC_BALANCE = `{{external.functions.erc20Balance(34443,${SMART_ACCOUNT_ADDRESS},${USDC_ADDRESS},,)}}`;
  const IONIC_USDC_BALANCE = `{{external.functions.erc20Balance(34443,${SMART_ACCOUNT_ADDRESS},${IONIC_USDC_ADDRESS},,)}}`;

  const UINT256_MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935n';
  
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
   * Fear & Greed Trigger: triggers when index is above 0
   */
  function createFearAndGreedTrigger(): Trigger {
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    // Condition: index must be > 0
    trigger.setParams('period', 1000*60*60);
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
    conditionGroup.addConditionCheck(IRONCLAD_USDC_BALANCE, 'gt', '100000'); // more than 0.1 USDC
  
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
    withdraw.setParams('abiParams.asset', USDC_ADDRESS);
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
    deposit.setParams('tokenToDeposit', USDC_ADDRESS);
  
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
    conditionGroup.addConditionCheck(IONIC_USDC_BALANCE, 'gt', '100000'); // more than 0.1 USDC
  
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
    withdraw.setParams('tokenToWithdraw', USDC_ADDRESS);
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
  
    deposit.setParams('abiParams.asset', USDC_ADDRESS);
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
    const compareMessage = createSlackMessage('Comparing Ionic vs Ironclad yields...');
    actions.push(compareMessage);
  
    const compareCondition = createCompareIonicVsIroncladCondition();
    actions.push(compareCondition);
  
    edges.push(
      new Edge({
        source: fearAndGreedTrigger,
        target: compareMessage,
      }),
      new Edge({
        source: compareMessage,
        target: compareCondition,
      })
    );
  
    /********************************
     * STEP 3 (True): Ionic yield is higher
     * => Check if user has Ironclad USDC
     ********************************/
    const ionicHigherMessage = createSlackMessage('Ionic yield is higher! Checking Ironclad USDC...');
    actions.push(ionicHigherMessage);
  
    const checkIroncladCondition = createCheckIroncladUSDCCondition();
    actions.push(checkIroncladCondition);
  
    edges.push(
      // True path from compareCondition => Ionic yield is higher
      new Edge({
        source: compareCondition,
        target: ionicHigherMessage,
        label: 'true',
        value: 'true',
      }),
      new Edge({
        source: ionicHigherMessage,
        target: checkIroncladCondition,
      })
    );
  
    /********************************
     * STEP 4A: If user DOES have USDC on Ironclad
     * => Withdraw, wait 10s, deposit on Ionic
     ********************************/
    const ironcladUSDCMessage = createSlackMessage('Withdrawing from Ironclad...');
    actions.push(ironcladUSDCMessage);
  
    const ironcladWithdraw = createIroncladWithdrawAll();
    actions.push(ironcladWithdraw);
  
    // Wait 10s
    const wait10Message = createSlackMessage('Waiting 10 seconds...');
    actions.push(wait10Message);
  
    const wait10seconds = createWaitAction10Seconds();
    actions.push(wait10seconds);
  
    // Deposit on Ionic
    const depositMessage = createSlackMessage('Depositing USDC on Ionic...');
    actions.push(depositMessage);
  
    const depositOnIonic = createDepositOnIonic();
    actions.push(depositOnIonic);
  
    edges.push(
      new Edge({
        source: checkIroncladCondition,
        target: ironcladUSDCMessage,
        label: 'true',
        value: 'true',
      }),
      new Edge({
        source: ironcladUSDCMessage,
        target: ironcladWithdraw,
      }),
      new Edge({
        source: ironcladWithdraw,
        target: wait10Message,
      }),
      new Edge({
        source: wait10Message,
        target: wait10seconds,
      }),
      new Edge({
        source: wait10seconds,
        target: depositMessage,
      }),
      new Edge({
        source: depositMessage,
        target: depositOnIonic,
      })
    );
  
    /********************************
     * STEP 4B: If user does NOT have USDC on Ironclad
     * => Check if user has USDC in wallet
     ********************************/
    const checkWalletMessage = createSlackMessage('No Ironclad USDC. Checking wallet balance...');
    actions.push(checkWalletMessage);
  
    const checkWalletUSDC = createCheckWalletUSDCCondition();
    actions.push(checkWalletUSDC);
  
    edges.push(
      new Edge({
        source: checkIroncladCondition,
        target: checkWalletMessage,
        label: 'false',
        value: 'false',
      }),
      new Edge({
        source: checkWalletMessage,
        target: checkWalletUSDC,
      })
    );
  
    /********************************
     * STEP 4C: If user does have USDC in wallet
     * => Deposit on Ionic
     ********************************/
    const depositMessage2 = createSlackMessage('Depositing USDC on Ionic (no Ironclad holdings)...');
    actions.push(depositMessage2);
  
    const depositOnIonic2 = createDepositOnIonic();
    actions.push(depositOnIonic2);
  
    edges.push(
      new Edge({
        source: checkWalletUSDC,
        target: depositMessage2,
        label: 'true',
        value: 'true',
      }),
      new Edge({
        source: depositMessage2,
        target: depositOnIonic2,
      })
    );
  
    /***************************************************************************
     * === NEW for Ironclad yield better (False Path from compareCondition) ===
     * STEP 5: Ironclad yield is equal/higher => Check if user has Ionic USDC
     **************************************************************************/
    const ironcladHigherMessage = createSlackMessage('Ironclad yield is better! Checking Ionic USDC...');
    actions.push(ironcladHigherMessage);
  
    const checkIonicUSDC = createCheckIonicUSDCCondition();
    actions.push(checkIonicUSDC);
  
    edges.push(
      // False path from compareCondition => Ironclad yield is equal or higher
      new Edge({
        source: compareCondition,
        target: ironcladHigherMessage,
        label: 'false',
        value: 'false',
      }),
      new Edge({
        source: ironcladHigherMessage,
        target: checkIonicUSDC,
      })
    );
  
    /********************************
     * STEP 5A: If user DOES have USDC on Ionic
     * => Withdraw, wait 10s, deposit on Ironclad
     ********************************/
    const ionicUSDCMessage = createSlackMessage('Withdrawing from Ionic...');
    actions.push(ionicUSDCMessage);
  
    const ionicWithdraw = createIonicWithdrawAll();
    actions.push(ionicWithdraw);
  
    // Wait 10s
    const wait10Message2 = createSlackMessage('Waiting 10 seconds...');
    actions.push(wait10Message2);
  
    const wait10seconds2 = createWaitAction10Seconds();
    actions.push(wait10seconds2);
  
    // Deposit on Ironclad
    const depositIroncladMessage = createSlackMessage('Depositing USDC on Ironclad...');
    actions.push(depositIroncladMessage);
  
    const depositOnIronclad = createDepositOnIronclad();
    actions.push(depositOnIronclad);
  
    edges.push(
      new Edge({
        source: checkIonicUSDC,
        target: ionicUSDCMessage,
        label: 'true',
        value: 'true',
      }),
      new Edge({
        source: ionicUSDCMessage,
        target: ionicWithdraw,
      }),
      new Edge({
        source: ionicWithdraw,
        target: wait10Message2,
      }),
      new Edge({
        source: wait10Message2,
        target: wait10seconds2,
      }),
      new Edge({
        source: wait10seconds2,
        target: depositIroncladMessage,
      }),
      new Edge({
        source: depositIroncladMessage,
        target: depositOnIronclad,
      })
    );
  
    /********************************
     * STEP 5B: If user does NOT have USDC on Ionic
     * => Check if user has USDC in wallet
     ********************************/
    const checkWalletMessage2 = createSlackMessage('No Ionic USDC. Checking wallet balance...');
    actions.push(checkWalletMessage2);
  
    const checkWalletUSDC2 = createCheckWalletUSDCCondition();
    actions.push(checkWalletUSDC2);
  
    edges.push(
      new Edge({
        source: checkIonicUSDC,
        target: checkWalletMessage2,
        label: 'false',
        value: 'false',
      }),
      new Edge({
        source: checkWalletMessage2,
        target: checkWalletUSDC2,
      })
    );
  
    /********************************
     * STEP 5C: If user does have USDC in wallet
     * => Deposit on Ironclad
     ********************************/
    const depositMessage3 = createSlackMessage('Depositing USDC on Ironclad (no Ionic holdings)...');
    actions.push(depositMessage3);
  
    const depositOnIronclad2 = createDepositOnIronclad();
    actions.push(depositOnIronclad2);
  
    edges.push(
      new Edge({
        source: checkWalletUSDC2,
        target: depositMessage3,
        label: 'true',
        value: 'true',
      }),
      new Edge({
        source: depositMessage3,
        target: depositOnIronclad2,
      })
    );
  
    /********************************
     * Final Workflow
     ********************************/
    const workflow = new Workflow('Aggregator Workflow', actions, edges);
  
    // Log JSON (optional)
    // console.log('Workflow JSON:', JSON.stringify(workflow.toJSON(), null, 2));
  
    // Create/run on your platform:
    const creationResult = await workflow.create();
    // console.log("Creation result:", creationResult);
  
    const runResult = await workflow.run();
    console.log("Run result:", runResult);
  }
  
  // Optional immediate call to test
  aggregatorWorkflow();