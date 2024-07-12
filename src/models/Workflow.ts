import { Node } from './Node.js';
import { Edge } from './Edge.js';
import { apiServices } from '../services/ApiService.js';

export class Workflow {
  id: string | null = null;
  name: string;
  nodes: Node[];
  edges: Edge[];

  constructor(name: string, nodes: Node[] = [], edges: Edge[] = []) {
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
      name: this.name,
      nodes: this.nodes.map(node => node.toJSON()),
      edges: this.edges.map(edge => edge.toJSON()),
    };
  }

  async create() {
    const response = await apiServices.post('/workflows', this.toJSON());
    this.id = response.id; // Assign the returned ID to the workflow instance

    // Assign IDs to the nodes based on the response
    response.nodes.forEach((nodeResponse: any) => {
      const node = this.nodes.find(n => n.getRef() === nodeResponse.ref);
      if (node) {
        node.setId(nodeResponse.id);
      }
    });

    return response;
  }
}