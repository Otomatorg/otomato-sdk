import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function aave_trigger_optimism() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Supply rate trigger --------
  const aaveTrigger = new Trigger(TRIGGERS.LENDING.AAVE.LENDING_RATE);
  aaveTrigger.setChainId(CHAINS.OPTIMISM);
  aaveTrigger.setParams(
    "abiParams.asset",
    getTokenFromSymbol(CHAINS.OPTIMISM, "USDC.e").contractAddress  // WETH, USDC, USDT, USDC.e, DAI, sUSD, LUSD
  );
  aaveTrigger.setParams(
    "condition",
    "gt"
  );
  // Set as 0 to ensure the trigger is triggered instantly
  aaveTrigger.setParams(
    "comparisonValue",
    0
  );
  
  // -------- Wait 1 second as we only focus on the trigger --------
  const waitAction = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
  waitAction.setParams("time", '1000');

  const edge1 = new Edge({
    source: aaveTrigger,
    target: waitAction,
  });
  const workflow = new Workflow(
    "AAVE Trigger Optimism",
    [
      aaveTrigger,
      waitAction,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("AAVE Trigger Optimism before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("AAVE Trigger Optimism after: " + workflow.getState());
}

aave_trigger_optimism();