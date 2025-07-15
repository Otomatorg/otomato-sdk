import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, getTokenFromSymbol } from '../../src/index.js';
import { apiServices } from '../../src/services/ApiService.js';
import type { Node } from '../../src/models/Node.js';
import type { Edge as EdgeType } from '../../src/models/Edge.js';
import dotenv from 'dotenv';

dotenv.config();

export async function createWorkflowWithMultipleTriggersInsert() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
    console.warn("API_URL or AUTH_TOKEN not set, skipping API interaction for example");
    return;
  }

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  // Create two triggers
  const trigger1 = new Trigger(TRIGGERS.TOKENS.PRICE.PRICE_MOVEMENT_AGAINST_CURRENCY);
  trigger1.setChainId(CHAINS.MODE);
  trigger1.setComparisonValue(3000);
  trigger1.setCondition('lte');
  trigger1.setParams('currency', 'USD');
  trigger1.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);

  const trigger2 = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
  trigger2.setChainId(CHAINS.MODE);
  trigger2.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'USDC').contractAddress);

  // Create an action that both triggers will connect to
  const notificationAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
  notificationAction.setParams("webhook", process.env.SLACK_WEBHOOK || "https://webhook.url");
  notificationAction.setParams("message", "Either price dropped or transfer occurred!");

  // Create workflow with two triggers and one action
  const workflow = new Workflow("Multiple Triggers Insert Example", [trigger1, trigger2, notificationAction]);

  // Create edges from both triggers to the action
  const edge1 = new Edge({ source: trigger1, target: notificationAction });
  const edge2 = new Edge({ source: trigger2, target: notificationAction });
  workflow.addEdges([edge1, edge2]);

  console.log("Initial workflow structure:");
  console.log(`- Nodes: ${workflow.nodes.length} (${workflow.nodes.filter((n: Node) => n.class === 'trigger').length} triggers, ${workflow.nodes.filter((n: Node) => n.class === 'action').length} actions)`);
  console.log(`- Edges: ${workflow.edges.length}`);
  console.log(`- Trigger 1 connects to: ${workflow.edges.filter((e: EdgeType) => e.source === trigger1).map((e: EdgeType) => e.target.getRef()).join(', ')}`);
  console.log(`- Trigger 2 connects to: ${workflow.edges.filter((e: EdgeType) => e.source === trigger2).map((e: EdgeType) => e.target.getRef()).join(', ')}`);

  // Insert a new node after trigger1
  const newAction = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
  workflow.insertNode(newAction, trigger1);

  console.log("\nAfter inserting new node after trigger1:");
  console.log(`- Nodes: ${workflow.nodes.length} (${workflow.nodes.filter((n: Node) => n.class === 'trigger').length} triggers, ${workflow.nodes.filter((n: Node) => n.class === 'action').length} actions)`);
  console.log(`- Edges: ${workflow.edges.length}`);
  
  // Check that both triggers connect to the new node
  const edgesToNewNode = workflow.edges.filter((edge: EdgeType) => edge.target === newAction);
  console.log(`- Edges to new node: ${edgesToNewNode.length}`);
  console.log(`- Trigger 1 connects to: ${workflow.edges.filter((e: EdgeType) => e.source === trigger1).map((e: EdgeType) => e.target.getRef()).join(', ')}`);
  console.log(`- Trigger 2 connects to: ${workflow.edges.filter((e: EdgeType) => e.source === trigger2).map((e: EdgeType) => e.target.getRef()).join(', ')}`);
  console.log(`- New node connects to: ${workflow.edges.filter((e: EdgeType) => e.source === newAction).map((e: EdgeType) => e.target.getRef()).join(', ')}`);

  // Create and run the workflow
  const creationResult = await workflow.create();
  if (creationResult.success) {
    console.log(`\nWorkflow created successfully with ID: ${workflow.id}`);
    
    const runResult = await workflow.run();
    if (runResult.success) {
      console.log("Workflow is now running!");
    } else {
      console.error("Error running workflow:", runResult.error);
    }
  } else {
    console.error("Error creating workflow:", creationResult.error);
  }

  return workflow;
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createWorkflowWithMultipleTriggersInsert().catch(console.error);
} 