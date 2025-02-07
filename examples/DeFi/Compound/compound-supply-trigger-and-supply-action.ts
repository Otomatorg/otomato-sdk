import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function compound_supply_trigger_and_supply_action() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Compound Lending Rate Trigger --------
  const compoundSupplyTrigger = new Trigger(
    TRIGGERS.LENDING.COMPOUND.LENDING_RATE
  );
  compoundSupplyTrigger.setChainId(CHAINS.BASE);
  compoundSupplyTrigger.setCondition("gt");
  compoundSupplyTrigger.setComparisonValue(0.1);
  compoundSupplyTrigger.setParams("token", getTokenFromSymbol(CHAINS.BASE, "WETH").contractAddress);

  // -------- Supply Compound --------
  const compoundSupply = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
  compoundSupply.setChainId(CHAINS.BASE);

  compoundSupply.setParams(
      "abiParams.amount",
      0.000001
  );
  compoundSupply.setParams(
      "abiParams.asset",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  const edge1 = new Edge({
    source: compoundSupplyTrigger,
    target: compoundSupply,
  });

  const workflow = new Workflow(
    "Compound Supply Trigger",
    [
      compoundSupplyTrigger,
      compoundSupply,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("compound_supply_trigger_and_supply_action state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("compound_supply_trigger_and_supply_action state after: " + workflow.getState());
}

compound_supply_trigger_and_supply_action();