import { getToken } from "../constants/tokens.js";

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
    const replacePlaceholder = (target: string) => {
      const placeholder = `$${key}`;
      if (target.includes(placeholder)) {
        return target.replace(placeholder, value);
      }
      return target;
    };

    this.approvedTargets = this.approvedTargets.map(replacePlaceholder);
    this.label = this.label.map(replacePlaceholder);
    this.labelNotAuthorized = this.labelNotAuthorized.map(replacePlaceholder);
  }

  fillMethod(): void {
    const executeMethod = (target: string) => {
      const methodPattern = /\$(\w+)\(([^)]+)\)/g;
      return target.replace(methodPattern, (match, methodName, params) => {
        const paramList = params.split(',').map((param: string) => param.trim());

        switch (methodName) {
          case 'tokenSymbol': {
            const [chainId, address] = paramList;
            const token = getToken(parseInt(chainId, 10), address);
            return token ? token.symbol : match;
          }
          case 'otherTokenSymbol': {
            const [chainId, address] = paramList;
            const symbol = getDifferentToken(parseInt(chainId, 10), address);
            return symbol;
          }
          // Add other methods here as needed
          default:
            return match;
        }
      });
    };

    this.approvedTargets = this.approvedTargets.map(executeMethod);
    this.label = this.label.map(executeMethod);
    this.labelNotAuthorized = this.labelNotAuthorized.map(executeMethod);
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

const getDifferentToken = (chain: number, contractAddress: string) => {
  const tokenSymbol = getToken(chain, contractAddress)?.symbol;
  if (!tokenSymbol || tokenSymbol !== 'WETH')
    return 'WETH';
  return 'USDT';
}