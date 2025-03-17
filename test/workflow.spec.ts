import { expect } from 'chai';
import { Workflow } from '../src/models/Workflow.js';
import { Trigger } from '../src/models/Trigger.js';
import { Action } from '../src/models/Action.js';
import { TRIGGERS, ACTIONS, getTokenFromSymbol, CHAINS, Edge } from '../src/index.js';
import { Note } from '../src/models/Note.js';
import { WORKFLOW_LOOPING_TYPES } from '../src/constants/WorkflowSettings.js';

describe('Workflow Class - fromJSON', () => {
  it('should correctly instantiate a Workflow from a JSON object', async () => {
    const json = {
      "id": "ce0feea1-4d83-42b5-9972-0d434c179ac9",
      "name": "My new Agent 8",
      "executionId": "cb31ca59-599f-42e4-887e-51d4a07a7867",
      "agentId": null,
      "state": "inactive",
      "settings": null,
      "dateCreated": "2025-02-05T09:18:29.273Z",
      "dateModified": "2025-02-05T09:18:29.272Z",
      "nodes": [
          {
              "id": "a87d0e82-f3f9-4a1d-b02f-f9a9147751c8",
              "ref": "10",
              "blockId": 4,
              "executionId": "c2463d60-299f-4a24-b3a4-37869f8b8331",
              "type": "trigger",
              "state": "completed",
              "position": {
                  "x": 400,
                  "y": 120
              },
              "parameters": {
                  "abi": {
                      "parameters": {
                          "sender": null,
                          "amountOut": null,
                          "inputToken": null,
                          "inputAmount": null,
                          "outputToken": null
                      }
                  },
                  "chainId": 1
              },
              "dateCreated": "2025-02-05T09:18:29.275177+00:00",
              "dateModified": "2025-02-05T09:18:29.275177+00:00"
          },
          {
              "id": "93f98a37-ef31-45e9-8dcd-0980861f5c48",
              "ref": "11",
              "blockId": 100010,
              "executionId": "25676362-b7ec-44bf-82e2-56be7ce1f4ae",
              "type": "action",
              "state": "completed",
              "position": {
                  "x": 400,
                  "y": 240
              },
              "parameters": {
                  "time": "1000"
              },
              "dateCreated": "2025-02-05T09:18:29.275177+00:00",
              "dateModified": "2025-02-05T09:18:29.275177+00:00"
          }
      ],
      "edges": [
          {
              "id": "a57c362b-e80d-4719-9161-7da536b69091",
              "source": "10",
              "target": "11",
              "value": null,
              "label": null
          }
      ],
      "notes": []
  }

    const workflow = await Workflow.fromJSON(json);

    expect(workflow.id).to.equal(json.id);
    expect(workflow.name).to.equal(json.name);
    expect(workflow.state).to.equal(json.state);
    expect(workflow.dateCreated).to.equal(json.dateCreated);
    expect(workflow.dateModified).to.equal(json.dateModified);
    expect(workflow.nodes).to.have.lengthOf(json.nodes.length);
    expect(workflow.edges).to.have.lengthOf(json.edges.length);
    expect(workflow.notes).to.have.lengthOf(json.notes.length);
  });

  it('should handle empty nodes, edges, and notes arrays', async () => {
    const json = {
      id: 'workflow-2',
      name: 'Empty Workflow',
      state: 'inactive',
      dateCreated: null,
      dateModified: null,
      executionId: null,
      nodes: [],
      edges: [],
      notes: []
    };

    const workflow = await Workflow.fromJSON(json);

    expect(workflow.id).to.equal(json.id);
    expect(workflow.name).to.equal(json.name);
    expect(workflow.state).to.equal(json.state);
    expect(workflow.dateCreated).to.be.null;
    expect(workflow.dateModified).to.be.null;
    expect(workflow.executionId).to.be.null;
    expect(workflow.nodes).to.be.empty;
    expect(workflow.edges).to.be.empty;
    expect(workflow.notes).to.be.empty;
  });
});


describe('Workflow Class - insertSplit', () => {
  /**
   * Helper to create a base workflow: trigger -> action
   */
  function createBaseWorkflow() {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const action = new Action(ACTIONS.CORE.CONDITION.IF);

    const workflow = new Workflow('Base Workflow', [trigger, action]);
    // Add an edge from trigger to action
    workflow.addEdge(new Edge({ source: trigger, target: action }));

    return { workflow, trigger, action };
  }

  it('Scenario 1: Insert a split with 2 branches at the end (no nodeAfter)', () => {
    // Setup: trigger -> action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert a "Split" node at the end, with 2 branches
    const splitNode = new Action(ACTIONS.CORE.SPLIT.SPLIT);
    workflow.insertSplit(splitNode, action, undefined, 2);

    // Expected:
    // 1) We still have trigger->action
    // 2) A new edge action->splitNode
    // 3) 2 new edges from splitNode -> emptyBlock1, splitNode -> emptyBlock2
    // So total nodes: trigger, action, splitNode, and 2 empties => 5
    // Total edges: 1 (old) + 1 (action->split) + 2 branches => 4
    expect(workflow.nodes).to.have.lengthOf(5);
    expect(workflow.edges).to.have.lengthOf(4);

    // Check the old edge still exists
    const oldEdge = workflow.edges.find(e => e.source === trigger && e.target === action);
    expect(oldEdge, 'Original trigger->action is missing').to.exist;

    // Check for new edge action->splitNode
    const edgeActionToSplit = workflow.edges.find(e => e.source === action && e.target === splitNode);
    expect(edgeActionToSplit, 'No edge from action->splitNode').to.exist;

    // Expect 2 edges from splitNode to new empty blocks
    const edgesFromSplit = workflow.edges.filter(e => e.source === splitNode);
    expect(edgesFromSplit).to.have.lengthOf(2);
  });

  it('Scenario 2: Insert a split with 2 branches in the middle (nodeAfter)', () => {
    // Setup: trigger -> action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert a "Split" node between trigger and action
    const splitNode = new Action(ACTIONS.CORE.SPLIT.SPLIT);
    workflow.insertSplit(splitNode, trigger, action, 2);

    // Expected:
    // 1) Old edge trigger->action removed
    // 2) trigger->splitNode
    // 3) First branch: splitNode->action
    // 4) Second branch: splitNode->(emptyBlock)
    // => 4 total nodes: trigger, action, splitNode, emptyBlock
    // => 3 total edges: (trigger->split), (split->action), (split->emptyBlock)
    expect(workflow.nodes).to.have.lengthOf(4);
    expect(workflow.edges).to.have.lengthOf(3);

    // Check the new edges
    const edgeTriggerToSplit = workflow.edges.find(e => e.source === trigger && e.target === splitNode);
    expect(edgeTriggerToSplit, 'Missing trigger->split edge').to.exist;

    const edgeSplitToAction = workflow.edges.find(e => e.source === splitNode && e.target === action);
    expect(edgeSplitToAction, 'Missing split->action edge').to.exist;

    // The other branch should be split->someEmptyBlock
    const emptyBlock = workflow.nodes.find(
      n => n !== trigger && n !== action && n !== splitNode
    );
    expect(emptyBlock, 'No empty block found').to.exist;

    const edgeSplitToEmpty = workflow.edges.find(e => e.source === splitNode && e.target === emptyBlock);
    expect(edgeSplitToEmpty, 'Missing split->emptyBlock edge').to.exist;
  });

  it('Scenario 3: Insert a split with 3 branches at the end', () => {
    // Setup: trigger->action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert the split node with 3 branches (no nodeAfter)
    const splitNode = new Action(ACTIONS.CORE.SPLIT.SPLIT);
    workflow.insertSplit(splitNode, action, undefined, 3);

    // We expect:
    //  - Still have trigger->action
    //  - A new edge action->split
    //  - 3 edges from split->empty blocks
    // => total nodes = 1(trigger) + 1(action) + 1(split) + 3(empties) = 6
    // => total edges = 1(original) + 1(action->split) + 3(split->empties) = 5
    expect(workflow.nodes).to.have.lengthOf(6);
    expect(workflow.edges).to.have.lengthOf(5);

    // Check edges from `splitNode`
    const edgesFromSplit = workflow.edges.filter(e => e.source === splitNode);
    expect(edgesFromSplit).to.have.lengthOf(3);
  });

  it('Scenario 4: Insert a split with 3 branches in the middle', () => {
    // Setup: trigger->action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert the split node between trigger and action, with 3 branches
    const splitNode = new Action(ACTIONS.CORE.SPLIT.SPLIT);
    workflow.insertSplit(splitNode, trigger, action, 3);

    // Expect:
    //  - old edge removed
    //  - trigger->split
    //  - first branch: split->action
    //  - second + third branches: split->emptyBlock1, split->emptyBlock2
    // => total nodes: 5
    // => total edges: 4
    expect(workflow.nodes).to.have.lengthOf(5);
    expect(workflow.edges).to.have.lengthOf(4);

    const edgeTriggerToSplit = workflow.edges.find(e => e.source === trigger && e.target === splitNode);
    expect(edgeTriggerToSplit, 'Missing trigger->split edge').to.exist;

    const edgesFromSplit = workflow.edges.filter(e => e.source === splitNode);
    expect(edgesFromSplit).to.have.lengthOf(3);

    // One of them should target `action`, the other two target new empty blocks
    const edgeSplitToAction = edgesFromSplit.find(e => e.target === action);
    expect(edgeSplitToAction, 'Missing first branch to existing action').to.exist;

    const emptyBlocks = workflow.nodes.filter(n => ![trigger, action, splitNode].includes(n));
    expect(emptyBlocks, 'Missing 2 empty blocks').to.have.lengthOf(2);
    emptyBlocks.forEach(eb => {
      const hasEdge = edgesFromSplit.some(e => e.target === eb);
      expect(hasEdge).to.be.true;
    });
  });

  it('Scenario 5: numberOfBranches < 2 should throw an error', () => {
    // Setup
    const { workflow, trigger } = createBaseWorkflow();

    // Attempt to insert a split with only 1 branch => error
    const splitNode = new Action(ACTIONS.CORE.SPLIT.SPLIT);
    expect(() => {
      workflow.insertSplit(splitNode, trigger, undefined, 1);
    }).to.throw('numberOfBranches must be at least 2.');
  });

  it('Scenario 6: nodeBefore not in workflow throws error', () => {
    const { workflow, trigger } = createBaseWorkflow();
    const otherNode = new Action(ACTIONS.CORE.SPLIT.SPLIT); // Not in workflow

    expect(() => {
      workflow.insertSplit(otherNode, otherNode, undefined, 2);
    }).to.throw('nodeBefore must exist in the workflow.');
  });

  it('Scenario 7: nodeAfter exists but not connected to nodeBefore', () => {
    // Setup: trigger->action
    const { workflow, trigger, action } = createBaseWorkflow();

    // We'll add a *different* node so that trigger->thisNode->action does NOT exist
    // action2 is not connected in any edge
    const action2 = new Action(ACTIONS.CORE.CONDITION.IF);
    workflow.addNode(action2);

    // Insert a split using nodeBefore=trigger, nodeAfter=action2
    // There's no edge trigger->action2, so it should throw "No edge exists..."
    const splitNode = new Action(ACTIONS.CORE.SPLIT.SPLIT);

    expect(() => {
      workflow.insertSplit(splitNode, trigger, action2, 2);
    }).to.throw('No edge exists between nodeBefore and nodeAfter.');
  });
});

describe('Workflow Class - insertCondition', () => {
  /**
   * Helper to create a base workflow: trigger -> action
   */
  function createBaseWorkflow() {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    const action = new Action(ACTIONS.CORE.CONDITION.IF);

    const workflow = new Workflow('Base Workflow', [trigger, action]);
    // Add an edge from trigger to action
    workflow.addEdge(new Edge({ source: trigger, target: action }));

    return { workflow, trigger, action };
  }

  it('Scenario 1: Add IF before the action, no ELSE', () => {
    // trigger -> action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert the IF node: nodeBefore=trigger, nodeAfter=action, addElseCase=false
    const conditionNode = new Action(ACTIONS.CORE.CONDITION.IF);
    workflow.insertCondition(conditionNode, trigger, action, false);

    // EXPECT: 3 nodes total => [trigger, action, IF]
    expect(workflow.nodes).to.have.lengthOf(3);

    // The old edge (trigger->action) is removed
    // We now have edges:
    //   1) trigger->conditionNode (label 'true' or unlabeled, depends on your insert logic)
    //   2) conditionNode->action  (label 'true')
    expect(workflow.edges).to.have.lengthOf(2);

    const edge1 = workflow.edges.find(e => e.source === trigger && e.target === conditionNode);
    const edge2 = workflow.edges.find(e => e.source === conditionNode && e.target === action);

    expect(edge1, 'Missing edge from trigger to condition').to.exist;
    expect(edge2, 'Missing edge from condition to action').to.exist;

    // Typically they're labeled "true," but adapt if your code differs
    expect(edge1?.label).to.equal(undefined);
    expect(edge2?.label).to.equal('true');
  });

  it('Scenario 2: Add IF after the action, no ELSE', () => {
    // trigger -> action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert the IF node: nodeBefore=action, nodeAfter=undefined, addElseCase=false
    const conditionNode = new Action(ACTIONS.CORE.CONDITION.IF);
    workflow.insertCondition(conditionNode, action, undefined, false);

    // EXPECT: We haven't removed trigger->action. We only added:
    //   action->conditionNode, plus conditionNode->(empty block?) if your code does so.
    // But since there's "no else," we expect a single "true" branch.
    //
    // Depending on your insertCondition logic, it might produce:
    //   - action->IF, and IF-> emptyBlock (labeled 'true')
    //   or possibly just action->IF if your code only inserts the condition node.
    //
    // Let's assume your code spawns an "empty block" for the "true" path at the end:
    // => We expect 4 nodes: trigger, action, IF, emptyBlock
    // => We expect 3 edges: 
    //    1) trigger->action
    //    2) action->IF
    //    3) IF->emptyBlock ( labeled 'true' )
    const allNodes = workflow.nodes;
    expect(allNodes).to.have.lengthOf(4);

    const edges = workflow.edges;
    expect(edges).to.have.lengthOf(3);

    // Check the original edge is still there
    const edgeTriggerAction = edges.find(e => e.source === trigger && e.target === action);
    expect(edgeTriggerAction, 'Missing original trigger->action edge').to.exist;

    // Check the new edges
    const edgeActionIF = edges.find(e => e.source === action && e.target === conditionNode);
    expect(edgeActionIF, 'Missing action->IF edge').to.exist;

    // The "true" edge typically goes to the empty block
    const emptyBlockNode = allNodes.find(n => n !== trigger && n !== action && n !== conditionNode);
    const edgeIFEmpty = edges.find(e => e.source === conditionNode && e.target === emptyBlockNode);
    expect(edgeIFEmpty, 'Missing IF->empty block edge').to.exist;
    expect(edgeIFEmpty?.label).to.equal('true');
  });

  it('Scenario 3: Add IF before the action, with ELSE', () => {
    // trigger -> action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert the IF node: nodeBefore=trigger, nodeAfter=action, addElseCase=true
    const conditionNode = new Action(ACTIONS.CORE.CONDITION.IF);
    workflow.insertCondition(conditionNode, trigger, action, true);

    // EXPECT: 4 nodes => [trigger, action, IF, emptyBlock(for false)]
    expect(workflow.nodes).to.have.lengthOf(4);

    // Edges:
    //   1) trigger->IF (maybe unlabeled or "Condition")
    //   2) IF->action labeled "true"
    //   3) IF->emptyBlock labeled "false"
    expect(workflow.edges).to.have.lengthOf(3);

    const edgeIFtoAction = workflow.edges.find(
      e => e.source === conditionNode && e.target === action && e.label === 'true'
    );
    expect(edgeIFtoAction, 'Missing IF->action with label true').to.exist;

    const falseEdge = workflow.edges.find(
      e => e.source === conditionNode && e.label === 'false'
    );
    expect(falseEdge, 'Missing IF->(emptyBlock) with label false').to.exist;
  });

  it('Scenario 4: Add IF after the action, with ELSE', () => {
    // trigger -> action
    const { workflow, trigger, action } = createBaseWorkflow();

    // Insert the IF node: nodeBefore=action, nodeAfter=undefined, addElseCase=true
    const conditionNode = new Action(ACTIONS.CORE.CONDITION.IF);
    workflow.insertCondition(conditionNode, action, undefined, true);

    // EXPECT final flow: 
    //   trigger -> action -> IF
    //   IF->(emptyBlock1) labeled 'true'
    //   IF->(emptyBlock2) labeled 'false'
    //
    // That yields 5 total nodes:
    //   1) trigger
    //   2) action
    //   3) IF
    //   4) emptyBlock1
    //   5) emptyBlock2
    expect(workflow.nodes).to.have.lengthOf(5);

    // Original edge remains trigger->action.
    // Then an edge from action->IF, plus edges from IF->emptyBlock1 ('true') and IF->emptyBlock2 ('false').
    expect(workflow.edges).to.have.lengthOf(4);

    // Check original
    const edgeTriggerAction = workflow.edges.find(
      e => e.source === trigger && e.target === action
    );
    expect(edgeTriggerAction, 'Missing original trigger->action edge').to.exist;

    // Check action->IF
    const edgeActionIF = workflow.edges.find(
      e => e.source === action && e.target === conditionNode
    );
    expect(edgeActionIF, 'Missing action->IF edge').to.exist;

    // The "true" and "false" edges from IF
    const trueEdge = workflow.edges.find(e => e.source === conditionNode && e.label === 'true');
    const falseEdge = workflow.edges.find(e => e.source === conditionNode && e.label === 'false');

    expect(trueEdge, 'Missing IF->emptyBlock (true)').to.exist;
    expect(falseEdge, 'Missing IF->emptyBlock (false)').to.exist;
  });
});

describe('Workflow Class', () => {
  it('should create a workflow with a trigger and actions', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);
    trigger.setPosition(0, 0);

    const action1 = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("amount", 1000);
    action1.setParams("asset", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
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
      agentId: null,
      dateCreated: null,
      dateModified: null,
      executionId: null,
      nodes: [trigger.toJSON(), action1.toJSON(), action2.toJSON()],
      edges: [],
      notes: [], // Ensure notes are empty initially
      state: 'inactive',
      settings: null // Add settings field
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

    const action1 = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("amount", 1000);
    action1.setParams("asset", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
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

    const action = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    action.setChainId(CHAINS.ETHEREUM);
    action.setParams("amount", 1000);
    action.setParams("asset", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
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

    const action1 = new Action(ACTIONS.LENDING.COMPOUND.DEPOSIT);
    action1.setChainId(CHAINS.ETHEREUM);
    action1.setParams("amount", 1000);
    action1.setParams("asset", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    action1.setPosition(1, 0);

    const workflow = new Workflow("Test Workflow", [trigger, action1], [new Edge({ source: trigger, target: action1 })]);
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), trigger, action1);
    expect(workflow.nodes).to.have.length(3);
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
      [new Edge({ source: trigger, target: split })]
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
      [new Edge({ source: trigger, target: condition })]
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

describe('Workflow Class - getNode', () => {
  it('should return the correct node when a valid ref is provided', () => {
    const workflow = new Workflow("Test Workflow");
    const node = new Action(ACTIONS.CORE.CONDITION.IF);
    workflow.addNode(node);

    const result = workflow.getNode(node.getRef());
    expect(result).to.equal(node);
  });

  it('should return null when the node with the given ref does not exist', () => {
    const workflow = new Workflow("Test Workflow");
    const result = workflow.getNode("non-existent-ref");
    expect(result).to.be.null;
  });

  it('should work correctly when the workflow has no nodes', () => {
    const workflow = new Workflow("Empty Workflow");
    const result = workflow.getNode("any-ref");
    expect(result).to.be.null;
  });
});

describe('Workflow Class - Edge Management', () => {
  it('should get all outgoing edges from a node', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

    const edge1 = new Edge({ source: node1, target: node2, label: 'true', value: 'true' });
    const edge2 = new Edge({ source: node1, target: node3, label: 'false', value: 'false' });
    const edge3 = new Edge({ source: node2, target: node3 }); // Different source

    const workflow = new Workflow("Test Workflow", [node1, node2, node3], [edge1, edge2, edge3]);

    const edges = workflow.getEdges(node1);
    
    // Should only get edges where node1 is the source
    expect(edges).to.have.lengthOf(2);
    expect(edges).to.deep.include(edge1);
    expect(edges).to.deep.include(edge2);
    expect(edges).to.not.deep.include(edge3);
  });

  it('should return empty array when node has no outgoing edges', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    
    const edge1 = new Edge({ source: node2, target: node1 }); // node1 has no outgoing edges
    
    const workflow = new Workflow("Test Workflow", [node1, node2], [edge1]);
    
    const edges = workflow.getEdges(node1);
    expect(edges).to.be.empty;
  });

  it('should preserve edge labels and values when getting edges', () => {
    const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
    
    const edge1 = new Edge({ 
      source: node1, 
      target: node2, 
      label: 'custom-label',
      value: 'custom-value'
    });
    
    const workflow = new Workflow("Test Workflow", [node1, node2], [edge1]);
    
    const edges = workflow.getEdges(node1);
    
    expect(edges).to.have.lengthOf(1);
    expect(edges[0].label).to.equal('custom-label');
    expect(edges[0].value).to.equal('custom-value');
  });
});

describe('Workflow Class - Complex Condition Tree', () => {
  it('should create a workflow with nested conditions', () => {
    // Create initial trigger
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setChainId(CHAINS.ETHEREUM);
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

    // First condition node
    const condition1 = new Action(ACTIONS.CORE.CONDITION.IF);
    
    // Create initial workflow with trigger -> condition1
    const workflow = new Workflow(
      "Nested Conditions Workflow",
      [trigger, condition1],
      [new Edge({ source: trigger, target: condition1 })]
    );

    // Add true/false branches for condition1
    const condition1TrueBlock = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
    const condition1FalseBlock = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
    workflow.insertNode(condition1TrueBlock, condition1, undefined, "true", "true");
    workflow.insertNode(condition1FalseBlock, condition1, undefined, "false", "false");

    // Create and add nested conditions
    const condition2True = new Action(ACTIONS.CORE.CONDITION.IF);  // For true branch
    const condition2False = new Action(ACTIONS.CORE.CONDITION.IF); // For false branch
    
    // Replace empty blocks with new conditions
    workflow.swapNode(condition1TrueBlock, condition2True);
    workflow.swapNode(condition1FalseBlock, condition2False);

    // Add empty blocks for condition2True's branches
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), condition2True, undefined, "true", "true");
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), condition2True, undefined, "false", "false");

    // Add empty blocks for condition2False's branches
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), condition2False, undefined, "true", "true");
    workflow.insertNode(new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK), condition2False, undefined, "false", "false");

    // Verify the structure
    // Expected: 7 nodes total
    // 1 trigger + 3 conditions + 4 empty blocks
    expect(workflow.nodes).to.have.lengthOf(8);

    // Expected: 7 edges total
    // 1 (trigger->condition1) + 
    // 2 (condition1->condition2True/False) +
    // 2 (condition2True->emptyBlocks) +
    // 2 (condition2False->emptyBlocks)
    expect(workflow.edges).to.have.lengthOf(7);

    // Verify edge from trigger to first condition
    const triggerEdge = workflow.edges.find(e => e.source === trigger);
    expect(triggerEdge?.target).to.equal(condition1);

    // Verify condition1's edges
    const condition1Edges = workflow.getEdges(condition1);
    expect(condition1Edges).to.have.lengthOf(2);
    expect(condition1Edges.find(e => e.label === "true")?.target).to.equal(condition2True);
    expect(condition1Edges.find(e => e.label === "false")?.target).to.equal(condition2False);

    // Verify condition2True's edges
    const condition2TrueEdges = workflow.getEdges(condition2True);
    expect(condition2TrueEdges).to.have.lengthOf(2);
    expect(condition2TrueEdges.find(e => e.label === "true")).to.exist;
    expect(condition2TrueEdges.find(e => e.label === "false")).to.exist;

    // Verify condition2False's edges
    const condition2FalseEdges = workflow.getEdges(condition2False);
    expect(condition2FalseEdges).to.have.lengthOf(2);
    expect(condition2FalseEdges.find(e => e.label === "true")).to.exist;
    expect(condition2FalseEdges.find(e => e.label === "false")).to.exist;

    // Verify all condition edges have proper labels and values
    const allConditionEdges = [
      ...condition1Edges,
      ...condition2TrueEdges,
      ...condition2FalseEdges
    ];
    allConditionEdges.forEach(edge => {
      expect(edge.label).to.be.oneOf(["true", "false"]);
      expect(edge.value).to.equal(edge.label);
    });
  });
});

describe('Workflow Class - validateInternalVariables', () => {
  it('should detect invalid node references in parameters', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setRef('1');

    const action = new Action(ACTIONS.CORE.SWAP.SWAP);
    action.setRef('2');
    action.setParams('tokenIn', '{{nodeMap.3.output.amount}}');

    const workflow = new Workflow('Test Workflow', [trigger, action]);
    const invalidRefs = workflow.validateInternalVariables();

    expect(invalidRefs).to.have.lengthOf(1);
    expect(invalidRefs).to.deep.include.members([
      {
        nodeRef: '2',
        nodeType: 'action',
        parameterKey: 'tokenIn',
        parameterValue: '{{nodeMap.3.output.amount}}',
        referencedNodeRef: '3'
      }
    ]);
  });

  it('should not report valid node references', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setRef('1');

    const action1 = new Action(ACTIONS.CORE.SWAP.SWAP);
    action1.setRef('2');

    const action2 = new Action(ACTIONS.CORE.SWAP.SWAP);
    action2.setRef('3');
    action2.setParams('tokenIn', '{{nodeMap.1.output.amount}}');

    const workflow = new Workflow('Test Workflow', [trigger, action1, action2]);
    const invalidRefs = workflow.validateInternalVariables();

    expect(invalidRefs).to.have.lengthOf(0);
  });

  it('should handle parameters without node references', () => {
    const trigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);
    trigger.setRef('1');

    const action = new Action(ACTIONS.CORE.SWAP.SWAP);
    action.setRef('2');
    action.setParams('tokenIn', '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9');

    const workflow = new Workflow('Test Workflow', [trigger, action]);
    const invalidRefs = workflow.validateInternalVariables();

    expect(invalidRefs).to.have.lengthOf(0);
  });
});

describe('Workflow Class - setSettings', () => {
  it('should set valid polling settings', () => {
    const workflow = new Workflow('Test Workflow');
    const pollingSettings = {
      loopingType: WORKFLOW_LOOPING_TYPES.POLLING,
      period: 3000,
      limit: 10
    };
    
    workflow.setSettings(pollingSettings);
    expect(workflow.settings).to.deep.equal(pollingSettings);
  });

  it('should set valid subscription settings', () => {
    const workflow = new Workflow('Test Workflow');
    const subscriptionSettings = {
      loopingType: WORKFLOW_LOOPING_TYPES.SUBSCRIPTION,
      timeout: 60000,
      limit: 20
    };
    
    workflow.setSettings(subscriptionSettings);
    expect(workflow.settings).to.deep.equal(subscriptionSettings);
  });

  it('should throw error when polling period is not positive', () => {
    const workflow = new Workflow('Test Workflow');
    const invalidSettings = {
      loopingType: WORKFLOW_LOOPING_TYPES.POLLING,
      period: -1,
      limit: 10
    };
    
    expect(() => workflow.setSettings(invalidSettings))
      .to.throw('Polling settings must include a positive period value');
  });

  it('should throw error when polling limit is not positive', () => {
    const workflow = new Workflow('Test Workflow');
    const invalidSettings = {
      loopingType: WORKFLOW_LOOPING_TYPES.POLLING,
      period: 3000,
      limit: 0
    };
    
    expect(() => workflow.setSettings(invalidSettings))
      .to.throw('Polling settings must include a positive limit value');
  });

  it('should throw error when subscription timeout is not positive', () => {
    const workflow = new Workflow('Test Workflow');
    const invalidSettings = {
      loopingType: WORKFLOW_LOOPING_TYPES.SUBSCRIPTION,
      timeout: -1,
      limit: 20
    };
    
    expect(() => workflow.setSettings(invalidSettings))
      .to.throw('Subscription settings must include a positive timeout value');
  });

  it('should throw error when subscription limit is not positive', () => {
    const workflow = new Workflow('Test Workflow');
    const invalidSettings = {
      loopingType: WORKFLOW_LOOPING_TYPES.SUBSCRIPTION,
      timeout: 60000,
      limit: 0
    };
    
    expect(() => workflow.setSettings(invalidSettings))
      .to.throw('Subscription settings must include a positive limit value');
  });

  it('should persist settings in toJSON output', () => {
    const workflow = new Workflow('Test Workflow');
    const pollingSettings = {
      loopingType: WORKFLOW_LOOPING_TYPES.POLLING,
      period: 3000,
      limit: 10
    };
    
    workflow.setSettings(pollingSettings);
    const json = workflow.toJSON();
    expect(json.settings).to.deep.equal(pollingSettings);
  });

  it('should load settings from JSON in fromJSON', async () => {
    const json = {
      name: 'Test Workflow',
      nodes: [],
      edges: [],
      notes: [],
      settings: {
        loopingType: WORKFLOW_LOOPING_TYPES.SUBSCRIPTION,
        timeout: 60000,
        limit: 20
      }
    };
    
    const workflow = await Workflow.fromJSON(json);
    expect(workflow.settings).to.deep.equal(json.settings);
  });
});