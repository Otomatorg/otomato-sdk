import { findBlockByPrototype } from "../models/Trigger";

export function getExternalVariable(prototype: String, args: Array<any>) {
    return `{{external.functions.${prototype}(${args})}}`;
};

/**
 * Creates a string of the form:
 * {{external.functions.[prototype](param1,param2,...)}}
 * 
 * - It looks up the parameter definitions for the given prototype.
 * - For each parameter definition (in order), it finds a matching user parameter by key.
 * - If not found, uses the parameter's default `value` if it exists, otherwise an empty placeholder.
 * - Removes any trailing empty placeholders, but preserves empty placeholders in the middle.
 */
export function getExternalVariableFromParameters(
    prototype: string,
    parameters: Array<{ key: string; value: any }>
  ): string {
    // 1. Find the block in TRIGGERS
    const block = findBlockByPrototype(prototype);
    if (!block) {
      // If we can't find the block definition, just call with user-supplied parameters
      return `{{external.functions.${prototype}(${parameters.map((p) => p.value).join(",")})}}`;
    }
  
    // 2. Grab the ordered list of parameter definitions
    const blockParams: Array<{ key: string; value?: any }> = block.parameters || [];
  
    // 3. Build an array of final values in the same order as blockParams
    const finalValues: string[] = blockParams.map((bp) => {
      // 3a. Find a matching user parameter by exact key
      const userParam = parameters.find((up) => up.key === bp.key);
  
      if (userParam) {
        // Use the user-supplied value
        return userParam.value?.toString() ?? "";
      } else if (bp.value != null) {
        // Use the block's default value, if defined
        return bp.value?.toString() ?? "";
      } else {
        // No user-supplied or default => empty placeholder
        return "";
      }
    });
  
    // 4. Remove trailing empty placeholders (e.g., `,,` at the end)
    while (finalValues.length && finalValues[finalValues.length - 1] === "") {
      finalValues.pop();
    }
  
    // 5. Join with commas to preserve empty slots in the middle
    const paramString = finalValues.join(",");
  
    return `{{external.functions.${prototype}(${paramString})}}`;
  }