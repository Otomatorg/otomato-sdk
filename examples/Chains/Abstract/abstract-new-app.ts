import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices } from '../../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function abstract_new_app() {
  const EMAIL_ADDRESS = "your-email@gmail.com"

  if (!process.env.API_URL || !process.env.AUTH_TOKEN)
    return;

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN); 

  // -------- Abstract new app release trigger --------
  const abstractNewAppTrigger = new Trigger(TRIGGERS.SOCIALS.ABSTRACT.ON_NEW_APP_RELEASE);
  abstractNewAppTrigger.setParams("category", "gaming");
  abstractNewAppTrigger.setCondition("eq");
  abstractNewAppTrigger.setComparisonValue('true');

  // -------- Send email --------
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  notificationAction.setParams("body", "The abstract new apps:" + abstractNewAppTrigger.getOutputVariableName('newApps'));
  notificationAction.setParams("subject", "Abstract new app");
  notificationAction.setParams("to", EMAIL_ADDRESS);

  const workflow = new Workflow(
    "Abstract new app",
    [
      abstractNewAppTrigger,
      notificationAction
    ],
    [new Edge({
      source: abstractNewAppTrigger,
      target: notificationAction,
    })]
  );

  const creationResult = await workflow.create();

  console.log("Abstract new app before: " + workflow.getState());

  console.log("Workflow ID: " + workflow.id);

  const runResult = await workflow.run();

  console.log("Abstract new app after: " + workflow.getState());
}

abstract_new_app();