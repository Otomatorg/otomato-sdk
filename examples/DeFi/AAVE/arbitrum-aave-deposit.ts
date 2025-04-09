import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function arbitrum_aave() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Supply rate trigger --------
  const aaveSupplyTrigger = new Trigger(TRIGGERS.LENDING.AAVE.LENDING_RATE);
  aaveSupplyTrigger.setChainId(CHAINS.ARBITRUM);
  aaveSupplyTrigger.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress
  );
  aaveSupplyTrigger.setParams(
    "condition",
    "gt"
  );
  aaveSupplyTrigger.setParams(
    "comparisonValue",
    -100
  );

  // -------- Aave Supply --------
  const aaveSupplyAction = new Action(ACTIONS.LENDING.AAVE.SUPPLY);
  aaveSupplyAction.setChainId(CHAINS.ARBITRUM);
  aaveSupplyAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress);
  aaveSupplyAction.setParams("abiParams.amount", 0.00033);
  aaveSupplyAction.setParams("abiParams.referralCode", 0);
  aaveSupplyAction.setPosition(0, 200);

  const workflow = new Workflow(
    "Arbitrum Aave Deposit and Withdraw",
    [
      aaveSupplyTrigger,
      aaveSupplyAction,
    ],
    [new Edge({
      source: aaveSupplyTrigger,
      target: aaveSupplyAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Arbitrum Aave before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Arbitrum Aave after: " + workflow.getState());
}

arbitrum_aave();