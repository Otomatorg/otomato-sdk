import { TRIGGERS, getToken, CHAINS, Trigger, getTokenFromSymbol, convertToTokenUnits } from '../src/index.js';


const main = async () => {

    const transferTrigger = new Trigger(TRIGGERS.TOKENS.TRANSFER.TRANSFER);

    const contractAddr = getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress;
    console.log(contractAddr);

    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("value", await convertToTokenUnits(1, CHAINS.ETHEREUM, contractAddr));
    transferTrigger.setParams("to", "0x888888888889758f76e7103c6cbf23abbf58f946");
    transferTrigger.setContractAddress(contractAddr);

    console.log(JSON.stringify(transferTrigger.toJSON()));

    transferTrigger.setParams("to", "");

    console.log(JSON.stringify(transferTrigger.toJSON()));
}

const main2 = async () => {

    const transferTrigger = new Trigger(TRIGGERS.DEXES.ODOS.SWAP);

    const contractAddr = getTokenFromSymbol(CHAINS.MODE, 'USDC').contractAddress;
    console.log(contractAddr);

    transferTrigger.setChainId(CHAINS.ETHEREUM);
    transferTrigger.setParams("sender", "0x888888888889758f76e7103c6cbf23abbf58f946");

    console.log(JSON.stringify(transferTrigger.toJSON()));

    transferTrigger.setParams("sender", "");

    console.log(JSON.stringify(transferTrigger.toJSON()));
}

main2();
