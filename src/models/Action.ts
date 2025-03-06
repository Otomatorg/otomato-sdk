import { Parameter } from './Parameter.js';
import { Node, ParentInfo, Position, NodeState } from './Node.js';
import { ACTIONS } from '../constants/Blocks.js';
import { ethers } from 'ethers';
import { typeIsNumber } from '../utils/typeValidator.js';

export class Action extends Node {
  constructor(action: { blockId: number; name: string; description: string; parameters: Parameter[], output?: { [key: string]: string }, image: string, ref?: string, position?: Position, parentInfo?: ParentInfo, state?: NodeState, frontendHelpers?: Record<string, any> }) {
    super({
      ...action,
      class: 'action',
      parentInfo: findActionByBlockId(action.blockId).parentInfo,
      frontendHelpers: action.frontendHelpers || {}
    });
  }

  static async fromJSON(json: { [key: string]: any }): Promise<Action> {
    const enriched = findActionByBlockId(json.blockId);

    const action = new Action({
      ...enriched.block,
      ref: json.ref,
      position: json.position,
      parentInfo: enriched.parentInfo,
      state: json.state,
    });

    for (const [key, value] of Object.entries(json.parameters)) {
      if (!value) {
        continue;
      }

      switch (key) {
        case 'chainId':
          action.setChainId(value as number);
          break;
        case 'contractAddress':
          action.setContractAddress(value as string);
          break;
        case 'abi':
          const abiParameters = (value as { parameters: { [key: string]: any } }).parameters;
          for (const abiKey in abiParameters) {
            const enrichedParameter = enriched.block.parameters.find((param: Parameter) => param.key === `abiParams.${abiKey}`);
            const paramType = enrichedParameter ? enrichedParameter.type : null;

            if (!abiParameters[abiKey] || !paramType)
              continue;

            if (typeIsNumber(paramType) && typeof abiParameters[abiKey] === 'string' && abiParameters[abiKey].endsWith('n')) {
              action.setParams(abiKey, BigInt(abiParameters[abiKey].slice(0, -1)));
            } else {
              action.setParams(abiKey, abiParameters[abiKey]);
            }
          }
          break;
        default:
          action.setParams(key, value);
          break;
      }
    }

    action.setId(json.id);
    return action;
  }
}

export const findActionByBlockId = (blockId: number): { parentInfo: ParentInfo; block: any } => {
  for (const category in ACTIONS) {
    for (const service in (ACTIONS as any)[category]) {
      for (const actionKey in (ACTIONS as any)[category][service]) {
        if ((ACTIONS as any)[category][service][actionKey].blockId === blockId) {
          return {
            parentInfo: {
              name: service,
              description: (ACTIONS as any)[category][service].description,
              image: (ACTIONS as any)[category][service].image,
              functionName: actionKey
            },
            block: (ACTIONS as any)[category][service][actionKey],
          };
        }
      }
    }
  }
  throw new Error(`Action with id ${blockId} not found`);
};