import {
  ACTIONS,
  Action,
  TRIGGERS,
  Trigger,
  Workflow,
  Edge,
  CHAINS,
  ConditionGroup,
  LOGIC_OPERATORS,
  apiServices,
  getTokenFromSymbol,
} from '../../src/index.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * STRING_KEYWORD_DETECTION block (blockId 100048)
 *
 * Returns `{ matched: boolean, matchedKeyword: string }`. Returns `matched: true`
 * if the input string contains at least one of the provided keywords, and the
 * first keyword that hit. Case-insensitive by default; pass `caseSensitive: true`
 * to flip that.
 *
 * Inputs:
 *   - text          (string)              — the haystack
 *   - keywords      (string[])            — the needles to search for
 *   - caseSensitive (boolean, optional)   — defaults to false
 *
 * Outputs:
 *   - matched        (boolean)
 *   - matchedKeyword (string)             — the first keyword that hit (empty if none)
 *
 * This example wires it into a workflow that:
 *   1) AAVE USDC lending rate on Ethereum > 1% (trigger)
 *   2) Run STRING_KEYWORD_DETECTION on a chosen text against a list of keywords
 *   3) IF matched === true, send an email; otherwise, the workflow just stops.
 *
 * Run:
 *   API_URL=https://api.otomato.xyz/api \
 *   AUTH_TOKEN=<your-jwt-or-xtoken> \
 *   EMAIL_TO=you@example.com \
 *   npx tsx examples/Core/string-keyword-detection.ts
 *
 * Two-case validation:
 *   - text="hello world", keywords=["hello"]   → matched=true  → email sent
 *   - text="goodbye world", keywords=["hello"] → matched=false → email skipped
 */

async function main() {
  if (!process.env.API_URL || !process.env.AUTH_TOKEN) {
    throw new Error('API_URL and AUTH_TOKEN must be set in .env');
  }
  const emailTo = process.env.EMAIL_TO;
  if (!emailTo) {
    throw new Error('EMAIL_TO must be set in .env');
  }

  apiServices.setUrl(process.env.API_URL);
  apiServices.setAuth(process.env.AUTH_TOKEN);

  // Toggle these to see the email path vs the no-email path.
  const text = process.env.KEYWORD_TEXT ?? 'hello world';
  const keywords = (process.env.KEYWORD_LIST ?? 'hello,market').split(',').map((k) => k.trim());

  // 1) Trigger: AAVE USDC lending rate on Ethereum, fire when > 1%.
  const usdc = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC');
  const aaveTrigger = new Trigger(TRIGGERS.LENDING.AAVE.LENDING_RATE);
  aaveTrigger.setChainId(CHAINS.ETHEREUM);
  aaveTrigger.setParams('abiParams.asset', usdc.contractAddress);
  aaveTrigger.setParams('condition', 'gt');
  aaveTrigger.setParams('comparisonValue', 1);

  // 2) STRING_KEYWORD_DETECTION action.
  //    Set `text` to a literal or to an upstream output via getOutputVariableName().
  const keywordDetection = new Action(
    ACTIONS.CORE.STRING_KEYWORD_DETECTION.STRING_KEYWORD_DETECTION,
  );
  keywordDetection.setParams('text', text);
  keywordDetection.setParams('keywords', keywords);
  keywordDetection.setParams('caseSensitive', false);

  // 3) IF gate — only continue when matched === true.
  const matchedGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
  matchedGroup.addConditionCheck(
    keywordDetection.getOutputVariableName('matched'),
    'eq',
    'true',
  );
  const ifMatched = new Action(ACTIONS.CORE.CONDITION.IF);
  ifMatched.setParams('logic', LOGIC_OPERATORS.AND);
  ifMatched.setParams('groups', [matchedGroup]);

  // 4) Email — fired only on the IF's true branch.
  const email = new Action(ACTIONS.NOTIFICATIONS.EMAIL.SEND_EMAIL);
  email.setParams('to', emailTo);
  email.setParams('subject', `Keyword match: ${keywordDetection.getOutputVariableName('matchedKeyword')}`);
  email.setParams(
    'body',
    `Matched keyword "${keywordDetection.getOutputVariableName('matchedKeyword')}" in: ${text}`,
  );

  const workflow = new Workflow(
    'String Keyword Detection — example',
    [aaveTrigger, keywordDetection, ifMatched, email],
    [],
  );
  workflow.addEdge(new Edge({ source: aaveTrigger, target: keywordDetection }));
  workflow.addEdge(new Edge({ source: keywordDetection, target: ifMatched }));
  workflow.addEdge(new Edge({ source: ifMatched, target: email, label: 'true', value: 'true' }));

  const created = await workflow.create();
  if (!created.success) throw new Error('Failed to create workflow');
  console.log('Workflow created:', workflow.id);

  const ran = await workflow.run();
  if (!ran.success) throw new Error('Failed to run workflow');
  console.log('Workflow running. State:', workflow.getState());
  console.log(`Inspect: ${process.env.API_URL.replace(/\/api$/, '')}/agent/${workflow.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
