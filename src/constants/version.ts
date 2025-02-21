export const SDK_VERSION = '2.0.88';

export function compareVersions(v1: string, v2: string): number {
    // Split the version strings into parts
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);

    // Determine the maximum length to compare all parts
    const len = Math.max(v1Parts.length, v2Parts.length);

    // Compare each part
    for (let i = 0; i < len; i++) {
        const v1Part = v1Parts[i] || 0; // Default to 0 if undefined
        const v2Part = v2Parts[i] || 0;

        if (v1Part > v2Part) return 1;  // v1 is greater
        if (v1Part < v2Part) return -1; // v2 is greater
        // If equal, continue to the next part
    }
    return 0; // Versions are equal
}
