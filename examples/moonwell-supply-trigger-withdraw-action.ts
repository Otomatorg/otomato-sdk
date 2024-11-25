import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function moonwell_supply_trigger_and_withdraw_action() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Moonwell lending rate Trigger --------
  const moonWellLendingTrigger = new Trigger(TRIGGERS.LENDING.MOONWELL.LENDING_RATE);
  moonWellLendingTrigger.setChainId(CHAINS.BASE);
  moonWellLendingTrigger.setCondition("gt");
  moonWellLendingTrigger.setComparisonValue(1);
  moonWellLendingTrigger.setParams("lendingRateToken", getTokenFromSymbol(CHAINS.BASE, "wstETH").contractAddress);

  // -------- Withdraw MOONWELL --------
  const moonwellWithdraw = new Action(ACTIONS.LENDING.MOONWELL.WITHDRAW);
  moonwellWithdraw.setChainId(CHAINS.BASE);

  moonwellWithdraw.setParams(
      "abiParams.amount",
      await convertToTokenUnitsFromSymbol(0.00001, CHAINS.BASE, "USDC")
  );
  moonwellWithdraw.setParams(
      "tokenToWithdraw",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  moonwellWithdraw.setPosition(0, 200);

  const edge1 = new Edge({
    source: moonWellLendingTrigger,
    target: moonwellWithdraw,
  });

  const workflow = new Workflow(
    "Moonwell Supply Trigger and  Withdraw Action on Base",
    [
      moonWellLendingTrigger,
      moonwellWithdraw,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("moonwell_supply_trigger_and_withdraw_action state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("moonwell_supply_trigger_and_withdraw_action state after: " + workflow.getState());
}

moonwell_supply_trigger_and_withdraw_action();