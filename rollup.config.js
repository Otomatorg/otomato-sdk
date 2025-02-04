import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default {
  input: 'dist/src/index.js',
  output: {
    file: 'dist/bundled/otomato-sdk.esm.js',
    format: 'esm',
  },
  plugins: [
    polyfillNode(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      // Explicitly include dagre and other CJS modules
      include: /node_modules\/(dagre|graphlib|lodash)/,
      dynamicRequireTargets: [
        // List any specific dynamic requires if needed
        'node_modules/dagre/**/*.js'
      ],
    }),
    json()
  ]
};