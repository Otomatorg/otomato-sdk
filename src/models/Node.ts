import { Parameter } from './Parameter.js';
import { validateType } from '../utils/typeValidator.js';
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
  keyMap: { [key: string]: string };
  position?: Position;
  ref: string;
  class: string;
  image: string;
  parentInfo?: ParentInfo;
  state: NodeState;

  constructor(node: { blockId: number; name: string; description: string; parameters: Parameter[], ref?: string, position?: Position, class: string; image: string; parentInfo?: ParentInfo, state?: NodeState }) {
    this.id = null;
    this.blockId = node.blockId;
    this.name = node.name;
    this.description = node.description;
    this.image = node.image;
    this.parameters = {};
    this.keyMap = {};
    this.class = node.class;
    this.parentInfo = node.parentInfo;
    this.state = node.state || 'inactive';

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

  getParentInfo(): ParentInfo | undefined {
    return this.parentInfo;
  }

  getState(): NodeState {
    return this.state;
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

  getStaticParameters(): { [key: string]: any } | null {
    return null;
  }

  toJSON(): { [key: string]: any } {
    const serializeBigInt = (key: string, value: any) => {
      if (typeof value === 'bigint') {
        return value.toString() + 'n';
      } else if (typeof value === 'object' && value !== null) {
        // Recursively call serializeBigInt for nested objects
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
      console.log(this.id);
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