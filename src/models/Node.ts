import { Parameter } from './Parameter.js';
import { validateType, typeIsNumber, isVariable, typeIsInteger, typeIsFloat } from '../utils/typeValidator.js';
import { ACTIONS, TRIGGERS } from '../constants/Blocks.js';
import { apiServices } from '../services/ApiService.js';

export interface Position {
  x: number;
  y: number;
}

export interface ParentInfo {
  name: string;
  description: string;
  image: string;
  functionName?: string;
}

export type NodeState = 'inactive' | 'active' | 'failed' | 'completed';

let nodeCounter = 0;
const generatedRefs = new Set<string>();

export abstract class Node {
  id: string | null = null;
  blockId: number;
  name: string;
  description: string;
  parameters: { [key: string]: Parameter };
  outputs: { [key: string]: string };
  keyMap: { [key: string]: string };
  position?: Position;
  ref: string;
  class: string;
  image: string;
  parentInfo?: ParentInfo;
  state: NodeState;
  frontendHelpers: Record<string, any>; // New field for frontendHelpers

  constructor(node: { blockId: number; name: string; description: string; parameters: Parameter[], output?: { [key: string]: string }, ref?: string, position?: Position, class: string; image: string; parentInfo?: ParentInfo, state?: NodeState, frontendHelpers?: Record<string, any> }) {
    this.id = null;
    this.blockId = node.blockId;
    this.name = node.name;
    this.description = node.description;
    this.image = node.image;
    this.parameters = {};
    this.outputs = node.output || {};
    this.keyMap = {};
    this.class = node.class;
    this.parentInfo = node.parentInfo;
    this.state = node.state || 'inactive';
    this.frontendHelpers = node.frontendHelpers || {};

    if (node.ref) {
      this.ref = node.ref;
    } else {
      this.ref = `${++nodeCounter}`;
      while (generatedRefs.has(this.ref)) {
        this.ref = `${++nodeCounter}`;
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

  setId(id: string): void {
    this.id = id;
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

  setRef(ref: string): void {
    this.ref = ref;
  }

  getParentInfo(): ParentInfo | undefined {
    return this.parentInfo;
  }

  getState(): NodeState {
    return this.state;
  }

  protected setParameter(key: string, value: any): void {
    if (key in this.parameters) {
      const param = this.parameters[key];
      try {
        // BigInt conversion
        if (typeIsNumber(param.type) && typeof value === 'string' && value.endsWith('n')) {
          value = BigInt(value.substring(0, value.length - 1));
        }

        // String to integer conversion
        if (typeIsInteger(param.type) && typeof value === 'string') {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            value = parsedValue;
          }
        }

        if (typeIsFloat(param.type) && typeof value === 'string') {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            value = parsedValue;
          }
        }

      } catch (e) {
        // console.error(`Error processing parameter ${key}:`, e);
      }

      // Validate the value type
      if (validateType(param.type, value)) {
        this.parameters[key].value = value;
      } else if (value === undefined || value === null || value === "") {
        this.parameters[key].value = null;
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
      if (key.startsWith('abiParams.')) {
        const abiKey = key.replace('abiParams.', '');
        if (!acc.abi) {
          acc.abi = { parameters: {} };
        }
        acc.abi.parameters[abiKey] = this.parameters[key].value;
      } else {
        acc[key] = this.parameters[key].value;
      }
      return acc;
    }, {} as { [key: string]: any });
  }

  getOutputs(): { [key: string]: string } {
    return this.outputs;
  }

  getOutputVariableName(outputKey: string): string {
    return `{{nodeMap.${this.getRef()}.output.${outputKey}}}`;
  }

  getParameterVariableName(parameterKey: string): string {
    const parameters = this.getParameters();

    if (parameters.abi && parameters.abi.parameters && parameters.abi.parameters.hasOwnProperty(parameterKey)) {
      // If the key is inside abi.parameters, format accordingly
      return `{{nodeMap.${this.getRef()}.parameters.abi.parameters.${parameterKey}}}`;
    } else {
      // If the key is not inside abi.parameters, use the default format
      return `{{nodeMap.${this.getRef()}.parameters.${parameterKey}}}`;
    }
  }

  toJSON(): { [key: string]: any } {
    const serializeBigInt = (key: string, value: any): any => {
      if (typeof value === 'bigint') {
        return value.toString() + 'n';
      } else if (Array.isArray(value)) {
        // Handle arrays by mapping over each element
        return value.map((item) => serializeBigInt('', item));
      } else if (typeof value === 'object' && value !== null) {
        // Recursively handle objects
        return Object.entries(value).reduce((acc, [k, v]) => {
          acc[k] = serializeBigInt(k, v);
          return acc;
        }, {} as { [key: string]: any });
      } else {
        return value;
      }
    };

    const json: { [key: string]: any } = {
      id: this.id,
      ref: this.ref,
      blockId: this.blockId,
      type: this.class,
      state: this.state,
      parameters: {
        ...this.getParameters(),
      },
      frontendHelpers: this.frontendHelpers
    };
    if (this.position) {
      json.position = this.position;
    }
    return JSON.parse(JSON.stringify(json, serializeBigInt));
  }

  async delete(): Promise<{ success: boolean; error?: string }> {
    if (!this.id) {
      throw new Error('Cannot delete a node without an ID.');
    }
    try {
      const response = await apiServices.delete(`/nodes/${this.id}`);
      if (response.status === 204) {
        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Unknown error' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  async update(): Promise<{ success: boolean; error?: string }> {
    if (!this.id) {
      throw new Error('Cannot update a node without an ID.');
    }
    try {
      const response = await apiServices.patch(`/nodes/${this.id}`, this.toJSON());
      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false, error: response.data?.error || 'Unknown error' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Unknown error' };
    }
  }

  private getSimplifiedKey(key: string): string {
    return key.replace(/[.\[\]]/g, '_');
  }

  static async fromJSON(json: { [key: string]: any }): Promise<Node> {
    switch (json.type) {
      case 'trigger': {
        const { Trigger } = await import('./Trigger.js');
        return Trigger.fromJSON(json);
      }
      case 'action': {
        const { Action } = await import('./Action.js');
        return Action.fromJSON(json);
      }
      default:
        throw new Error(`Unsupported type: ${json.type}`);
    }
  }
}