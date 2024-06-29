import { Parameter } from './Parameter.js';
import { Node } from './Node.js';

export class Action extends Node {
  constructor(action: { id: number; name: string; description: string; parameters: Parameter[], x?: number, y?: number }) {
    super(action);
  }
}
