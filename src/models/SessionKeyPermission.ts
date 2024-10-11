import { CHAINS } from "../constants/chains.js";
import { getToken, getTokenFromSymbol } from "../constants/tokens.js";
import { Parameter } from "./Parameter.js";

export class SessionKeyPermission {
  approvedTargets: string[];
  label: string[];
  labelNotAuthorized: string[];

  constructor({
    approvedTargets = [],
    label = [],
    labelNotAuthorized = [],
  }: {
    approvedTargets?: string[];
    label?: string[];
    labelNotAuthorized?: string[];
  } = {}) {
    this.approvedTargets = approvedTargets;
    this.label = label;
    this.labelNotAuthorized = labelNotAuthorized;
  }

  fill(key: string, value: any): void {
    // Escape special regex characters in the key
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\[\]]/g, '\\$&');
    const placeholder = new RegExp(`{{${escapedKey}}}`, 'g');

    // Function to replace placeholders in a target string
    const replacePlaceholder = (target: string) => target.replace(placeholder, value);

    // Apply the placeholder replacement logic
    this.approvedTargets = this.approvedTargets.map(replacePlaceholder);
    this.label = this.label.map(replacePlaceholder);
    this.labelNotAuthorized = this.labelNotAuthorized.map(replacePlaceholder);
  }


  /**
   * Fill placeholders using variables returned by the 'before' string execution.
   * @param beforeCode - A string representing the 'before' logic to execute.
   */
  async fillBeforeVariables(
    beforeCode: string,
    parameters: { [key: string]: any }
  ): Promise<void> {
    try {
      // Prepare the otomatoSdk object with required functions
      const otomatoSdk = {
        getToken,
        getTokenFromSymbol,
        CHAINS
        // Include any other functions you need from otomato-sdk
      };

      // Prepare the environment with parameters and otomatoSdk
      const env = { parameters, otomatoSdk };

      // Replace the dynamic import in beforeCode
      const beforeCodeUpdated = beforeCode.replace(
        /const\s+otomatoSdk\s*=\s*await\s*import\(['"]otomato-sdk['"]\);/,
        'const otomatoSdk = env.otomatoSdk;'
      );

      // Wrap the beforeCode in an async function and immediately invoke it
      const asyncBeforeFn = new Function(
        'env',
        `
        return (async function() {
          return await (${beforeCodeUpdated})(env);
        })();
      `
      );

      // Execute the async function and await the result
      const beforeResult = await asyncBeforeFn(env);

      // Replace placeholders like {{before.variableName}} with the corresponding values
      if (beforeResult && typeof beforeResult === 'object') {
        Object.keys(beforeResult).forEach((key) => {
          this.fill(`before.${key}`, beforeResult[key]);
        });
      } else {
        console.error("Before function did not return an object:", beforeResult);
      }
    } catch (error) {
      console.error("Error executing before code:", error);
    }
  }



  // The rest of your existing code
  fillParameters(params: { [key: string]: any }): void {
    // Helper to handle the replacement in case of arrays
    const fillArray = (key: string, array: any[]) => {
      array.forEach((item, index) => {
        if (typeof item === 'string') {
          this.fill(`${key}[${index}]`, item);
        }
      });
    };

    // 1. Replace non-ABI params
    for (let key in params) {
      if (key !== 'abi') {
        if (Array.isArray(params[key])) {
          fillArray(`parameters.${key}`, params[key]);
        } else {
          this.fill(`parameters.${key}`, params[key]);
        }
      }
    }

    // 2. Replace ABI params
    const abiParams = params.abi?.parameters;
    for (let key in abiParams) {
      if (Array.isArray(abiParams[key])) {
        fillArray(`parameters.abi.parameters.${key}`, abiParams[key]);
      } else {
        this.fill(`parameters.abi.parameters.${key}`, abiParams[key]);
      }
    }
  }

  async fillMethod(): Promise<void> {
    const executeMethod = async (target: string): Promise<string> => {
      const methodPattern = /\{\{(\w+)\(([^)]+)\)\}\}/g;

      // Find all matches of the pattern in the target string
      const matches = [...target.matchAll(methodPattern)];

      // Process each match asynchronously
      for (const match of matches) {
        const [fullMatch, methodName, params] = match;
        const paramList = params.split(',').map((param: string) => param.trim());

        let replacement: string | undefined;

        switch (methodName) {
          case 'tokenSymbol': {
            const [chainId, address] = paramList;
            const token = await getToken(parseInt(chainId, 10), address);
            replacement = token ? token.symbol : fullMatch;
            break;
          }
          case 'otherTokenSymbol': {
            const [chainId, address] = paramList;
            const symbol = await getDifferentToken(parseInt(chainId, 10), address);
            replacement = symbol;
            break;
          }
          // Add other methods here as needed
          default:
            replacement = fullMatch; // If no method matches, leave it unchanged
        }

        // Replace the matched pattern with the resolved value
        target = target.replace(fullMatch, replacement || fullMatch);
      }

      return target;
    };

    // Apply executeMethod asynchronously to approvedTargets, label, and labelNotAuthorized
    this.approvedTargets = await Promise.all(this.approvedTargets.map(executeMethod));
    this.label = await Promise.all(this.label.map(executeMethod));
    this.labelNotAuthorized = await Promise.all(this.labelNotAuthorized.map(executeMethod));
  }

  toJSON(): { [key: string]: any } {
    const containsPlaceholder = this.approvedTargets.some(target => target.includes('$'));

    if (containsPlaceholder) {
      throw new Error('Approved targets contain unresolved placeholders.');
    }

    return {
      approvedTargets: this.approvedTargets,
      label: this.label,
      labelNotAuthorized: this.labelNotAuthorized,
    };
  }

  static fromJSON(json: { [key: string]: any }): SessionKeyPermission {
    if (!json || !Array.isArray(json.approvedTargets)) {
      console.error('Invalid JSON object for SessionKeyPermission:', json);
      throw new Error('Invalid JSON object for SessionKeyPermission');
    }
    return new SessionKeyPermission(json);
  }

  merge(other: SessionKeyPermission): void {
    // Merge approvedTargets
    const uniqueTargets = new Set(this.approvedTargets);
    other.approvedTargets.forEach(target => uniqueTargets.add(target));
    this.approvedTargets = Array.from(uniqueTargets);

    // Merge labels
    const uniqueLabels = new Set(this.label);
    other.label.forEach(lbl => uniqueLabels.add(lbl));
    this.label = Array.from(uniqueLabels);

    // Merge labelNotAuthorized
    const uniqueLabelsNotAuthorized = new Set(this.labelNotAuthorized);
    other.labelNotAuthorized.forEach(lbl => uniqueLabelsNotAuthorized.add(lbl));
    this.labelNotAuthorized = Array.from(uniqueLabelsNotAuthorized);

    // Remove labels from labelNotAuthorized if they are present in label
    this.labelNotAuthorized = this.labelNotAuthorized.filter(lbl => !this.label.includes(lbl));
  }
}

// Helper function to get a different token
const getDifferentToken = async (chain: number, contractAddress: string) => {
  const tokenSymbol = (await getToken(chain, contractAddress))?.symbol;
  if (!tokenSymbol || tokenSymbol !== 'WETH') return 'WETH';
  return 'USDT';
};