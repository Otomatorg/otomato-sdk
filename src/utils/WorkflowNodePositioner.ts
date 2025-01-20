// workflowNodePositioner.ts

import { Workflow } from '../models/Workflow.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';

export const xSpacing = 600;
export const ySpacing = 120;
export const ROOT_X = 400;
export const ROOT_Y = 120;

export function positionWorkflowNodes(workflow: Workflow): void {
    try {
        // Step 1: Find the starting nodes using identityStartingNodes function
        const startingNodes = identityStartingNodes(workflow);

        // Step 2: Place the starting nodes
        let xPosition = ROOT_X;
        startingNodes.forEach((startNode) => {
            startNode.setPosition(xPosition, ROOT_Y);
            xPosition += xSpacing;
        });

        // Step 3: Place all other nodes relative to their parents
        const nodesToPosition = workflow.nodes.filter((node) => !startingNodes.includes(node));
        nodesToPosition.forEach((node) => positionNode(node, workflow.edges, xSpacing, ySpacing, workflow));
    } catch (e) { console.error(e) }
}

export function positionNode(node: Node, edges: Edge[], xSpacing: number, ySpacing: number, workflow: Workflow): void {
    const parents = getParents(node, edges);

    // todo: what if we have multiple parents?
    const children = getChildren(parents[0], edges);

    const sortedChildren = children.sort((a, b) => {
        const edgeA = edges.find(edge => edge.source === parents[0] && edge.target === a);
        const edgeB = edges.find(edge => edge.source === parents[0] && edge.target === b);

        const labelA = edgeA?.label ?? "";
        const labelB = edgeB?.label ?? "";

        if (labelA === "true" && labelB !== "true") return -1;
        if (labelB === "true" && labelA !== "true") return 1;
        if (labelA === "false" && labelB !== "false") return 1;
        if (labelB === "false" && labelA !== "false") return -1;
        return 0;
    });

    const childrenCountOfParent = sortedChildren.length;
    const parentX = parents.reduce((sum, parent) => sum + (parent.position?.x ?? ROOT_X), 0) / parents.length;
    const parentY = Math.max(...parents.map(parent => parent.position?.y ?? ROOT_Y));

    if (childrenCountOfParent === 1) {
        node.setPosition(parentX, parentY + ySpacing);
    } else {
        const index = sortedChildren.indexOf(node); // Get the position of this node among its siblings
        const totalChildren = sortedChildren.length;

        // Compute the x position for this node
        const offset = index - (totalChildren - 1) / 2; // Center the children around the parent
        node.setPosition(parentX + offset * xSpacing, parentY + ySpacing);
    }
}

export function positionWorkflowNodesAvoidOverlap(workflow: Workflow): void {
    const levels: Map<number, Node[]> = new Map();

    function addToLevel(node: Node) {
        const level = Math.round(node.position!.y / ySpacing);
        if (!levels.has(level)) {
            levels.set(level, []);
        }
        levels.get(level)!.push(node);
    }

    // 1) Lay out nodes using existing logic
    positionWorkflowNodes(workflow);

    // 2) Fill the `levels` map
    workflow.nodes.forEach((node) => {
        if (node.position) {
            addToLevel(node);
        }
    });

    // 3) Resolve horizontal overlaps level by level
    levels.forEach((nodes, level) => {
        // Sort by x so we can detect collisions
        nodes.sort((a, b) => (a.position!.x ?? 0) - (b.position!.x ?? 0));

        // Shift nodes that collide
        for (let i = 1; i < nodes.length; i++) {
            const prev = nodes[i - 1];
            const current = nodes[i];
            if (current.position!.x - prev.position!.x < xSpacing) {
                const shift = xSpacing - (current.position!.x - prev.position!.x);
                moveNodeAndChildren(current, shift, workflow.edges);
            }
        }
    });

    // 4) **Center each parent over its children** (the new step)
    centerParentXPositions(workflow);
}

/**
 * Repositions each parent node so that its X is the average of the children’s X.
 * We do a simple bottom-up pass: start with all leaves, then move upward to parents.
 */
function centerParentXPositions(workflow: Workflow): void {
    // Identify the “leaf” nodes
    const queue = identifyLeafNodes(workflow);

    while (queue.length > 0) {
        const child = queue.shift()!;
        const parents = getParents(child, workflow.edges);

        for (const parent of parents) {
            const children = getChildren(parent, workflow.edges);
            if (children.length) {
                // Average x of all children
                const sumX = children.reduce((acc, c) => acc + (c.position?.x ?? 0), 0);
                const avgX = sumX / children.length;

                // Move parent to that average, keep same y
                parent.setPosition(avgX, parent.position?.y ?? 0);
            }

            // Add this parent to the queue so we can recurse upward
            if (!queue.includes(parent)) {
                queue.push(parent);
            }
        }
    }
}

function moveNodeAndChildren(
    node: Node,
    shift: number,
    edges: Edge[],
): void {
    // Move the node
    node.setPosition(node.position!.x + shift, node.position!.y);

    // Propagate to children
    edges
        .filter((edge) => edge.source === node)
        .forEach((edge) => {
            moveNodeAndChildren(edge.target, shift, edges);
        });
}

export function identifyLeafNodes(workflow: Workflow): Node[] {
    const nonLeafNodes = new Set(workflow.edges.map(edge => edge.source.getRef()));
    return workflow.nodes.filter(node => !nonLeafNodes.has(node.getRef()));
}

/**
 * Identifies starting nodes (nodes with no incoming edges).
 * A starting node is defined as one that is not a target of any edge.
 * 
 * @param workflow The workflow to analyze.
 * @returns An array of nodes that have no incoming edges.
 */
export function identityStartingNodes(workflow: Workflow): Node[] {
    const childRefs = new Set(workflow.edges.map((edge) => edge.target.getRef()));
    return workflow.nodes.filter((node) => !childRefs.has(node.getRef()));
}

export function getChildren(node: Node, edges: Edge[]): Node[] {
    return edges.filter(edge => edge.source === node).map(edge => edge.target);
}

export function getParents(node: Node, edges: Edge[]): Node[] {
    return edges.filter(edge => edge.target === node).map(edge => edge.source);
}

export function getEdges(node: Node, edges: Edge[]): Edge[] {
    return edges.filter(edge => edge.source === node || edge.target === node);
}

export function getEndNodePositions(workflow: Workflow): { x: number; y: number }[] {
    return workflow.nodes
        .filter(node => getChildren(node, workflow.edges).length === 0) // node with no children
        .map(node => ({
            x: node.position?.x ?? 0,
            y: (node.position?.y ?? 0) + ySpacing,
        }));
}