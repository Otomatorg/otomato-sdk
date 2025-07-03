// workflowNodePositioner.ts

import { Workflow } from '../models/Workflow.js';
import { Node } from '../models/Node.js';
import { Edge } from '../models/Edge.js';

export const xSpacing = 500;
export const ySpacing = 120;
export const ROOT_X = 400;
export const ROOT_Y = 120;
export const TRIGGER_X_SPACING = 363;

/**
 * Helper: Returns a group key for a node based on its primary parent.
 * If a node has multiple parents, we sort them numerically (by their ref)
 * and choose the lowest one.
 */
function getGroupKey(node: Node, edges: Edge[]): string {
  const parents = getParents(node, edges);
  if (parents.length === 0) return "none";
  parents.sort((a, b) => Number(a.getRef()) - Number(b.getRef()));
  return parents[0].getRef();
}

/**
 * Step 1: Layer Assignment via Topological Ordering.
 */
function assignLayers(workflow: Workflow): void {
  const incomingCounts: Map<string, number> = new Map();
  for (const node of workflow.nodes) {
    incomingCounts.set(node.getRef(), 0);
    (node as any).layer = 0;
  }
  for (const edge of workflow.edges) {
    const targetRef = edge.target.getRef();
    incomingCounts.set(targetRef, (incomingCounts.get(targetRef) || 0) + 1);
  }
  const queue: Node[] = [];
  for (const node of workflow.nodes) {
    if (incomingCounts.get(node.getRef()) === 0) {
      queue.push(node);
      (node as any).layer = 0;
    }
  }
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLayer = (current as any).layer as number;
    const children = getChildren(current, workflow.edges);
    for (const child of children) {
      (child as any).layer = Math.max((child as any).layer, currentLayer + 1);
      const childRef = child.getRef();
      incomingCounts.set(childRef, (incomingCounts.get(childRef) || 1) - 1);
      if (incomingCounts.get(childRef) === 0) {
        queue.push(child);
      }
    }
  }
}

/**
 * Main function that positions workflow nodes using a hierarchical layout.
 * Nodes are grouped by their primary parent.
 */
export function positionWorkflowNodes(workflow: Workflow): void {
  try {
    // Step 1: Assign layers.
    assignLayers(workflow);

    // Group nodes by layer.
    const layers: Map<number, Node[]> = new Map();
    for (const node of workflow.nodes) {
      const layer = (node as any).layer as number;
      if (!layers.has(layer)) {
        layers.set(layer, []);
      }
      layers.get(layer)!.push(node);
    }

    // Process each layer in order.
    const sortedLayers = Array.from(layers.keys()).sort((a, b) => a - b);
    for (const layer of sortedLayers) {
      const nodesInLayer = layers.get(layer)!;
      // Determine the Y position for this layer.
      const yPos = (layer * ySpacing) + ROOT_Y;

        // Special handling for layer 0 (triggers)
        if (layer === 0) {
          const startingNodes = nodesInLayer.filter(node => getParents(node, workflow.edges).length === 0);
          startingNodes.sort((a, b) => Number(a.getRef()) - Number(b.getRef())); // Consistent ordering
          const numStartingNodes = startingNodes.length;
          let totalWidth = 0; // Initialize totalWidth

          if (numStartingNodes > 0) {
            totalWidth = (numStartingNodes - 1) * TRIGGER_X_SPACING; // Assign value to totalWidth
            let currentX = ROOT_X - totalWidth / 2;
            for (let i = 0; i < numStartingNodes; i++) {
              startingNodes[i].setPosition(currentX, yPos);
              currentX += TRIGGER_X_SPACING;
            }
        }
          // Handle non-starting nodes in layer 0 if any (should be rare for triggers)
          const otherNodesInLayer0 = nodesInLayer.filter(node => getParents(node, workflow.edges).length > 0);
          if (otherNodesInLayer0.length > 0) {
            // Fallback to default group positioning for these nodes
            // This part reuses the existing grouping logic but only for these specific nodes.
            const groups: Map<string, Node[]> = new Map();
            for (const node of otherNodesInLayer0) {
              const groupKey = getGroupKey(node, workflow.edges);
              if (!groups.has(groupKey)) {
                groups.set(groupKey, []);
              }
              groups.get(groupKey)!.push(node);
            }
            // Simplified group processing for these non-starting nodes in layer 0
            // Calculate currentXOffset based on whether startingNodes were present or not
            const startingNodesOffset = numStartingNodes > 0 ? totalWidth / 2 + TRIGGER_X_SPACING : 0;
            let currentXOffset = ROOT_X + startingNodesOffset;
            // If there were no starting nodes, and we only have otherNodesInLayer0,
            // they should probably start near ROOT_X, not offset by totalWidth/2.
            // If startingNodes were there, offset by totalWidth/2 + some spacing.
            // If numStartingNodes is 0, totalWidth is 0, so currentXOffset starts at ROOT_X.
            // If numStartingNodes > 0, currentXOffset starts at ROOT_X + totalWidth/2 + TRIGGER_X_SPACING
            // (using TRIGGER_X_SPACING as a gap, or xSpacing could be used too)

            if (numStartingNodes > 0) {
                 currentXOffset = ROOT_X + totalWidth / 2 + xSpacing; // Place them after triggers with xSpacing
            } else {
                 currentXOffset = ROOT_X; // If no triggers, start these at ROOT_X
            }

            const sortedGroupKeys = Array.from(groups.keys()).sort((a, b) => Number(a) - Number(b));
            for (const key of sortedGroupKeys) {
                const groupNodes = groups.get(key)!;
                groupNodes.sort((a, b) => Number(a.getRef()) - Number(b.getRef()));
                for (let i = 0; i < groupNodes.length; i++) {
                    groupNodes[i].setPosition(currentXOffset + i * xSpacing, yPos);
                }
                currentXOffset += groupNodes.length * xSpacing + xSpacing; // Add spacing between groups
            }
        }
        } else {
          // Original logic for layers other than 0
          // Group nodes by primary parent.
          const groups: Map<string, Node[]> = new Map();
          for (const node of nodesInLayer) {
            const groupKey = getGroupKey(node, workflow.edges);
            if (!groups.has(groupKey)) {
              groups.set(groupKey, []);
            }
            groups.get(groupKey)!.push(node);
          }

          // Build group info objects.
          interface GroupInfo {
            groupKey: string;
            nodes: Node[];
            desiredCenter: number;
            desiredLeft: number;
            width: number; // (groupSize - 1) * xSpacing
            newLeft?: number;
          }
          const groupInfos: GroupInfo[] = [];
          // Sort group keys numerically.
          const sortedGroupKeys = Array.from(groups.keys()).sort((a, b) => Number(a) - Number(b));
          for (const key of sortedGroupKeys) {
            const groupNodes = groups.get(key)!;
            groupNodes.sort((a, b) => Number(a.getRef()) - Number(b.getRef()));
            let desiredCenter: number;
            if (key === "none") { // Should not happen for layer > 0 if graph is connected
              desiredCenter = ROOT_X;
            } else {
              const parent = workflow.nodes.find(n => n.getRef() === key);
              desiredCenter = parent && parent.position ? parent.position.x : ROOT_X;
            }
            const groupSize = groupNodes.length;
            const width = (groupSize - 1) * xSpacing;
            const desiredLeft = desiredCenter - width / 2;
            groupInfos.push({
              groupKey: key,
              nodes: groupNodes,
              desiredCenter,
              desiredLeft,
              width
            });
          }
          // Adjust groups so that adjacent groups do not overlap.
          // We require that the left edge of a group is at least xSpacing to the right of the previous group's right edge.
          groupInfos.sort((a, b) => a.desiredLeft - b.desiredLeft);
          let prevRight = -Infinity;
          for (const group of groupInfos) {
            let newLeft = group.desiredLeft;
            if (newLeft < prevRight + xSpacing) {
              newLeft = prevRight + xSpacing;
            }
            group.newLeft = newLeft;
            prevRight = newLeft + group.width;
          }
          // Now assign positions for nodes in each group using the new left.
          for (const group of groupInfos) {
            const { nodes, newLeft } = group;
            for (let i = 0; i < nodes.length; i++) {
              const nodeX = newLeft! + i * xSpacing;
              nodes[i].setPosition(nodeX, yPos);
            }
        }
      }
    }

    // Step 3: Resolve overlaps within each group in each layer.
      // This step might need adjustment if TRIGGER_X_SPACING causes issues with xSpacing based overlap.
      // For now, we assume xSpacing is the minimum desired gap after initial placement.
    layers.forEach((nodes, layer) => {
      const groups: Map<string, Node[]> = new Map();
      for (const node of nodes) {
        const groupKey = getGroupKey(node, workflow.edges);
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(node);
      }
      groups.forEach((groupNodes, groupKey) => {
        let changed = true;
        while (changed) {
          changed = false;
          groupNodes.sort((a, b) => {
            const diff = a.position!.x - b.position!.x;
            if (Math.abs(diff) < 1e-6) {
              return Number(a.getRef()) - Number(b.getRef());
            }
            return diff;
          });
          for (let i = 1; i < groupNodes.length; i++) {
            const prev = groupNodes[i - 1];
            const current = groupNodes[i];
            const diff = current.position!.x - prev.position!.x;

            // Determine the target spacing for overlap resolution
            let targetSpacing = xSpacing;
            if (layer === 0) {
              // More direct check: if all nodes currently being processed together in this group are starting nodes.
              const allNodesInGroupAreStartingNodes = groupNodes.every(gn => getParents(gn, workflow.edges).length === 0);
              if (allNodesInGroupAreStartingNodes) {
                // This condition implies that the group being processed should indeed be the "none" group,
                // consisting only of starting nodes.
                targetSpacing = TRIGGER_X_SPACING;
              }
            }

            if (diff < targetSpacing) {
              const shift = targetSpacing - diff;
              moveNodeAndChildren(current, shift, workflow.edges);
              changed = true;
            }
          }
        }
      });
    });

    // Additional step: Ensure common children of multiple layer 0 triggers are centered at ROOT_X.
    // This runs after initial layer placement and before final overlap resolution specific to children groups might occur,
    // and crucially before parent centering which might pull triggers away.
    for (const node of workflow.nodes) {
      const nodeLayer = (node as any).layer;
      if (nodeLayer === 1) { // Check nodes in the layer immediately following triggers
        const parents = getParents(node, workflow.edges);
        if (parents.length > 1) { // Only if it has multiple parents
          const allParentsAreLayer0Triggers = parents.every(p => {
            const parentLayer = (p as any).layer;
            const parentIsStartingNode = getParents(p, workflow.edges).length === 0;
            return parentLayer === 0 && parentIsStartingNode;
          });

          if (allParentsAreLayer0Triggers) {
            if (node.position) { // Ensure node.position exists before trying to read node.position.y
              node.setPosition(ROOT_X, node.position.y);
            } else {
              // This case should ideally not happen if nodes in layer 1 are already positioned by the main loop.
              // If it does, assign a default Y based on its layer.
              node.setPosition(ROOT_X, (nodeLayer * ySpacing) + ROOT_Y);
            }
          }
        }
      }
    }

    // Step 4: Bottom-up Parent Centering.
    // Now, we simply set each parent's x to the exact average of its children.
    centerParentXPositions(workflow);

    // Final sort for consistency: sort nodes in each layer by primary parent's numeric value then node ref.
    layers.forEach((nodes, layer) => {
      nodes.sort((a, b) => {
        const groupA = Number(getGroupKey(a, workflow.edges));
        const groupB = Number(getGroupKey(b, workflow.edges));
        if (groupA !== groupB) return groupA - groupB;
        return Number(a.getRef()) - Number(b.getRef());
      });
    });

  } catch (e) {
    console.error(e);
  }
}

export function positionWorkflowNodesAvoidOverlap(workflow: Workflow): void {
  positionWorkflowNodes(workflow);
  centerParentXPositions(workflow);
}

/**
 * Modified bottom-up pass to center each parent over its children.
 * The parent's x is now set exactly to the average of its children's x positions.
 */
function centerParentXPositions(workflow: Workflow): void {
  const queue = identifyLeafNodes(workflow);
  while (queue.length > 0) {
    const child = queue.shift()!;
    const parents = getParents(child, workflow.edges);
    for (const parent of parents) {
      // Check if the parent is a layer 0 starting node.
      // Layer information should be available on the node from the assignLayers step.
      const parentLayer = (parent as any).layer;
      const parentIsStartingNode = getParents(parent, workflow.edges).length === 0;

      if (parentLayer === 0 && parentIsStartingNode) {
        // Do not change the X position of layer 0 starting nodes.
        // Still add to queue if not already present, for processing its own parents if it had any (though starting nodes don't).
        // More importantly, it ensures the loop continues correctly for other parents of the current 'child'.
        if (!queue.includes(parent)) {
            queue.push(parent);
        }
        continue; // Skip X-position adjustment for this parent
      }

      const children = getChildren(parent, workflow.edges);
      if (children.length) {
        const xs = children.map(c => c.position!.x);
        const avgX = xs.reduce((acc, x) => acc + x, 0) / xs.length;
        parent.setPosition(avgX, parent.position?.y ?? 0);
      }
      if (!queue.includes(parent)) {
        queue.push(parent);
      }
    }
  }
}

/**
 * Recursively shifts a node and all its descendants by the given amount.
 */
function moveNodeAndChildren(node: Node, shift: number, edges: Edge[]): void {
  const oldX = node.position!.x;
  node.setPosition(oldX + shift, node.position!.y);
  edges.filter(edge => edge.source === node)
       .forEach(edge => moveNodeAndChildren(edge.target, shift, edges));
}

export function identifyLeafNodes(workflow: Workflow): Node[] {
  const nonLeafNodes = new Set(workflow.edges.map(edge => edge.source.getRef()));
  return workflow.nodes.filter(node => !nonLeafNodes.has(node.getRef()));
}

export function identityStartingNodes(workflow: Workflow): Node[] {
  const childRefs = new Set(workflow.edges.map(edge => edge.target.getRef()));
  return workflow.nodes.filter(node => !childRefs.has(node.getRef()));
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
    .filter(node => getChildren(node, workflow.edges).length === 0)
    .map(node => ({
      x: node.position?.x ?? 0,
      y: (node.position?.y ?? 0) + ySpacing,
    }));
}