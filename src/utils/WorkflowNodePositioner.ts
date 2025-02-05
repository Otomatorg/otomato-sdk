import { Workflow } from '../models/Workflow.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';
// Import necessary functions from d3-dag
import { graphStratify, sugiyama, layeringLongestPath, decrossTwoLayer, coordCenter } from 'd3-dag';

export const xSpacing = 400; // used for horizontal spacing between nodes
export const ySpacing = 120;  // used for vertical spacing between layers
export const ROOT_X = 400;   // x-offset for the entire layout
export const ROOT_Y = 120;   // y-offset for the entire layout

// Define the data interface for the DAG
interface DagDatum {
  id: string;
  parentIds: string[];
}

/**
 * d3-dag based layout for the “top-down” pass.
 *
 * This function transforms the workflow into a DAG format for d3-dag,
 * runs the Sugiyama layout algorithm, and updates the positions of workflow nodes.
 */
export function positionWorkflowNodes(workflow: Workflow): void {
  const nodeMap = new Map<string, Node>();

  // 1) Transform workflow into data for stratification
  const data: DagDatum[] = workflow.nodes.map((node: Node) => {
    const id = node.getRef();
    nodeMap.set(id, node);
    const parents = workflow.edges
      .filter(edge => edge.target === node)
      .map(edge => edge.source.getRef());
    return { id, parentIds: parents };
  });

  // 2) Build the DAG using graphStratify
  // Cast to 'any' so we can access .each(...) etc. at runtime
  const dag = graphStratify()(data) as any;

  // 3) Create and configure the Sugiyama layout
  // Note the calls to the operator factories: layeringLongestPath(), decrossTwoLayer(), coordCenter()
  const layout = (sugiyama() as any)
    .layering((layeringLongestPath as any)())
    .decross((decrossTwoLayer as any)())
    .coord((coordCenter as any)())
    // Instead of .size, we use .nodeSize for spacing between nodes
    .nodeSize([xSpacing, ySpacing]);

  // 4) Run layout
  layout(dag);

  // 5) Update workflow node positions
  for (const node of dag.nodes()) {
    const id = node.data.id;
    const wfNode = nodeMap.get(id);
    if (wfNode && typeof node.x === 'number' && typeof node.y === 'number') {
      wfNode.setPosition(node.x + ROOT_X, node.y + ROOT_Y);
    }
  };
}

/**
 * Helper functions (unchanged).
 */
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
    .filter((node: Node) => getChildren(node, workflow.edges).length === 0)
    .map((node: Node) => ({
      x: node.position?.x ?? 0,
      y: (node.position?.y ?? 0) + ySpacing * 2,
    }));
}

export function identifyLeafNodes(workflow: Workflow): Node[] {
  const sources = new Set(workflow.edges.map((edge: Edge) => edge.source.getRef()));
  return workflow.nodes.filter((node: Node) => !sources.has(node.getRef()));
}

export function identityStartingNodes(workflow: Workflow): Node[] {
  const childRefs = new Set(workflow.edges.map((edge: Edge) => edge.target.getRef()));
  return workflow.nodes.filter((node: Node) => !childRefs.has(node.getRef()));
}