export class SessionKeyPermission {
  approvedTargets: string[];

  constructor(approvedTargets: string[] = []) {
    if (!Array.isArray(approvedTargets)) {
      console.error('approvedTargets should be an array. Received:', approvedTargets);
      approvedTargets = [];
    }
    this.approvedTargets = approvedTargets;
  }

  fill(key: string, value: any): void {
    if (!Array.isArray(this.approvedTargets)) {
      console.error('approvedTargets is not an array. Cannot call map on:', this.approvedTargets);
      return;
    }
    
    this.approvedTargets = this.approvedTargets.map(target => {
      const placeholder = `$${key}`;
      if (typeof target === 'string' && target.includes(placeholder)) {
        target = target.replace(placeholder, value);
      }
      return target;
    });
  }

  toJSON(): { [key: string]: any } {
    const containsPlaceholder = this.approvedTargets.some(target => typeof target === 'string' && target.includes('$'));
    
    if (containsPlaceholder) {
      throw new Error('Approved targets contain unresolved placeholders.');
    }
    
    return {
      approvedTargets: this.approvedTargets,
    };
  }

  static fromJSON(json: { [key: string]: any }): SessionKeyPermission {
    if (!json || !Array.isArray(json.approvedTargets)) {
      console.error('Invalid JSON object for SessionKeyPermission:', json);
      throw new Error('Invalid JSON object for SessionKeyPermission');
    }
    return new SessionKeyPermission(json.approvedTargets);
  }

  merge(other: SessionKeyPermission): void {
    if (!other || !Array.isArray(other.approvedTargets)) {
      console.error('Invalid SessionKeyPermission object to merge:', other);
      return;
    }
    
    const uniqueTargets = new Set(this.approvedTargets);
    other.approvedTargets.forEach(target => uniqueTargets.add(target));
    
    this.approvedTargets = Array.from(uniqueTargets);
  }
}