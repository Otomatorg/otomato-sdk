import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, LOGIC_OPERATORS, ConditionGroup, convertToTokenUnitsFromSymbol, rpcServices } from '../../../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function morpho_vault_withdraw() {

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

  // -------- Withdraw Morpho --------
  const morphoWithdraw = new Action(ACTIONS.LENDING.MORPHO.WITHDRAW);

  morphoWithdraw.setChainId(CHAINS.BASE);
  morphoWithdraw.setParams(
    "vault",
    "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183"
);
  morphoWithdraw.setParams(
      "abiParams.amount",
      0.0001
  );

  const edge1 = new Edge({
    source: fearAndGreedTrigger,
    target: morphoWithdraw,
  });

  const workflow = new Workflow(
    "Morpho vault withdraw steakhouse usdc on Base",
    [
      fearAndGreedTrigger,
      morphoWithdraw,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log("morpho_vault_withdraw state before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("morpho_vault_withdraw state after: " + workflow.getState());
}

morpho_vault_withdraw();