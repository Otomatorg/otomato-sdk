import { Parameter } from './Parameter.js';
import { Node, Position } from './Node.js';

export class Trigger extends Node {
  type: number;

  constructor(trigger: { blockId: number; name: string; description: string; type: number; parameters: Parameter[], image: string, ref?: string, position?: Position }) {
    super({ ...trigger, class: 'trigger' });
    this.type = trigger.type;
  }

  private notAPollingTrigger(): boolean {
    return this.type === 0;
  }

  setCondition(value: string): void {
    if (this.notAPollingTrigger()) {
      throw new Error('Condition setting is not applicable for subscription based triggers.');
    }
    this.setParameter('condition', value);
  }

  setComparisonValue(value: number): void {
    if (this.notAPollingTrigger()) {
      throw new Error('Comparison value setting is not applicable for subscription based triggers.');
    }
    this.setParameter('comparisonValue', value);
  }

  setInterval(value: number): void {
    if (this.notAPollingTrigger()) {
      throw new Error('Interval setting is not applicable for subscription based triggers.');
    }
    this.setParameter('interval', value);
  }
}
