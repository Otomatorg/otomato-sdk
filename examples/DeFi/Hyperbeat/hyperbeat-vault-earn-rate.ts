import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hyperbeat_vault_earn_rate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 
    
  const hyperbeatHyperbeatVaultApyTrigger = new Trigger(TRIGGERS.LENDING.HYPERBEAT.HYPERBEAT_VAULT_APY);
  hyperbeatHyperbeatVaultApyTrigger.setParams('vaultAddress', '0x5e105266db42f78FA814322Bce7f388B4C2e61eb');
  hyperbeatHyperbeatVaultApyTrigger.setParams('condition', 'gt');
  hyperbeatHyperbeatVaultApyTrigger.setParams('comparisonValue', 13);
  hyperbeatHyperbeatVaultApyTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Hyperbeat hbUSDT vault rate is above 13%');
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hyperbeatHyperbeatVaultApyTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Get notified when hbUSDT vault earn rate above 13%', [hyperbeatHyperbeatVaultApyTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("Hyperbeat vault earn rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hyperbeat vault earn rate after: " + workflow.getState());
}

hyperbeat_vault_earn_rate();