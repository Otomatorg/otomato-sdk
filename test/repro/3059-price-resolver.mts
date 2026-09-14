/**
 * otomato-dapp#3059 — the injected price resolver, exercised directly against
 * `src/utils/helpers.ts`.
 *
 * Why not a mocha spec: this package does not import on master. `WorkflowTemplates.ts`
 * dereferences `TRIGGERS.LENDING.MORPHO.MARKET_UTILIZATION`, which `Blocks.ts` does not
 * carry, so any suite that loads the SDK entrypoint dies with
 * `Cannot read properties of undefined (reading 'blockId')` at WorkflowTemplates.ts:2108
 * — verified on a clean origin/master with this change stashed. Importing the helpers
 * module on its own sidesteps that and still runs the real code.
 *
 *   npx tsx test/repro/3059-price-resolver.mts
 */
import { getTokenPrice, hasPriceResolver, setPriceResolver } from '../../src/utils/helpers.js';

let failed = 0;
const check = (name: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n        expected ${JSON.stringify(expected)}\n        actual   ${JSON.stringify(actual)}`}`);
};

console.log('#3059 SDK injected price resolver\n');

check('absent by default — third parties are unaffected', hasPriceResolver(), false);

setPriceResolver(async () => 2493.73);
check('installed', hasPriceResolver(), true);
check('answers from the resolver, no network', await getTokenPrice(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'), 2493.73);

const seen: Array<[number, string]> = [];
setPriceResolver(async (c, a) => { seen.push([c, a]); return 1; });
await getTokenPrice(8453, '0xabc');
check('receives the chainId and address asked for', seen, [[8453, '0xabc']]);

setPriceResolver(async () => { throw new Error('registry down'); });
let threw = false;
await getTokenPrice(999, '0x5555555555555555555555555555555555555555').catch(() => { threw = true; });
check('a throwing resolver never breaks the lookup', threw, false);

setPriceResolver(async () => 0);
threw = false;
await getTokenPrice(999, '0x5555555555555555555555555555555555555555').catch(() => { threw = true; });
check('a non-positive answer defers instead of being used', threw, false);

setPriceResolver(null);
check('can be uninstalled', hasPriceResolver(), false);

console.log(`\n${failed === 0 ? 'ALL PASS' : `${failed} FAILED`} — 7 assertions`);
process.exit(failed === 0 ? 0 : 1);
