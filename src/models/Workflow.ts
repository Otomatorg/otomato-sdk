import { Node, Position } from './Node.js';
import { Edge } from './Edge.js';
import { apiServices } from '../services/ApiService.js';
import { Action } from './Action.js';
import { SessionKeyPermission } from './SessionKeyPermission.js';
import { Note } from './Note.js';
import { getEndNodePositions, positionWorkflowNodes } from '../utils/WorkflowNodePositioner.js';
import { ACTIONS } from '../constants/Blocks.js';

export type WorkflowState = 'inactive' | 'active' | 'failed' | 'completed' | 'waiting';

export class Workflow {
  id: string | null = null;
  name: string;
  nodes: Node[];
  edges: Edge[];
  state: WorkflowState;
  dateCreated: string | null = null;
  dateModified: string | null = null;
  executionId: string | null = null;
  notes: Note[] = [];

  constructor(name: string = '', nodes: Node[] = [], edges: Edge[] = []) {
    this.name = name;
    this.nodes = nodes;
    this.edges = edges;
    this.state = 'inactive';
    positionWorkflowNodes(this);
  }

  setName(name: string): void {
    this.name = name;
  }

  addNode(node: Node): void {
    this.nodes.push(node);
    positionWorkflowNodes(this);
  }

  addNodes(nodes: Node[]): void {
    this.nodes.push(...nodes);
    positionWorkflowNodes(this);
  }

  getNode(ref: string): Node | null {
    return this.nodes.find(node => node.getRef() === ref) || null;
  }

  deleteNode(nodeToDelete: Node): void {
    // Remove the node from the nodes array
    const nodeIndex = this.nodes.findIndex(node => node === nodeToDelete);
    if (nodeIndex === -1) {
      throw new Error(`Node not found in the workflow.`);
    }
    this.nodes.splice(nodeIndex, 1);

    // Collect incoming and outgoing edges
    const incomingEdges = this.edges.filter(edge => edge.target === nodeToDelete);
    const outgoingEdges = this.edges.filter(edge => edge.source === nodeToDelete);

    // Create new edges to replace the deleted node's connections
    const newEdges: Edge[] = [];
    incomingEdges.forEach(inEdge => {
      outgoingEdges.forEach(outEdge => {
        newEdges.push(new Edge({ source: inEdge.source, target: outEdge.target }));
      });
    });

    // Update the edges array: remove edges involving the deleted node and add the new ones
    this.edges = this.edges.filter(edge => edge.source !== nodeToDelete && edge.target !== nodeToDelete);
    this.edges.push(...newEdges);

    // Recalculate positions
    positionWorkflowNodes(this);
  }

  /**
   * Inserts a new node into the workflow, potentially splitting an existing edge.
   * 
   * - If `nodeAfter` is specified, we expect an edge nodeBefore->nodeAfter to exist.
   *   That edge is removed, and replaced by two new edges:
   *      nodeBefore->nodeToInsert (with `edgeLabelBefore`, `edgeValueBefore`)
   *      nodeToInsert->nodeAfter  (with `edgeLabelAfter`, `edgeValueAfter`)
   *
   * - If `nodeAfter` is not specified, we create only one edge:
   *      nodeBefore->nodeToInsert (with `edgeLabelBefore`, `edgeValueBefore`)
   *
   * @param nodeToInsert      The node to insert
   * @param nodeBefore        The existing node that precedes `nodeToInsert`
   * @param nodeAfter         (Optional) The existing node that should follow `nodeToInsert`
   * @param edgeLabelBefore   (Optional) Label for the edge nodeBefore->nodeToInsert
   * @param edgeValueBefore   (Optional) Value for the edge nodeBefore->nodeToInsert
   * @param edgeLabelAfter    (Optional) Label for the edge nodeToInsert->nodeAfter
   * @param edgeValueAfter    (Optional) Value for the edge nodeToInsert->nodeAfter
   */
  public insertNode(
    nodeToInsert: Node,
    nodeBefore: Node,
    nodeAfter?: Node,
    edgeLabelBefore: string | null = null,
    edgeValueBefore: any | null = null,
    edgeLabelAfter: string | null = null,
    edgeValueAfter: any | null = null
  ): void {
    // Ensure nodeBefore exists in the workflow
    if (!this.nodes.includes(nodeBefore)) {
      throw new Error('The nodeBefore must exist in the workflow.');
    }

    // CASE A: If no nodeAfter => we create a single edge from nodeBefore to nodeToInsert
    if (!nodeAfter) {
      // Add the new node to the workflow
      this.addNode(nodeToInsert);

      // Create the edge nodeBefore->nodeToInsert
      const newEdge = new Edge({
        source: nodeBefore,
        target: nodeToInsert,
        label: edgeLabelBefore ?? undefined,
        value: edgeValueBefore ?? undefined
      });
      this.addEdge(newEdge);

      // Recalculate positions
      positionWorkflowNodes(this);
      return;
    }

    // CASE B: nodeAfter is provided => we expect an edge nodeBefore->nodeAfter to exist
    if (!this.nodes.includes(nodeAfter)) {
      throw new Error('The nodeAfter must exist in the workflow.');
    }

    // Find the existing edge nodeBefore->nodeAfter
    const edgeBetween = this.edges.find(
      (edge) => edge.source === nodeBefore && edge.target === nodeAfter
    );
    if (!edgeBetween) {
      throw new Error('No edge exists between nodeBefore and nodeAfter.');
    }

    // Add the new node to the workflow
    this.addNode(nodeToInsert);

    // Remove the existing edge between nodeBefore and nodeAfter
    this.edges = this.edges.filter((edge) => edge !== edgeBetween);

    // Create the two new edges:
    // 1) nodeBefore->nodeToInsert
    const newEdge1 = new Edge({
      source: nodeBefore,
      target: nodeToInsert,
      label: edgeLabelBefore ?? undefined,
      value: edgeValueBefore ?? undefined
    });

    // 2) nodeToInsert->nodeAfter
    const newEdge2 = new Edge({
      source: nodeToInsert,
      target: nodeAfter,
      label: edgeLabelAfter ?? undefined,
      value: edgeValueAfter ?? undefined
    });

    this.addEdges([newEdge1, newEdge2]);

    // Recalculate positions
    positionWorkflowNodes(this);
  }

  public insertCondition(
    nodeToInsert: Node,
    nodeBefore: Node,
    nodeAfter?: Node,
    addElseCase?: boolean,
    addEmptyNodes: boolean = true
  ): void {

    if (nodeAfter) {
      this.insertNode(nodeToInsert, nodeBefore, nodeAfter, null, null, 'true', 'true');
    }

    // Otherwise, create both "true" and "false" paths.
    // 1) "true" path: nodeBefore -> nodeToInsert -> nodeAfter
    if (!nodeAfter) {
      this.insertNode(nodeToInsert, nodeBefore, undefined);
      if (addEmptyNodes) {
        const emptyNode1 = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
        this.insertNode(emptyNode1, nodeToInsert, undefined, 'true', 'true');
      }
    }

    // 2) "false" path: nodeBefore -> nodeToInsert, 
    //    but here we pass no nodeAfter (so nodeAfter=null),
    //    and label/value are "false".
    if (addElseCase && addEmptyNodes) {
      const emptyNode2 = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
      this.insertNode(emptyNode2, nodeToInsert, undefined, 'false', 'false');
    }
  }

  /**
   * Inserts a "split" node, creating `numberOfBranches` parallel branches.
   * 
   * If `nodeAfter` is given, we call `insertNode(...)` to splice the split node
   * between `nodeBefore` and `nodeAfter`. That yields two edges:
   *    nodeBefore->nodeToInsert and nodeToInsert->nodeAfter
   * The first branch is effectively "nodeAfter."
   * Then we add additional empty blocks for the remaining branches.
   * 
   * If `nodeAfter` is NOT given, we just insertNode(split, nodeBefore),
   * which yields an edge: nodeBefore->split.
   * Then we create `numberOfBranches` empty blocks off the split node.
   * 
   * @param nodeToInsert     The split node to insert (e.g. type="Split").
   * @param nodeBefore       The node after which the split is inserted.
   * @param nodeAfter        (Optional) If we’re splitting in the middle of a flow, the node that was originally after `nodeBefore`.
   * @param numberOfBranches The total number of branches to create from `nodeToInsert`.
   */
  public insertSplit(
    nodeToInsert: Node,
    nodeBefore: Node,
    nodeAfter: Node | undefined,
    numberOfBranches: number
  ): void {
    // Basic validation
    if (!this.nodes.includes(nodeBefore)) {
      throw new Error('nodeBefore must exist in the workflow.');
    }
    if (numberOfBranches < 2) {
      throw new Error('numberOfBranches must be at least 2.');
    }

    // Step 1: Insert the "split" node via insertNode
    // - If nodeAfter is defined, it removes nodeBefore->nodeAfter
    //   and creates nodeBefore->nodeToInsert & nodeToInsert->nodeAfter.
    // - If nodeAfter is undefined, we simply get nodeBefore->nodeToInsert.
    this.insertNode(nodeToInsert, nodeBefore, nodeAfter);

    // Step 2: Create the parallel branches
    if (nodeAfter) {
      // The first branch is already nodeToInsert->nodeAfter
      // So we only need to create the remaining (numberOfBranches - 1) branches
      const remaining = numberOfBranches - 1;
      for (let i = 0; i < remaining; i++) {
        const emptyBlock = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
        // Insert the emptyBlock after nodeToInsert
        // => this creates a new edge nodeToInsert->emptyBlock
        this.insertNode(emptyBlock, nodeToInsert);
      }
    } else {
      // nodeAfter is undefined => all branches must be created
      // Each branch is nodeToInsert->(new empty block)
      for (let i = 0; i < numberOfBranches; i++) {
        const emptyBlock = new Action(ACTIONS.CORE.EMPTYBLOCK.EMPTYBLOCK);
        this.insertNode(emptyBlock, nodeToInsert);
      }
    }
  }

  swapNode(oldNode: Node, newNode: Node): void {
    // Find the index of the node to replace
    const nodeIndex = this.nodes.findIndex(node => node === oldNode);
    if (nodeIndex === -1) {
      throw new Error(`Node to swap not found in the workflow.`);
    }

    // Replace the old node with the new node in the nodes array
    this.nodes[nodeIndex] = newNode;

    // Update edges to point to the new node
    this.edges.forEach(edge => {
      if (edge.source === oldNode) {
        edge.source = newNode;
      }
      if (edge.target === oldNode) {
        edge.target = newNode;
      }
    });

    // Recalculate positions
    positionWorkflowNodes(this);
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
    positionWorkflowNodes(this);
  }

  updateEdge(edgeId: string, newEdge: Edge): void {
    const edgeToUpdate = this.edges.find(e => e.id === edgeId);
    if (edgeToUpdate) {
      edgeToUpdate.source = newEdge.source;
      edgeToUpdate.target = newEdge.target;
    } else {
      throw new Error(`Edge with id ${edgeId} not found`);
    }
    positionWorkflowNodes(this);
  }

  addEdges(edges: Edge[]): void {
    this.edges.push(...edges);
    positionWorkflowNodes(this);
  }

  getState(): WorkflowState {
    return this.state;
  }

  // Add a new note to the workflow
  addNote(note: Note): void {
    this.notes.push(note);
  }

  // Update an existing note by ID
  updateNote(noteId: string, newText: string, newPosition: Position): void {
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      note.text = newText;
      note.position = newPosition;
    } else {
      throw new Error(`Note with id ${noteId} not found`);
    }
  }

  // Delete a note by ID
  deleteNote(noteId: string): void {
    const index = this.notes.findIndex(n => n.id === noteId);
    if (index !== -1) {
      this.notes.splice(index, 1);
    } else {
      throw new Error(`Note with id ${noteId} not found`);
    }
  }

  // Retrieve notes as JSON to include them in the toJSON method
  getNotes(): { id: string | null; text: string; position: Position }[] {
    return this.notes.map(note => note.toJSON());
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
      dateCreated: this.dateCreated,
      dateModified: this.dateModified,
      executionId: this.executionId,
      nodes: this.nodes.map(node => node.toJSON()),
      edges: this.edges.map(edge => edge.toJSON()),
      notes: this.getNotes(),
    };
  }

  async create(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiServices.post('/workflows', this.toJSON());

      if (response.status === 201) {
        this.id = response.data.id; // Assign the returned ID to the workflow instance
        this.dateCreated = response.data.dateCreated;
        this.dateModified = response.data.dateModified;

        // Assign IDs to the nodes based on the response
        response.data.nodes.forEach((nodeResponse: any) => {
          const node = this.nodes.find(n => n.getRef() === nodeResponse.ref);
          if (node) {
            node.setId(nodeResponse.id);
          }
        });

        // Assign IDs to the edges based on the source and target nodes
        response.data.edges.forEach((edgeResponse: any) => {
          const edge = this.edges.find(e =>
            e.source.getRef() === edgeResponse.source &&
            e.target.getRef() === edgeResponse.target
          );
          if (edge) {
            edge.id = edgeResponse.id;
          }
        });

        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Unknown error' };
      }
    } catch (error: any) {
      console.log(error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  async update(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiServices.put(`/workflows/${this.id}`, this.toJSON());

      if (response.status === 200) {
        this.dateModified = response.data.dateModified;

        // Assign IDs to the nodes based on the response
        response.data.nodes.forEach((nodeResponse: any) => {
          const node = this.nodes.find(n => n.getRef() === nodeResponse.ref);
          if (node) {
            node.setId(nodeResponse.id);
          }
        });

        // Assign IDs to the edges based on the source and target nodes
        response.data.edges.forEach((edgeResponse: any) => {
          const edge = this.edges.find(e =>
            e.source.getRef() === edgeResponse.source &&
            e.target.getRef() === edgeResponse.target
          );
          if (edge) {
            edge.id = edgeResponse.id;
          }
        });

        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Unknown error' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  async load(workflowId: string): Promise<Workflow> {
    try {
      const response = await apiServices.get(`/workflows/${workflowId}`);
      this.id = response.id;
      this.name = response.name;
      this.state = response.state as WorkflowState;
      this.dateCreated = response.dateCreated;
      this.executionId = response.executionId;
      this.dateModified = response.dateModified;
      this.nodes = await Promise.all(response.nodes.map(async (nodeData: any) => await Node.fromJSON(nodeData)));
      this.edges = response.edges.map((edgeData: any) => Edge.fromJSON(edgeData, this.nodes));
      this.notes = response.notes.map((noteData: any) => Note.fromJSON(noteData));
      positionWorkflowNodes(this);
      return this;
    } catch (error: any) {
      throw new Error(`Failed to load workflow: ${error.message}`);
    }
  }

  async reload(): Promise<Workflow> {
    if (!this.id) {
      throw new Error('Cannot reload a workflow without an ID.');
    }
    return this.load(this.id);
  }

  async run(): Promise<{ success: boolean; error?: string }> {
    if (!this.id) {
      throw new Error('The workflow needs to be published first');
    }

    try {
      const response = await apiServices.post(`/workflows/${this.id}/run`, this.toJSON());

      if (response.status === 200) {
        this.state = 'active';
        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Unknown error' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  async delete(): Promise<{ success: boolean; error?: string }> {
    if (!this.id) {
      throw new Error('Cannot delete a workflow without an ID.');
    }

    try {
      const response = await apiServices.delete(`/workflows/${this.id}`);

      if (response.status === 204) {
        // Optionally, you can clean up the instance's properties here
        this.id = null;
        this.name = '';
        this.nodes = [];
        this.edges = [];
        this.state = 'inactive';

        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Unknown error' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  async getSessionKeyPermissions(): Promise<SessionKeyPermission> {
    if (!this.id)
      throw new Error('The workflow needs to be published first');

    return apiServices.getSessionKeyPermissions(this.id);
  }

  getEndNodePositions(): { x: number; y: number }[] {
    return getEndNodePositions(this);
  }

  static async fromJSON(json: any): Promise<Workflow> {
    const workflow = new Workflow(json.name);
    workflow.id = json.id || null;
    workflow.state = json.state as WorkflowState;
    workflow.dateCreated = json.dateCreated || null;
    workflow.executionId = json.executionId || null;
    workflow.dateModified = json.dateModified || null;

    // Convert nodes from JSON
    workflow.nodes = await Promise.all(json.nodes.map(async (nodeData: any) => await Node.fromJSON(nodeData)));

    // Convert edges from JSON (ensuring they link to the correct nodes)
    workflow.edges = json.edges.map((edgeData: any) => Edge.fromJSON(edgeData, workflow.nodes));

    // Convert notes from JSON
    workflow.notes = json.notes.map((noteData: any) => Note.fromJSON(noteData));

    // Recalculate positions
    positionWorkflowNodes(workflow);

    return workflow;
  }
}