import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnitsFromSymbol } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function uniswap_v3() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Uniswap Trigger --------
  const uniswapTrigger = new Trigger(
    TRIGGERS.DEXES.UNISWAP.V2_SWAP
  );
  uniswapTrigger.setChainId(
      CHAINS.BASE
  );
  uniswapTrigger.setParams(
      'contractAddress',
      '0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C'
  );

  // -------- Send Slack Message --------
  const slackMessage = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  slackMessage.setParams('webhook', process.env.SLACK_WEBHOOK);
  slackMessage.setParams('message', `UniswapV2: ${uniswapTrigger.getOutputVariableName('amount0In')} (amount0In) ${uniswapTrigger.getOutputVariableName('amount0Out')} (amount0Out) ${uniswapTrigger.getOutputVariableName('token0')} to ${uniswapTrigger.getOutputVariableName('amount1In')} (amount1In) ${uniswapTrigger.getOutputVariableName('amount1Out')} (amount1Out) ${uniswapTrigger.getOutputVariableName('token1')}`);

  const edge1 = new Edge({
    source: uniswapTrigger,
    target: slackMessage,
  });

  const workflow = new Workflow(
    'Uniswap V2 Trigger',
    [
      uniswapTrigger,
      slackMessage,
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