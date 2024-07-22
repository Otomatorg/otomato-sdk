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

    static fromJSON(json: { [key: string]: any }, nodes: Node[]): Edge {
        const source = nodes.find(n => n.getRef() === json.source);
        const target = nodes.find(n => n.getRef() === json.target);

        if (!source || !target)
            throw new Error("Edge refer to non existing node");

        return new Edge({
            id: json.id,
            source,
            target
        });
    }
}