
/**
 * Returns the trigger constant string for a given blockId.
 * @param blockId The block id to look up.
 * @returns The trigger constant string, or undefined if not found.
 */

import { ACTIONS, TRIGGERS } from "../constants/Blocks.js";

/**
 * Converts a string to camelCase
 * @param str The string to convert
 * @returns The camelCase string
 */
const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

/**
 * Formats a parameter value for code output
 * @param value The parameter value to format
 * @param nodeRefToName Mapping of node references to node names
 * @returns The formatted value as a string
 */
const formatParameterValue = (value: any, nodeRefToName: Record<string, string>): string => {
  if (value === null) {
    return 'null';
  } else if (value === undefined) {
    return 'undefined';
  } else if (typeof value === 'string') {
    // Check if it contains nodeMap references and convert them to getOutput calls
    if (value.includes('{{nodeMap.')) {
      return convertNodeMapToGetOutput(value, nodeRefToName);
    }
    // Escape single quotes in the string
    const escapedValue = value.replace(/'/g, "\\'");
    return `'${escapedValue}'`;
  } else if (typeof value === 'number') {
    return String(value);
  } else if (typeof value === 'boolean') {
    return String(value);
  } else if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  } else {
    return String(value);
  }
};

/**
 * Converts nodeMap references to getOutput calls
 * @param value The string containing nodeMap references
 * @param nodeRefToName Mapping of node references to node names
 * @returns The converted string with getOutput calls
 */
const convertNodeMapToGetOutput = (value: string, nodeRefToName: Record<string, string>): string => {
  // Replace {{nodeMap.X.output.property}} with ${nodeName.getOutputVariableName('property')}
  const converted = value.replace(/\{\{nodeMap\.(\d+)\.output\.(\w+)\}\}/g, (match, nodeRef, outputProperty) => {
    const nodeName = nodeRefToName[nodeRef];
    if (nodeName) {
      return `\${${nodeName}.getOutputVariableName('${outputProperty}')}`;
    }
    // Fallback if node name not found
    return `\${getNodeByRef('${nodeRef}').getOutputVariableName('${outputProperty}')}`;
  });
  
  // If the string contains getOutput calls, wrap it in template literal
  if (converted.includes('.getOutputVariableName(')) {
    return `\`${converted}\``;
  }
  
  return `'${converted}'`;
};

/**
 * Returns the trigger or action constant string for a given blockId.
 * Searches both TRIGGERS and ACTIONS.
 * @param blockId The block id to look up.
 * @returns The trigger or action constant string, or undefined if not found.
 */
export const getBlockConstantByBlockId = (blockId: number): string | undefined => {
  /**
   * Recursively searches an object for a blockId and returns the path as a string.
   * @param obj The object to search.
   * @param path The current path in the object.
   * @returns The path string if found, otherwise undefined.
   */
  const searchBlocks = (obj: Record<string, unknown>, path: string[] = []): string | undefined => {
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const value = obj[key];
      if (value && typeof value === 'object') {
        if ('blockId' in value && (value as { blockId: number }).blockId === blockId) {
          return [...path, key].join('.');
        }
        const found = searchBlocks(value as Record<string, unknown>, [...path, key]);
        if (found) return found;
      }
    }
    return undefined;
  };

  // Search in TRIGGERS first
  const foundTriggerPath = searchBlocks(TRIGGERS as Record<string, unknown>);
  if (foundTriggerPath) {
    return 'TRIGGERS.' + foundTriggerPath.toUpperCase();
  }

  // If not found in TRIGGERS, search in ACTIONS
  const foundActionPath = searchBlocks(ACTIONS as Record<string, unknown>);
  if (foundActionPath) {
    return 'ACTIONS.' + foundActionPath.toUpperCase();
  }

  return undefined;
};

/**
 * Converts a workflow JSON object back to its representative code.
 * 
 * @param wfJson The workflow JSON object
 * @returns The workflow code as a string
 */
export const convertWFJSONToCode = (wfJson: any): string => {
  const nodes = wfJson.nodes;
  const edges = wfJson.edges;
  const settings = wfJson.settings;

  let code = '';
  const nodeRefToName: Record<string, string> = {};

  // Generate imports
  code += `import { Workflow, Edge, Trigger, Action } from './models';\n`;
  code += `import { TRIGGERS, ACTIONS } from './constants/Blocks';\n`;
  code += `import { WORKFLOW_LOOPING_TYPES } from './constants/WorkflowSettings';\n\n`;

  // Generate node instantiations
  for (const node of nodes) {
    const blockConstant = getBlockConstantByBlockId(node.blockId);
    
    if (!blockConstant) {
      throw new Error(`Block constant not found for blockId: ${node.blockId}`);
    }

    // Extract the class name from the block constant and create a better name
    const blockPath = blockConstant.split('.');
    const blockName = blockPath[blockPath.length - 1];
    
    // Create a more descriptive name based on the block path
    let nodeName: string;
    if (node.type === 'trigger') {
      // For triggers: protocol + blockName + Trigger
      const protocol = blockPath[1]?.toLowerCase() || '';
      const subProtocol = blockPath[2]?.toLowerCase() || '';
      const cleanBlockName = blockName.toLowerCase();
      
      // Create proper camelCase name with better structure
      const baseName = toCamelCase(`${subProtocol}_${cleanBlockName}`); //${protocol}_
      nodeName = `${baseName}Trigger`;
    } else if (node.type === 'action') {
      // For actions: protocol + blockName + Action
      const protocol = blockPath[1]?.toLowerCase() || '';
      const subProtocol = blockPath[2]?.toLowerCase() || '';
      const cleanBlockName = blockName.toLowerCase();
      
      // Create proper camelCase name with better structure
      const baseName = toCamelCase(`${subProtocol}_${cleanBlockName}`); //${protocol}_
      nodeName = `${baseName}Action`;
    } else {
      // Fallback to original naming
      nodeName = `${blockName.toLowerCase()}${node.ref}`;
    }
    
    // Store the mapping for later use
    nodeRefToName[node.ref] = nodeName;

    // Generate the node instantiation
    if (node.type === 'trigger') {
      code += `const ${nodeName} = new Trigger(TRIGGERS.${blockPath.slice(1).join('.')});\n`;
    } else if (node.type === 'action') {
      code += `const ${nodeName} = new Action(ACTIONS.${blockPath.slice(1).join('.')});\n`;
    }

    // Generate setParams code for each parameter
    for (const [paramKey, paramValue] of Object.entries(node.parameters)) {
      // Handle nested abi.parameters with abiParams prefix
      if (paramKey === 'abi' && typeof paramValue === 'object' && paramValue !== null) {
        const abiParams = (paramValue as any).parameters;
        if (abiParams && typeof abiParams === 'object') {
          for (const [abiParamKey, abiParamValue] of Object.entries(abiParams)) {
            const prefixedKey = `abiParams.${abiParamKey}`;
            const valueCode = formatParameterValue(abiParamValue, nodeRefToName);
            code += `${nodeName}.setParams('${prefixedKey}', ${valueCode});\n`;
          }
        }
      } else {
        // Handle normal parameters
        const valueCode = formatParameterValue(paramValue, nodeRefToName);
        code += `${nodeName}.setParams('${paramKey}', ${valueCode});\n`;
      }
    }

    // Generate setPosition code if position exists
    if (node.position && typeof node.position.x === 'number' && typeof node.position.y === 'number') {
      code += `${nodeName}.setPosition(${node.position.x}, ${node.position.y});\n`;
    }

    // Set ref and isOptional if present
    // if (node.ref) {
    //   code += `${nodeName}.setRef('${node.ref}');\n`;
    // }
    if (typeof node.isOptional === 'boolean') {
      code += `${nodeName}.setIsOptional(${node.isOptional});\n`;
    }
    
    code += '\n';
  }

  // Generate edge creations
  const edgeNames: string[] = [];
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const sourceName = nodeRefToName[edge.source];
    const targetName = nodeRefToName[edge.target];
    
    if (!sourceName || !targetName) {
      throw new Error(`Node reference not found for edge: ${edge.source} -> ${edge.target}`);
    }

    const edgeName = `edge${i + 1}`;
    edgeNames.push(edgeName);
    
    code += `const ${edgeName} = new Edge({ source: ${sourceName}, target: ${targetName} });\n`;
  }

  code += '\n';

  // Generate workflow creation
  const nodeNames = Object.values(nodeRefToName);
  const settingsCode = settings ? generateSettingsCode(settings) : 'null';
  
  code += `const workflow = new Workflow('${wfJson.name}', [${nodeNames.join(', ')}], [${edgeNames.join(', ')}], ${settingsCode});\n`;
  code += `\nreturn workflow;`;
  
  return code;
};

/**
 * Generates settings code for the workflow
 * @param settings The workflow settings object
 * @returns The settings code as a string
 */
const generateSettingsCode = (settings: any): string => {
  if (!settings) return 'null';
  
  let settingsCode = '{\n';
  
  if (settings.loopingType) {
    settingsCode += `  loopingType: WORKFLOW_LOOPING_TYPES.${settings.loopingType.toUpperCase()},\n`;
  }
  
  if (settings.period !== undefined) {
    settingsCode += `  period: ${settings.period},\n`;
  }
  
  if (settings.limit !== undefined) {
    settingsCode += `  limit: ${settings.limit},\n`;
  }
  
  if (settings.timeout !== undefined) {
    settingsCode += `  timeout: ${settings.timeout},\n`;
  }
  
  // Remove trailing comma and newline
  settingsCode = settingsCode.replace(/,\n$/, '\n');
  settingsCode += '}';
  
  return settingsCode;
};

// const jsonData = {
//   "id": "7c7ebd16-5079-41d1-83d1-9d3d0e661e71",
//   "name": "My new Agent 3",
//   "state": "inactive",
//   "dateCreated": "2025-09-09T08:48:04.510Z",
//   "dateModified": "2025-09-09T08:58:40.538Z",
//   "executionId": null,
//   "agentId": null,
//   "nodes": [
//     {
//       "id": "85adca53-5a19-46be-b7ac-c83632d70a3a",
//       "ref": "6",
//       "blockId": 35,
//       "type": "trigger",
//       "state": "inactive",
//       "isOptional": null,
//       "parameters": {
//         "contract": "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
//         "rarityCondition": "lte",
//         "rarity": 5000,
//         "price": 30,
//         "traits": "{\"Background\":[\"Blue\"],\"Body\":[\"Pineapple Suit\"]}"
//       },
//       "frontendHelpers": {},
//       "position": {
//         "x": 400,
//         "y": 120
//       }
//     },
//     {
//       "id": "092a2dde-7d4e-4104-9c66-8cd70d2b722f",
//       "ref": "10",
//       "blockId": 100018,
//       "type": "action",
//       "state": "inactive",
//       "isOptional": null,
//       "parameters": {
//         "protectedData": "0xa0745746a3e664540b79dae6992cfd8088a0926f",
//         "content": "A Pudgy Penguin has just been listed."
//       },
//       "frontendHelpers": {},
//       "position": {
//         "x": 400,
//         "y": 240
//       }
//     }
//   ],
//   "edges": [
//     {
//       "id": "47bf90ea-f255-4c32-84a6-17526ae28379",
//       "source": "6",
//       "target": "10"
//     }
//   ],
//   "notes": [],
//   "settings": null
// }

// console.log(convertWFJSONToCode(jsonData));
