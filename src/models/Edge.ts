import { Node } from './Node.js';

let edgeCounter = 0;
const generatedEdgeIds = new Set<string>();

export class Edge {
    id: string;
    source: Node;
    target: Node;

    constructor(edge: { id?: string, source: Node, target: Node }) {
        if (edge.id) {
            this.id = edge.id;
        } else {
            this.id = `e-${++edgeCounter}`;
            while (generatedEdgeIds.has(this.id)) {
                this.id = `e-${++edgeCounter}`;
            }
        }
        generatedEdgeIds.add(this.id);

        this.source = edge.source;
        this.target = edge.target;
    }

    toJSON(): { [key: string]: any } {
        return {
            id: this.id,
            source: this.source.getRef(),
            target: this.target.getRef(),
        };
    }
}
