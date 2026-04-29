import { TRIGGERS, Trigger, CHAINS, getTokenFromSymbol, apiServices, WORKFLOW_LOOPING_TYPES } from '../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SCRIPT block: take the AAVE USDC supply rate (Ethereum) and return it × 2.2.
 *
 * The AAVE LENDING_RATE trigger emits `lendingRate` (float, %).
 * We pass it into the SCRIPT node's parameters via the `{{nodeMap.<ref>.output.<key>}}`
 * template — the runtime resolves the templates before invoking the script,
 * so `env.parameters.rate` is already the numeric rate at execution time.
 *
 * Same caveats as the inline-script example apply (admin token required, raw JSON node).
 */

const SCRIPT_BLOCK_ID = 100037;

async function main() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
    throw new Error('API_URL and AUTH_TOKEN must be set in .env');
  }

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  const usdc = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;

  // Trigger: AAVE USDC lending rate on Ethereum, condition `gte 0` so it always fires.
  const trigger = new Trigger(TRIGGERS.LENDING.AAVE.LENDING_RATE);
  trigger.setChainId(CHAINS.ETHEREUM);
  trigger.setParams('asset', usdc);
  trigger.setParams('condition', 'gte');
  trigger.setParams('comparisonValue', 0);
  trigger.setPosition(200, 120);

  const scriptNode = {
    ref: 'script',
    blockId: SCRIPT_BLOCK_ID,
    type: 'action',
    parameters: {
      rate: trigger.getOutputVariableName('lendingRate'),
      multiplier: 2.2,
    },
    handler: `(env) => {
      const rate = parseFloat(env.parameters.rate);
      const multiplier = parseFloat(env.parameters.multiplier);
      return {
        aaveSupplyRate: rate,
        multiplier,
        result: rate * multiplier,
      };
    }`,
    position: { x: 200, y: 240 },
  };

  const payload = {
    name: 'SDK example: AAVE USDC supply rate × 2.2',
    nodes: [trigger.toJSON(), scriptNode],
    edges: [{ source: trigger.getRef(), target: scriptNode.ref }],
    settings: {
      loopingType: WORKFLOW_LOOPING_TYPES.SUBSCRIPTION,
      limit: 1,
      timeout: 60_000,
    },
  };

  const created = await apiServices.post('/workflows', payload);
  const workflowId = created.data.id;
  console.log('Workflow created:', workflowId);

  await apiServices.post(`/workflows/${workflowId}/run`, {});
  console.log('Workflow started. Polling for completion…');

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const wf = await apiServices.get(`/workflows/${workflowId}`);
    if (!wf.executionId) continue;
    const exec = await apiServices.get(`/executions/${wf.executionId}`);
    const scriptOutput = exec.workflow.nodes.find((n: any) => n.ref === 'script');
    if (scriptOutput?.state === 'completed') {
      console.log('Script output:', scriptOutput.output);
      return;
    }
    if (scriptOutput?.state === 'failed') {
      console.error('Script failed:', scriptOutput);
      return;
    }
  }
  console.warn('Timed out waiting for script to complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
