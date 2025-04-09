import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

const withdrawAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935n';


async function arbitrum_compound_aave_withdraw() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Supply rate trigger --------
  const compoundSupplyTrigger = new Trigger(TRIGGERS.LENDING.COMPOUND.LENDING_RATE);
  compoundSupplyTrigger.setChainId(CHAINS.ARBITRUM);
  compoundSupplyTrigger.setParams(
    "token",
    getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress
  );
  compoundSupplyTrigger.setParams(
    "condition",
    "gt"
  );
  compoundSupplyTrigger.setParams(
    "comparisonValue",
    -100
  );

  // Split
  const split = new Action(ACTIONS.CORE.SPLIT.SPLIT);

  // -------- Aave Withdraw --------
  const aaveWithdrawAction = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);
  aaveWithdrawAction.setChainId(CHAINS.ARBITRUM);
  aaveWithdrawAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress);
  aaveWithdrawAction.setParams("abiParams.amount", withdrawAmount);
  aaveWithdrawAction.setParams("abiParams.to", '0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d');
  aaveWithdrawAction.setPosition(0, 300);

  // -------- Withdraw Compound --------
  const compoundWithdrawAction = new Action(ACTIONS.LENDING.COMPOUND.WITHDRAW);
  compoundWithdrawAction.setChainId(CHAINS.ARBITRUM);
  compoundWithdrawAction.setParams(
      "abiParams.amount",
      withdrawAmount
  );
  compoundWithdrawAction.setParams(
      "abiParams.asset",
      getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress
  );


  const workflow = new Workflow(
    "Compound Deposit and Withdraw",
    [
      compoundSupplyTrigger,
      split,
      aaveWithdrawAction,
      compoundWithdrawAction,
    ],
    [new Edge({
      source: compoundSupplyTrigger,
      target: split,
    }), new Edge({
      source: split,
      target: aaveWithdrawAction,
    }), new Edge({
      source: split,
      target: compoundWithdrawAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Compound and Aave Withdraw before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Compound and Aave Withdraw after: " + workflow.getState());
}

arbitrum_compound_aave_withdraw();