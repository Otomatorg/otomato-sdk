import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function health_factor() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const hyperlendHealthFactorTrigger = new Trigger(TRIGGERS.LENDING.HYPERLEND.HEALTH_FACTOR);
  hyperlendHealthFactorTrigger.setParams('chainId', 999);
  hyperlendHealthFactorTrigger.setParams('abiParams.user', '0xe6fDce21F9787C2fa04A2CbC11011F77458fCfb4');
  hyperlendHealthFactorTrigger.setParams('condition', 'lte');
  hyperlendHealthFactorTrigger.setParams('comparisonValue', 1.2);
  hyperlendHealthFactorTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Wallet {{nodeMap.1.parameters.abi.parameters.user}}\'s health factor dropped below 1.2');
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hyperlendHealthFactorTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Notify me when HF reach a treshold on HyperLend', [hyperlendHealthFactorTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("Health factor before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Health factor after: " + workflow.getState());
}

health_factor();