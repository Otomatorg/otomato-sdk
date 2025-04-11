import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices, convertToTokenUnits, getToken } from '../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function morpho_collateral_deposit() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Fear and Greed Trigger --------
  const fearAndGreedTrigger = new Trigger(
    TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX
  );
  fearAndGreedTrigger.setCondition("gt");
  fearAndGreedTrigger.setComparisonValue(1);

  // -------- Deposit Collateral Morpho -----
  const morphoDeposit = new Action(ACTIONS.LENDING.MORPHO.SUPPLY_COLLATERAL);
  morphoDeposit.setChainId(CHAINS.BASE);
  morphoDeposit.setParams(
      "abiParams.amount",
      0.005
  );

  morphoDeposit.setParams(
    "marketId",
    "0x3b3769cfca57be2eaed03fcc5299c25691b77781a1e124e7a8d520eb9a7eabb5" // USDC/WETH
  );

  const edge1 = new Edge({
    source: fearAndGreedTrigger,
    target: morphoDeposit,
  });

  const workflow = new Workflow(
    "Morpho market deposit collateral on Base",
    [
      fearAndGreedTrigger,
      morphoDeposit,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("morpho_collateral_deposit state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("morpho_collateral_deposit state after: " + workflow.getState());
}

morpho_collateral_deposit();