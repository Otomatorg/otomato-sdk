import { Workflow } from '../models/Workflow.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';
import ELK from 'elkjs/lib/elk.bundled.js';

export const xSpacing = 700; // similar to Dagre’s node separation
export const ySpacing = 75;
export const ROOT_X = 400;   // reference positions (if needed)
export const ROOT_Y = 120;

// Create a single ELK instance for reuse
const elk = new ELK();

/**
 * ELK-based layout for workflow nodes.
 *
 * This function builds an ELK-compatible graph:
 *  1) It creates a root graph object with layout options.
 *  2) It adds all workflow nodes as children, with id, width, and height.
 *  3) It adds all edges (as ELK expects sources/targets arrays).
 *  4) It calls elk.layout() (asynchronously) to compute positions.
 *  5) It then updates each node in workflow.nodes with the computed positions.
 *
 * Note: ELK returns (x,y) for the top-left of each node’s bounding box.
 * If your SDK expects center positions, we adjust by adding half the width/height.
 */
export async function positionWorkflowNodes(workflow: Workflow): Promise<void> {
  // 1) Create an ELK graph structure
  const elkGraph = {
    id: 'root',
    // Layout options can be tuned as needed.
    layoutOptions: {
      // 'DOWN' makes the layout top-to-bottom (like Dagre’s rankdir: 'TB')
      'elk.direction': 'DOWN',
      // Space between nodes (ELK uses this for both horizontal and vertical spacing)
      'elk.layered.spacing.nodeNode': ySpacing.toString(),
      // Add some padding around the graph
      'elk.padding': '20', // you can also use "20,20,20,20" for (top,right,bottom,left)
    },
    // 2) Map workflow nodes to ELK “children”
    children: workflow.nodes.map((node) => ({
      id: node.getRef(),
      width: 100,  // approximate width
      height: 50,  // approximate height
    })),
    // 3) Map workflow edges to ELK “edges”
    edges: workflow.edges.map((edge) => ({
      id: `${edge.source.getRef()}_${edge.target.getRef()}`,
      sources: [edge.source.getRef()],
      targets: [edge.target.getRef()],
      // Optionally, you can pass edge-specific layout options here.
    })),
  };

  // 4) Run the ELK layout (this returns a Promise)
  const layout = await elk.layout(elkGraph);

  // 5) Extract positions from ELK’s result and store them back on the workflow nodes.
  // ELK returns an array of children nodes with computed { x, y, width, height }.
  if (layout.children) {
    layout.children.forEach((elkNode: any) => {
      // Find the corresponding Node object by its unique reference
      const nodeObj = workflow.nodes.find((n) => n.getRef() === elkNode.id);
      if (!nodeObj) return;
      // ELK gives x,y as the top-left. To match Dagre’s “center” output, we add half the dimensions.
      const centerX = elkNode.x + (elkNode.width / 2);
      const centerY = elkNode.y + (elkNode.height / 2);
      nodeObj.setPosition(centerX, centerY);
    });
  }
}

/**
 * The following helper functions remain unchanged,
 * as they depend only on your workflow model.
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
 * Old methods for identifying “leaf” or starting nodes.
 */
export function identifyLeafNodes(workflow: Workflow): Node[] {
  const sources = new Set(workflow.edges.map((edge) => edge.source.getRef()));
  return workflow.nodes.filter((node) => !sources.has(node.getRef()));
}

export function identityStartingNodes(workflow: Workflow): Node[] {
  const childRefs = new Set(workflow.edges.map((edge) => edge.target.getRef()));
  return workflow.nodes.filter((node) => !childRefs.has(node.getRef()));
}