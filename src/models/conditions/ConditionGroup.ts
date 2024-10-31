// ConditionGroup.ts
import { ConditionCheck } from './ConditionCheck.js';

export class ConditionGroup {
  logic: string;
  checks: ConditionCheck[];

  constructor(logic: string = 'and') {
    this.logic = logic;
    this.checks = [];
  }

  addConditionCheck(value1: any, condition: string, value2: any) {
    const check = new ConditionCheck(value1, condition, value2);
    this.checks.push(check);
  }

  toJSON() {
    return {
      logic: this.logic,
      checks: this.checks.map((check) => check.toJSON()),
    };
  }
}