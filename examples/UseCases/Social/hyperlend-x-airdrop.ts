import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function hyperlend() {

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  const xXPostTriggerTrigger = new Trigger(TRIGGERS.TRENDING.X.X_POST_TRIGGER);
  xXPostTriggerTrigger.setParams('username', 'hyperlendx');
  xXPostTriggerTrigger.setParams('includeRetweets', false);
  xXPostTriggerTrigger.setPosition(400, 120);
  
  const aiAiAction = new Action(ACTIONS.TRENDING.AI.AI);
  aiAiAction.setParams('prompt', 'the tweet mentions airdrop claim');
  aiAiAction.setParams('context', `${xXPostTriggerTrigger.getOutputVariableName('tweetContent')}`);
  aiAiAction.setParams('defaultMode', false);
  aiAiAction.setPosition(400, 240);
  
  const conditionIfAction = new Action(ACTIONS.CORE.CONDITION.IF);
  conditionIfAction.setParams('logic', 'or');
  conditionIfAction.setParams('groups', [
    {
      "logic": "or",
      "checks": [
        {
          "value1": aiAiAction.getOutputVariableName('result'),
          "value2": "true",
          "condition": "eq"
        }
      ]
    }
  ]);
  conditionIfAction.setPosition(400, 360);
  
  const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
  telegramSendMessageAction.setParams('message', `Hyperlend protocol alert: a tweet mentionning airdrop claim has been posted ${xXPostTriggerTrigger.getOutputVariableName('tweetURL')}`);
  telegramSendMessageAction.setPosition(400, 480);
  
  const edge1 = new Edge({ source: xXPostTriggerTrigger, target: aiAiAction });
  const edge2 = new Edge({ source: aiAiAction, target: conditionIfAction });
  const edge3 = new Edge({ source: conditionIfAction, target: telegramSendMessageAction });
  
  const workflow = new Workflow('Get notified when Hyperlend mentions airdrop claim', [xXPostTriggerTrigger, aiAiAction, conditionIfAction, telegramSendMessageAction], [edge1, edge2, edge3], {
    loopingType: 'subscription',
    limit: 1000,
    timeout: 365 * 24 * 60 * 60 * 1000,
  });
  
  const creationResult = await workflow.create();

  console.log("Hyperlend before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Hyperlend after: " + workflow.getState());
}

hyperlend();