import { Workflow } from '../models/Workflow.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';

export const xSpacing = 500;
export const ySpacing = 120;
export const ROOT_X = 400;
export const ROOT_Y = 120;

export function positionWorkflowNodesAvoidOverlap(workflow: Workflow): void {
    // 1) Lay out nodes using existing logic
    positionWorkflowNodes(workflow);

    // 2) Group nodes by 'level' based on vertical position
    const levels: Map<number, Node[]> = new Map();
    workflow.nodes.forEach((node) => {
        if (node.position) {
            const level = Math.round(node.position.y / ySpacing);
            if (!levels.has(level)) {
                levels.set(level, []);
            }
            levels.get(level)!.push(node);
        }
    });

    // 3) Resolve horizontal overlaps among *all* nodes in each level
    levels.forEach((levelNodes) => {
        // Sort the nodes in this level by X
        levelNodes.sort((a, b) => (a.position!.x ?? 0) - (b.position!.x ?? 0));

        // Walk left-to-right, shifting nodes that would collide with the previous one
        for (let i = 1; i < levelNodes.length; i++) {
            const prev = levelNodes[i - 1];
            const current = levelNodes[i];

            // Compute how close they are
            const dx = current.position!.x - prev.position!.x;

            // If they are too close, shift the current node (and its children) to the right
            if (dx < xSpacing) {
                const shift = xSpacing - dx;
                moveNodeAndChildren(current, shift, workflow.edges);
            }
        }
    });

    // 4) Re-center parents above their children in a bottom-up pass
    centerParentXPositions(workflow);
}

/**
 * Lays out the workflow nodes in a rough top-down manner,
 * then positions each node relative to its parent.
 */
export function positionWorkflowNodes(workflow: Workflow): void {
    try {
        // Step 1: Find the starting nodes
        const startingNodes = identityStartingNodes(workflow);

        // Step 2: Place the starting nodes
        let xPosition = ROOT_X;
        startingNodes.forEach((startNode) => {
            startNode.setPosition(xPosition, ROOT_Y);
            xPosition += xSpacing;
        });

        // Step 3: For all other nodes, position them based on their parent(s)
        const nodesToPosition = workflow.nodes.filter(
            (node) => !startingNodes.includes(node)
        );
        nodesToPosition.forEach((node) =>
            positionNode(node, workflow.edges, xSpacing, ySpacing, workflow)
        );
    } catch (e) {
        console.error(e);
    }
}

export function positionNode(
    node: Node,
    edges: Edge[],
    xSpacing: number,
    ySpacing: number,
    workflow: Workflow
): void {
    const parents = getParents(node, edges);
    if (!parents.length) return; // Edge case: no parents?

    // Sort children of the first parent by edge labels (true/false) so "true" is left, "false" is right
    const children = getChildren(parents[0], edges).sort((a, b) => {
        const edgeA = edges.find(
            (edge) => edge.source === parents[0] && edge.target === a
        );
        const edgeB = edges.find(
            (edge) => edge.source === parents[0] && edge.target === b
        );
        const labelA = edgeA?.label ?? "";
        const labelB = edgeB?.label ?? "";

        if (labelA === "true" && labelB !== "true") return -1;
        if (labelB === "true" && labelA !== "true") return 1;
        if (labelA === "false" && labelB !== "false") return 1;
        if (labelB === "false" && labelA !== "false") return -1;
        return 0;
    });

    const parentX =
        parents.reduce((sum, p) => sum + (p.position?.x ?? ROOT_X), 0) /
        parents.length;
    const parentY = Math.max(...parents.map((p) => p.position?.y ?? ROOT_Y));

    if (children.length <= 1) {
        node.setPosition(parentX, parentY + ySpacing);
    } else {
        // This node’s index among siblings
        const index = children.indexOf(node);
        const offset = index - (children.length - 1) / 2;
        node.setPosition(parentX + offset * xSpacing, parentY + ySpacing);
    }
}

/**
 * Repositions each parent node so that its X = average of its children’s X.
 */
function centerParentXPositions(workflow: Workflow): void {
    // Identify the leaf nodes to start a bottom-up pass
    const queue = identifyLeafNodes(workflow);

    while (queue.length > 0) {
        const child = queue.shift()!;
        const parents = getParents(child, workflow.edges);

        for (const parent of parents) {
            const children = getChildren(parent, workflow.edges);
            if (children.length) {
                const sumX = children.reduce((acc, c) => acc + (c.position?.x ?? 0), 0);
                const avgX = sumX / children.length;
                parent.setPosition(avgX, parent.position?.y ?? 0);
            }
            // Push this parent upward in the queue to continue up the chain
            if (!queue.includes(parent)) {
                queue.push(parent);
            }
        }
    }
}

/**
 * Recursively shifts a node and all its descendants by `shift` in the x-direction.
 */
function moveNodeAndChildren(node: Node, shift: number, edges: Edge[]): void {
    node.setPosition(node.position!.x + shift, node.position!.y);
    edges
        .filter((edge) => edge.source === node)
        .forEach((edge) => {
            moveNodeAndChildren(edge.target, shift, edges);
        });
}

/**
 * A "leaf" node is one that has no children (it’s never the source of an edge).
 */
export function identifyLeafNodes(workflow: Workflow): Node[] {
    const sources = new Set(workflow.edges.map((edge) => edge.source.getRef()));
    return workflow.nodes.filter((node) => !sources.has(node.getRef()));
}

/**
 * Identify starting nodes (no incoming edges).
 */
export function identityStartingNodes(workflow: Workflow): Node[] {
    const childRefs = new Set(
        workflow.edges.map((edge) => edge.target.getRef())
    );
    return workflow.nodes.filter((node) => !childRefs.has(node.getRef()));
}

export function getChildren(node: Node, edges: Edge[]): Node[] {
    return edges
        .filter((edge) => edge.source === node)
        .map((edge) => edge.target);
}

export function getParents(node: Node, edges: Edge[]): Node[] {
    return edges
        .filter((edge) => edge.target === node)
        .map((edge) => edge.source);
}

export function getEdges(node: Node, edges: Edge[]): Edge[] {
    return edges.filter(
        (edge) => edge.source === node || edge.target === node
    );
}

export function getEndNodePositions(workflow: Workflow): { x: number; y: number }[] {
    return workflow.nodes
        .filter(
            (node) => getChildren(node, workflow.edges).length === 0
        )
        .map((node) => ({
            x: node.position?.x ?? 0,
            y: (node.position?.y ?? 0) + ySpacing,
        }));
}