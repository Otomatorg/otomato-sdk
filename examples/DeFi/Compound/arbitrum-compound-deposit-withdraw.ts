import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

const withdrawAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935n';


async function arbitrum_compound_deposit_withdraw() {

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

  // -------- Compound Supply --------
  const compoundSupplyAction = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
  compoundSupplyAction.setChainId(CHAINS.ARBITRUM);
  compoundSupplyAction.setParams(
      "abiParams.amount",
      0.00001
  );
  compoundSupplyAction.setParams(
      "abiParams.asset",
      getTokenFromSymbol(CHAINS.ARBITRUM, "USDC").contractAddress
  );

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
      compoundSupplyAction,
      compoundWithdrawAction,
    ],
    [new Edge({
      source: compoundSupplyTrigger,
      target: compoundSupplyAction,
    }), new Edge({
      source: compoundSupplyAction,
      target: compoundWithdrawAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Compound Deposit and Withdraw before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Compound Deposit and Withdraw after: " + workflow.getState());
}

arbitrum_compound_deposit_withdraw();