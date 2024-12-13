import { Position } from "./Node";

export class Note {
    id: string;
    text: string;
    position: Position;

    constructor(text: string, position: Position, id?: string) {
        this.id = id || Date.now().toString(); // Use provided ID or fallback to timestamp
        this.text = text;
        this.position = position;
    }

    setPosition(x: number, y: number): void {
        this.position = { x, y };
    }

    toJSON() {
        return {
            id: this.id,
            text: this.text,
            position: this.position,
        };
    }

    // Static method to create a Note instance from JSON
    static fromJSON(json: { id: string; text: string; position: Position }): Note {
        return new Note(json.text, json.position, json.id);
    }
}