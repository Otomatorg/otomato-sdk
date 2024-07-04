import { Parameter } from './Parameter.js';
import { validateType } from '../utils/typeValidator.js';

export interface Position {
  x: number;
  y: number;
}

let nodeCounter = 0;
const generatedRefs = new Set<string>();

export class Node {
  id: number;
  name: string;
  description: string;
  parameters: { [key: string]: Parameter };
  keyMap: { [key: string]: string };
  position?: Position;
  ref: string;
  class: string;  // Updated to use class instead of type

  constructor(node: { id: number; name: string; description: string; parameters: Parameter[], ref?: string, position?: Position, class: string }) {
    this.id = node.id;
    this.name = node.name;
    this.description = node.description;
    this.parameters = {};
    this.keyMap = {};
    this.class = node.class;  // Set class property

    if (node.ref) {
      this.ref = node.ref;
    } else {
      this.ref = `n-${++nodeCounter}`;
      while (generatedRefs.has(this.ref)) {
        this.ref = `n-${++nodeCounter}`;
      }
    }
    generatedRefs.add(this.ref);

    node.parameters.forEach(param => {
      this.parameters[param.key] = { ...param, value: null };
      const simplifiedKey = this.getSimplifiedKey(param.key);
      this.keyMap[simplifiedKey] = param.key;
    });

    if (node.position) {
      this.position = node.position;
    }
  }

  setChainId(value: number): void {
    this.setParameter('chainId', value);
  }

  setContractAddress(value: string): void {
    this.setParameter('contractAddress', value);
  }

  setParams(key: string, value: any): void {
    const fullKey = this.parameters[`abiParams.${key}`] ? `abiParams.${key}` : key;
    this.setParameter(fullKey, value);
  }

  setPosition(x: number, y: number): void {
    this.position = { x, y };
  }

  getRef(): string {
    return this.ref;
  }

  protected setParameter(key: string, value: any): void {
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
      ref: this.ref,
      type: this.class,
      parameters: this.getParameters(),
    };
    if (this.position) {
      json.position = this.position;
    }
    return json;
  }

  private getSimplifiedKey(key: string): string {
    return key.replace(/[.\[\]]/g, '_');
  }
}
