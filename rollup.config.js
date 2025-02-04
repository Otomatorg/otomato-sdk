// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default {
  input: 'dist/src/index.js', // your entry point
  output: {
    file: 'dist/bundled/otomato-sdk.esm.js', // you might choose an ESM build or UMD, see below
    format: 'esm', // or 'umd' if you prefer (but note the differences in import style)
  },
  plugins: [
    polyfillNode(),
    resolve({
      browser: true,       // ensure we resolve browser-compatible versions
      preferBuiltins: false // do not prefer Node built-ins; use polyfills instead
    }),
    commonjs(),
    json()
  ]
};