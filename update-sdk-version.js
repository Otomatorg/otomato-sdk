// update-sdk-version.js
const fs = require('fs');
const path = require('path');

// Read the version from package.json
const { version } = require('./package.json');

// Define the path to your sdk-version.js file
const sdkVersionPath = path.join(__dirname, 'sdk-version.js');

// Create the content to be written to sdk-version.js
const content = `export const SDK_VERSION = '${version}';\n`;

// Write the content to sdk-version.js
fs.writeFileSync(sdkVersionPath, content, 'utf8');

console.log(`SDK_VERSION updated to ${version}`);