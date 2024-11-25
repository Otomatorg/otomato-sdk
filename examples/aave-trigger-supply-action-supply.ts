import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function aave_trigger_supply_action_supply() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Supply rate trigger --------
  const aaveSupplyTrigger = new Trigger(TRIGGERS.LENDING.AAVE.LENDING_RATE);
  aaveSupplyTrigger.setChainId(CHAINS.BASE);
  aaveSupplyTrigger.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.BASE, "wstETH").contractAddress
  );
  aaveSupplyTrigger.setParams(
    "condition",
    "gt"
  );
  aaveSupplyTrigger.setParams(
    "comparisonValue",
    0.00001
  );
  
  // -------- Supply --------
  const supplyAction = new Action(ACTIONS.LENDING.AAVE.SUPPLY);
  supplyAction.setChainId(CHAINS.BASE);
  supplyAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress);
  supplyAction.setParams("abiParams.amount", await convertToTokenUnitsFromSymbol(0.00001, CHAINS.BASE, "USDC"));
  // supplyAction.setParams("abiParams.onBehalfOf", '0x757A004bE766f745fd4CD75966CF6C8Bb84FD7c1'); // old address
  supplyAction.setParams("abiParams.onBehalfOf", '0x8e379aD0090f45a53A08007536cE2fa0a3F9F93d');
  supplyAction.setParams("abiParams.referralCode", 0);
  supplyAction.setPosition(0, 200);

  const edge1 = new Edge({
    source: aaveSupplyTrigger,
    target: supplyAction,
  });
  const workflow = new Workflow(
    "AAVE Supply Trigger and Supply Action",
    [
      aaveSupplyTrigger,
      supplyAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("AAVE Supply Trigger and Supply Action before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("AAVE Supply Trigger and Supply Action after: " + workflow.getState());
}

aave_trigger_supply_action_supply();