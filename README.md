
# Otomato SDK

The Otomato SDK provides a set of tools to create and manage automations, triggers, and actions in your applications. It is designed to work in both frontend and backend environments using TypeScript.

## Installation

To install the Otomato SDK, run:

```bash
npm install otomato-sdk
```

## Usage

### Create an Automation

### Create a Trigger

#### Example

Here's how to create a trigger using the Otomato SDK:

```typescript
import { Trigger, TRIGGERS, CHAINS, getTokenFromSymbol } from 'otomato-sdk';

const transferTrigger = new Trigger(TRIGGERS.TOKENS.ERC20.TRANSFER);
transferTrigger.setChainId(CHAINS.ETHEREUM);
transferTrigger.setParams("value", 1000);
transferTrigger.setParams("to", "0xe1432599B51d9BE1b5A27E2A2FB8e5dF684749C6");
transferTrigger.setContractAddress(getTokenFromSymbol(CHAINS.ETHEREUM, 'USDC').contractAddress);

console.log(transferTrigger.toJSON());
```

## Contributing

We welcome contributions to the Otomato SDK. Please make sure you have Node.js v20 installed.

### Development Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/otomatorg/otomato-sdk.git
    cd otomato-sdk
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Build the project:
    ```bash
    npm run build
    ```

4. Run an example:
    ```bash
    node dist/examples/create-trigger.js
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
