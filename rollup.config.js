// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'dist/src/index.js', // your compiled SDK entry point
  output: {
    file: 'dist/bundled/otomato-sdk.umd.js',
    format: 'umd',
    name: 'OtomatoSDK',
    // If you see warnings about "this" being undefined and your dependencies rely on a non-strict global,
    // you can set the context to 'this'. Uncomment the line below if needed:
    // context: 'this',
  },
  // Set the overall context for modules (if your dependencies require a non-strict "this")
  // context: 'this',
  plugins: [
    resolve(),  // Resolves node_modules packages
    commonjs(), // Converts CommonJS modules to ES modules
    json()      // Allows Rollup to import JSON files
  ]
};