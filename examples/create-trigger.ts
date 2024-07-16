import { TRIGGERS, getToken, CHAINS, Trigger, getTokenFromSymbol, convertToTokenUnits } from '../src/index.js';


const main = async () => {

    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);

    const contractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;
    console.log(contractAddr);

    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", await convertToTokenUnits(1, CHAINS.ETHEREUM, contractAddr));
    transferTrigger.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
    transferTrigger.setContractAddress(contractAddr);

    console.log(transferTrigger.toJSON());
}

main();
