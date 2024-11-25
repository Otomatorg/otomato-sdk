import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ionic_base_supply() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Fear and Greed --------
  const fearAndGreedTrigger = new Trigger(
    TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX
  );
  fearAndGreedTrigger.setCondition("gt");
  fearAndGreedTrigger.setComparisonValue(0);
  fearAndGreedTrigger.setPosition(0, 0);

  // -------- Deposit IONIC --------
  const ionicSupply = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
  ionicSupply.setChainId(CHAINS.BASE);
  ionicSupply.setParams(
      "abiParams.amount",
      await convertToTokenUnitsFromSymbol(0.000001, CHAINS.BASE, "USDC")
  );
  ionicSupply.setParams(
      "tokenToDeposit",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );
  ionicSupply.setPosition(0, 200);

  const edge1 = new Edge({
    source: fearAndGreedTrigger,
    target: ionicSupply,
  });

  const workflow = new Workflow(
    "Ionic Supply on base",
    [
      fearAndGreedTrigger,
      ionicSupply,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("ionic_base_supply state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("ionic_base_supply state after: " + workflow.getState());
}

ionic_base_supply();