import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function morphobeat_market_borrowing_rate() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 
    
  const hyperbeatMorphobeatMarketApyTrigger = new Trigger(TRIGGERS.LENDING.HYPERBEAT.MORPHOBEAT_MARKET_APY);
  hyperbeatMorphobeatMarketApyTrigger.setParams('marketId', '0x64e7db7f042812d4335947a7cdf6af1093d29478aff5f1ccd93cc67f8aadfddc');
  hyperbeatMorphobeatMarketApyTrigger.setParams('condition', 'gt');
  hyperbeatMorphobeatMarketApyTrigger.setParams('comparisonValue', 20);
  hyperbeatMorphobeatMarketApyTrigger.setPosition(400, 120);

  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', 'Morphobeat kHYPE / WHYPE Market borrowing rate is above 20%');
  telegramSendMessageAction.setPosition(400, 240);

  const edge1 = new Edge({ source: hyperbeatMorphobeatMarketApyTrigger, target: telegramSendMessageAction });

  const workflow = new Workflow('Get notified when Morphobeat kHYPE / WHYPE Market borrowing rate above 20%', [hyperbeatMorphobeatMarketApyTrigger, telegramSendMessageAction], [edge1], null);

  const creationResult = await workflow.create();

  console.log("Morphobeat market borrowing rate before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Morphobeat market borrowing rate after: " + workflow.getState());
}

morphobeat_market_borrowing_rate();