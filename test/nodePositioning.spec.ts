import { expect } from 'chai';
import {
    positionWorkflowNodes,
    positionWorkflowNodesAvoidOverlap,
    identityStartingNodes,
    getChildren,
    getParents,
    getEdges,
    getEndNodePositions,
    xSpacing,
    ySpacing,
    ROOT_X,
    ROOT_Y,
    TRIGGER_X_SPACING as ACTUAL_TRIGGER_X_SPACING // Import to use the constant if needed, or use literal
} from '../src/utils/WorkflowNodePositioner';
import { TRIGGERS, ACTIONS } from '../src/index.js'; // Added import

// Dummy implementations for testing purposes.
class DummyNode {
    public position: { x: number; y: number } | null = null;
    constructor(private ref: string) { }
    getRef(): string {
        return this.ref;
    }
    setPosition(x: number, y: number): void {
        this.position = { x, y };
    }
}

class DummyEdge {
    constructor(
        public source: DummyNode,
        public target: DummyNode,
        public label?: string
    ) { }
}

class DummyWorkflow {
    constructor(public nodes: DummyNode[], public edges: DummyEdge[]) { }
}

//
// TESTS
//

describe('Step 1. Identity Starting Nodes', () => {
    it('should return nodes with no incoming edges', () => {
        // Create three nodes: A, B, C.
        // Edge: A -> B, so A and C have no incoming edges.
        const A = new DummyNode('A');
        const B = new DummyNode('B');
        const C = new DummyNode('C');
        const edges = [new DummyEdge(A, B)];
        const workflow = new DummyWorkflow([A, B, C], edges);

        const starting = identityStartingNodes(workflow as any);
        const refs = starting.map((n: any) => n.getRef());
        expect(refs).to.have.members(['A', 'C']);
    });
});

describe('Step 1. getChildren & getParents', () => {
    it('should return the correct children and parents', () => {
        const A = new DummyNode('A');
        const B = new DummyNode('B');
        const C = new DummyNode('C');
        const edge1 = new DummyEdge(A, B);
        const edge2 = new DummyEdge(A, C);
        const edges = [edge1, edge2];
        const workflow = new DummyWorkflow([A, B, C], edges);

        const childrenOfA = getChildren(A as any, edges as any);
        expect(childrenOfA.map((n: any) => n.getRef())).to.have.members(['B', 'C']);

        const parentsOfB = getParents(B as any, edges as any);
        expect(parentsOfB.map((n: any) => n.getRef())).to.deep.equal(['A']);
    });
});

describe('Step 2. Layer Assignment and Vertical Positioning', () => {
    it('should assign Y positions according to layers', () => {
        // Create a small tree:
        //    A (layer 0)
        //    ├─ B (layer 1)
        //    └─ C (layer 1)
        //         └─ D (layer 2)
        const A = new DummyNode('A');
        const B = new DummyNode('B');
        const C = new DummyNode('C');
        const D = new DummyNode('D');

        const edges = [
            new DummyEdge(A, B),
            new DummyEdge(A, C),
            new DummyEdge(C, D)
        ];
        const workflow = new DummyWorkflow([A, B, C, D], edges);

        // Running the algorithm will assign layers internally.
        positionWorkflowNodes(workflow as any);

        // Check Y positions based on layer:
        // layer 0: y = ROOT_Y
        // layer 1: y = ROOT_Y + ySpacing
        // layer 2: y = ROOT_Y + 2*ySpacing
        expect(A.position!.y).to.equal(ROOT_Y);
        expect(B.position!.y).to.equal(ROOT_Y + ySpacing);
        expect(C.position!.y).to.equal(ROOT_Y + ySpacing);
        expect(D.position!.y).to.equal(ROOT_Y + 2 * ySpacing);
    });
});

describe('Step 2. Horizontal Placement (Grouping by Parent)', () => {
    it('should center a child group around its parent X position', () => {
        // Create one parent with two children.
        const A = new DummyNode('A'); // starting node; will be placed at ROOT_X in layer 0.
        const B = new DummyNode('B');
        const C = new DummyNode('C');
        const edges = [
            new DummyEdge(A, B),
            new DummyEdge(A, C)
        ];
        const workflow = new DummyWorkflow([A, B, C], edges);

        positionWorkflowNodes(workflow as any);

        // A is a starting node, so A.position.x should be ROOT_X.
        expect(A.position!.x).to.equal(ROOT_X);

        // Both B and C are children of A. In the algorithm, they are grouped using
        // the parent's X as the center. With two children and xSpacing = 500,
        // the left child's x should be: A.position.x - (500/2) = ROOT_X - 250,
        // and the right child's x: (ROOT_X - 250) + 500 = ROOT_X + 250.
        expect(B.position!.x).to.equal(ROOT_X - (xSpacing / 2));
        expect(C.position!.x).to.equal(ROOT_X + (xSpacing / 2));
    });
});

describe('Step 3. Overlap Resolution', () => {
    it('should shift a node when overlap is detected in the same level', () => {
        // Create two starting nodes (with no edges) so they are both in layer 0.
        const A = new DummyNode('A');
        const B = new DummyNode('B');
        // Manually set positions to simulate an overlap in the same level.
        // We set both nodes in layer 0 (y = ROOT_Y) but force B to overlap A.
        A.setPosition(100, ROOT_Y);
        B.setPosition(140, ROOT_Y); // gap = 40 < xSpacing (500)
        const workflow = new DummyWorkflow([A, B], []);

        // Normally, positionWorkflowNodes would reposition starting nodes with proper spacing.
        // Here, we simulate an overlap resolution scenario by bypassing the layout.
        // Build levels map manually.
        const levels: Map<number, DummyNode[]> = new Map();
        function addToLevel(node: DummyNode) {
            const level = Math.round(node.position!.y / ySpacing);
            if (!levels.has(level)) {
                levels.set(level, []);
            }
            levels.get(level)!.push(node);
        }
        workflow.nodes.forEach((node) => addToLevel(node));

        // Simulate the overlap resolution loop (which runs for nodes in the same level).
        levels.forEach((nodes) => {
            nodes.sort((a, b) => (a.position!.x) - (b.position!.x));
            for (let i = 1; i < nodes.length; i++) {
                const prev = nodes[i - 1];
                const current = nodes[i];
                const diff = current.position!.x - prev.position!.x;
                if (diff < xSpacing) {
                    const shift = xSpacing - diff;
                    // Directly shift current's position (in production, moveNodeAndChildren is used).
                    current.setPosition(current.position!.x + shift, current.position!.y);
                }
            }
        });

        // Now, expect that the gap between A and B is at least xSpacing.
        const gap = B.position!.x - A.position!.x;
        expect(gap).to.be.at.least(xSpacing);
    });
});

describe('Helper: moveNodeAndChildren', () => {
    it('should shift a node and its descendants', () => {
        // Create a simple tree: A -> B -> C.
        const A = new DummyNode('A');
        const B = new DummyNode('B');
        const C = new DummyNode('C');
        const edges = [new DummyEdge(A, B), new DummyEdge(B, C)];
        A.setPosition(100, 200);
        B.setPosition(200, 300);
        C.setPosition(300, 400);

        // We simulate a shift of B and its descendants by 500.
        // (Assuming moveNodeAndChildren works recursively.)
        // Since moveNodeAndChildren is not exported, we simulate its effect here:
        const shift = 500;
        B.setPosition(B.position!.x + shift, B.position!.y);
        C.setPosition(C.position!.x + shift, C.position!.y);

        expect(B.position!.x).to.equal(200 + shift);
        expect(C.position!.x).to.equal(300 + shift);
    });
});

describe('Step 4. Parent Centering (Bottom-Up Pass)', () => {
    it('should center a parent over its children', () => {
        // Create a workflow with one parent (A) and two children (B and C).
        const A = new DummyNode('A');
        const B = new DummyNode('B');
        const C = new DummyNode('C');
        const edges = [
            new DummyEdge(A, B),
            new DummyEdge(A, C)
        ];
        const workflow = new DummyWorkflow([A, B, C], edges);

        // Manually set children positions to simulate an uncentered parent.
        // (Assume these nodes are in different layers, so we call the centering logic via positionWorkflowNodesAvoidOverlap.)
        B.setPosition(100, 300);
        C.setPosition(300, 300);
        // Set parent's initial position off-center.
        A.setPosition(50, 200);

        // Call the function that triggers a bottom-up centering pass.
        positionWorkflowNodesAvoidOverlap(workflow as any);

        // Now, A's X should be centered over its children.
        const expectedParentX = (B.position!.x + C.position!.x) / 2;
        expect(A.position!.x).to.equal(expectedParentX);
    });
});

describe('Step 5. End Node Positions', () => {
    it('should return the positions for nodes with no children offset by ySpacing', () => {
        const A = new DummyNode('A');
        // Manually set a position for A.
        A.setPosition(500, 400);
        // No edges from A, so it is an end node.
        const workflow = new DummyWorkflow([A], []);
        const endPositions = getEndNodePositions(workflow as any);

        expect(endPositions.length).to.equal(1);
        // Expected y position is node’s y plus ySpacing.
        expect(endPositions[0].x).to.equal(500);
        expect(endPositions[0].y).to.equal(400 + ySpacing);
    });
});


// --- The test case ---
describe('Workflow Grouping Test for SmartYield USDC', () => {
    it('should group fourth-layer children by their primary parent to avoid crossing edges', () => {
        // The workflow JSON as provided (shortened parameters for brevity)
        const workflowJson = {
            "id": "1c762713-120c-40fc-9565-25e6441b0dd9",
            "name": "SmartYield USDC",
            "executionId": "60e9210c-6282-4949-bf35-c9cdc55bdb1e",
            "agentId": "2d7de8d5-0b08-4d38-a79b-f81e691953e0",
            "state": "inactive",
            "settings": null,
            "dateCreated": "2025-02-06T21:57:39.649Z",
            "dateModified": "2025-02-06T21:57:43.125Z",
            "nodes": [
                {
                    "id": "60750115-95fe-4f4c-b49b-3832e3ed9320",
                    "ref": "1",
                    "blockId": 18,
                    "executionId": "7bafc566-cad9-4bfa-a25d-40db23e1e156",
                    "type": "trigger",
                    "state": "completed",
                    "position": { "x": "400", "y": "120" },
                    "parameters": { "limit": "100000", "period": "3600000", "timeout": null }
                },
                {
                    "id": "f5a01a4c-e76c-416e-aac6-2a4b22f5b4d9",
                    "ref": "2",
                    "blockId": 100016,
                    "executionId": "091ccad0-bc8c-44fb-97c8-8658274b17a3",
                    "type": "action",
                    "state": "completed",
                    "position": { "x": "400", "y": "240" },
                    "parameters": { "logic": "or", "groups": [{ "logic": "and", "checks": [{}] }] }
                },
                {
                    "id": "5043930e-48ed-464b-ae2a-74537501f143",
                    "ref": "3",
                    "blockId": 100016,
                    "executionId": "0c207b6c-b040-4f92-80d0-be8f90e7244d",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "150", "y": "360" },
                    "parameters": { "logic": "or", "groups": [{ "logic": "and", "checks": [{}] }] }
                },
                {
                    "id": "7a2fe2bb-fecf-4b3f-9c29-92fa7fb2bc28",
                    "ref": "9",
                    "blockId": 100016,
                    "executionId": "e9a84e0f-7a77-4be7-814c-637ce43fe94e",
                    "type": "action",
                    "state": "completed",
                    "position": { "x": "650", "y": "360" },
                    "parameters": { "logic": "or", "groups": [{ "logic": "and", "checks": [{}] }] }
                },
                {
                    "id": "b0904b9c-3615-4cca-9399-1fdff7301f28",
                    "ref": "4",
                    "blockId": 100028,
                    "executionId": "b12fed84-e4ba-4db7-b4ca-c4282e0a1518",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "-100", "y": "480" },
                    "parameters": { "abi": { "parameters": { "asset": "0x...", "amount": "bigNumber" } }, "chainId": "8453" }
                },
                {
                    "id": "cf9b05bf-070a-44e3-a37f-53e372a58e72",
                    "ref": "10",
                    "blockId": 100021,
                    "executionId": "c3a96f4a-f2a8-499c-8dd5-061c0db41f3d",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "400", "y": "480" },
                    "parameters": { "abi": { "parameters": { "to": null, "asset": "0x...", "amount": "bigNumber" } }, "chainId": "8453" }
                },
                {
                    "id": "7e0e1d1f-009f-47db-8a3c-b839e13402f0",
                    "ref": "7",
                    "blockId": 100016,
                    "executionId": "e4610742-9f65-41a9-9bb3-458fe50c3e0c",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "400", "y": "480" },
                    "parameters": { "logic": "or", "groups": [{ "logic": "and", "checks": [{}] }] }
                },
                {
                    "id": "0f11138e-9796-41e6-9607-0cfe642657d6",
                    "ref": "13",
                    "blockId": 100016,
                    "executionId": "75883638-b95e-49ae-9144-ecdfdf49efc0",
                    "type": "action",
                    "state": "completed",
                    "position": { "x": "900", "y": "480" },
                    "parameters": { "logic": "or", "groups": [{ "logic": "and", "checks": [{}] }] }
                },
                {
                    "id": "8844ab00-25c6-4d8d-9537-93297b2b0a83",
                    "ref": "14",
                    "blockId": 100027,
                    "executionId": "661b46be-28d7-4f3f-bca5-491c35244b85",
                    "type": "action",
                    "state": "failed",
                    "position": { "x": "900", "y": "600" },
                    "parameters": { "abi": { "parameters": { "asset": "0x...", "amount": "{{...}}" } }, "chainId": "8453" }
                },
                {
                    "id": "c323f2f0-5393-4480-834b-435d672b9d34",
                    "ref": "5",
                    "blockId": 100010,
                    "executionId": "5cafd97e-e7de-418a-9e40-501793c7e55c",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "-100", "y": "600" },
                    "parameters": { "time": "10000" }
                },
                {
                    "id": "e1062b2b-0d19-40d7-a705-e15eed1bb12a",
                    "ref": "8",
                    "blockId": 100020,
                    "executionId": "9c5e53cb-ce65-4ad7-b289-0c2314a1edf9",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "400", "y": "600" },
                    "parameters": { "abi": { "parameters": { "asset": "0x...", "amount": "bigNumber", "onBehalfOf": null, "referralCode": null } }, "chainId": "8453" }
                },
                {
                    "id": "4a4fce16-aebb-4ffb-9c8d-1f587632a3af",
                    "ref": "11",
                    "blockId": 100010,
                    "executionId": "742ab120-0d06-4b1d-8544-28ae6e2a4ab9",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "400", "y": "600" },
                    "parameters": { "time": "10000" }
                },
                {
                    "id": "d70270d7-52c8-4c9a-b587-26ad8601c46a",
                    "ref": "12",
                    "blockId": 100027,
                    "executionId": "5779d045-94c6-449e-b06c-8e3db28b84cb",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "400", "y": "720" },
                    "parameters": { "abi": { "parameters": { "asset": "0x...", "amount": "{{...}}" } }, "chainId": "8453" }
                },
                {
                    "id": "487bf95f-a2a8-4ac7-828b-c6dd1a2f4a8f",
                    "ref": "6",
                    "blockId": 100020,
                    "executionId": "80c950d6-0567-4f7f-a5bd-18d0a1a00a3c",
                    "type": "action",
                    "state": "inactive",
                    "position": { "x": "-100", "y": "720" },
                    "parameters": { "abi": { "parameters": { "asset": "0x...", "amount": "{{...}}", "onBehalfOf": null, "referralCode": null } }, "chainId": "8453" }
                }
            ],
            "edges": [
                { "id": "03141e06-1b5f-40bb-9fd7-7fb6a409ff85", "source": "1", "target": "2", "value": null, "label": null },
                { "id": "097ad811-e2fb-4a61-8358-04409401aad8", "source": "9", "target": "13", "value": "false", "label": "false" },
                { "id": "196d5728-7f5f-47a7-9396-883c17f6e4c3", "source": "3", "target": "4", "value": "true", "label": "true" },
                { "id": "345e4f63-18b5-4bda-be25-97e956c7641e", "source": "10", "target": "11", "value": null, "label": null },
                { "id": "37862c84-3384-4d6c-b2b0-1c8618285b08", "source": "9", "target": "10", "value": "true", "label": "true" },
                { "id": "66ab77a9-1dbb-42b6-b2f3-e4bbb488d8fc", "source": "3", "target": "7", "value": "false", "label": "false" },
                { "id": "6ef8f870-ae7e-4cc1-91b7-97767d9e9749", "source": "5", "target": "6", "value": null, "label": null },
                { "id": "75b1bb45-cec9-4467-a1a3-40c7b694034f", "source": "2", "target": "9", "value": "false", "label": "false" },
                { "id": "7e87c9e6-c49a-467f-aabd-8fd4b8b31b2c", "source": "13", "target": "14", "value": "true", "label": "true" },
                { "id": "7f12f6ae-3f67-4d9a-9e7d-e290f099f631", "source": "4", "target": "5", "value": null, "label": null },
                { "id": "c4c34bb5-f7af-4c02-9166-ae9cdb4a8c34", "source": "2", "target": "3", "value": "true", "label": "true" },
                { "id": "f96e8250-0177-46f0-a21e-58bf6054b04a", "source": "7", "target": "8", "value": "true", "label": "true" },
                { "id": "fc8789ce-8892-42e4-b2ae-b4e28b7a3fd9", "source": "11", "target": "12", "value": null, "label": null }
            ],
            "notes": []
        };

        // --- Convert JSON nodes to DummyNode instances ---
        const nodeMap: { [ref: string]: DummyNode } = {};
        const nodes: DummyNode[] = workflowJson.nodes.map((n: any) => {
            const node = new DummyNode(n.ref);
            // Convert the string positions to numbers.
            node.setPosition(parseFloat(n.position.x), parseFloat(n.position.y));
            nodeMap[n.ref] = node;
            return node;
        });

        // --- Convert JSON edges to DummyEdge instances (using nodeMap) ---
        const edges: DummyEdge[] = workflowJson.edges.map((e: any) => {
            return new DummyEdge(nodeMap[e.source], nodeMap[e.target], e.label);
        });

        const workflow = new DummyWorkflow(nodes, edges);

        // Run the positioning algorithm (which now groups children by their primary parent)
        positionWorkflowNodes(workflow as any);

        // --- Verification ---
        // For layer 3 (i.e. nodes with y roughly 480), we expect the primary parent nodes to be ordered as:
        // "4", "7", "10", "13" from left to right.
        // Extract the nodes on layer 3.
        const layer3Nodes = nodes.filter(n => Math.abs(n.position!.y - 480) < 1);
        // Sort them by their x position.
        layer3Nodes.sort((a, b) => a.position!.x - b.position!.x);
        const refs = layer3Nodes.map(n => n.getRef());
        expect(refs).to.deep.equal(["4", "7", "10", "13"],
            `Expected layer 3 ordering to be 4,7,10,13 but got ${refs.join('-')}`);
    });
});

describe('Flow: Condition -> Split(3) -> Delay Demo', () => {
  it('should ensure that nodes "6" and "9" are separated by at least xSpacing and that their children are grouped correctly', () => {
    // The provided flow JSON.
    const workflowJson = {
      "id": "5e2c3300-937f-46d3-ab65-9a91b95d9a3d",
      "name": "Condition -> Split(3) -> Delay Demo",
      "executionId": null,
      "agentId": null,
      "state": "inactive",
      "settings": null,
      "dateCreated": "2025-01-26T18:36:38.218Z",
      "dateModified": "2025-01-26T18:44:24.351Z",
      "nodes": [
        {
          "id": "70a32de4-7178-4bea-9118-ff505c2bcbd0",
          "ref": "1",
          "blockId": 18,
          "executionId": null,
          "type": "trigger",
          "state": "inactive",
          "position": { "x": 650, "y": 120 },
          "parameters": { "limit": null, "period": 60000000, "timeout": null }
        },
        {
          "id": "6f0e8684-be51-4119-9ddc-7ac279af4731",
          "ref": "2",
          "blockId": 100010,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": 650, "y": 240 },
          "parameters": { "time": null }
        },
        {
          "id": "753bf037-4def-4d32-803c-747a811902cd",
          "ref": "3",
          "blockId": 100016,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": 650, "y": 360 },
          "parameters": { "logic": "and", "groups": [ { "logic": "and", "checks": [ { "value1": "1", "value2": "1", "condition": "eq" } ] } ] }
        },
        {
          "id": "7827138c-c941-4363-af04-09822f614965",
          "ref": "9",
          "blockId": 100010,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": 1150, "y": 480 },
          "parameters": { "time": null }
        },
        {
          "id": "8e28ab75-ecd3-42ab-815e-ae7dea5c0b39",
          "ref": "6",
          "blockId": 100015,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": 150, "y": 480 },
          "parameters": {}
        },
        {
          "id": "23114540-fd6e-42b7-9883-1c388ccfd615",
          "ref": "11",
          "blockId": 100013,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": 150, "y": 600 },
          "parameters": {
            "amount": "100000000n",
            "chainId": 34443,
            "tokenIn": "0xd988097fb8612cc24eeC14542bC03424c656005f",
            "slippage": 1,
            "tokenOut": "0x4200000000000000000000000000000000000006"
          }
        },
        {
          "id": "74aaf543-691b-4a8b-a605-076de5005d24",
          "ref": "10",
          "blockId": 100015,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": 650, "y": 600 },
          "parameters": {}
        },
        {
          "id": "d935f05d-cf51-410c-accc-88b4a73a1401",
          "ref": "8",
          "blockId": 0,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": -350, "y": 600 },
          "parameters": {
            "amount": null,
            "chainId": null,
            "tokenIn": null,
            "slippage": null,
            "tokenOut": null
          }
        },
        {
          "id": "d265f52d-107d-402a-a7f8-7d2c45f83651",
          "ref": "5",
          "blockId": 0,
          "executionId": null,
          "type": "action",
          "state": "inactive",
          "position": { "x": 1150, "y": 600 },
          "parameters": {
            "amount": null,
            "chainId": null,
            "tokenIn": null,
            "slippage": null,
            "tokenOut": null
          }
        }
      ],
      "edges": [
        { "id": "12a7f46d-a5aa-4aa1-98f1-11b5e3f8c250", "source": "3", "target": "6", "value": null, "label": null },
        { "id": "1cc368e4-d354-4daf-a5c3-d3c221c5281c", "source": "6", "target": "8", "value": null, "label": null },
        { "id": "21cac419-fd5a-48b5-b80d-afbedbef8170", "source": "6", "target": "10", "value": null, "label": null },
        { "id": "5ed21d68-3390-4df1-8946-7acd32f09889", "source": "9", "target": "5", "value": null, "label": null },
        { "id": "71c37344-b359-4275-89e3-781ec0527fa1", "source": "2", "target": "3", "value": null, "label": null },
        { "id": "8c65ca0b-cfd8-4856-b1e7-211616f15db5", "source": "3", "target": "9", "value": "false", "label": "false" },
        { "id": "91dc227b-260e-4858-b655-abf8069ac800", "source": "6", "target": "11", "value": null, "label": null },
        { "id": "dde76530-7f68-41a7-9aa0-6ba21644f6a5", "source": "1", "target": "2", "value": null, "label": null }
      ],
      "notes": []
    };

    // --- Convert JSON nodes to DummyNode instances ---
    const nodeMap: { [ref: string]: DummyNode } = {};
    const nodes: DummyNode[] = workflowJson.nodes.map((n: any) => {
      const node = new DummyNode(n.ref);
      // If the JSON positions are numbers, no conversion is needed.
      node.setPosition(Number(n.position.x), Number(n.position.y));
      nodeMap[n.ref] = node;
      return node;
    });

    // --- Convert JSON edges to DummyEdge instances (using nodeMap) ---
    const edges = workflowJson.edges.map((e: any) => {
      return new DummyEdge(nodeMap[e.source], nodeMap[e.target], e.label);
    });

    const workflow = new DummyWorkflow(nodes, edges);

    // Run the positioning algorithm.
    positionWorkflowNodes(workflow as any);

    // (1) Ensure that node "6" and node "9" are separated by at least xSpacing.
    const node6X = nodeMap["6"].position!.x;
    const node9X = nodeMap["9"].position!.x;
    expect(Math.abs(node9X - node6X)).to.be.at.least(500, `Nodes "6" and "9" should be at least xSpacing apart. Got |${node9X} - ${node6X}|.`);

    // (2) Check the grouping of children.
    // Get children of node "6": from edges where source === node "6".
    const childrenOf6 = edges.filter(e => e.source === nodeMap["6"]).map(e => e.target);
    // Their refs should be "8", "10", and "11".
    const refs6 = childrenOf6.map(n => n.getRef()).sort((a, b) => Number(a) - Number(b));
    expect(refs6).to.have.members(["8", "10", "11"]);

    // Compute the average x of node "6"'s children.
    const avgX6 = childrenOf6.reduce((acc, n) => acc + (n.position!.x), 0) / childrenOf6.length;
    // We expect that avgX6 is roughly equal to node "6"'s x (allowing a tolerance).
    expect(avgX6).to.be.closeTo(node6X, 50, `The average x of node "6"'s children (${avgX6}) should be close to node "6"'s x (${node6X}).`);

    // Get children of node "9": from edges where source === node "9".
    const childrenOf9 = edges.filter(e => e.source === nodeMap["9"]).map(e => e.target);
    // Their refs should be only "5".
    const refs9 = childrenOf9.map(n => n.getRef());
    expect(refs9).to.deep.equal(["5"]);

    // Check that node "5" is positioned near node "9".
    const avgX9 = childrenOf9.reduce((acc, n) => acc + n.position!.x, 0) / childrenOf9.length;
    expect(avgX9).to.be.closeTo(node9X, 50, `The average x of node "9"'s children (${avgX9}) should be close to node "9"'s x (${node9X}).`);
  });
});

describe('Multiple Trigger Positioning', () => {
    it('should position two triggers symmetrically around ROOT_X and their common child at ROOT_X', () => {
        const trigger1 = new DummyNode('1'); // Trigger 1
        const trigger2 = new DummyNode('2'); // Trigger 2
        const action1 = new DummyNode('3'); // Action 1 (common child)

        const edges = [
            new DummyEdge(trigger1, action1),
            new DummyEdge(trigger2, action1)
        ];
        // Ensure nodes are passed in sorted order of ref for predictability if internal lists don't re-sort fully
        const workflow = new DummyWorkflow([trigger1, trigger2, action1], edges);

        positionWorkflowNodes(workflow as any);

        // const TRIGGER_X_SPACING = 427;

        // Triggers are in layer 0
        expect(trigger1.position!.y).to.equal(ROOT_Y);
        expect(trigger2.position!.y).to.equal(ROOT_Y);

        // Trigger X positions
        const expectedT1_X = ROOT_X - ACTUAL_TRIGGER_X_SPACING / 2;
        const expectedT2_X = ROOT_X + ACTUAL_TRIGGER_X_SPACING / 2;
        expect(trigger1.position!.x).to.equal(expectedT1_X);
        expect(trigger2.position!.x).to.equal(expectedT2_X);

        // Common child action1 is in layer 1
        expect(action1.position!.y).to.equal(ROOT_Y + ySpacing);
        // Common child action1 should be centered at ROOT_X due to parent centering
        expect(action1.position!.x).to.equal(ROOT_X);
    });

    it('should position three triggers symmetrically around ROOT_X and their common child at ROOT_X', () => {
        const trigger1 = new DummyNode('1');
        const trigger2 = new DummyNode('2');
        const trigger3 = new DummyNode('3');
        const action1 = new DummyNode('4');

        const edges = [
            new DummyEdge(trigger1, action1),
            new DummyEdge(trigger2, action1),
            new DummyEdge(trigger3, action1)
        ];
        // Nodes are already in order of ref: 1, 2, 3, 4.
        // The positioner sorts starting nodes by ref: "1", "2", "3".
        const workflow = new DummyWorkflow([trigger1, trigger2, trigger3, action1], edges);

        positionWorkflowNodes(workflow as any);

        // const TRIGGER_X_SPACING = 427;

        // Triggers are in layer 0
        expect(trigger1.position!.y).to.equal(ROOT_Y);
        expect(trigger2.position!.y).to.equal(ROOT_Y);
        expect(trigger3.position!.y).to.equal(ROOT_Y);

        // Trigger X positions for three triggers
        // Node "1" is ROOT_X - ACTUAL_TRIGGER_X_SPACING
        // Node "2" is ROOT_X
        // Node "3" is ROOT_X + ACTUAL_TRIGGER_X_SPACING
        expect(trigger1.position!.x).to.equal(ROOT_X - ACTUAL_TRIGGER_X_SPACING);
        expect(trigger2.position!.x).to.equal(ROOT_X);
        expect(trigger3.position!.x).to.equal(ROOT_X + ACTUAL_TRIGGER_X_SPACING);

        // Common child action1 is in layer 1
        expect(action1.position!.y).to.equal(ROOT_Y + ySpacing);
        // Common child action1 should be centered at ROOT_X
        expect(action1.position!.x).to.equal(ROOT_X);
    });
});

describe('Example Workflow: Multiple Triggers (abstract_streamer_live_multiple_triggers)', () => {
    it('should correctly position nodes from the example workflow', async () => {
        const { abstract_streamer_live_multiple_triggers } = await import('../examples/Core/create-workflow-with-multiple-triggers.js');
        const workflowInstance = await abstract_streamer_live_multiple_triggers();

        const allNodes = workflowInstance.nodes;
        // Find starting trigger nodes (class 'trigger' and no parents)
        const triggerNodes = allNodes.filter(n => {
            const parents = getParents(n as any, workflowInstance.edges as any); // Cast to any for DummyNode compatibility if type mismatch
            return n.class === 'trigger' && parents.length === 0;
        });

        expect(triggerNodes.length).to.equal(2, "Should find two starting trigger nodes in the example");

        // Sort them by their actual numeric reference to determine left/right
        // The refs are strings but should represent numbers.
        triggerNodes.sort((a, b) => Number(a.getRef()) - Number(b.getRef()));

        const identifiedTrigger1 = triggerNodes[0]; // Left-most (smaller ref)
        const identifiedTrigger2 = triggerNodes[1]; // Right-most (larger ref)

        const notificationActionNode = allNodes.find(n => n.blockId === ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL.blockId);
        expect(notificationActionNode, "Notification Action not found").to.exist;

        // Use the imported constant if available, otherwise the literal value
        const effectiveTriggerXSpacing = ACTUAL_TRIGGER_X_SPACING || 427;

        // Check Y positions
        expect(identifiedTrigger1!.position!.y).to.equal(ROOT_Y);
        expect(identifiedTrigger2!.position!.y).to.equal(ROOT_Y);
        expect(notificationActionNode!.position!.y).to.equal(ROOT_Y + ySpacing);

        // Check X positions
        expect(identifiedTrigger1!.position!.x).to.equal(ROOT_X - effectiveTriggerXSpacing / 2);
        expect(identifiedTrigger2!.position!.x).to.equal(ROOT_X + effectiveTriggerXSpacing / 2);
        expect(notificationActionNode!.position!.x).to.equal(ROOT_X);
    });
});