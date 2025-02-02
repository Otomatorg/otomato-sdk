import { Workflow } from '../models/Workflow.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';
// Note: Using 'dagre' for layered DAG layout
import dagre from 'dagre';
// or: import * as dagre from 'dagre';

export const xSpacing = 700; // used by dagre as node separation
export const ySpacing = 75;
export const ROOT_X = 400;   // we’ll keep references, but Dagre decides actual positions
export const ROOT_Y = 120;

/**
 * Dagre-based layout for the “top-down” pass. We’re effectively ignoring the old
 * manual code. Instead, we:
 *  1) Build a dagre graph
 *  2) Add all nodes & edges
 *  3) dagre.layout(g)
 *  4) Extract positions & write them back to workflow.nodes
 */
export function positionWorkflowNodes(workflow: Workflow): void {
    // 1) Create a new directed graph
    // doc: https://github.com/dagrejs/dagre
    const g = new dagre.graphlib.Graph({ multigraph: false, compound: false });
    g.setGraph({
        // Some layout options:
        rankdir: 'TB',                // "top-bottom" layering
        nodesep: xSpacing * 0.5,      // horizontal spacing 
        ranksep: ySpacing,            // vertical spacing between levels
        marginx: 20,                  // how much margin to leave around the left/right
        marginy: 20,                  // how much margin to leave around the top/bottom
    });
    g.setDefaultEdgeLabel(() => ({}));

    // 2) Add nodes to the graph
    // Dagre requires each node have an id and some approximate width/height
    workflow.nodes.forEach((node) => {
        const nodeId = node.getRef();
        // For a typical text-based node, approximate width & height
        g.setNode(nodeId, {
            label: nodeId,
            width: 100,
            height: 50
        });
    });

    // 3) Add edges
    // Dagre identifies edges by (sourceId, targetId). We don’t need labels for layout,
    // but we can store them if we want. If you rely on “true/false” ordering, we can tweak
    // e.g. use edge label as a tie-break. (See advanced docs.)
    workflow.edges.forEach((edge) => {
        const fromId = edge.source.getRef();
        const toId = edge.target.getRef();
        g.setEdge(fromId, toId, { label: edge.label ?? '' });
    });

    // 4) Run Dagre layout
    dagre.layout(g);

    // 5) Extract positions from Dagre graph and store them back to your Node objects
    g.nodes().forEach((nodeId: any) => {
        const dagreNode = g.node(nodeId); // { x, y, width, height, ... }
        const nodeObj = workflow.nodes.find((n) => n.getRef() === nodeId);
        if (!nodeObj || !dagreNode) return;
        // Store x,y in your node’s position
        nodeObj.setPosition(dagreNode.x, dagreNode.y);
    });
}

/**
 * We keep these helper functions the same for external usage (if your code or tests need them),
 * but we’re not actively using them in the new Dagre-based layout. 
 */
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
        .filter((node) => getChildren(node, workflow.edges).length === 0)
        .map((node) => ({
            x: node.position?.x ?? 0,
            y: (node.position?.y ?? 0) + ySpacing * 2,
        }));
}

/**
 * In Dagre, we no longer do an explicit “identify leaf nodes” or “center parents by average,”
 * because the layout library handles that. 
 * But here’s your old method if something else depends on it.
 */
export function identifyLeafNodes(workflow: Workflow): Node[] {
    const sources = new Set(workflow.edges.map((edge) => edge.source.getRef()));
    return workflow.nodes.filter((node) => !sources.has(node.getRef()));
}
export function identityStartingNodes(workflow: Workflow): Node[] {
    const childRefs = new Set(workflow.edges.map((edge) => edge.target.getRef()));
    return workflow.nodes.filter((node) => !childRefs.has(node.getRef()));
}