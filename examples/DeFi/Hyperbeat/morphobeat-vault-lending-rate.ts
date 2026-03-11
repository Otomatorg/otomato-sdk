import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function morphobeat_vault_lending_rate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 
    
  const hyperbeatMorphobeatVaultApyTrigger = new Trigger(TRIGGERS.LENDING.HYPERBEAT.MORPHOBEAT_VAULT_APY);
  hyperbeatMorphobeatVaultApyTrigger.setParams('vaultAddress', '0xe5ADd96840F0B908ddeB3Bd144C0283Ac5ca7cA0');
  hyperbeatMorphobeatVaultApyTrigger.setParams('condition', 'gt');
  hyperbeatMorphobeatVaultApyTrigger.setParams('comparisonValue', 15);
  hyperbeatMorphobeatVaultApyTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', ' Hyperithm USDT0 market lending rate is above 15%');
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hyperbeatMorphobeatVaultApyTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Get notified when Hyperithm USDT0 market lending rate above 15%', [hyperbeatMorphobeatVaultApyTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("Morphobeat vault lending rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Morphobeat vault lending rate after: " + workflow.getState());
}

morphobeat_vault_lending_rate();