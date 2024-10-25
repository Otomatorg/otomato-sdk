// ConditionCheck.ts
export class ConditionCheck {
    value1: any;
    condition: string;
    value2: any;
  
    constructor(value1: any, condition: string, value2: any) {
      this.value1 = value1;
      this.condition = condition;
      this.value2 = value2;
    }
  
    toJSON() {
      return {
        value1: this.value1,
        condition: this.condition,
        value2: this.value2,
      };
    }
  }