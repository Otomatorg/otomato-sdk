import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

const withdrawAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935n';

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
    0 // putting 0 as comparison value so that the workflow is triggered instantly
  );

  // -------- Aave Supply --------
  const aaveSupplyAction = new Action(ACTIONS.LENDING.AAVE.SUPPLY);
  aaveSupplyAction.setChainId(CHAINS.ARBITRUM);
  aaveSupplyAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress);
  aaveSupplyAction.setParams("abiParams.amount", 0.00001);
  aaveSupplyAction.setParams("abiParams.referralCode", 0);
  aaveSupplyAction.setPosition(0, 200);

  // -------- Aave Withdraw --------
  const aaveWithdrawAction = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);
  aaveWithdrawAction.setChainId(CHAINS.ARBITRUM);
  aaveWithdrawAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress);
  aaveWithdrawAction.setParams("abiParams.amount", withdrawAmount);
  aaveWithdrawAction.setParams("abiParams.to", '0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d');
  aaveWithdrawAction.setPosition(0, 300);

  const workflow = new Workflow(
    "Arbitrum Aave Deposit and Withdraw",
    [
      aaveSupplyTrigger,
      aaveSupplyAction,
      aaveWithdrawAction,
    ],
    [new Edge({
      source: aaveSupplyTrigger,
      target: aaveSupplyAction,
    }), new Edge({
      source: aaveSupplyAction,
      target: aaveWithdrawAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Arbitrum Aave before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Arbitrum Aave after: " + workflow.getState());
}

arbitrum_aave();