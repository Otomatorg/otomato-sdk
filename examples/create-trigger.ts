import { TRIGGERS, getToken, CHAINS, Trigger } from '../src/index.js';



const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);

transferTrigger.setChainId(CHAINS.ETHEREUM);
// transferTrigger.setParams("value", 1000);
transferTrigger.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
transferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);

console.log(JSON.stringify(transferTrigger.toJSON(), null, 2));
