import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ironclad_trigger_supply_action_supply() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Supply rate trigger --------
  const ironcladSupplyTrigger = new Trigger(TRIGGERS.LENDING.IRONCLAD.LENDING_RATE);
  ironcladSupplyTrigger.setChainId(CHAINS.MODE);
  ironcladSupplyTrigger.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.MODE, "USDT").contractAddress
  );
  ironcladSupplyTrigger.setParams(
    "condition",
    "gt"
  );
  ironcladSupplyTrigger.setParams(
    "comparisonValue",
    -200
  );
  
  // -------- Supply --------
  const supplyAction = new Action(ACTIONS.LENDING.IRONCLAD.SUPPLY);
  supplyAction.setChainId(CHAINS.MODE);
  supplyAction.setParams("abiParams.asset", getTokenFromSymbol(CHAINS.MODE, "USDC").contractAddress);
  supplyAction.setParams("abiParams.amount", await convertToTokenUnitsFromSymbol(0.00001, CHAINS.MODE, "USDC"));
  supplyAction.setParams("abiParams.referralCode", 0);
  supplyAction.setPosition(0, 200);

  const edge1 = new Edge({
    source: ironcladSupplyTrigger,
    target: supplyAction,
  });
  const workflow = new Workflow(
    "IRONCLAD Supply Trigger and Supply Action",
    [
      ironcladSupplyTrigger,
      supplyAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("IRONCLAD Supply Trigger and Supply Action before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("IRONCLAD Supply Trigger and Supply Action after: " + workflow.getState());
}

ironclad_trigger_supply_action_supply();