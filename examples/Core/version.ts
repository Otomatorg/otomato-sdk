import { SDK_VERSION, compareVersions } from '../../src/index.js';

console.log(compareVersions(SDK_VERSION, '1000.1.1'))
console.log(compareVersions(SDK_VERSION, '1.6.10'))
console.log(compareVersions(SDK_VERSION, '1.5.0'))
console.log(compareVersions(SDK_VERSION, '1.5.69'))