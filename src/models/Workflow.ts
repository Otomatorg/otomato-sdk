import { Node, Position } from './Node.js';
import { Edge } from './Edge.js';
import { apiServices } from '../services/ApiService.js';
import { Action } from './Action.js';
import { SessionKeyPermission } from './SessionKeyPermission.js';
import { Note } from './Note.js';
import { positionWorkflowNodes } from '../utils/WorkflowNodePositioner.js';

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

  insertNode(nodeToInsert: Node, nodeBefore: Node, nodeAfter?: Node): void {
    // Ensure nodeBefore exists in the workflow
    if (!this.nodes.includes(nodeBefore)) {
      throw new Error('The nodeBefore must exist in the workflow.');
    }
  
    // If nodeAfter is not provided, insert the new node as a child of nodeBefore
    if (!nodeAfter) {
      // Add the new node to the workflow
      this.addNode(nodeToInsert);
  
      // Add a new edge between nodeBefore and nodeToInsert
      const newEdge = new Edge({ source: nodeBefore, target: nodeToInsert });
      this.addEdge(newEdge);
  
      // Recalculate positions
      positionWorkflowNodes(this);
      return;
    }
  
    // If nodeAfter is provided, ensure both nodes exist in the workflow
    if (!this.nodes.includes(nodeAfter)) {
      throw new Error('The nodeAfter must exist in the workflow.');
    }
  
    // Check if an edge exists between nodeBefore and nodeAfter
    const edgeBetween = this.edges.find(edge => edge.source === nodeBefore && edge.target === nodeAfter);
    if (!edgeBetween) {
      throw new Error('No edge exists between nodeBefore and nodeAfter.');
    }
  
    // Add the new node to the workflow
    this.addNode(nodeToInsert);
  
    // Remove the existing edge between nodeBefore and nodeAfter
    this.edges = this.edges.filter(edge => edge !== edgeBetween);
  
    // Add new edges
    const newEdge1 = new Edge({ source: nodeBefore, target: nodeToInsert });
    const newEdge2 = new Edge({ source: nodeToInsert, target: nodeAfter });
    this.addEdges([newEdge1, newEdge2]);
  
    // Recalculate positions
    positionWorkflowNodes(this);
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
      const response = await apiServices.patch(`/workflows/${this.id}`, this.toJSON());

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
}