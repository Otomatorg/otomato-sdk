import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function aave_trigger_borrow_action_borrow() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Borrow rate trigger --------
  const aaveBorrowTrigger = new Trigger(TRIGGERS.LENDING.AAVE.BORROWING_RATES);
  aaveBorrowTrigger.setChainId(CHAINS.BASE);
  aaveBorrowTrigger.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  aaveBorrowTrigger.setParams(
    "condition",
    "gt"
  );
  aaveBorrowTrigger.setParams(
    "comparisonValue",
    0.1
  );
  
  // -------- Withdraw --------
  const withdrawAction = new Action(ACTIONS.LENDING.AAVE.WITHDRAW);
  withdrawAction.setChainId(CHAINS.BASE);
  withdrawAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress);
  withdrawAction.setParams("abiParams.amount", await convertToTokenUnitsFromSymbol(0.00001, CHAINS.BASE, "USDC"));
  withdrawAction.setParams("abiParams.to", '0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d');

  withdrawAction.setPosition(0, 200);

  const edge1 = new Edge({
    source: aaveBorrowTrigger,
    target: withdrawAction,
  });
  const workflow = new Workflow(
    "AAVE Borrow Trigger and Withdraw Action",
    [
      aaveBorrowTrigger,
      withdrawAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("AAVE Borrow Trigger and Withdraw Action before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("AAVE Borrow Trigger and Withdraw Action after: " + workflow.getState());
}

aave_trigger_borrow_action_borrow();