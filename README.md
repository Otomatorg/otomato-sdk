
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
import { TRIGGERS } from 'otomato-sdk/constants/ActionBlocks';
import { CHAINS } from 'otomato-sdk/constants/chain';
import { TOKENS } from 'otomato-sdk/constants/tokens';
import { Trigger } from 'otomato-sdk/models/Trigger';

const transferTrigger = new Trigger(TRIGGERS.ETHEREUM.ERC20.TRANSFER);

transferTrigger.setChainId(CHAINS.ETHEREUM);
transferTrigger.setParams("value", 1000); // using setParams for abiParams.value
transferTrigger.setParams("to", "0x987654321"); // using setParams for abiParams.to
transferTrigger.setContractAddress(TOKENS.ETHEREUM.USDC);

console.log(transferTrigger.getParameters());
console.log(transferTrigger.toJSON());
```

## Contributing

We welcome contributions to the Otomato SDK. Please make sure you have Node.js v20 installed.

### Development Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/otomato-sdk.git
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

4. Run the example:
    ```bash
    npx tsc
    node dist/examples/create-trigger.js
    ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
