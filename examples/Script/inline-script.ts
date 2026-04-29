import { TRIGGERS, Trigger, apiServices, WORKFLOW_LOOPING_TYPES } from '../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * SCRIPT block (blockId 100037)
 *
 * The SCRIPT block runs an inline JavaScript function on the Otomato runtime.
 * The function receives `env` (with `parameters` and upstream node outputs)
 * and must return a JSON-serializable value, which becomes the node's output.
 *
 * Caveats today:
 *   - Only admin tokens (xtoken:...) can submit workflows containing this block;
 *     non-admin tokens are rejected by the BANNED_BLOCK_IDS check on the server.
 *   - The block is not yet exposed as a typed Action in the SDK
 *     (its `parameters` array is empty and the Action class does not surface
 *     the `handler` field). This example builds the node JSON directly and
 *     submits the workflow via `apiServices.post('/workflows', ...)`.
 */

const SCRIPT_BLOCK_ID = 100037;

async function main() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
    throw new Error('API_URL and AUTH_TOKEN must be set in .env');
  }

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  // 1) Trigger: every 24h, runs once. We use the SDK to build a valid trigger node.
  const trigger = new Trigger(TRIGGERS.CORE.EVERY_PERIOD.EVERY_PERIOD);
  trigger.setParams('period', 86_400_000);
  trigger.setParams('limit', 1);
  trigger.setPosition(200, 120);

  // 2) SCRIPT node — built as raw JSON (see caveats above).
  //    `handler` is the function the runtime will execute.
  //    `parameters` are passed in via `env.parameters`.
  const scriptNode = {
    ref: 'script',
    blockId: SCRIPT_BLOCK_ID,
    type: 'action',
    parameters: { greeting: 'hello from inline script' },
    handler: `(env) => {
      const { greeting } = env.parameters;
      return { ok: true, echoed: greeting, ranAt: new Date().toISOString() };
    }`,
    position: { x: 200, y: 240 },
  };

  const payload = {
    name: 'SDK example: SCRIPT block',
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

  // Poll the latest execution until both nodes are no longer pending.
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const wf = await apiServices.get(`/workflows/${workflowId}`);
    const execId = wf.executionId;
    if (!execId) continue;

    const exec = await apiServices.get(`/executions/${execId}`);
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
