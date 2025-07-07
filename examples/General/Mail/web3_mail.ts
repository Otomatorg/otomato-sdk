/*import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function web3_mail() {

  const PROTECTED_DATA = "YOUR_PROTECTED_DATA_ADDRESS"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Eth price trigger --------
  const balanceTrigger = new Trigger(TRIGGERS.TOKENS.PRICE.PRICE_MOVEMENT_AGAINST_CURRENCY);
  balanceTrigger.setChainId(CHAINS.BASE);
  balanceTrigger.setComparisonValue(2500);
  balanceTrigger.setCondition("gte");
  balanceTrigger.setParams('currency', 'USD');
  balanceTrigger.setContractAddress(getTokenFromSymbol(CHAINS.BASE, "WETH").contractAddress);

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.WEB3MAIL.SEND_WEB3MAIL);
  notificationAction.setParams("content", "The current price of ETH on Base is " + balanceTrigger.getOutputVariableName('price') + " USD");
  notificationAction.setParams("subject", "ETH price on Base");
  notificationAction.setParams("protectedData", PROTECTED_DATA);

  const workflow = new Workflow(
    "ETH Price Monitor on Base using Web3Mail",
    [
      balanceTrigger,
      notificationAction
    ],
    [new Edge({
      source: balanceTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("ETH Price Monitor on Base using Web3Mail before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("ETH Price Monitor on Base using Web3Mail after: " + workflow.getState());
}

web3_mail();*/