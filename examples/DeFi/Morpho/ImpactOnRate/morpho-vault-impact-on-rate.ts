import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, Edge, apiServices } from '../../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function morpho_vault_impact_on_rate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Morpho Impact On Rate --------
  const morphoImpactOnRate = new Trigger(TRIGGERS.LENDING.MORPHO.PREDICT_IMPACT_ON_LENDING_RATE);

  morphoImpactOnRate.setChainId(CHAINS.BASE);
  morphoImpactOnRate.setParams(
    "vault",
    "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183"
  );
  morphoImpactOnRate.setParams(
    "amount",
    1000000
  );
  morphoImpactOnRate.setCondition("gt");
  morphoImpactOnRate.setComparisonValue(0); // putting 0 as comparison value so that the workflow is triggered instantly

  //  -------- Wait 1 second --------
  const wait1Second = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
  wait1Second.setParams(
    "time",
    "1"
  );

  const edge1 = new Edge({
    source: morphoImpactOnRate,
    target: wait1Second,
  });

  const workflow = new Workflow(
    "Morpho vault impact on rate on Base",
    [
      morphoImpactOnRate,
      wait1Second,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("morpho_vault_impact_on_rate state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("morpho_vault_impact_on_rate state after: " + workflow.getState());
}

morpho_vault_impact_on_rate();