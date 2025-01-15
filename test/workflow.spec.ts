import { expect } from 'chai';
import { Workflow } from '../src/models/Workflow.js';
import { Trigger } from '../src/models/Trigger.js';
import { Action } from '../src/models/Action.js';
import { TRIGGERS, ACTIONS, getTokenFromSymbol, CHAINS, Edge } from '../src/index.js';
import { Note } from '../src/models/Note.js';

describe('Workflow Class', () => {
  it('should create a workflow with a trigger and actions', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);

    const action2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    action2.setParams("webhook", "https://webhook.url");
    action2.setParams("message", "This is a test message");
    action2.setPosition(2, 0);

    const workflow = new Workflow("Test Workflow", [trigger, action1, action2]);

    const json = workflow.toJSON();
    expect(json).to.deep.equal({
      name: "Test Workflow",
      id: null,
      dateCreated: null,
      dateModified: null,
      executionId: null,
      nodes: [trigger.toJSON(), action1.toJSON(), action2.toJSON()],
      edges: [],
      notes: [], // Ensure notes are empty initially
      state: 'inactive'
    });
  });

  it('should add a note to the workflow', () => {
    const workflow = new Workflow("Workflow with Notes");
    const note = new Note("This is a test note", { x: 10, y: 20 });
    workflow.addNote(note);

    expect(workflow.notes).to.deep.include(note);
  });

  it('should update a note in the workflow', () => {
    const workflow = new Workflow("Workflow with Notes");
    const note = new Note("Original note text", { x: 10, y: 20 });
    workflow.addNote(note);
    const noteId = note.id;

    workflow.updateNote(noteId, "Updated note text", { x: 30, y: 40 });

    const updatedNote = workflow.notes.find(n => n.id === noteId);
    expect(updatedNote).to.exist;
    expect(updatedNote?.text).to.equal("Updated note text");
    expect(updatedNote?.position).to.deep.equal({ x: 30, y: 40 });
  });

  it('should delete a note from the workflow', () => {
    const workflow = new Workflow("Workflow with Notes");
    const note = new Note("This is a test note to delete", { x: 10, y: 20 });
    workflow.addNote(note);
    const noteId = note.id;

    workflow.deleteNote(noteId);

    expect(workflow.notes.find(n => n.id === noteId)).to.be.undefined;
  });

  it('should include notes in the workflow JSON output', () => {
    const workflow = new Workflow("Workflow with Notes");
    const note = new Note("This is a test note", { x: 10, y: 20 });
    workflow.addNote(note);

    const json = workflow.toJSON();
    expect(json.notes).to.deep.equal([note.toJSON()]);
  });

  it('should set the name of the workflow', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const workflow = new Workflow("Initial Name", [trigger]);
    workflow.setName("Updated Name");

    expect(workflow.name).to.equal("Updated Name");
  });

  it('should add a trigger to the workflow', () => {
    const initialTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    initialTrigger.setChainId(CHAINS.ETHEREUM);
    initialTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    initialTrigger.setPosition(0, 0);

    const newTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    newTrigger.setChainId(CHAINS.ETHEREUM);
    newTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    newTrigger.setPosition(1, 0);

    const workflow = new Workflow("Test Workflow", [initialTrigger]);
    workflow.addNode(newTrigger);

    expect(workflow.nodes).to.deep.equal([initialTrigger, newTrigger]);
  });

  it('should add actions to the workflow', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);

    const action2 = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    action2.setParams("webhook", "https://webhook.url");
    action2.setParams("message", "This is a test message");
    action2.setPosition(2, 0);

    const workflow = new Workflow("Test Workflow", [trigger]);
    workflow.addNode(action1);
    workflow.addNode(action2);

    expect(workflow.nodes).to.deep.equal([trigger, action1, action2]);
  });

  it('should update an edge in the workflow', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action.setChainId(CHAINS.ETHEREUM);
    action.setParams("value", 1000);
    action.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action.setPosition(1, 0);

    const edge = new Edge({
      id: 'e-1',
      source: trigger,
      target: action,
    });

    const workflow = new Workflow("Test Workflow", [trigger, action], [edge]);

    const newEdge = new Edge({
      id: 'e-1',
      source: action,
      target: trigger,
    });

    workflow.updateEdge('e-1', newEdge);

    const updatedEdge = workflow.edges.find(e => e.id === 'e-1');

    expect(updatedEdge).to.deep.equal(newEdge);
  });
});

describe('Workflow Class - Node Modifications', () => {
  it('should delete a node from the workflow and update edges', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const edge1 = new Edge({ source: node1, target: node2 });
    const edge2 = new Edge({ source: node2, target: node3 });

    const workflow = new Workflow("Workflow with Nodes", [node1, node2, node3], [edge1, edge2]);

    workflow.deleteNode(node2);

    // Verify node2 is deleted
    expect(workflow.nodes).to.deep.equal([node1, node3]);

    // Verify edges involving node2 are removed
    expect(workflow.edges.length).to.equal(1);
    expect(workflow.edges[0].source).to.deep.equal(node1);
    expect(workflow.edges[0].target).to.deep.equal(node3);
  });

  it('should throw an error when trying to delete a node not in the workflow', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const workflow = new Workflow("Workflow with Nodes", [node1], []);

    expect(() => workflow.deleteNode(node2)).to.throw('Node not found in the workflow.');
  });

  it('should swap a node with another and update edges', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const edge1 = new Edge({ source: node1, target: node2 });
    const edge2 = new Edge({ source: node2, target: node3 });

    const workflow = new Workflow("Workflow with Nodes", [node1, node2, node3], [edge1, edge2]);

    const newNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    workflow.swapNode(node2, newNode);

    // Verify node2 is replaced with newNode
    expect(workflow.nodes).to.deep.equal([node1, newNode, node3]);

    // Verify edges are updated to reference newNode
    expect(workflow.edges).to.deep.equal([
      { ...edge1, target: newNode },
      { ...edge2, source: newNode },
    ]);
  });

  it('should throw an error when trying to swap a node not in the workflow', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const newNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const workflow = new Workflow("Workflow with Nodes", [node1], []);

    expect(() => workflow.swapNode(node2, newNode)).to.throw('Node to swap not found in the workflow.');
  });

  it('should handle swapping a node with a connected node', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const edge1 = new Edge({ source: node1, target: node2 });
    const edge2 = new Edge({ source: node2, target: node3 });

    const workflow = new Workflow("Workflow with Connected Nodes", [node1, node2, node3], [edge1, edge2]);

    const newNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    workflow.swapNode(node2, newNode);

    // Verify newNode is connected correctly
    expect(workflow.edges).to.deep.equal([
      { ...edge1, target: newNode },
      { ...edge2, source: newNode },
    ]);

    // Verify workflow structure
    expect(workflow.nodes).to.deep.equal([node1, newNode, node3]);
  });

  // Insert Node Tests
  it('should insert a node between two existing nodes and update edges', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const edge = new Edge({ source: node1, target: node3 });
    const workflow = new Workflow("Workflow with Insert Node", [node1, node3], [edge]);

    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    workflow.insertNode(node2, node1, node3);

    // Verify nodes are updated
    expect(workflow.nodes).to.have.members([node1, node2, node3]);
    expect(workflow.nodes.length).to.equal(3);

    // Verify edges are updated
    const updatedEdges = workflow.edges.map(edge => ({
      source: edge.source,
      target: edge.target
    }));

    expect(updatedEdges).to.deep.equal([
      { source: node1, target: node2 },
      { source: node2, target: node3 }
    ]);
  });

  // Test: Insert node as a child of nodeBefore
  it('should insert a node as a child of nodeBefore when nodeAfter is not provided', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const workflow = new Workflow("Workflow with Insert Node", [node1], []);

    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    workflow.insertNode(node2, node1);

    // Verify nodes are updated
    expect(workflow.nodes).to.have.members([node1, node2]);
    expect(workflow.nodes.length).to.equal(2);

    // Verify edges are updated
    const updatedEdges = workflow.edges.map(edge => ({
      source: edge.source,
      target: edge.target
    }));

    expect(updatedEdges).to.deep.equal([
      { source: node1, target: node2 }
    ]);
  });

  // Test: Error when no edge exists between nodeBefore and nodeAfter
  it('should throw an error when inserting a node without an existing edge between nodeBefore and nodeAfter', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const workflow = new Workflow("Workflow without Edge", [node1, node3], []);

    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    expect(() => workflow.insertNode(node2, node1, node3)).to.throw(
      'No edge exists between nodeBefore and nodeAfter.'
    );
  });

  // Test: Error when nodeBefore or nodeAfter is not in the workflow
  it('should throw an error when inserting a node with nodeBefore or nodeAfter not in the workflow', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const edge = new Edge({ source: node1, target: node3 });
    const workflow = new Workflow("Workflow with Nodes", [node1], [edge]);

    expect(() => workflow.insertNode(node2, node1, node3)).to.throw(
      'The nodeAfter must exist in the workflow.'
    );
  });

  // New Test: Insert a node into an empty workflow
  it('should throw an error when inserting a node into an empty workflow', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const workflow = new Workflow("Empty Workflow", [], []);

    expect(() => workflow.insertNode(node1, node1)).to.throw(
      'The nodeBefore must exist in the workflow.'
    );
  });
});

describe('Empty block management', () => {
  it('should create a workflow with an empty block', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);


    const workflow = new Workflow("Test Workflow", [trigger, action1], [new Edge({ source: trigger, target: action1 })]);
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), trigger, action1);
    expect(workflow.nodes).to.have.length(3);
  });

  it('should export a workflow without its empty nodes', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);
  
    const action1 = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("value", 1000);
    action1.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    action1.setPosition(1, 0);
  
    // Create a workflow with an edge from trigger -> action1
    const workflow = new Workflow(
      "Test Workflow",
      [trigger, action1],
      [ new Edge({ source: trigger, target: action1 }) ]
    );
  
    // Insert empty blocks (blockId === 0 inside ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK)
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), action1);
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), trigger, action1);
  
    // Confirm that, before toJSON, the workflow contains 4 nodes
    // (trigger, action1, and 2 empties) plus 3 edges
    expect(workflow.nodes).to.have.length(4);
    expect(workflow.edges).to.have.length(3);
  
    // Convert to JSON; this should invoke your logic that clones + deletes empty nodes
    const json = workflow.toJSON();
  
    // Now the JSON should reflect a workflow with only 2 nodes (the real ones)
    expect(json.nodes).to.have.length(2);
    // And only 1 edge (trigger -> action1)
    expect(json.edges).to.have.length(1);
  
    // Optional: You can do deeper checks if you'd like:
    // e.g., verifying that the final edges reference only the IDs of trigger & action1
    // expect(json.nodes.map(n => n.blockId)).to.deep.equal([trigger.blockId, action1.blockId]);
  });

  it('should create a SPLIT from SDK', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
  
    const split = new Action(ACTIONS.CORE.SPLIT.SPLIT);
  
    // Initial workflow has 2 nodes and 1 edge (trigger -> split)
    const workflow = new Workflow(
      "Test Workflow",
      [trigger, split],
      [ new Edge({ source: trigger, target: split }) ]
    );
  
    // Insert three empty blocks after split (no nodeAfter => child of `split`)
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), split);
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), split);
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), split);
  
    // Now we expect:
    //   - 5 total nodes: (trigger, split, 3 empties)
    //   - 4 edges:
    //       1) trigger -> split
    //       2) split -> emptyBlock1
    //       3) split -> emptyBlock2
    //       4) split -> emptyBlock3
    expect(workflow.nodes).to.have.lengthOf(5);
    expect(workflow.edges).to.have.lengthOf(4);
  
    // Confirm original edge from trigger -> split still exists
    const edgeFromTrigger = workflow.edges.find(e => e.source === trigger && e.target === split);
    expect(edgeFromTrigger).to.exist;
  
    // Confirm we have three new edges from `split` to the newly inserted empty blocks
    const edgesFromSplit = workflow.edges.filter(e => e.source === split);
    expect(edgesFromSplit).to.have.lengthOf(3);
  
    // (Optional) Further checks that each inserted node is indeed an EMPTYBLOCK, etc.
  });
  
  it('should create a IF/ELSE from SDK', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
  
    const condition = new Action(ACTIONS.CORE.CONDITION.IF);
  
    // Initial workflow has 2 nodes, 1 edge (trigger -> condition)
    const workflow = new Workflow(
      "Test Workflow",
      [trigger, condition],
      [ new Edge({ source: trigger, target: condition }) ]
    );
  
    // Insert two nodes after condition, each with edge labels "true" and "false"
    const ifAction = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
    workflow.insertNode(ifAction, condition, undefined, "true", "true");
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), condition, undefined, "false", "false");
  
    // Now we expect:
    //   - 4 total nodes: (trigger, condition, ifAction, elseAction)
    //   - 3 edges:
    //       1) trigger -> condition
    //       2) condition -> ifAction    (label: "true", value: "true")
    //       3) condition -> elseAction  (label: "false", value: "false")
    expect(workflow.nodes).to.have.lengthOf(4);
    expect(workflow.edges).to.have.lengthOf(3);
  
    const edgesFromCondition = workflow.edges.filter(e => e.source === condition);
    expect(edgesFromCondition).to.have.lengthOf(2);
  
    const trueEdge = edgesFromCondition.find(e => e.label === "true");
    expect(trueEdge).to.exist;
    expect(trueEdge?.value).to.equal("true");
  
    const falseEdge = edgesFromCondition.find(e => e.label === "false");
    expect(falseEdge).to.exist;
    expect(falseEdge?.value).to.equal("false");
  
    // Now swap the ifAction (an EMPTYBLOCK) with an actual WAIT node
    const waitNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    workflow.swapNode(ifAction, waitNode);
  
    // The number of nodes remains 4, but `ifAction` is replaced by `waitNode`
    expect(workflow.nodes).to.have.lengthOf(4);
    expect(workflow.nodes).to.include(waitNode);
    expect(workflow.nodes).to.not.include(ifAction);
  
    // Edges remain 3, but the edge labeled "true" now targets the `waitNode`
    expect(workflow.edges).to.have.lengthOf(3);
  
    const updatedTrueEdge = workflow.edges.find(e => e.label === "true");
    expect(updatedTrueEdge?.target).to.equal(waitNode);
  });

});