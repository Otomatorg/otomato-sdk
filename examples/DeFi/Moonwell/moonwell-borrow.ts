import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function moonwell_borrow() {

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

  // -------- Collaretal MOONWELL --------
  const enableCollateral = new Action(ACTIONS.LENDING.MOONWELL.ENABLE_COLLATERAL);
  enableCollateral.setChainId(CHAINS.BASE);

  enableCollateral.setParams(
      "abiParams.tokens",
      [
        "0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22",
      ]
  );

  // -------- Borrow MOONWELL --------
  const moonwellBorrow = new Action(ACTIONS.LENDING.MOONWELL.BORROW);
  moonwellBorrow.setChainId(CHAINS.BASE);

  moonwellBorrow.setParams(
      "abiParams.amount",
      await convertToTokenUnitsFromSymbol(0.000001, CHAINS.BASE, "USDC")
  );
  moonwellBorrow.setParams(
      "tokenToBorrow",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  const edge1 = new Edge({
    source: fearAndGreedTrigger,
    target: enableCollateral,
  });

  const edge2 = new Edge({
    source: enableCollateral,
    target: moonwellBorrow,
  });

  const workflow = new Workflow(
    "Moonwell Borrow on Base",
    [
      fearAndGreedTrigger,
      enableCollateral,
      moonwellBorrow,
    ],
    [edge1, edge2]
  );

  const creationResult = await workflow.create();

  console.log("moonwell_borrow state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("moonwell_borrow state after: " + workflow.getState());
}

moonwell_borrow();