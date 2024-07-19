import { Node } from './Node.js';
import { Edge } from './Edge.js';
import { apiServices } from '../services/ApiService.js';

export class Workflow {
  id: string | null = null;
  name: string;
  nodes: Node[];
  edges: Edge[];

  constructor(name: string = '', nodes: Node[] = [], edges: Edge[] = []) {
    this.name = name;
    this.nodes = nodes;
    this.edges = edges;
  }

  setName(name: string): void {
    this.name = name;
  }

  addNode(node: Node): void {
    this.nodes.push(node);
  }

  addNodes(nodes: Node[]): void {
    this.nodes.push(...nodes);
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  addEdges(edges: Edge[]): void {
    this.edges.push(...edges);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nodes: this.nodes.map(node => node.toJSON()),
      edges: this.edges.map(edge => edge.toJSON()),
    };
  }

  async create() {
    try {
      const response = await apiServices.post('/workflows', this.toJSON());

      if (response.status === 201) {
        this.id = response.data.id; // Assign the returned ID to the workflow instance

        // Assign IDs to the nodes based on the response
        response.data.nodes.forEach((nodeResponse: any) => {
          const node = this.nodes.find(n => n.getRef() === nodeResponse.ref);
          if (node) {
            node.setId(nodeResponse.id);
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

  async update(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiServices.patch(`/workflows/${this.id}`, this.toJSON());
  
      if (response.status === 200) {
        // Assign IDs to the nodes based on the response
        response.data.nodes.forEach((nodeResponse: any) => {
          const node = this.nodes.find(n => n.getRef() === nodeResponse.ref);
          if (node) {
            node.setId(nodeResponse.id);
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
    const response = await apiServices.get(`/workflows/${workflowId}`);
    this.id = response.id;
    this.name = response.name;
    this.nodes = await Promise.all(response.nodes.map(async (nodeData: any) => await Node.fromJSON(nodeData)));
    this.edges = response.edges.map((edgeData: any) => Edge.fromJSON(edgeData, this.nodes));
    return this;
}

  async run() {
    if (!this.id) {
      throw new Error('The workflow needs to be published first');
    }
  
    try {
      const response = await apiServices.post(`/workflows/${this.id}/run`, this.toJSON());
  
      if (response.status === 204) {
        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Unknown error' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }
}