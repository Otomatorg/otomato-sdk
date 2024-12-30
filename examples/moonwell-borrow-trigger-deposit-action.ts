import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function moonwell_borrow_trigger_and_deposit_action() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Moonwell borrowing rate Trigger --------
  const moonWellBorrowingTrigger = new Trigger(TRIGGERS.LENDING.MOONWELL.BORROWING_RATES);
  moonWellBorrowingTrigger.setChainId(CHAINS.BASE);
  moonWellBorrowingTrigger.setCondition("gt");
  moonWellBorrowingTrigger.setComparisonValue(1);
  moonWellBorrowingTrigger.setParams("asset", getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress);

  // -------- Deposit MOONWELL --------
  const moonwellSupply = new Action(ACTIONS.LENDING.MOONWELL.DEPOSIT);
  moonwellSupply.setChainId(CHAINS.BASE);

  moonwellSupply.setParams(
      "abiParams.amount",
      await convertToTokenUnitsFromSymbol(0.00001, CHAINS.BASE, "USDC")
  );
  moonwellSupply.setParams(
      "tokenToDeposit",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  moonwellSupply.setPosition(0, 200);

  const edge1 = new Edge({
    source: moonWellBorrowingTrigger,
    target: moonwellSupply,
  });

  const workflow = new Workflow(
    "Moonwell Borrow Trigger and Supply Action on Base",
    [
      moonWellBorrowingTrigger,
      moonwellSupply,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("moonwell_borrow_trigger_and_deposit_action state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("moonwell_borrow_trigger_and_deposit_action state after: " + workflow.getState());
}

moonwell_borrow_trigger_and_deposit_action();