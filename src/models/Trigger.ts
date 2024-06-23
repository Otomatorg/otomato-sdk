import { Parameter } from './Parameter.js';
import { validateType } from '../utils/typeValidator.js';

export class Trigger {
  id: number;
  name: string;
  description: string;
  type: number;
  parameters: { [key: string]: Parameter };
  keyMap: { [key: string]: string };

  constructor(trigger: { id: number; name: string; description: string; type: number; parameters: Parameter[] }) {
    this.id = trigger.id;
    this.name = trigger.name;
    this.description = trigger.description;
    this.type = trigger.type;
    this.parameters = {};
    this.keyMap = {};
    trigger.parameters.forEach(param => {
      this.parameters[param.key] = { ...param, value: null };
      const simplifiedKey = this.getSimplifiedKey(param.key);
      this.keyMap[simplifiedKey] = param.key;
    });
  }

  setChainId(value: number): void {
    this.setParameter('chainId', value);
  }

  setContractAddress(value: string): void {
    this.setParameter('contractAddress', value);
  }

  setCondition(value: string): void {
    if (this.type !== 1) {
      throw new Error('Condition setting is not applicable for subscription based triggers.');
    }
    this.setParameter('condition', value);
  }

  setComparisonValue(value: number): void {
    if (this.type !== 1) {
      throw new Error('Comparison value setting is not applicable for subscription based triggers.');
    }
    this.setParameter('comparisonValue', value);
  }

  setInterval(value: number): void {
    if (this.type !== 1) {
      throw new Error('Interval setting is not applicable for subscription based triggers.');
    }
    this.setParameter('interval', value);
  }

  setParams(key: string, value: any): void {
    const fullKey = this.parameters[`abiParams.${key}`] ? `abiParams.${key}` : key;
    this.setParameter(fullKey, value);
  }

  private setParameter(key: string, value: any): void {
    if (key in this.parameters) {
      const param = this.parameters[key];
      if (validateType(param.type, value)) {
        this.parameters[key].value = value;
      } else {
        throw new Error(`Invalid type for parameter ${key}. Expected ${param.type}.`);
      }
    } else {
      throw new Error(`Parameter with key ${key} not found`);
    }
  }

  getParameter(key: string): any {
    if (key in this.parameters) {
      return this.parameters[key].value;
    } else {
      throw new Error(`Parameter with key ${key} not found`);
    }
  }

  getParameters(): { [key: string]: any } {
    return Object.keys(this.parameters).reduce((acc, key) => {
      acc[key] = this.parameters[key].value;
      return acc;
    }, {} as { [key: string]: any });
  }

  toJSON(): { [key: string]: any } {
    const json: { [key: string]: any } = {
      id: this.id,
      parameters: this.getParameters(),
    };
    return json;
  }

  private getSimplifiedKey(key: string): string {
    return key.replace(/[.\[\]]/g, '_');
  }
}
