import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function abstract_users_new_badge() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Abstract users new badge trigger --------
  const abstractUsersNewBadgeTrigger = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_USERS_NEW_BADGE);
  abstractUsersNewBadgeTrigger.setParams("walletAddress", "0xbad61ce35c1a02fc59cb690bcde3631083738f8b");
  abstractUsersNewBadgeTrigger.setCondition("eq");
  abstractUsersNewBadgeTrigger.setComparisonValue('true');

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The abstract users new badge is " + abstractUsersNewBadgeTrigger.getOutputVariableName('newBadges'));
  notificationAction.setParams("subject", "Abstract users new badge");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Abstract users new badge",
    [
      abstractUsersNewBadgeTrigger,
      notificationAction
    ],
    [new Edge({
      source: abstractUsersNewBadgeTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Abstract users new badge before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Abstract users new badge after: " + workflow.getState());
}

abstract_users_new_badge();