import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ironclad_trigger_borrow_action_borrow() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Borrow rate trigger --------
  const ironcladBorrowTrigger = new Trigger(TRIGGERS.LENDING.IRONCLAD.BORROWING_RATES);
  ironcladBorrowTrigger.setChainId(CHAINS.MODE);
  ironcladBorrowTrigger.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.MODE, "USDT").contractAddress
  );
  ironcladBorrowTrigger.setParams(
    "condition",
    "gt"
  );
  ironcladBorrowTrigger.setParams(
    "comparisonValue",
    -200
  );
  
  // -------- Withdraw --------
  const withdrawAction = new Action(ACTIONS.LENDING.IRONCLAD.WITHDRAW);
  withdrawAction.setChainId(CHAINS.MODE);
  withdrawAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.MODE, "USDC").contractAddress);
  withdrawAction.setParams("abiParams.amount", await convertToTokenUnitsFromSymbol(0.00001, CHAINS.MODE, "USDC"));
  withdrawAction.setPosition(0, 200);

  const edge1 = new Edge({
    source: ironcladBorrowTrigger,
    target: withdrawAction,
  });
  const workflow = new Workflow(
    "IRONCLAD Borrow Trigger and Withdraw Action",
    [
      ironcladBorrowTrigger,
      withdrawAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("IRONCLAD Borrow Trigger and Withdraw Action before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("IRONCLAD Borrow Trigger and Withdraw Action after: " + workflow.getState());
}

ironclad_trigger_borrow_action_borrow();