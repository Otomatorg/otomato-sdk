import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function compound_withdraw_trigger_and_withdraw_action() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Compound Lending Rate Trigger --------
  const compoundWithdrawTrigger = new Trigger(
    TRIGGERS.LENDING.COMPOUND.BORROWING_RATES
  );
  compoundWithdrawTrigger.setChainId(CHAINS.BASE);
  compoundWithdrawTrigger.setCondition("gt");
  compoundWithdrawTrigger.setComparisonValue(-100);
  compoundWithdrawTrigger.setParams("token", getTokenFromSymbol(CHAINS.BASE, "WETH").contractAddress);

  // -------- Withdraw Compound --------
  const compoundWithdraw = new Action(ACTIONS.LENDING.COMPOUND.WITHDRAW);
  compoundWithdraw.setChainId(CHAINS.BASE);

  compoundWithdraw.setParams(
      "abiParams.amount",
      await convertToTokenUnitsFromSymbol(0.000001, CHAINS.BASE, "USDC")
  );
  compoundWithdraw.setParams(
      "abiParams.asset",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  const edge1 = new Edge({
    source: compoundWithdrawTrigger,
    target: compoundWithdraw,
  });

  const workflow = new Workflow(
    "Compound Withdraw Trigger",
    [
      compoundWithdrawTrigger,
      compoundWithdraw,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("compound_withdraw_trigger_and_withdraw_action state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("compound_withdraw_trigger_and_withdraw_action state after: " + workflow.getState());
}

compound_withdraw_trigger_and_withdraw_action();