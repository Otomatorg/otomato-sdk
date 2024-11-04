import { Position } from "./Node";

export class Note {
    id: string;
    text: string;
    position: Position;

    constructor(text: string, position: Position) {
        this.id = Date.now().toString(); // Assign the current timestamp as the ID
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
}