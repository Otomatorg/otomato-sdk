import { TRIGGERS, getToken, CHAINS, Trigger, getTokenFromSymbol, convertToTokenUnits } from '../src/index.js';


const main = async () => {

    const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);

    const contractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;
    console.log(contractAddr);

    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", await convertToTokenUnits(1, CHAINS.ETHEREUM, contractAddr));
    transferTrigger.setParams("to", "0x888888888889758f76e7103c6cbf23abbf58f946");
    transferTrigger.setContractAddress(contractAddr);

    console.log(JSON.stringify(transferTrigger.toJSON()));
}

main();
