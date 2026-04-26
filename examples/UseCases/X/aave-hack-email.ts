import {
  ACTIONS,
  Action,
  TRIGGERS,
  Trigger,
  Workflow,
  Edge,
  apiServices,
  ConditionGroup,
  LOGIC_OPERATORS,
  DEFAULT_WORKFLOW_LOOP_SETTINGS,
} from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function aave_hack_email() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
    console.error('Missing API_URL or AUTH_TOKEN in .env');
    return;
  }

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  const emailTo = process.env.EMAIL_TO ?? 'security-alerts@example.com';

  // -------- Trigger: AAVE official account --------
  const aaveTrigger = new Trigger(TRIGGERS.SOCIALS.X.X_POST_TRIGGER);
  aaveTrigger.setParams('username', 'aave');
  aaveTrigger.setPosition(400, 120);

  // -------- AI: classify tweet as hack-related --------
  const aiAction = new Action(ACTIONS.AI.AI.AI);
  aiAction.setParams(
    'prompt',
    'Return true if this tweet mentions AAVE being hacked or exploited',
  );
  aiAction.setParams('context', aaveTrigger.getOutputVariableName('tweetContent'));
  aiAction.setPosition(400, 240);

  // -------- IF: AI says hack detected --------
  const ifAction = new Action(ACTIONS.CORE.CONDITION.IF);
  ifAction.setParams('logic', LOGIC_OPERATORS.OR);
  const group = new ConditionGroup(LOGIC_OPERATORS.OR);
  group.addConditionCheck(aiAction.getOutputVariableName('result'), 'eq', 'true');
  ifAction.setParams('groups', [group]);
  ifAction.setPosition(600, 360);

  // -------- Email instead of withdraw --------
  const emailAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  emailAction.setParams('to', emailTo);
  emailAction.setParams('subject', 'AAVE hack signal detected');
  emailAction.setParams(
    'body',
    'A potential AAVE hack/exploit signal was detected on X.\n\n' +
      'Latest tweet from @aave: ' +
      aaveTrigger.getOutputVariableName('tweetContent') +
      '\n\nReview your AAVE positions: https://app.aave.com/',
  );
  emailAction.setPosition(400, 480);

  const edge1 = new Edge({ source: aaveTrigger, target: aiAction });
  const edge2 = new Edge({ source: aiAction, target: ifAction });
  const edge3 = new Edge({
    source: ifAction,
    target: emailAction,
    label: 'true',
    value: true,
  });

  const workflow = new Workflow(
    'Email me if AAVE hack is detected via @aave tweets',
    [aaveTrigger, aiAction, ifAction, emailAction],
    [edge1, edge2, edge3],
    DEFAULT_WORKFLOW_LOOP_SETTINGS.subscription,
  );

  console.log('aave_hack_email state before create: ' + workflow.getState());

  const creationResult = await workflow.create();
  console.log('Workflow created. ID: ' + workflow.id);
  console.log('Creation result:', creationResult);

  const runResult = await workflow.run();
  console.log('aave_hack_email state after run: ' + workflow.getState());
  console.log('Run result:', runResult);
}

aave_hack_email().catch((err) => {
  console.error('Workflow failed:', err);
  process.exit(1);
});
