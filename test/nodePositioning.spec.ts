import { expect } from 'chai';
import { Workflow } from '../src/models/Workflow.js';
import { Edge } from '../src/models/Edge.js';
import { Action, ACTIONS } from '../src/index.js';
import {
    positionWorkflowNodes,
    positionWorkflowNodesAvoidOverlap,
    xSpacing,
    ySpacing,
    getChildren,
    identifyLeafNodes,
    ROOT_X,
    ROOT_Y,
    identityStartingNodes,
    getEdges,
    getParents,
    getEndNodePositions
} from '../src/utils/WorkflowNodePositioner';

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

        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(child.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });
    });

    it('should position parent with multiple children correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edge1 = new Edge({ source: parent, target: child1 });
        const edge2 = new Edge({ source: parent, target: child2 });
        const workflow = new Workflow("Multiple Children Workflow", [parent, child1, child2], [edge1, edge2]);

        positionWorkflowNodes(workflow);

        // Expectations
        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y }); // Parent at ROOT_X, ROOT_Y
        expect(child1.position).to.deep.equal({ x: ROOT_X - xSpacing / 2, y: ROOT_Y + ySpacing }); // child1 to the left
        expect(child2.position).to.deep.equal({ x: ROOT_X + xSpacing / 2, y: ROOT_Y + ySpacing }); // child2 to the right
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
        expect(nodeD.position).to.deep.equal({ x: ROOT_X - xSpacing / 2, y: ROOT_Y + ySpacing * 2 });
    });

    it('should order children based on edge labels', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const childTrue = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const childFalse = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge2 = new Edge({ source: parent, target: childTrue, label: 'true' });
        const edge3 = new Edge({ source: parent, target: childFalse, label: 'false' });

        const workflow = new Workflow("Edge Label Workflow", [parent, childTrue, childFalse], [edge2, edge3]);
        positionWorkflowNodes(workflow);

        const children = getChildren(parent, workflow.edges);

        // Check order of children
        expect(children).to.deep.equal([childTrue, childFalse]);

        // Check positions
        expect(childTrue.position?.x).to.be.lessThan(childFalse.position?.x!);
    });

    it('should order children based on edge labels - contrary setup', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const childTrue = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const childFalse = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge2 = new Edge({ source: parent, target: childTrue, label: 'false' });
        const edge3 = new Edge({ source: parent, target: childFalse, label: 'true' });

        const workflow = new Workflow("Edge Label Workflow", [parent, childTrue, childFalse], [edge2, edge3]);
        positionWorkflowNodes(workflow);

        const children = getChildren(parent, workflow.edges);

        // Check order of children
        expect(children).to.deep.equal([childTrue, childFalse]);

        // Check positions
        expect(childFalse.position?.x).to.be.lessThan(childTrue.position?.x!);
    });
});

describe('Node Positioning - Multiple Children', () => {
    it('should position a node with 3 children correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: parent, target: child1 });
        const edge2 = new Edge({ source: parent, target: child2 });
        const edge3 = new Edge({ source: parent, target: child3 });
        const workflow = new Workflow("Three Children Workflow", [parent, child1, child2, child3], [edge1, edge2, edge3]);

        // No explicit layout call here, so by default, positions are presumably (ROOT_X, ROOT_Y).
        // If you’re calling positionWorkflowNodes automatically on Workflow creation, you might remove these checks.

        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(child1.position).to.deep.equal({ x: ROOT_X - xSpacing, y: ROOT_Y + ySpacing });
        expect(child2.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });
        expect(child3.position).to.deep.equal({ x: ROOT_X + xSpacing, y: ROOT_Y + ySpacing });
    });

    it('should position a node with 4 children correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const children = Array.from({ length: 4 }, () => new Action(ACTIONS.CORE.DELAY.WAIT_FOR));
        const edges = children.map(child => new Edge({ source: parent, target: child }));
        const workflow = new Workflow("Four Children Workflow", [parent, ...children], edges);

        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });

        children.forEach((child, index) => {
            const expectedX = ROOT_X + (index - 1.5) * xSpacing;
            expect(child.position).to.deep.equal({ x: expectedX, y: ROOT_Y + ySpacing });
        });
    });

    it('should position a node with 5 children correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const children = Array.from({ length: 5 }, () => new Action(ACTIONS.CORE.DELAY.WAIT_FOR));
        const edges = children.map(child => new Edge({ source: parent, target: child }));
        const workflow = new Workflow("Five Children Workflow", [parent, ...children], edges);


        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });

        children.forEach((child, index) => {
            const expectedX = ROOT_X + (index - 2) * xSpacing;
            expect(child.position).to.deep.equal({ x: expectedX, y: ROOT_Y + ySpacing });
        });
    });

    it('should position a node with 10 children correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const children = Array.from({ length: 10 }, () => new Action(ACTIONS.CORE.DELAY.WAIT_FOR));
        const edges = children.map(child => new Edge({ source: parent, target: child }));
        const workflow = new Workflow("Ten Children Workflow", [parent, ...children], edges);

        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });

        children.forEach((child, index) => {
            const expectedX = ROOT_X + (index - 4.5) * xSpacing;
            expect(child.position).to.deep.equal({ x: expectedX, y: ROOT_Y + ySpacing });
        });
    });

    it('should position a node with 11 children correctly', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const children = Array.from({ length: 11 }, () => new Action(ACTIONS.CORE.DELAY.WAIT_FOR));
        const edges = children.map(child => new Edge({ source: parent, target: child }));
        const workflow = new Workflow("Eleven Children Workflow", [parent, ...children], edges);

        expect(parent.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });

        children.forEach((child, index) => {
            const expectedX = ROOT_X + (index - 5) * xSpacing;
            expect(child.position).to.deep.equal({ x: expectedX, y: ROOT_Y + ySpacing });
        });
    });
});

describe('Node Positioning - Workflow Modifications', () => {
    it('should correctly position nodes when adding a node at the end of the workflow', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge = new Edge({ source: node1, target: node2 });
        const workflow = new Workflow("Adding Node at End", [node1, node2], [edge]);

        positionWorkflowNodes(workflow);

        // Add a new node at the end
        const newNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const newEdge = new Edge({ source: node2, target: newNode });
        workflow.addNode(newNode);
        workflow.addEdge(newEdge);

        expect(node1.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(node2.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });
        expect(newNode.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing * 2 });
    });

    it('should correctly position nodes when adding a node in the middle of the workflow', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge = new Edge({ source: node1, target: node3 });
        const workflow = new Workflow("Adding Node in Middle", [node1, node3], [edge]);

        // Add a new node in the middle using insertNode
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        workflow.insertNode(node2, node1, node3);

        // Expectations
        expect(node1.position?.y).to.deep.equal(ROOT_Y);
        expect(node2.position?.y).to.deep.equal(ROOT_Y + ySpacing);
        expect(node3.position?.y).to.deep.equal(ROOT_Y + ySpacing * 2);

        // Verify edges by comparing only source and target
        const simplifiedEdges = workflow.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
        }));
        expect(simplifiedEdges).to.deep.equal([
            { source: node1, target: node2 },
            { source: node2, target: node3 },
        ]);
    });

    it('should correctly position nodes when swapping two nodes', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node3 });
        const workflow = new Workflow("Swapping Nodes", [node1, node2, node3], [edge1, edge2]);

        positionWorkflowNodes(workflow);

        // Swap node2 and node3
        const newNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        workflow.swapNode(node2, newNode);

        expect(node1.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(newNode.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });
        expect(node3.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing * 2 });
    });

    it('should correctly position nodes when deleting a node at the end of the workflow', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node3 });
        const workflow = new Workflow("Deleting Node at End", [node1, node2, node3], [edge1, edge2]);

        positionWorkflowNodes(workflow);

        // Delete the last node
        workflow.deleteNode(node3);

        positionWorkflowNodes(workflow);

        expect(node1.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(node2.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });
        expect(workflow.nodes.length).to.equal(2);
        expect(workflow.edges).to.deep.equal([edge1]); // Ensure no additional edges remain
    });

    it('should correctly position nodes when deleting a node in the middle of the workflow', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node3 });
        const workflow = new Workflow("Deleting Node in Middle", [node1, node2, node3], [edge1, edge2]);

        positionWorkflowNodes(workflow);

        // Delete the middle node
        workflow.deleteNode(node2);

        positionWorkflowNodes(workflow);

        // Expectations
        expect(node1.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(node3.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });

        // Verify edges by comparing only source and target
        const simplifiedEdges = workflow.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
        }));
        expect(simplifiedEdges).to.deep.equal([
            { source: node1, target: node3 },
        ]);
    });

    it('should correctly position nodes when deleting a starting node', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edge = new Edge({ source: node1, target: node2 });
        const workflow = new Workflow("Deleting Starting Node", [node1, node2], [edge]);

        // Delete the starting node
        workflow.deleteNode(node1);

        // Expectations
        expect(node2.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
        expect(workflow.nodes.length).to.equal(1);

        // Verify edges
        expect(workflow.edges).to.deep.equal([]);
    });
});

describe('Node Positioning - Overlapping Protection', () => {
    it('should correctly position nodes in a nested workflow with two levels of children', () => {
        // Create the nodes
        const rootNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const grandChild1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const grandChild2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const grandChild3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const grandChild4 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        // Create the edges
        const edge1 = new Edge({ source: rootNode, target: child1 });
        const edge2 = new Edge({ source: rootNode, target: child2 });
        const edge3 = new Edge({ source: child1, target: grandChild1 });
        const edge4 = new Edge({ source: child1, target: grandChild2 });
        const edge5 = new Edge({ source: child2, target: grandChild3 });
        const edge6 = new Edge({ source: child2, target: grandChild4 });

        // Create the workflow
        const workflow = new Workflow(
            "Nested Workflow",
            [rootNode, child1, child2, grandChild1, grandChild2, grandChild3, grandChild4],
            [edge1, edge2, edge3, edge4, edge5, edge6]
        );

        // Expectations for rootNode
        // grandchildren
        expect(grandChild4.position).to.deep.equal({ x: ROOT_X + xSpacing * 2, y: ROOT_Y + ySpacing * 2 });
        expect(grandChild3.position).to.deep.equal({ x: ROOT_X + xSpacing, y: ROOT_Y + ySpacing * 2 });
        expect(grandChild2.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing * 2 });
        expect(grandChild1.position).to.deep.equal({ x: ROOT_X - xSpacing, y: ROOT_Y + ySpacing * 2 });


        // children
        expect(child2.position).to.deep.equal({ x: (grandChild4?.position?.x! + grandChild3?.position?.x!) / 2, y: ROOT_Y + ySpacing });
        expect(child1.position).to.deep.equal({ x: (grandChild2?.position?.x! + grandChild1?.position?.x!) / 2, y: ROOT_Y + ySpacing });

        // root
        expect(rootNode.position).to.deep.equal({ x: (child2?.position?.x! + child1?.position?.x!) / 2, y: ROOT_Y });

        // Expectations for first-level children

        // Expectations for second-level children

        // Verify edges remain unchanged
        const simplifiedEdges = workflow.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
        }));
        expect(simplifiedEdges).to.deep.equal([
            { source: rootNode, target: child1 },
            { source: rootNode, target: child2 },
            { source: child1, target: grandChild1 },
            { source: child1, target: grandChild2 },
            { source: child2, target: grandChild3 },
            { source: child2, target: grandChild4 },
        ]);
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

describe('getEdges', () => {
    it('should return an empty array if there are no edges', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edges: Edge[] = [];

        const result = getEdges(node, edges);
        expect(result).to.deep.equal([]);
    });

    it('should return all edges where the node is the source', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const target1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const target2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node, target: target1 });
        const edge2 = new Edge({ source: node, target: target2 });
        const edges: Edge[] = [edge1, edge2];

        const result = getEdges(node, edges);
        expect(result).to.deep.equal([edge1, edge2]);
    });

    it('should return all edges where the node is the target', () => {
        const source1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const source2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: source1, target: node });
        const edge2 = new Edge({ source: source2, target: node });
        const edges: Edge[] = [edge1, edge2];

        const result = getEdges(node, edges);
        expect(result).to.deep.equal([edge1, edge2]);
    });

    it('should return all edges where the node is either the source or the target', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const otherNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: node, target: otherNode });
        const edge2 = new Edge({ source: otherNode, target: node });
        const edge3 = new Edge({ source: otherNode, target: otherNode });
        const edges: Edge[] = [edge1, edge2, edge3];

        const result = getEdges(node, edges);
        expect(result).to.deep.equal([edge1, edge2]);
    });

    it('should handle an empty workflow with no nodes or edges', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edges: Edge[] = [];

        const result = getEdges(node, edges);
        expect(result).to.deep.equal([]);
    });
});

describe('getParents', () => {
    it('should return an empty array if there are no edges', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edges: Edge[] = [];

        const result = getParents(node, edges);
        expect(result).to.deep.equal([]);
    });

    it('should return an empty array if the node has no parents', () => {
        const node = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const edge = new Edge({ source: node, target: child });
        const edges: Edge[] = [edge];

        const result = getParents(node, edges);
        expect(result).to.deep.equal([]);
    });

    it('should return all parent nodes of a given node', () => {
        const parent1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const parent2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: parent1, target: child });
        const edge2 = new Edge({ source: parent2, target: child });
        const edges: Edge[] = [edge1, edge2];

        const result = getParents(child, edges);
        expect(result).to.deep.equal([parent1, parent2]);
    });

    it('should handle cases with no parents in a complex workflow', () => {
        const root = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const intermediate = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const leaf = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: root, target: intermediate });
        const edge2 = new Edge({ source: intermediate, target: leaf });
        const edges: Edge[] = [edge1, edge2];

        const result = getParents(root, edges);
        expect(result).to.deep.equal([]);
    });

    it('should handle cases with a single parent', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge = new Edge({ source: parent, target: child });
        const edges: Edge[] = [edge];

        const result = getParents(child, edges);
        expect(result).to.deep.equal([parent]);
    });

    it('should return parents when a node is both a source and target', () => {
        const parent1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const parent2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const intermediate = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const leaf = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: parent1, target: intermediate });
        const edge2 = new Edge({ source: parent2, target: intermediate });
        const edge3 = new Edge({ source: intermediate, target: leaf });

        const edges: Edge[] = [edge1, edge2, edge3];

        const result = getParents(intermediate, edges);
        expect(result).to.deep.equal([parent1, parent2]);
    });
});

/**
 * NEW: Tests focusing on parent recentering logic after overlap resolution.
 * If your code recenters parents inside positionWorkflowNodesAvoidOverlap(),
 * these tests confirm the parent's final X is the average of the children's X values.
 */
describe('Parent X-Centering', () => {
    it('should center a single parent over two children', () => {
        // Create one parent + two children
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const childA = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const childB = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edgeA = new Edge({ source: parent, target: childA });
        const edgeB = new Edge({ source: parent, target: childB });
        const workflow = new Workflow('Center over two children', [parent, childA, childB], [edgeA, edgeB]);

        // First do a normal positioning
        positionWorkflowNodes(workflow);

        // Then apply the “avoid overlap” function which also re-centers parents
        positionWorkflowNodesAvoidOverlap(workflow);

        // Suppose after normal positioning:
        // childA = { x: ROOT_X - xSpacing/2, y: ROOT_Y + ySpacing }
        // childB = { x: ROOT_X + xSpacing/2, y: ROOT_Y + ySpacing }
        expect(childA.position).to.deep.equal({ x: ROOT_X - xSpacing / 2, y: ROOT_Y + ySpacing });
        expect(childB.position).to.deep.equal({ x: ROOT_X + xSpacing / 2, y: ROOT_Y + ySpacing });

        // The parent's X should be the average of childA.x and childB.x
        const avgChildX = (childA.position!.x + childB.position!.x) / 2;
        expect(parent.position!.x).to.equal(avgChildX);
        // And the parent's Y remains the original “root” Y
        expect(parent.position!.y).to.equal(ROOT_Y);
    });

    it('should center a node with three children after overlap correction', () => {
        const parent = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edges = [
            new Edge({ source: parent, target: child1 }),
            new Edge({ source: parent, target: child2 }),
            new Edge({ source: parent, target: child3 }),
        ];

        const workflow = new Workflow('Center over three children', [parent, child1, child2, child3], edges);

        // Initial position
        positionWorkflowNodes(workflow);
        // Then ensure no overlap & recenter
        positionWorkflowNodesAvoidOverlap(workflow);

        // Suppose we expect these child positions:
        // child1 -> X = ROOT_X - xSpacing, child2 -> X = ROOT_X, child3 -> X = ROOT_X + xSpacing
        expect(child1.position).to.deep.equal({ x: ROOT_X - xSpacing, y: ROOT_Y + ySpacing });
        expect(child2.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y + ySpacing });
        expect(child3.position).to.deep.equal({ x: ROOT_X + xSpacing, y: ROOT_Y + ySpacing });

        // The parent should end up at the average X of all children
        const xPositions = [child1.position!.x, child2.position!.x, child3.position!.x];
        const sum = xPositions.reduce((acc, v) => acc + v, 0);
        const avgChildX = sum / xPositions.length;

        expect(parent.position!.x).to.equal(avgChildX);
        expect(parent.position!.y).to.equal(ROOT_Y);
    });

    it('should preserve parent’s position if there are no children', () => {
        const parentOnly = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const workflow = new Workflow('No children test', [parentOnly], []);

        // position
        positionWorkflowNodes(workflow);
        // overlap + recenter
        positionWorkflowNodesAvoidOverlap(workflow);

        // Parent with no children stays at (ROOT_X, ROOT_Y)
        expect(parentOnly.position).to.deep.equal({ x: ROOT_X, y: ROOT_Y });
    });
});

describe('getEndNodePositions', () => {
    it('should return an empty array if workflow has no nodes', () => {
        const workflow = new Workflow('Empty', [], []);
        const endPositions = getEndNodePositions(workflow);
        expect(endPositions).to.deep.equal([]);
    });

    it('should return one end node position for a single-node workflow (no edges)', () => {
        const singleNode = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const workflow = new Workflow('Single Node', [singleNode], []);

        // Position it
        positionWorkflowNodes(workflow);

        // We expect one end position: { x: singleNode.x, y: singleNode.y + ySpacing }
        const endPositions = getEndNodePositions(workflow);

        expect(endPositions).to.have.length(1);
        expect(endPositions[0]).to.deep.equal({
            x: singleNode.position?.x,
            y: (singleNode.position?.y ?? 0) + ySpacing,
        });
    });

    it('should return correct end node positions for a linear workflow', () => {
        const node1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const node3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        // node1 -> node2 -> node3
        const edge1 = new Edge({ source: node1, target: node2 });
        const edge2 = new Edge({ source: node2, target: node3 });

        const workflow = new Workflow('Linear 3-step', [node1, node2, node3], [edge1, edge2]);
        positionWorkflowNodes(workflow);

        // only node3 is childless => one "end node" position
        const endPositions = getEndNodePositions(workflow);

        expect(endPositions).to.have.length(1);
        expect(endPositions[0]).to.deep.equal({
            x: node3.position?.x,
            y: (node3.position?.y ?? 0) + ySpacing,
        });
    });

    it('should return multiple end node positions if multiple leaf nodes exist', () => {
        // root -> child1, child2 (both are leaves)
        const root = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const child2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const edge1 = new Edge({ source: root, target: child1 });
        const edge2 = new Edge({ source: root, target: child2 });

        const workflow = new Workflow('Forked Workflow', [root, child1, child2], [edge1, edge2]);
        positionWorkflowNodes(workflow);

        // child1 & child2 have no children => 2 end positions
        const endPositions = getEndNodePositions(workflow);

        expect(endPositions).to.have.length(2);
        // The order of array items can vary, so check existence instead of direct index if you prefer
        const expected1 = {
            x: child1.position?.x,
            y: (child1.position?.y ?? 0) + ySpacing,
        };
        const expected2 = {
            x: child2.position?.x,
            y: (child2.position?.y ?? 0) + ySpacing,
        };

        expect(endPositions).to.deep.include(expected1);
        expect(endPositions).to.deep.include(expected2);
    });

    it('should handle a more complex tree with multiple levels', () => {
        // root -> mid1 -> leaf1, leaf2
        //       -> mid2 -> leaf3
        const root = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const mid1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const mid2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const leaf1 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const leaf2 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);
        const leaf3 = new Action(ACTIONS.CORE.DELAY.WAIT_FOR);

        const e1 = new Edge({ source: root, target: mid1 });
        const e2 = new Edge({ source: root, target: mid2 });
        const e3 = new Edge({ source: mid1, target: leaf1 });
        const e4 = new Edge({ source: mid1, target: leaf2 });
        const e5 = new Edge({ source: mid2, target: leaf3 });

        const workflow = new Workflow('Multi-level', [root, mid1, mid2, leaf1, leaf2, leaf3], [e1, e2, e3, e4, e5]);
        positionWorkflowNodes(workflow);

        // Leaves are leaf1, leaf2, leaf3 => 3 end node positions
        const endPositions = getEndNodePositions(workflow);
        expect(endPositions).to.have.length(3);

        const expectedPos1 = { x: leaf1.position?.x, y: (leaf1.position?.y ?? 0) + ySpacing };
        const expectedPos2 = { x: leaf2.position?.x, y: (leaf2.position?.y ?? 0) + ySpacing };
        const expectedPos3 = { x: leaf3.position?.x, y: (leaf3.position?.y ?? 0) + ySpacing };

        expect(endPositions).to.deep.include(expectedPos1);
        expect(endPositions).to.deep.include(expectedPos2);
        expect(endPositions).to.deep.include(expectedPos3);
    });
});