// import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, Edge, apiServices, WORKFLOW_LOOPING_TYPES } from '../../../src/index.js';
// import dotenv from 'dotenv';

// dotenv.config();

// async function wallet_point() {

//   if (!process.env.API_URL || !process.env.AUTH_TOKEN)
//     return;

//   apiServices.setUrl(process.env.API_URL);
//   apiServices.setAuth(process.env.AUTH_TOKEN); 

//   const pointsPointsMovementTrigger = new Trigger(TRIGGERS.SOCIALS.POINTS.POINTS_MOVEMENT);
//   pointsPointsMovementTrigger.setParams('walletAddress', '0x9f5362c5ad18e5a3f9c06e9cf26d5ae0c5833f3f');
//   pointsPointsMovementTrigger.setPosition(400, 120);
  
//   const telegramSendMessageAction = new Action(ACTIONS.TRENDING.TELEGRAM.SEND_MESSAGE);
//   telegramSendMessageAction.setParams('message', `Wallet's points have increased:  ${pointsPointsMovementTrigger.getOutputVariableName('pointsChange')}`);
//   telegramSendMessageAction.setPosition(400, 240);
  
//   const edge1 = new Edge({ source: pointsPointsMovementTrigger, target: telegramSendMessageAction });
  
//   const workflow = new Workflow('Get notified when wallet\'s points increase', [pointsPointsMovementTrigger, telegramSendMessageAction], [edge1], {
//     loopingType: WORKFLOW_LOOPING_TYPES.SUBSCRIPTION,
//     limit: 1000,
//     timeout: 31536000000
//   });

//   const creationResult = await workflow.create();

//   console.log("When the Ethereum foundation transfers ETH before: " + workflow.getState());

//   console.log("Workflow ID: " + workflow.id);

//   const runResult = await workflow.run();

//   console.log("When the Ethereum foundation transfers ETH after: " + workflow.getState());
// }

// wallet_point();