import { Node, ParentInfo, Position, NodeState } from './Node.js';
import { Parameter } from './Parameter.js';
import { TRIGGERS } from '../constants/Blocks.js';
import { ethers } from 'ethers';
import { typeIsNumber } from '../utils/typeValidator.js';

export class Trigger extends Node {
  type: number;

  constructor(trigger: { blockId: number; name: string; description: string; type: number; parameters: Parameter[], image: string, ref?: string, position?: Position, parentInfo?: ParentInfo, state?: NodeState }) {
    super({ ...trigger, class: 'trigger', parentInfo: findTriggerByBlockId(trigger.blockId).parentInfo });
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

  static async fromJSON(json: { [key: string]: any }): Promise<Trigger> {
    const enriched = findTriggerByBlockId(json.blockId);

    const trigger = new Trigger({
      ...enriched.block,
      ref: json.ref,
      position: json.position,
      parentInfo: enriched.parentInfo,
      state: json.state
    });

    for (const [key, value] of Object.entries(json.parameters)) {

      if (!value) {
        continue;
      }

      switch (key) {
        case 'chainId':
          trigger.setChainId(value as number);
          break;
        case 'contractAddress':
          trigger.setContractAddress(value as string);
          break;
        case 'condition':
          trigger.setCondition(value as string);
          break;
        case 'comparisonValue':
          trigger.setComparisonValue(value as number);
          break;
        case 'abi':
          const abiParameters = (value as { parameters: { [key: string]: any } }).parameters;
          for (const abiKey in abiParameters) {
            const enrichedParameter = enriched.block.parameters.find((param: Parameter) => param.key === `abiParams.${abiKey}`);
            const paramType = enrichedParameter ? enrichedParameter.type : null;

            if (!abiParameters[abiKey] || !paramType)
              continue;

            if (typeIsNumber(paramType) && typeof abiParameters[abiKey] === 'string' && abiParameters[abiKey].endsWith('n')) {
              trigger.setParams(abiKey, BigInt(abiParameters[abiKey].slice(0, -1)));
            } else {
              trigger.setParams(abiKey, abiParameters[abiKey]);
            }

          }
          break;
        default:
          trigger.setParams(key, value);
          break;
      }

    }

    trigger.setId(json.id);
    return trigger;
  }
}

// Assuming findTriggerByBlockId function is defined as mentioned
export const findTriggerByBlockId = (blockId: number): { parentInfo: ParentInfo; block: any } => {
  for (const category in TRIGGERS) {
    for (const service in (TRIGGERS as any)[category]) {
      for (const triggerKey in (TRIGGERS as any)[category][service]) {
        if ((TRIGGERS as any)[category][service][triggerKey].blockId === blockId) {
          return {
            parentInfo: {
              name: service,
              description: (TRIGGERS as any)[category][service].description,
              image: (TRIGGERS as any)[category][service].image,
            },
            block: (TRIGGERS as any)[category][service][triggerKey],
          };
        }
      }
    }
  }
  throw new Error(`Trigger with id ${blockId} not found`);
};