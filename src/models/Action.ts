import { Parameter } from './Parameter.js';
import { Node, ParentInfo, Position, NodeState } from './Node.js';
import { ACTIONS } from '../constants/Blocks.js';
import { ethers } from 'ethers';
import { typeIsNumber } from '../utils/typeValidator.js';
import { SessionKeyPermission } from './SessionKeyPermission.js';

export class Action extends Node {
  constructor(action: { blockId: number; name: string; description: string; parameters: Parameter[], output?: { [key: string]: string }, image: string, ref?: string, position?: Position, parentInfo?: ParentInfo, state?: NodeState }) {
    super({ ...action, class: 'action', parentInfo: findActionByBlockId(action.blockId).parentInfo });
  }

  async getSessionKeyPermissions() {
    const parentBlock = findActionByBlockId(this.blockId).block;
    if (!parentBlock.permissions) return null;

    const permissions = SessionKeyPermission.fromJSON(parentBlock.permissions);
    permissions.fillParameters(this.getParameters());
    await permissions.fillMethod();

    // Handle 'before' code for the main action
    if (parentBlock.before) {
      await permissions.fillBeforeVariables(parentBlock.before, this.getParameters());
    }

    // Handle batchWith: for any batched actions, merge their permissions
    if (parentBlock.batchWith && parentBlock.batchWith.length > 0) {
      for (const batch of parentBlock.batchWith) {
        const batchedAction = findActionByBlockId(batch.id).block;

        if (batchedAction.permissions) {
          const batchedActionInstance = new Action(batchedAction);

          // Replace placeholders in parameters
          const resolvedBatchParams = batch.parameters;
          Object.keys(resolvedBatchParams).forEach(key => {
            // If it's an ABI parameter, handle it separately
            if (key === 'abi' && resolvedBatchParams.abi?.parameters) {
              Object.keys(resolvedBatchParams.abi.parameters).forEach(abiKey => {
                const abiValue = this.replaceVariables(resolvedBatchParams.abi.parameters[abiKey]);
                batchedActionInstance.setParams(`${abiKey}`, abiValue);
              });
            } else {
              let value = this.replaceVariables(resolvedBatchParams[key]);
              batchedActionInstance.setParams(key, value);
            }
          });

          // Get batched permissions
          const batchedPermissions = await batchedActionInstance.getSessionKeyPermissions();

          if (!batchedPermissions)
            continue;

          batchedPermissions.fillParameters(batch.parameters);  // Pass batched action parameters
          await batchedPermissions.fillMethod();

          // Handle 'before' code for the batched action
          if (batchedAction.before) {
            await batchedPermissions.fillBeforeVariables(batchedAction.before, batch.parameters);
          }

          // Merge the batched action's permissions with the main action's permissions
          permissions.merge(batchedPermissions);
        }
      }
    }

    return permissions;
  }

  /**
   * Replace any placeholders like {{parameters.tokenToDeposit}} with actual values
   * from the parameters of the current action. Supports both strings and arrays.
   */
  replaceVariables(value: any): any {
    if (typeof value === 'string') {
      return value.replace(/\{\{parameters\.(.*?)\}\}/g, (_, key) => {
        return this.getParameter(key) || '';
      });
    }

    if (Array.isArray(value)) {
      return value.map(item => this.replaceVariables(item));  // Recursively handle each array element
    }

    // Return the value unchanged if it's neither a string nor an array
    return value;
  }

  static async fromJSON(json: { [key: string]: any }): Promise<Action> {
    const enriched = findActionByBlockId(json.blockId);

    const action = new Action({
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
            },
            block: (ACTIONS as any)[category][service][actionKey],
          };
        }
      }
    }
  }
  throw new Error(`Action with id ${blockId} not found`);
};