import { TRIGGERS } from "../constants/Blocks";
import { findBlockByPrototype } from "../models/Trigger";

export function getExternalVariable(prototype: String, args: Array<any>) {
    return `{{external.functions.${prototype}(${args})}}`;
};

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
    const blockParams: Array<{ key: string }> = block.parameters || [];
  
    // 3. Build an array of final values in the same order as blockParams
    const finalValues: string[] = blockParams.map((bp) => {
      // Find a matching user parameter by exact key
      const userParam = parameters.find((up) => up.key === bp.key);
      if (!userParam) {
        // no user param => empty placeholder
        return "";
      }
      // Return user-supplied value as string
      return userParam.value?.toString() ?? "";
    });
  
    // 4. Remove trailing empty placeholders
    while (finalValues.length && finalValues[finalValues.length - 1] === "") {
      finalValues.pop();
    }
  
    // 5. Join with commas to preserve empty slots in the middle
    const paramString = finalValues.join(",");
  
    return `{{external.functions.${prototype}(${paramString})}}`;
  }