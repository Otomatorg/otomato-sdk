// workflowNodePositioner.ts

import { Workflow } from '../models/Workflow.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';

/**
 * Positions nodes in a BFS manner, assuming exactly one root node.
 * - The root is placed at (400, 120) unless it already has a position.
 * - If a parent has exactly 1 child, that child is placed directly below the parent
 *   (same x, with an offset in y).
 * - If a parent has multiple children, they are horizontally spread around the parent's X.
 * - Existing positions are not overwritten.
 */
/*export function autoPositionNodes(workflow: Workflow): void {
    // 1. Build adjacency & incoming edge count
    const adjacency = new Map<string, Node[]>();
    const incomingCount = new Map<string, number>();

    // Constants you can tweak or increase if you see overlap or crossing edges
    const ROOT_X = 400;
    const ROOT_Y = 120;
    const MIN_SPACING_X = 500;  // Horizontal spacing between siblings
    const MIN_SPACING_Y = 120;  // Vertical spacing from parent to child

    // Initialize adjacency and incoming counts
    workflow.nodes.forEach((node) => {
        adjacency.set(node.getRef(), []);
        incomingCount.set(node.getRef(), 0);
    });

    // Fill adjacency list (source -> array of targets) and count incoming edges
    workflow.edges.forEach((edge: Edge) => {
        const sourceRef = edge.source.getRef();
        const targetRef = edge.target.getRef();
        adjacency.get(sourceRef)?.push(edge.target);
        incomingCount.set(targetRef, (incomingCount.get(targetRef) ?? 0) + 1);
    });

    // 2. Find all root nodes (no incoming edges). If multiple, just pick the first.
    const rootNodes = workflow.nodes.filter(
        (n) => (incomingCount.get(n.getRef()) || 0) === 0
    );
    if (rootNodes.length === 0) {
        // No root found; nothing to do
        return;
    }

    // We'll assume the first root is "the" root for this layout
    const root = rootNodes[0];
    if (!hasPosition(root)) {
        root.setPosition(ROOT_X, ROOT_Y);
    }

    // 3. BFS from that single root
    const queue = [root];
    while (queue.length > 0) {
        const parent = queue.shift()!;
        const parentRef = parent.getRef();

        // Identify the children
        const children = adjacency.get(parentRef) || [];

        // Among those children, find any that do NOT already have positions
        const unpositionedKids = children.filter((c) => !hasPosition(c));

        if (unpositionedKids.length > 0) {
            const parentX = parent.position?.x ?? 0;
            const parentY = parent.position?.y ?? 0;

            if (unpositionedKids.length === 1) {
                // Single child: place it straight below the parent
                const onlyChild = unpositionedKids[0];
                onlyChild.setPosition(parentX, parentY + MIN_SPACING_Y);
            } else {
                // Multiple children: spread them horizontally around the parent's X
                const count = unpositionedKids.length;
                unpositionedKids.forEach((child, i) => {
                    const offset = i - (count - 1) / 2;
                    const childX = parentX + offset * MIN_SPACING_X;
                    const childY = parentY + MIN_SPACING_Y;
                    child.setPosition(childX, childY);
                });
            }
        }

        // Decrement incoming edges for each child. Once a child hits 0, enqueue it
        children.forEach((c) => {
            const cRef = c.getRef();
            const oldCount = incomingCount.get(cRef) ?? 0;
            const newCount = oldCount - 1;
            incomingCount.set(cRef, newCount);
            if (newCount === 0) {
                queue.push(c);
            }
        });
    }
}*/

export const xSpacing = 500;
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
        if (!startNode.position) {
            startNode.setPosition(xPosition, ROOT_Y);
            xPosition += xSpacing;
        }
    });

    // Step 3: Place all other nodes relative to their parents
    workflow.nodes.forEach((node) => positionNode(node, workflow.edges, xSpacing, ySpacing));
    } catch (e) {console.error(e)}
}

export function positionNode(node: Node, edges: Edge[], xSpacing: number, ySpacing: number): void {
    if (node.position) return; // Skip already positioned nodes

    // Get children of the node
    const children = getChildren(node, edges);

    // Recursively position children first
    children.forEach((child) => positionNode(child, edges, xSpacing, ySpacing));

    // Compute position based on children
    if (children.length === 1) {
        // Single child: Align vertically
        const child = children[0];
        node.setPosition(child.position!.x, child.position!.y + ySpacing);
    } else if (children.length > 1) {
        // Multiple children: Align horizontally in the middle of children
        const firstChild = children[0];
        const lastChild = children[children.length - 1];
        const midX = (firstChild.position!.x + lastChild.position!.x) / 2;
        node.setPosition(midX, firstChild.position!.y + ySpacing);
    }
}

/**
 * Checks if a node already has a numeric x & y position.
 */
function hasPosition(node: Node): boolean {
    return Boolean(
        node.position &&
        typeof node.position.x === 'number' &&
        typeof node.position.y === 'number'
    );
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