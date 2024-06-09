import { TRIGGERS, TOKENS, CHAINS, Trigger } from '../src/index';



const transferTrigger = new Trigger(TRIGGERS.ERC20.TRANSFER);

transferTrigger.setChainId(CHAINS.ETHEREUM);
// transferTrigger.setParams("value", 1000);
// transferTrigger.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
transferTrigger.setContractAddress(TOKENS.ETHEREUM.USDC);

console.log(transferTrigger.toJSON());