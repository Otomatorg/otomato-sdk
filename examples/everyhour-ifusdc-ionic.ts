import {
    ACTIONS,
    Action,
    TRIGGERS,
    Trigger,
    Workflow,
    CHAINS,
    getTokenFromSymbol,
    Edge,
    apiServices,
    LOGIC_OPERATORS,
    ConditionGroup,
} from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const walletAddress = '0x757A004bE766f745fd4CD75966CF6C8Bb84FD7c1';

async function daily_usdc_deposit_on_ionic() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
        console.error("Missing API_URL or AUTH_TOKEN in env");
        return;
    }

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams("period", 86400000); // 1 day
    trigger.setPosition(400, 120);

    /**
     * 2) Condition: Check if USDC balance > 0
     *    For demonstration, we’re using an external function that checks an ERC-20 balance.
     *    - 8453 is chainId for Base
     *    - wallet is "0xYourWalletAddress"
     *    - contract is USDC address on Base
     */
    const USDCBalance = `{{external.functions.erc20Balance(34443,${walletAddress},0xd988097fb8612cc24eeC14542bC03424c656005f,,)}}`;

    const ifCondition = new Action(ACTIONS.CORE.CONDITION.IF);
    ifCondition.setParams("logic", LOGIC_OPERATORS.OR);

    const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
    conditionGroup.addConditionCheck(USDCBalance, "gt", "0"); // If USDCBalance > 0

    ifCondition.setParams("groups", [conditionGroup]);
    ifCondition.setPosition(400, 240);

    /**
     * 3) Ionic Deposit: deposit all USDC
     *    Because we’re depositing the entire balance, just pass in the USDCBalance variable.
     */
    const ionicDeposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
    ionicDeposit.setChainId(CHAINS.MODE);
    ionicDeposit.setParams("tokenToDeposit", getTokenFromSymbol(CHAINS.MODE, "USDC").contractAddress);
    // deposit entire USDC balance
    ionicDeposit.setParams("abiParams.amount", USDCBalance);
    ionicDeposit.setPosition(400, 360);

    /**
     * Build the workflow
     */
    const workflow = new Workflow("Daily USDC deposit on Ionic", [
        trigger,
        ifCondition,
        ionicDeposit
    ]);

    // Edges
    const edge1 = new Edge({
        source: trigger,
        target: ifCondition,
    });

    // If true => deposit on Ionic
    const edge2 = new Edge({
        source: ifCondition,
        target: ionicDeposit,
        label: "true",
        value: "true",
    });

    workflow.addEdge(edge1);
    workflow.addEdge(edge2);

    // Debug: see the workflow as JSON
    console.log("Workflow JSON:");
    console.log(JSON.stringify(workflow.toJSON(), null, 2));

    // 4) Create the workflow in the system
    const creationResult = await workflow.create();
    console.log("Workflow state after creation:", workflow.getState());

    if (!creationResult.success) {
        throw new Error("An error occurred while creating the workflow");
    }

    // 5) Run the workflow
    const runResult = await workflow.run();
    console.log("Workflow state after run:", workflow.getState());

    if (!runResult.success) {
        throw new Error("An error occurred while running the workflow");
    } else {
        console.log(`Workflow ${workflow.id} is running`);
    }
}

async function dailySlackNotification() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
        console.error("Missing API_URL or AUTH_TOKEN in env");
        return;
    }

    // Setup API access
    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);

    // 1) Trigger: once every 24 hours (period = 86400000ms)
    const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
    trigger.setParams("period", 86400000); // 24 hours in milliseconds
    trigger.setPosition(100, 100);

    // 2) Slack Action: send a Slack message
    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", process.env.SLACK_WEBHOOK ?? "");
    slackAction.setParams("message", "Hello! This message is sent daily via Slack.");
    slackAction.setPosition(300, 100);

    // 3) Build the Workflow
    const workflow = new Workflow("Daily Slack Notification", [trigger, slackAction]);

    // 4) Add Edge (trigger → slackAction)
    const edge1 = new Edge({
        source: trigger,
        target: slackAction,
    });
    workflow.addEdge(edge1);

    // Debug: see the workflow as JSON
    console.log("Workflow JSON:");
    console.log(JSON.stringify(workflow.toJSON(), null, 2));

    // 5) Create the workflow in the system
    const creationResult = await workflow.create();
    console.log("Workflow state after creation:", workflow.getState());

    if (!creationResult.success) {
        throw new Error("An error occurred while creating the workflow");
    }

    // 6) Run the workflow (manually starts it)
    const runResult = await workflow.run();
    console.log("Workflow state after run:", workflow.getState());

    if (!runResult.success) {
        throw new Error("An error occurred while running the workflow");
    } else {
        console.log(`Workflow ${workflow.id} is running`);
    }
}

//dailySlackNotification();
daily_usdc_deposit_on_ionic();