import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits } from '../src/index.js';
import dotenv from 'dotenv';
dotenv.config();

const main = async () => {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    
    const trigger = new Trigger(TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3000);
    trigger.setCondition('lte');
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    trigger.setPosition(400, 120);

    const odosAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
    odosAction.setChainId(CHAINS.MODE);
    odosAction.setParams("tokenIn", getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    odosAction.setParams("tokenOut", getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    odosAction.setParams("amount", 100);
    odosAction.setParams("slippage", 1);
    odosAction.setPosition(400, 240);

    /*const transferAction = new Action(ACTIONS.TOKENS.TRANSFER.TRANSFER);
    transferAction.setChainId(CHAINS.ETHEREUM);
    transferAction.setParams("value", 1000);
    transferAction.setParams("to", "0x888888888889758f76e7103c6cbf23abbf58f946");
    transferAction.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);*/
  
    const workflow = new Workflow("Odos swap if eth < 3000$", [trigger, odosAction]);

    const edge = new Edge({
        source: trigger,
        target: odosAction,
    });

    workflow.addEdge(edge);

    console.log(JSON.stringify(workflow.toJSON()))

    const creationResult = await workflow.create();
    console.log(workflow.getState());

    if (!creationResult.success) {
        throw new Error("An error occurred when publishing the workflow")
    }

    console.log(workflow.id);

    const runResult = await workflow.run();
    console.log(workflow.getState());

    if (!runResult.success) {
        throw new Error("An error occurred when running the workflow")
    }

    console.log(`Workflow ${workflow.id} is running`);
    console.log(workflow.getState());
}

main();