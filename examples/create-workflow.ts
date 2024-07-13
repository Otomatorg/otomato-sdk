import { ACTIONS, Action, TRIGGERS, Trigger, Workflow, CHAINS, getToken, Edge, apiServices } from '../src/index.js';

const main = async () => {

    apiServices.setCookie("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDdjRUI4ZDgxNDdBYWE5ZEI4MUFjQkRGRTVjMzA1MERGQ2ZGMTg1MzciLCJzdWIiOiIweDg3RkU4YjRmMkZlODM3MGY2Y0M5YTk2MzQ0MmYwN0IwMmY0OTA5QTciLCJhdWQiOiJvdG9tYXRvLXRlc3QubmV0bGlmeS5hcHAiLCJleHAiOjE3MjMzODMxOTksIm5iZiI6MTcyMDc4OTM5OSwiaWF0IjoxNzIwNzkxMTk5LCJqdGkiOiIweDY4ZDkxOWEyMGZiYjIyNDUwZDZmOTFjMzM2ZTBmYjBjMmYyYTc3MmU3Zjg4NWU1ZjRmNzg1NTM2ZGIyYTY5YTAiLCJjdHgiOnt9fQ.MHgyOTM1NTM3MWYwOWM1YzllNWE3YjI4MjVkZTNjMDljZTkwMTQ3OTQwZmU1ZWRlMjM5YTk0MmFjYTQ5YTcwZWI0MGJlNmJiZDk2MDA4ZTIxMzJmNGM3ZTVlZGIzZDZiZjYyMDE4Mzc1MzUwMTRmNTc0ODM0ZDk4YWU3NDQwNDQzOTFi");

    const usdcTransferTrigger = new Trigger({
        blockId: TRIGGERS.TOKENS.ERC20.TRANSFER.blockId,
        name: TRIGGERS.TOKENS.ERC20.TRANSFER.name,
        description: TRIGGERS.TOKENS.ERC20.TRANSFER.description,
        type: TRIGGERS.TOKENS.ERC20.TRANSFER.type,
        parameters: TRIGGERS.TOKENS.ERC20.TRANSFER.parameters,
        image: TRIGGERS.TOKENS.ERC20.TRANSFER.image,
        ref: 'n-1',
    });
    usdcTransferTrigger.setChainId(CHAINS.ETHEREUM);
    usdcTransferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC').contractAddress);
    usdcTransferTrigger.setPosition(0, 0);

    const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
    slackAction.setParams("webhook", "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX");
    slackAction.setParams("message", "USDC has been transferred!");
    slackAction.setPosition(0, -10);

    const workflow = new Workflow("USDC Transfer Notification", [usdcTransferTrigger, slackAction]);

    const edge = new Edge({
        source: usdcTransferTrigger,
        target: slackAction,
    });

    workflow.addEdge(edge);
    const res = await workflow.create();
    console.log(res);
    console.log(`Workflow ID: ${workflow.id}`);  // This will print the ID of the created workflow
    workflow.nodes.forEach(node => {
        console.log(`Node ${node.getRef()} ID: ${node.id}`);
    });
}

main();
