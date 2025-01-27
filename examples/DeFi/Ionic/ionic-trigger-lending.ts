import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ionic_trigger_lending() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Lending rate trigger --------
  const aaveLendingTrigger = new Trigger(TRIGGERS.LENDING.IONIC.LENDING_RATE);
  aaveLendingTrigger.setChainId(CHAINS.BASE);
  aaveLendingTrigger.setParams(
    "token",
    getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  aaveLendingTrigger.setParams(
    "condition",
    "gt"
  );
  aaveLendingTrigger.setParams(
    "comparisonValue",
    0.1
  );
  
  // -------- Supply --------
  const supplyAction = new Action(ACTIONS.LENDING.AAVE.SUPPLY);
  supplyAction.setChainId(CHAINS.BASE);
  supplyAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress);
  supplyAction.setParams("abiParams.amount", await convertToTokenUnitsFromSymbol(0.00001, CHAINS.BASE, "USDC"));
  supplyAction.setParams("abiParams.onBehalfOf", '0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d');
  supplyAction.setParams("abiParams.referralCode", 0);

  supplyAction.setPosition(0, 200);

  const edge1 = new Edge({
    source: aaveLendingTrigger,
    target: supplyAction,
  });
  const workflow = new Workflow(
    "Ionic Trigger Lending",
    [
      aaveLendingTrigger,
      supplyAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("Ionic Trigger Lending before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Ionic Trigger Lending after: " + workflow.getState());
}

ionic_trigger_lending();