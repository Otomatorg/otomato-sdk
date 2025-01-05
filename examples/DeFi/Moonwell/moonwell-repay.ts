import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function moonwell_repay() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Fear and Greed Trigger --------
  const fearAndGreedTrigger = new Trigger(
    TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX
  );
  fearAndGreedTrigger.setCondition("gt");
  fearAndGreedTrigger.setComparisonValue(0);

  // -------- Deposit MOONWELL --------
  const moonwellRepay = new Action(ACTIONS.LENDING.MOONWELL.REPAY);
  moonwellRepay.setChainId(CHAINS.BASE);
  moonwellRepay.setParams(
      "abiParams.amount",
      await convertToTokenUnitsFromSymbol(0.000001, CHAINS.BASE, "USDC")
  );
  moonwellRepay.setParams(
      "tokenToRepay",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  const edge1 = new Edge({
    source: fearAndGreedTrigger,
    target: moonwellRepay,
  });

  const workflow = new Workflow(
    "Moonwell Repay on Base",
    [
      fearAndGreedTrigger,
      moonwellRepay,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("moonwell_repay state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("moonwell_repay state after: " + workflow.getState());
}

moonwell_repay();