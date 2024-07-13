// Assuming you have the ACTIONS constant defined as you provided

import { Parameter } from './Parameter.js';
import { validateType } from '../utils/typeValidator.js';
import { ACTIONS, TRIGGERS } from '../constants/Blocks.js';

export interface Position {
  x: number;
  y: number;
}

let nodeCounter = 0;
const generatedRefs = new Set<string>();

export class Node {
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

  constructor(node: { blockId: number; name: string; description: string; parameters: Parameter[], ref?: string, position?: Position, class: string; image: string }) {
    this.id = null;
    this.blockId = node.blockId;
    this.name = node.name;
    this.description = node.description;
    this.image = node.image;
    this.parameters = {};
    this.keyMap = {};
    this.class = node.class;
    
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

  toJSON(): { [key: string]: any } {
    const json: { [key: string]: any } = {
      id: this.id,
      ref: this.ref,
      blockId: this.blockId,
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

  static fromJSON(json: { [key: string]: any }): Node {

    let enriched = findActionByBlockId(json.blockId);
    if (!enriched) 
      enriched = findTriggerByBlockId(json.blockId);
    if (!enriched)
      enriched = {name: "Unknown", description: "Unknown", image: "Unknown"}

    const parameters = Object.keys(json.parameters).map(key => ({
      key,
      type: typeof json.parameters[key], // Assuming type can be derived from the value's type
      description: '', // Add appropriate description if needed
      value: json.parameters[key]
    }));
    const node = new Node({
      blockId: json.blockId,
      name: enriched.name,
      description: enriched.description,
      image: enriched.image,
      parameters,
      ref: json.ref,
      position: json.position,
      class: json.type
    });
    node.setId(json.id);
    return node;
  }
}

const findActionByBlockId = (blockId: number): { name: string; description: string; image: string } | null => {
  for (const category in ACTIONS) {
    for (const service in (ACTIONS as any)[category]) {
      for (const actionKey in (ACTIONS as any)[category][service]) {
        if ((ACTIONS as any)[category][service][actionKey].blockId === blockId) {
          return {
            name: (ACTIONS as any)[category][service][actionKey].name,
            description: (ACTIONS as any)[category][service][actionKey].description,
            image: (ACTIONS as any)[category][service][actionKey].image,
          };
        }
      }
    }
  }
  return null;
};

const findTriggerByBlockId = (blockId: number): { name: string; description: string; image: string } | null => {
  for (const category in TRIGGERS) {
    for (const service in (TRIGGERS as any)[category]) {
      for (const triggerKey in (TRIGGERS as any)[category][service]) {
        if ((TRIGGERS as any)[category][service][triggerKey].blockId === blockId) {
          return {
            name: (TRIGGERS as any)[category][service][triggerKey].name,
            description: (TRIGGERS as any)[category][service][triggerKey].description,
            image: (TRIGGERS as any)[category][service][triggerKey].image,
          };
        }
      }
    }
  }
  return null;
};