
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
import { TRIGGERS, CHAINS, getToken, Trigger } from 'otomato-sdk';

const transferTrigger = new Trigger(TRIGGERS.ETHEREUM.ERC20.TRANSFER);

transferTrigger.setChainId(CHAINS.ETHEREUM);
transferTrigger.setParams("value", 1000);
transferTrigger.setParams("to", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
transferTrigger.setContractAddress(getToken(CHAINS.ETHEREUM, 'USDC'));

console.log(transferTrigger.getParameters());
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
