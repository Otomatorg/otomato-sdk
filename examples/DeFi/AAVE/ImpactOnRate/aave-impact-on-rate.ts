import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function aave_impact_on_rate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Predict Impact on Lending Rate trigger --------
  const predictImpactOnLendingRateTrigger = new Trigger(TRIGGERS.LENDING.AAVE.PREDICT_IMPACT_ON_LENDING_RATE);
  predictImpactOnLendingRateTrigger.setChainId(CHAINS.BASE);
  predictImpactOnLendingRateTrigger.setParams(
    "asset",
    getTokenFromSymbol(CHAINS.BASE, "cbBTC").contractAddress
  );
  predictImpactOnLendingRateTrigger.setParams(
    "amount",
    1000
  );

  predictImpactOnLendingRateTrigger.setParams(
    "condition",
    "gt"
  );
  predictImpactOnLendingRateTrigger.setParams(
    "comparisonValue",
    -100
  );

  // -------- Wait 1 second --------
  const wait1SecondAction = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
  wait1SecondAction.setParams("time", '1');
  wait1SecondAction.setPosition(0, 100);


  const workflow = new Workflow(
    "Aave impact on lending rate",
    [
      predictImpactOnLendingRateTrigger,
      wait1SecondAction,
    ],
    [new Edge({
      source: predictImpactOnLendingRateTrigger,
      target: wait1SecondAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Predict Impact on Lending Rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Predict Impact on Lending Rate after: " + workflow.getState());
}

aave_impact_on_rate();