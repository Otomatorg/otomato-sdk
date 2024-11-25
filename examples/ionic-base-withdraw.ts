import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function ionic_base_withdraw() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // --------- Fear and Greed --------- 
  const fearAndGreedTrigger = new Trigger(
    TRIGGERS.SOCIALS.FEAR_AND_GREED.GET_FEAR_AND_GREED_INDEX
  );
  fearAndGreedTrigger.setCondition("gt");
  fearAndGreedTrigger.setComparisonValue(0);
  fearAndGreedTrigger.setPosition(0, 0);

  // --------- Withdraw -----------
  const ionicWithdraw = new Action(ACTIONS.LENDING.IONIC.WITHDRAW);
  ionicWithdraw.setChainId(CHAINS.BASE);

  ionicWithdraw.setParams(
      "abiParams.amount",
      await convertToTokenUnitsFromSymbol(0.000001, CHAINS.BASE, "USDC")
  );
  ionicWithdraw.setParams(
      "tokenToWithdraw",
      getTokenFromSymbol(CHAINS.BASE, "USDC").contractAddress
  );

  const edge1 = new Edge({
    source: fearAndGreedTrigger,
    target: ionicWithdraw,
  });

  const workflow = new Workflow(
    "Ionic Withdraw on base",
    [
      fearAndGreedTrigger,
      ionicWithdraw,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("ionic_base_withdraw state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("ionic_base_withdraw state after: " + workflow.getState());
}

ionic_base_withdraw();