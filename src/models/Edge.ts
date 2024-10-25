import { Node } from './Node.js';
import { apiServices } from '../services/ApiService.js';

export class Edge {
    id: string | null;
    source: Node;
    target: Node;
    label?: string;
    value?: number;

    constructor(edge: {
        id?: string | null;
        source: Node;
        target: Node;
        label?: string;
        value?: number;
    }) {
        if (!edge.source || !(edge.source instanceof Node)) {
            throw new Error('Edge must have a valid source node.');
        }
        if (!edge.target || !(edge.target instanceof Node)) {
            throw new Error('Edge must have a valid target node.');
        }

        this.id = edge.id ?? null;
        this.source = edge.source;
        this.target = edge.target;
        this.label = edge.label;
        this.value = edge.value;
    }

    toJSON(): { [key: string]: any } {
        const result: { [key: string]: any } = {
            id: this.id,
            source: this.source.getRef(),
            target: this.target.getRef(),
        };

        if (this.label != null) {
            result.label = this.label;
        }
        if (this.value != null) {
            result.value = this.value;
        }

        return result;
    }

    static fromJSON(json: { [key: string]: any }, nodes: Node[]): Edge {
        const source = nodes.find((n) => n.getRef() === json.source);
        const target = nodes.find((n) => n.getRef() === json.target);

        if (!source || !target) {
            throw new Error('Edge refers to a non-existing node');
        }

        return new Edge({
            id: json.id,
            source,
            target,
            label: json.label,
            value: json.value,
        });
    }

    async delete(): Promise<{ success: boolean; error?: string }> {
        if (!this.id) {
            throw new Error('Cannot delete an edge without an ID.');
        }
        try {
            const response = await apiServices.delete(`/edges/${this.id}`);
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