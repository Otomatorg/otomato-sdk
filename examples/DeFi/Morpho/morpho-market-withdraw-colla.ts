import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices, convertToTokenUnits, getToken } from '../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function morpho_withdraw_collateral() {

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

  // -------- Withdraw Collateral Morpho -----
  const morphoWithdraw = new Action(ACTIONS.LENDING.MORPHO.WITHDRAW_COLLATERAL);
  morphoWithdraw.setChainId(CHAINS.BASE);
  morphoWithdraw.setParams(
      "abiParams.amount",
      0.005
  );

  morphoWithdraw.setParams(
    "marketId",
    "0x3b3769cfca57be2eaed03fcc5299c25691b77781a1e124e7a8d520eb9a7eabb5" // USDC/WETH
  );

  const edge1 = new Edge({
    source: fearAndGreedTrigger,
    target: morphoWithdraw,
  });

  const workflow = new Workflow(
    "Morpho market deposit collateral on Base",
    [
      fearAndGreedTrigger,
      morphoWithdraw,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("morpho_withdraw_collateral state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("morpho_withdraw_collateral state after: " + workflow.getState());
}

morpho_withdraw_collateral();