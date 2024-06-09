import { Parameter } from './Parameter';
import { ethers } from 'ethers';

export class Trigger {
  id: number;
  name: string;
  description: string;
  parameters: { [key: string]: Parameter };
  keyMap: { [key: string]: string };

  constructor(trigger: { id: number; name: string; description: string; parameters: Parameter[] }) {
    this.id = trigger.id;
    this.name = trigger.name;
    this.description = trigger.description;
    this.parameters = {};
    this.keyMap = {};
    trigger.parameters.forEach(param => {
      this.parameters[param.key] = { ...param, value: null };
      const simplifiedKey = this.getSimplifiedKey(param.key);
      this.keyMap[simplifiedKey] = param.key;
    });
  }

  setChainId(value: number): void {
    this.setParameter("chainid", value);
  }

  setContractAddress(value: string): void {
    this.setParameter("contractAddress", value);
  }

  setParams(key: string, value: any): void {
    const fullKey = `abiParams.${key}`;
    if (fullKey in this.parameters) {
      this.setParameter(fullKey, value);
    } else {
      throw new Error(`Parameter with simplified key ${key} not found in abiParams`);
    }
  }

  private setParameter(key: string, value: any): void {
    if (key in this.parameters) {
      const param = this.parameters[key];
      if (this.validateType(param.type, value)) {
        this.parameters[key].value = value;
      } else {
        throw new Error(`Invalid type for parameter ${key}. Expected ${param.type}.`);
      }
    } else {
      throw new Error(`Parameter with key ${key} not found`);
    }
  }

  private validateType(expectedType: string, value: any): boolean {
    switch (expectedType) {
      case 'int':
        return Number.isInteger(value);
      case 'uint256':
      case 'int256':
        return Number.isInteger(value); // For simplicity, we're treating int256 and uint256 similarly here
      case 'address':
        return typeof value === 'string' && this.isAddress(value);
      case 'float':
        return typeof value === 'number';
      default:
        return false;
    }
  }

  private isAddress(value: string): boolean {
    return ethers.isAddress(value);
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
    return {
      id: this.id,
      parameters: this.getParameters(),
    };
  }

  private getSimplifiedKey(key: string): string {
    return key.replace(/[.\[\]]/g, '_');
  }
}