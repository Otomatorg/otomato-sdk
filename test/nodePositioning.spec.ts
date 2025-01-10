import { expect } from 'chai';
import { Workflow } from '../src/models/Workflow.js';
import { Edge } from '../src/models/Edge.js';
import { Action, ACTIONS } from '../src/index.js';
import { positionWorkflowNodes, xSpacing, ySpacing, getChildren, identifyLeafNodes, ROOT_X, ROOT_Y, identityStartingNodes } from '../src/utils/WorkflowNodePositioner';

describe('Node Positioning', () => {
    it('should position a single node workflow', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const workflow = new Workflow("Single Node Workflow", [node], []);

        positionWorkflowNodes(workflow);

        expect(node.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
    });

    it('should position leaf nodes horizontally', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const workflow = new Workflow("Leaf Nodes Workflow", [node1, node2], []);

        positionWorkflowNodes(workflow);

        expect(node1.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(node2.position).to.deep.equal({ x: ROOT_X + xSpacing, y: ROOT_Y });
    });

    it('should position parent with one child correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edge = new Edge({ source: parent, target: child });
        const workflow = new Workflow("Single Parent Workflow", [parent, child], [edge]);

        positionWorkflowNodes(workflow);

        expect(child.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });
    });

    it('should position parent with multiple children correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edge1 = new Edge({ source: parent, target: child1 });
        const edge2 = new Edge({ source: parent, target: child2 });
        const workflow = new Workflow("Multiple Children Workflow", [parent, child1, child2], [edge1, edge2]);

        positionWorkflowNodes(workflow);

        expect(child1.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(child2.position).to.deep.equal({ x: ROOT_X + xSpacing, y: ROOT_Y });
        expect(parent.position).to.deep.equal({ x: ROOT_X + xSpacing / 2, y: ROOT_Y + ySpacing });
    });

    it('should position complex workflows with multiple levels', () => {
        const nodeA = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeB = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeC = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeD = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edge1 = new Edge({ source: nodeA, target: nodeB });
        const edge2 = new Edge({ source: nodeA, target: nodeC });
        const edge3 = new Edge({ source: nodeB, target: nodeD });

        const workflow = new Workflow("Complex Workflow", [nodeA, nodeB, nodeC, nodeD], [edge1, edge2, edge3]);

        positionWorkflowNodes(workflow);

        expect(nodeA.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(nodeB.position).to.deep.equal({ x: ROOT_X - xSpacing / 2, y: ROOT_Y + ySpacing });
        expect(nodeC.position).to.deep.equal({ x: ROOT_X + xSpacing / 2, y: ROOT_Y + ySpacing });
        expect(nodeD.position).to.deep.equal({ x: ROOT_X + xSpacing / 2, y: ROOT_Y + ySpacing * 2 });
    });

    it('should skip already positioned nodes', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        child.setPosition(100, 50); // Already positioned
        const edge = new Edge({ source: parent, target: child });
        const workflow = new Workflow("Skip Positioned Node Workflow", [parent, child], [edge]);

        positionWorkflowNodes(workflow);

        expect(child.position).to.deep.equal({ x: 100, y: 50 }); // Unchanged
        expect(parent.position).to.deep.equal({ x: 100, y: 50 + ySpacing });
    });
});

describe('Node and Workflow Utility Functions', () => {
    it('should get children of a node', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: parent, target: child1 });
        const edge2 = new Edge({ source: parent, target: child2 });
        const edges = [edge1, edge2];

        const children = getChildren(parent, edges);
        expect(children).to.deep.equal([child1, child2]);
    });

    it('should identify leaf nodes in a workflow', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node3 });
        const workflow = new Workflow("Test Workflow", [node1, node2, node3], [edge1, edge2]);

        const leafNodes = identifyLeafNodes(workflow);
        expect(leafNodes).to.deep.equal([node3]);
    });

    it('should return an empty array if a node has no children', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edges: Edge[] = [];

        const children = getChildren(parent, edges);
        expect(children).to.deep.equal([]);
    });

    it('should return all nodes as leaves when there are no edges', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const workflow = new Workflow("Test Workflow", [node1, node2, node3], []);

        const leafNodes = identifyLeafNodes(workflow);
        expect(leafNodes).to.deep.equal([node1, node2, node3]);
    });

    it('should handle a single node workflow with no edges', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const workflow = new Workflow("Single Node Workflow", [node], []);

        const leafNodes = identifyLeafNodes(workflow);
        expect(leafNodes).to.deep.equal([node]);
    });

    it('should handle cycles gracefully in getChildren', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node1 });
        const edges = [edge1, edge2];

        const childrenOfNode1 = getChildren(node1, edges);
        const childrenOfNode2 = getChildren(node2, edges);

        expect(childrenOfNode1).to.deep.equal([node2]);
        expect(childrenOfNode2).to.deep.equal([node1]);
    });

    it('should handle multiple children in getChildren', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.CONDITION.IF);
        const node4 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node5 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node6 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node3 });
        const edge3 = new Edge({ source: node3, target: node4, label: "true", value: "true" });
        const edge4 = new Edge({ source: node3, target: node5, label: "false", value: "false" });
        const edge5 = new Edge({ source: node5, target: node6 });
        const edges = [edge1, edge2, edge3, edge4, edge5];

        const childrenOfNode1 = getChildren(node1, edges);
        const childrenOfNode2 = getChildren(node2, edges);
        const childrenOfNode3 = getChildren(node3, edges);
        const childrenOfNode5 = getChildren(node5, edges);

        expect(childrenOfNode1).to.deep.equal([node2]);
        expect(childrenOfNode2).to.deep.equal([node3]);
        expect(childrenOfNode3).to.deep.equal([node4, node5]);
        expect(childrenOfNode5).to.deep.equal([node6]);
    });

});

describe('identityStartingNodes', () => {
    it('should return all nodes if no edges exist', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const workflow = new Workflow("No Edges Workflow", [node1, node2], []);

        const startingNodes = identityStartingNodes(workflow);
        expect(startingNodes).to.deep.equal([node1, node2]);
    });

    it('should return only nodes that have no incoming edges', () => {
        const nodeA = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeB = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeC = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: nodeA, target: nodeB });
        const edge2 = new Edge({ source: nodeA, target: nodeC });
        const workflow = new Workflow("Simple Workflow", [nodeA, nodeB, nodeC], [edge1, edge2]);

        const startingNodes = identityStartingNodes(workflow);
        expect(startingNodes).to.deep.equal([nodeA]);
    });

    it('should return multiple starting nodes if they have no incoming edges', () => {
        const nodeA = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeB = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeC = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const nodeD = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: nodeA, target: nodeC });
        const edge2 = new Edge({ source: nodeB, target: nodeD });
        const workflow = new Workflow("Multiple Starting Nodes Workflow", [nodeA, nodeB, nodeC, nodeD], [edge1, edge2]);

        const startingNodes = identityStartingNodes(workflow);
        expect(startingNodes).to.deep.equal([nodeA, nodeB]);
    });

    it('should handle an empty workflow', () => {
        const workflow = new Workflow("Empty Workflow", [], []);

        const startingNodes = identityStartingNodes(workflow);
        expect(startingNodes).to.deep.equal([]);
    });

    it('should return a single starting node in a linear workflow', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node3 });
        const workflow = new Workflow("Linear Workflow", [node1, node2, node3], [edge1, edge2]);

        const startingNodes = identityStartingNodes(workflow);
        expect(startingNodes).to.deep.equal([node1]);
    });
});