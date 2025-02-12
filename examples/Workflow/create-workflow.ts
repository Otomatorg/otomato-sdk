import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getTokenFromSymbol, Edge, apiServices, convertToTokenUnits, convertToTokenUnitsFromSymbol } from '../../src/index.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

async function main() {
    if (!process.env.API_URL || !process.env.AUTH_TOKEN)
        return;

    apiServices.setUrl(process.env.API_URL);
    apiServices.setAuth(process.env.AUTH_TOKEN);    
    
    const trigger = new Trigger(TRIGGERS.TOKENS.PRICE.PRICE_MOVEMENT_AGAINST_CURRENCY);
    trigger.setChainId(CHAINS.MODE);
    trigger.setComparisonValue(3000);
    trigger.setCondition('lte');
    trigger.setParams('currency', 'USD');
    trigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    trigger.setPosition(400, 120);

    const odosAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
    odosAction.setChainId(CHAINS.MODE);
    odosAction.setParams("amount", await convertToTokenUnitsFromSymbol(1, CHAINS.MODE, 'USDT'));
    odosAction.setParams("tokenIn", getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
    odosAction.setParams("tokenOut", getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    odosAction.setPosition(400, 240);

    const ionicDeposit = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
    ionicDeposit.setChainId(CHAINS.MODE);
    ionicDeposit.setParams('tokenToDeposit', getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
    ionicDeposit.setParams('amount', odosAction.getOutputVariableName('amountOut'));
    ionicDeposit.setPosition(400, 360);

    const workflow = new Workflow("swap & deposit", [trigger, ionicDeposit, odosAction]);

    const edge = new Edge({
        source: trigger,
        target: odosAction,
    });
    const edge2 = new Edge({
        source: odosAction,
        target: ionicDeposit,
    });

    workflow.addEdge(edge);
    workflow.addEdge(edge2);

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
    } else {
        console.log('workflow is running');
    }
}

main();