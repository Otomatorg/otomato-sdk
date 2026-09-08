import { expect } from 'chai';
// Imported from the modules directly rather than through ../src/index.js: the barrel pulls in
// the 30MB generated Blocks.ts, which ts-node cannot compile in reasonable time.
import { CHAINS } from '../src/constants/chains.js';
import { CHAIN_ID_TO_LLAMA_SLUG, getTokenPrice, getTokenPrices } from '../src/utils/helpers.js';

/**
 * #3032 — api.odos.xyz was shut down on 2026-07-30 and now serves a Cloudflare
 * HTML error page (HTTP 530). The old helpers called `.json()` on it, so every
 * price lookup threw `Unexpected token '<', "<!doctype "...` into its caller.
 *
 * These cases pin the replacement: DeFi Llama as the source, li.quest as the
 * HyperEVM fallback, and — the part that actually bit us — a dead upstream
 * degrading to `null` instead of throwing.
 *
 * These helpers are stateless by design: the SDK is a public npm package with no
 * Redis, and a process-local cache would be per-instance. Redis caching lives in
 * sharedlibs `WalletService.getCachedPrice`. Each case still uses its own fake
 * addresses so intent stays readable.
 */

const realFetch = globalThis.fetch;
let calls: string[] = [];

/** Address generator: distinct per case, so the 60s cache can't leak across tests. */
const addr = (n: number) => `0x${n.toString(16).padStart(40, '0')}`;

const llamaBody = (entries: Record<string, any>) => ({ coins: entries });

const stubFetch = (handler: (url: string) => any) => {
  calls = [];
  (globalThis as any).fetch = async (url: any) => {
    calls.push(String(url));
    return handler(String(url));
  };
};

const jsonResponse = (body: any) => ({ ok: true, status: 200, json: async () => body });

/** The exact shape api.odos.xyz serves today: HTTP 530 + an HTML error page. */
const cloudflareErrorPage = () => ({
  ok: false,
  status: 530,
  json: async () => {
    throw new SyntaxError(`Unexpected token '<', "<!doctype "... is not valid JSON`);
  },
});

afterEach(() => {
  (globalThis as any).fetch = realFetch;
});

describe('#3032 getTokenPrice — DeFi Llama replaces api.odos.xyz', () => {
  it('never contacts api.odos.xyz', async () => {
    stubFetch(() => jsonResponse(llamaBody({ [`base:${addr(0x101)}`]: { symbol: 'X', decimals: 18, price: 3 } })));
    await getTokenPrice(CHAINS.BASE, addr(0x101));
    expect(calls.length).to.be.greaterThan(0);
    expect(calls.some((u) => u.includes('odos'))).to.equal(false);
    expect(calls[0]).to.include('coins.llama.fi/prices/current/');
  });

  it('prices a Base reward token (the Merkl case)', async () => {
    stubFetch(() => jsonResponse(llamaBody({ [`base:${addr(0x102)}`]: { symbol: 'MORPHO', decimals: 18, price: 2.5083 } })));
    expect(await getTokenPrice(CHAINS.BASE, addr(0x102))).to.equal(2.5083);
  });

  it('returns null — not a thrown parse error — when the upstream serves an HTML error page', async () => {
    stubFetch(() => cloudflareErrorPage());
    expect(await getTokenPrice(CHAINS.BASE, addr(0x103))).to.equal(null);
  });

  it('returns null when the upstream is unreachable', async () => {
    stubFetch(() => {
      throw new TypeError('fetch failed');
    });
    expect(await getTokenPrice(CHAINS.ETHEREUM, addr(0x104))).to.equal(null);
  });

  it('returns null for a token the upstream does not know', async () => {
    stubFetch(() => jsonResponse(llamaBody({})));
    expect(await getTokenPrice(CHAINS.BASE, addr(0x105))).to.equal(null);
  });

  it('returns null without any request for a chain with no DeFi Llama slug', async () => {
    stubFetch(() => jsonResponse(llamaBody({})));
    expect(await getTokenPrice(123456789, addr(0x106))).to.equal(null);
    expect(calls).to.deep.equal([]);
  });

  it('ignores a zero or non-numeric price', async () => {
    stubFetch(() =>
      jsonResponse(
        llamaBody({
          [`base:${addr(0x107)}`]: { symbol: 'ZERO', decimals: 18, price: 0 },
          [`base:${addr(0x108)}`]: { symbol: 'NAN', decimals: 18, price: 'n/a' },
        }),
      ),
    );
    expect(await getTokenPrice(CHAINS.BASE, addr(0x107))).to.equal(null);
    expect(await getTokenPrice(CHAINS.BASE, addr(0x108))).to.equal(null);
  });

  it('is stateless — a repeat lookup issues a fresh request (caching lives in sharedlibs Redis)', async () => {
    stubFetch(() => jsonResponse(llamaBody({ [`base:${addr(0x109)}`]: { symbol: 'C', decimals: 18, price: 7 } })));
    expect(await getTokenPrice(CHAINS.BASE, addr(0x109))).to.equal(7);
    const after = calls.length;
    expect(await getTokenPrice(CHAINS.BASE, addr(0x109))).to.equal(7);
    expect(calls.length, 'the SDK must not hold a process-local cache').to.be.greaterThan(after);
  });
});

describe('#3032 getTokenPrices — batched, and no longer empty off HyperEVM', () => {
  it('prices many tokens on a non-999 chain in ONE request', async () => {
    const tokens = [addr(0x201), addr(0x202), addr(0x203)];
    stubFetch(() =>
      jsonResponse(
        llamaBody(Object.fromEntries(tokens.map((t, i) => [`base:${t}`, { symbol: `T${i}`, decimals: 18, price: i + 1 }]))),
      ),
    );
    const prices = await getTokenPrices(CHAINS.BASE, tokens);
    expect(calls.length).to.equal(1);
    expect(prices.map((p) => p.priceUSD)).to.deep.equal([1, 2, 3]);
    expect(prices.map((p) => p.contractAddress)).to.deep.equal(tokens);
    expect(prices[0]).to.include.keys('contractAddress', 'symbol', 'decimals', 'priceUSD');
  });

  it('omits unresolved tokens and keeps the caller order for the rest', async () => {
    const tokens = [addr(0x211), addr(0x212), addr(0x213)];
    stubFetch(() =>
      jsonResponse(
        llamaBody({
          [`base:${tokens[0]}`]: { symbol: 'A', decimals: 6, price: 1 },
          [`base:${tokens[2]}`]: { symbol: 'C', decimals: 8, price: 3 },
        }),
      ),
    );
    const prices = await getTokenPrices(CHAINS.BASE, tokens);
    expect(prices.map((p) => p.contractAddress)).to.deep.equal([tokens[0], tokens[2]]);
    expect(prices.map((p) => p.decimals)).to.deep.equal([6, 8]);
  });

  it('chunks a long list into several requests', async () => {
    const tokens = Array.from({ length: 45 }, (_, i) => addr(0x300 + i));
    stubFetch((url) => {
      const asked = url.split('/prices/current/')[1].split(',');
      return jsonResponse(llamaBody(Object.fromEntries(asked.map((k) => [k, { symbol: 'B', decimals: 18, price: 1 }]))));
    });
    const prices = await getTokenPrices(CHAINS.BASE, tokens);
    expect(calls.length).to.equal(2);
    expect(prices.length).to.equal(45);
  });

  it('returns an empty array, never throws, when the upstream is dead', async () => {
    stubFetch(() => cloudflareErrorPage());
    expect(await getTokenPrices(CHAINS.BASE, [addr(0x401), addr(0x402)])).to.deep.equal([]);
  });
});

describe('#3032 HyperEVM keeps its li.quest fallback', () => {
  it('falls back to li.quest for a token DeFi Llama does not price', async () => {
    const token = addr(0x501);
    stubFetch((url) => {
      if (url.includes('coins.llama.fi')) return jsonResponse(llamaBody({}));
      return jsonResponse({ tokens: { 999: [{ address: token, symbol: 'LONGTAIL', decimals: 18, priceUSD: '4.2' }] } });
    });
    expect(await getTokenPrice(CHAINS.HYPER_EVM, token)).to.equal(4.2);
    expect(calls.some((u) => u.includes('li.quest'))).to.equal(true);
  });

  it('does not call li.quest when DeFi Llama already priced the token', async () => {
    const token = addr(0x502);
    stubFetch((url) => {
      if (url.includes('coins.llama.fi'))
        return jsonResponse(llamaBody({ [`hyperliquid:${token}`]: { symbol: 'WHYPE', decimals: 18, price: 81.75 } }));
      return jsonResponse({ tokens: { 999: [] } });
    });
    expect(await getTokenPrice(CHAINS.HYPER_EVM, token)).to.equal(81.75);
    expect(calls.some((u) => u.includes('li.quest'))).to.equal(false);
  });

  it('does not fall back to li.quest on other chains', async () => {
    stubFetch(() => jsonResponse(llamaBody({})));
    expect(await getTokenPrice(CHAINS.BASE, addr(0x503))).to.equal(null);
    expect(calls.some((u) => u.includes('li.quest'))).to.equal(false);
  });
});

describe('#3032 native-token sentinels', () => {
  // The SDK's own TOKENS list uses 0x0000..0 as the native-token address on most chains.
  // Odos never priced it; DeFi Llama resolves it (and 0xEeEe..eE) to the chain's gas token,
  // so a native-balance alert can be priced for the first time.
  it('prices the zero address as the chain native token', async () => {
    stubFetch(() =>
      jsonResponse(llamaBody({ ['base:0x0000000000000000000000000000000000000000']: { symbol: 'ETH', decimals: 18, price: 2403.25 } })),
    );
    expect(await getTokenPrice(CHAINS.BASE, '0x0000000000000000000000000000000000000000')).to.equal(2403.25);
  });

  it('live: the zero address prices above zero on Base', async () => {
    const price = await getTokenPrice(CHAINS.BASE, '0x0000000000000000000000000000000000000000');
    expect(price as number).to.be.greaterThan(0);
  });
});

describe('#3032 chain coverage', () => {
  it('maps every chain in CHAINS except ALL to a DeFi Llama slug', () => {
    const unmapped = Object.entries(CHAINS)
      .filter(([name, id]) => name !== 'ALL' && !CHAIN_ID_TO_LLAMA_SLUG[id as number])
      .map(([name]) => name);
    expect(unmapped, `unmapped chains: ${unmapped.join(', ')}`).to.deep.equal([]);
  });
});

describe('#3032 live smoke (hits coins.llama.fi)', () => {
  it('prices WETH on Base above zero', async () => {
    const price = await getTokenPrice(CHAINS.BASE, '0x4200000000000000000000000000000000000006');
    expect(price).to.be.a('number');
    expect(price as number).to.be.greaterThan(0);
  });

  it('prices the three HyperEVM stablecoins the depeg block watches', async () => {
    const prices = await getTokenPrices(CHAINS.HYPER_EVM, [
      '0xb88339CB7199b77E23DB6E890353E22632Ba630f',
      '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
      '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb',
    ]);
    expect(prices.length).to.equal(3);
    for (const p of prices) expect(p.priceUSD).to.be.closeTo(1, 0.05);
  });
});
