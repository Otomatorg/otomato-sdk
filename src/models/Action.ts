import { Parameter } from './Parameter.js';
import { Node, Position } from './Node.js';

export class Action extends Node {
  constructor(action: { blockId: number; name: string; description: string; parameters: Parameter[], ref?: string, position?: Position }) {
    super({ ...action, class: 'action' });
  }
}