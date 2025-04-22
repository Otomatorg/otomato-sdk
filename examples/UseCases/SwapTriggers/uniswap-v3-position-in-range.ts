import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function uniswap_v3() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Uniswap Trigger --------
  const uniswapInRangeTrigger = new Trigger(
    TRIGGERS.DEXES.UNISWAP.IS_IN_RANGE
  );
  uniswapInRangeTrigger.setChainId(
      CHAINS.BASE
  );
  uniswapInRangeTrigger.setParams(
      'tokenId',
      '104758'
  );
  uniswapInRangeTrigger.setParams(
      'condition',
      'eq'
  );
  uniswapInRangeTrigger.setParams(
      'comparisonValue',
      'true'
  );

  // -------- Send Slack Message --------
  const delay = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
  delay.setParams('time', "1");

  const edge1 = new Edge({
    source: uniswapInRangeTrigger,
    target: delay,
  });

  const workflow = new Workflow(
    'Uniswap V3 Position In Range',
    [
      uniswapInRangeTrigger,
      delay,
    ],
    [edge1]
  );

  const creationResult = await workflow.create();

  console.log('uniswap_v3 state before: ' + workflow.getState());

  console.log('Workflow ID: ' + workflow.id);

  const runResult = await workflow.run();

  console.log('uniswap_v3 state after: ' + workflow.getState());
}

uniswap_v3();