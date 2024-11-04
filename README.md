# Otomato SDK

The Otomato SDK empowers users to automate any crypto related behavior. With its suite of intuitive automation tools, Otomato allows users to seamlessly respond to market dynamics while abstracting all the complexity.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Authentication](#authentication)
  - [Creating a Workflow](#creating-a-workflow)
  - [Running a Workflow](#running-a-workflow)
- [Core Concepts](#core-concepts)
  - [Workflow](#workflow)
  - [Node](#node)
  - [Trigger](#trigger)
  - [Action](#action)
  - [Edge](#edge)
- [Examples](#examples)
  - [Swap and Deposit Workflow](#swap-and-deposit-workflow)
  - [ETH Price Monitoring with Split Conditions](#eth-price-monitoring-with-split-conditions)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Automate Web3 Actions**: Create automated workflows to interact with smart contracts, perform token swaps, send notifications, and more.
- **Smart Account Integration**: Utilize Smart Accounts (ERC-4337) for secure and efficient automation.
- **Building Block System**: Combine triggers and actions to build complex strategies without writing low-level code.
- **Session Key Permissions**: Maintain control over your assets with explicit action authorizations.
- **Extensible Architecture**: Easily add new triggers, actions, and services.

## Installation

```bash
npm install otomato-sdk

## Getting Started

### Authentication

Before interacting with the Otomato SDK, you need to authenticate your account.

```js
import { apiServices, CHAINS } from 'otomato-sdk';

async function authenticate() {
  const address = 'YOUR_WALLET_ADDRESS';
  const chainId = CHAINS.ETHEREUM;
  const accessCode = 'YOUR_ACCESS_CODE';

  const loginPayload = await apiServices.generateLoginPayload(address, chainId, accessCode);
  const signature = 'SIGNATURE_OF_LOGIN_PAYLOAD';
  const { token } = await apiServices.getToken(loginPayload, signature);

  apiServices.setAuth(token);
}
```

### Creating a workflow

A Workflow is a collection of Nodes (Triggers and Actions) connected by Edges.

```js
import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS } from 'otomato-sdk';

// Initialize Trigger and Action nodes
const priceTrigger = new Trigger(TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
priceTrigger.setChainId(CHAINS.MODE);
priceTrigger.setComparisonValue(3000);
priceTrigger.setCondition('lte');
priceTrigger.setParams('currency', 'USD');
priceTrigger.setContractAddress('TOKEN_CONTRACT_ADDRESS');
priceTrigger.setPosition(0, 0);

const swapAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
swapAction.setChainId(CHAINS.MODE);
swapAction.setParams('amount', 'AMOUNT_IN_WEI');
swapAction.setParams('tokenIn', 'TOKEN_IN_CONTRACT_ADDRESS');
swapAction.setParams('tokenOut', 'TOKEN_OUT_CONTRACT_ADDRESS');
swapAction.setPosition(0, 100);

// Create Edges to connect Nodes
const edge = new Edge({ source: priceTrigger, target: swapAction });

// Create Workflow
const workflow = new Workflow('Swap on Price Trigger', [priceTrigger, swapAction], [edge]);
```

### Running a Workflow

```js
// Publish the Workflow
const creationResult = await workflow.create();

if (creationResult.success) {
  // Run the Workflow
  const runResult = await workflow.run();
  if (runResult.success) {
    console.log('Workflow is running');
  } else {
    console.error('Error running workflow:', runResult.error);
  }
} else {
  console.error('Error creating workflow:', creationResult.error);
}
```

## Core concepts

### Workflow

A Workflow is a container for nodes (triggers and actions) and the edges that connect them.

**Properties**:
	•	`id`: Unique identifier.
	•	`name`: Name of the workflow.
	•	`nodes`: Array of Node instances.
	•	`edges`: Array of Edge instances.
	•	`state`: Current state (inactive, active, failed, completed, waiting).

### node

Node is an abstract class representing either a Trigger or an Action.

**Properties**:
	•	`id`: Unique identifier.
	•	`blockId`: Identifier for the block type.
	•	`parameters`: Key-value pairs for node configuration.
	•	`position`: Coordinates for UI placement.

### Trigger

A Trigger initiates the workflow based on certain conditions.

**Methods**:
	•	`setCondition(value)`: Sets the logical condition (lt, gt, etc.). This works only for polling based triggers.
	•	`setComparisonValue(value)`: Sets the value to compare against. This works only for polling based triggers.

### Action

An Action performs operations like swapping tokens, sending notifications, etc.

**Methods**:
	•	`setParams(key, value)`: Sets parameters specific to the action.

### Edges

An Edge connects two nodes, defining the workflow’s execution path.

**Properties**:
	•	`source`: Source Node.
	•	`target`: Target Node.
	•	`label`: Optional label for the edge.
	•	`value`: Optional value for conditional edges.


## Examples

### Swap and Deposit Workflow

This example demonstrates how to create a workflow that swaps tokens and then deposits them into a lending platform.

```js
import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, getTokenFromSymbol } from 'otomato-sdk';

// Initialize Trigger
const priceTrigger = new Trigger(TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
priceTrigger.setChainId(CHAINS.MODE);
priceTrigger.setComparisonValue(3000);
priceTrigger.setCondition('lte');
priceTrigger.setParams('currency', 'USD');
priceTrigger.setContractAddress(getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
priceTrigger.setPosition(0, 0);

// Initialize Actions
const swapAction = new Action(ACTIONS.SWAP.ODOS.SWAP);
swapAction.setChainId(CHAINS.MODE);
swapAction.setParams('amount', '1000000'); // Amount in token units
swapAction.setParams('tokenIn', getTokenFromSymbol(CHAINS.MODE, 'USDT').contractAddress);
swapAction.setParams('tokenOut', getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
swapAction.setPosition(0, 100);

const depositAction = new Action(ACTIONS.LENDING.IONIC.DEPOSIT);
depositAction.setChainId(CHAINS.MODE);
depositAction.setParams('tokenToDeposit', getTokenFromSymbol(CHAINS.MODE, 'WETH').contractAddress);
depositAction.setParams('amount', swapAction.getOutputVariableName('amountOut'));
depositAction.setPosition(0, 200);

// Create Edges
const edge1 = new Edge({ source: priceTrigger, target: swapAction });
const edge2 = new Edge({ source: swapAction, target: depositAction });

// Create Workflow
const workflow = new Workflow('Swap and Deposit', [priceTrigger, swapAction, depositAction], [edge1, edge2]);
```

### ETH Price Monitoring with Split Conditions

An advanced workflow using conditional branching based on ETH price.

```js
import { Workflow, Trigger, Action, Edge, TRIGGERS, ACTIONS, CHAINS, LOGIC_OPERATORS, ConditionGroup } from 'otomato-sdk';

// Initialize Trigger
const ethPriceTrigger = new Trigger(TRIGGERS.TOKENS.ON_CHAIN_PRICE_MOVEMENT.PRICE_MOVEMENT_AGAINST_CURRENCY);
ethPriceTrigger.setChainId(CHAINS.MODE);
ethPriceTrigger.setComparisonValue(3000);
ethPriceTrigger.setCondition('lt');
ethPriceTrigger.setParams('currency', 'USD');
ethPriceTrigger.setContractAddress('ETH_CONTRACT_ADDRESS');
ethPriceTrigger.setPosition(0, 0);

// Split Action
const splitAction = new Action(ACTIONS.CORE.SPLIT.SPLIT);

// Conditional Branches
const conditionTrue = new Action(ACTIONS.CORE.CONDITION.IF);
conditionTrue.setParams('logic', LOGIC_OPERATORS.OR);
const conditionGroup = new ConditionGroup(LOGIC_OPERATORS.AND);
conditionGroup.addConditionCheck(ethPriceTrigger.getOutputVariableName('price'), 'lt', 3000);
conditionTrue.setParams('groups', [conditionGroup]);

const slackAction = new Action(ACTIONS.NOTIFICATIONS.SLACK.SEND_MESSAGE);
slackAction.setParams('webhook', 'YOUR_SLACK_WEBHOOK');
slackAction.setParams('message', 'ETH price is below $3000!');

// Create Edges
const edge1 = new Edge({ source: ethPriceTrigger, target: splitAction });
const edge2 = new Edge({ source: splitAction, target: conditionTrue });
const edge3 = new Edge({ source: conditionTrue, target: slackAction, label: 'true', value: 'true' });

// Create Workflow
const workflow = new Workflow('ETH Price Monitoring', [ethPriceTrigger, splitAction, conditionTrue, slackAction], [edge1, edge2, edge3]);
```

## API Reference

### Workflow Class

- **Methods**:
  - `create()`: Publishes the workflow to the Otomato platform.
  - `run()`: Executes the workflow.
  - `update()`: Updates the workflow.
  - `delete()`: Deletes the workflow.
  - `load(workflowId)`: Loads a workflow by ID.

### Trigger Class

- **Methods**:
  - `setCondition(value)`: Sets the trigger condition.
  - `setComparisonValue(value)`: Sets the comparison value.
  - `setChainId(value)`: Sets the blockchain network.
  - `setContractAddress(value)`: Sets the contract address.

### Action Class

- **Methods**:
  - `setParams(key, value)`: Sets action parameters.
  - `setChainId(value)`: Sets the blockchain network.
  - `setContractAddress(value)`: Sets the contract address.

### Edge Class

- **Methods**:
  - `toJSON()`: Serializes the edge.
  - `delete()`: Deletes the edge.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.