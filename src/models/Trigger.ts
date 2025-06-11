import { Node, ParentInfo, Position, NodeState } from './Node.js';
import { Parameter } from './Parameter.js';
import { TRIGGERS } from '../constants/Blocks.js';
import { ethers } from 'ethers';
import { typeIsNumber } from '../utils/typeValidator.js';

export class Trigger extends Node {
  type: number;

  constructor(trigger: { blockId: number; name: string; description: string; type: number; parameters: Parameter[], output?: { [key: string]: string }, image: string, ref?: string, position?: Position, parentInfo?: ParentInfo, state?: NodeState, frontendHelpers?: Record<string, any> }) {
    super({ 
      ...trigger, 
      class: 'trigger', 
      parentInfo: findTriggerByBlockId(trigger.blockId).parentInfo, 
      frontendHelpers: trigger.frontendHelpers || {} // Pass frontendHelpers
    });
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

  setComparisonValue(value: number | string): void {
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
      state: json.state,
    });

    for (const [key, value] of Object.entries(json.parameters)) {

      if (value === undefined || value === null) {
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
          trigger.setComparisonValue(value as number | string);
          break;
        case 'abi':
          const abiParameters = (value as { parameters: { [key: string]: any } }).parameters;
          for (const abiKey in abiParameters) {
            const enrichedParameter = enriched.block.parameters.find((param: Parameter) => param.key === `abiParams.${abiKey}`);
            const paramType = enrichedParameter ? enrichedParameter.type : null;

            if (abiParameters[abiKey] === undefined || abiParameters[abiKey] === null || paramType === null)
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
              functionName: triggerKey
            },
            block: (TRIGGERS as any)[category][service][triggerKey],
          };
        }
      }
    }
  }
  throw new Error(`Trigger with id ${blockId} not found`);
};

/**
 * Searches through the TRIGGERS object to find a sub-object 
 * whose `prototype` property matches `prototypeToMatch`.
 *
 * @param prototypeToMatch - The prototype string to find (e.g. "priceMovementAgainstCurrency").
 * @returns An object of shape { [blockKey]: any } if found, otherwise null.
 */
export function findBlockByPrototype(
  prototypeToMatch: string
): { [blockKey: string]: any } | null {
  // Top-level keys are categories like "CORE", "TOKENS", "YIELD", etc.
  for (const categoryKey in TRIGGERS) {
    const category = (TRIGGERS as any )[categoryKey];

    // Each category may have multiple blocks: e.g. "EVERY_PERIOD", "TRANSFER", "BALANCE", etc.
    for (const blockKey in category) {
      const blockValue = category[blockKey];

      // If blockValue is not an object, skip it (it might be `description`, `image`, etc.)
      if (typeof blockValue !== 'object' || blockValue === null) {
        continue;
      }

      // Inside each block, we often see an object with the same name:
      // e.g. category["TRANSFER"]["TRANSFER"]
      // We iterate all keys inside blockValue to find the actual block that has `prototype`.
      for (const subKey in blockValue) {
        const subValue = blockValue[subKey];

        if (
          typeof subValue === 'object' &&
          subValue !== null &&
          subValue.prototype === prototypeToMatch
        ) {
          // Return the found block in the shape { [subKey]: subValue }
          return subValue;
        }
      }
    }
  }

  // If we never find a matching prototype, return null
  return null;
}