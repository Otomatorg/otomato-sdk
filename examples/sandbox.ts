import { TRIGGERS, getToken, CHAINS, Trigger } from '../src/index.js';

const trigger = new Trigger(TRIGGERS.PRICE_ACTION.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);

trigger.setChainId(CHAINS.MODE);
trigger.setComparisonValue(3200);
trigger.setCondition("gte");
trigger.setParams('currency', 'USD');
trigger.setPosition(1, 0);

console.log(trigger.toJSON());