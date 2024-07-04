import { Parameter } from '../models/Parameter.js';
import { CHAINS } from './chains.js';

const TRIGGER_TYPE = {
  SUBSCRIPTION: 0,
  POLLING: 1,
}

export const TRIGGERS = {
  "TOKENS": {
    "ERC20": {
      "CHAINS": [
        0
      ],
      "TRANSFER": {
        "id": 1,
        "name": "Transfer token",
        "description": "This block gets triggered when someone transfers the ERC20 configured in the params",
        "type": 0,
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the ETH blockchain",
            "mandatory": true
          },
          {
            "key": "abiParams.from",
            "type": "address",
            "description": "Address that transfers the funds"
          },
          {
            "key": "abiParams.value",
            "type": "uint256",
            "description": "Amount of crypto to transfer"
          },
          {
            "key": "abiParams.to",
            "type": "address",
            "description": "Address that receives the funds"
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "The contract address of the ERC20",
            "mandatory": true
          },
        ] as Parameter[]
      },
      "BALANCE": {
        "id": 1000,
        "name": "ERC20 balance check",
        "description": "Fetches the balance of an ERC20 and checks it against the specified condition.",
        "type": 1,
        "method": "function balanceOf(address account) view returns (uint256)",
        "handler": "output => { const params=JSON.parse(output);const balance = BigInt(params)/1000000n; return Number(balance); }",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the ETH blockchain"
          },
          {
            "key": "abiParams.account",
            "type": "address",
            "description": "Amount of crypto to transfer"
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "The contract address of the ERC20"
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ..."
          },
          {
            "key": "comparisonValue",
            "type": "any",
            "description": "The value to compare to"
          },
          {
            "key": "interval",
            "type": "integer",
            "description": "The waiting time between each polling"
          },
        ] as Parameter[]
      }
    }
  },
  "YIELD": {
    "SPLICE_FI": {
      "CHAINS": [
        43334
      ],
      "SWAP": {
        "id": 2,
        "name": "Splice Finance Swap",
        "description": "Swap in Splice Finance",
        "type": 0,
        "contractAddress": "0x7A3a94AE0fC1421A3eac23eA6371036ac8d8f448",
        "parameters": [
          {
            "key": "abiParams.caller",
            "type": "address",
            "description": "Caller address"
          },
          {
            "key": "abiParams.market",
            "type": "address",
            "description": "Market address"
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "Receiver address"
          },
          {
            "key": "abiParams.netPtToAccount",
            "type": "int256",
            "description": "Net PT to account"
          },
          {
            "key": "abiParams.netSyToAccount",
            "type": "int256",
            "description": "Net SY to account"
          },
        ] as Parameter[]
      },
      "LIQUIDITY_REMOVED": {
        "id": 6,
        "name": "Liquidity Removed",
        "description": "Liquidity removed in Splice Finance",
        "type": 0,
        "contractAddress": "0x7A3a94AE0fC1421A3eac23eA6371036ac8d8f448",
        "parameters": [
          {
            "key": "abiParams.caller",
            "type": "address",
            "description": "Caller address"
          },
          {
            "key": "abiParams.market",
            "type": "address",
            "description": "Market address"
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "Receiver address"
          },
          {
            "key": "abiParams.netLpToRemove",
            "type": "uint256",
            "description": "Net LP to remove"
          },
          {
            "key": "abiParams.netPtOut",
            "type": "uint256",
            "description": "Net PT out"
          },
          {
            "key": "abiParams.netSyOut",
            "type": "uint256",
            "description": "Net SY out"
          },
        ] as Parameter[]
      },
      "MARKET_CREATION": {
        "id": 7,
        "name": "Market Creation",
        "description": "Market creation in Splice Finance",
        "type": 0,
        "contractAddress": "0x7A3a94AE0fC1421A3eac23eA6371036ac8d8f448",
        "parameters": [
          {
            "key": "abiParams.market",
            "type": "address",
            "description": "Market address"
          },
          {
            "key": "abiParams.PT",
            "type": "address",
            "description": "PT address"
          },
          {
            "key": "abiParams.scalarRoot",
            "type": "int256",
            "description": "Scalar root"
          },
          {
            "key": "abiParams.initialAnchor",
            "type": "int256",
            "description": "Initial anchor"
          },
          {
            "key": "abiParams.lnFeeRateRoot",
            "type": "uint256",
            "description": "LN fee rate root"
          },
        ] as Parameter[]
      },
      "INTEREST_RATE_UPDATE": {
        "id": 9,
        "name": "Interest Rate Update",
        "description": "Interest rate update in Splice Finance",
        "type": 0,
        "contractAddress": "0x7A3a94AE0fC1421A3eac23eA6371036ac8d8f448",
        "parameters": [
          {
            "key": "abiParams.timestamp",
            "type": "uint256",
            "description": "Timestamp"
          },
          {
            "key": "abiParams.lastLnImpliedRate",
            "type": "int256",
            "description": "Last LN implied rate"
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "Contract address to monitor",
            "mandatory": true,
            "enum": [
              "0xDE95511418EBD8Bd36294B11C86314DdFA50e212",
              "0x34cf9BF641bd5f34197060A3f3478a1f97f78f0a",
              "0xb950A73Ea0842B0Cd06D0e369aE974799BB346f1",
              "0xbF14932e1A7962C77D0b31be80075936bE1A43D4"
            ]
          },
        ] as Parameter[]
      }
    }
  },
  "LENDING": {
    "ASTARIA": {
      "CHAINS": [
        43334
      ],
      "LEND_RECALLED": {
        "id": 8,
        "name": "Lend Recalled",
        "description": "Lend recalled in Astaria",
        "type": 0,
        "contractAddress": "0x34cf9BF641bd5f34197060A3f3478a1f97f78f0a",
        "parameters": [
          {
            "key": "abiParams.loanId",
            "type": "uint256",
            "description": "Loan ID"
          },
          {
            "key": "abiParams.recaller",
            "type": "address",
            "description": "Recaller address"
          },
          {
            "key": "abiParams.end",
            "type": "uint256",
            "description": "End time"
          },
        ] as Parameter[]
      }
    }
  },
  "DEXES": {
    "ODOS": {
      "CHAINS": [
        43334,
        1
      ],
      "SWAP": {
        "id": 4,
        "name": "Odos Swap",
        "description": "Swap on Odos",
        "type": 0,
        "contractAddress": "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the ETH blockchain",
            "mandatory": true
          },
          {
            "key": "abiParams.sender",
            "type": "address",
            "description": "Sender address"
          },
          {
            "key": "abiParams.inputAmount",
            "type": "uint256",
            "description": "Input amount"
          },
          {
            "key": "abiParams.inputToken",
            "type": "address",
            "description": "Input token address"
          },
          {
            "key": "abiParams.amountOut",
            "type": "uint256",
            "description": "Output amount"
          },
          {
            "key": "abiParams.outputToken",
            "type": "address",
            "description": "Output token address"
          },
        ] as Parameter[]
      }
    }
  },
  "SOCIALS": {
    "MODE_NAME_SERVICE": {
      "CHAINS": [
        43334
      ],
      "NAME_REGISTERED": {
        "id": 3,
        "name": "Name Registered",
        "description": "Name registered in Mode Name Service",
        "type": 0,
        "contractAddress": "0x2aD86eeEC513AC16804bb05310214C3Fd496835B",
        "parameters": [
          {
            "key": "abiParams.id",
            "type": "uint256",
            "description": "ID of the name registered"
          },
          {
            "key": "abiParams.owner",
            "type": "address",
            "description": "Owner address"
          },
          {
            "key": "abiParams.expires",
            "type": "uint256",
            "description": "Expiration time"
          },
        ] as Parameter[]
      }
    }
  }
};

export const ACTIONS = {
  "NOTIFICATIONS": {
    "SLACK": {
      "SEND_MESSAGE": {
        "id": 100002,
        "name": "Send message",
        "type": 0,
        "description": "Notifies you by sending a Slack message to the channel of your choice",
        "parameters": [
          {
            "key": "webhook",
            "type": "url",
            "description": "The webhook URL for the Slack channel"
          },
          {
            "key": "message",
            "type": "paragraph",
            "description": "The text content to send"
          },
        ] as Parameter[]
      }
    },
    "DISCORD": {
      "SEND_MESSAGE": {
        "id": 100003,
        "name": "Send message",
        "type": 0,
        "description": "Notifies you by sending a Discord message to the channel of your choice",
        "parameters": [
          {
            "key": "webhook",
            "type": "url",
            "description": "The webhook URL for the Discord channel"
          },
          {
            "key": "message",
            "type": "paragraph",
            "description": "The text content to send"
          },
        ] as Parameter[]
      }
    },
    "TELEGRAM": {
      "SEND_MESSAGE": {
        "id": 100001,
        "name": "Send message",
        "type": 0,
        "description": "Notifies you by sending a Telegram message to the chat of your choice",
        "parameters": [
          {
            "key": "webhook",
            "type": "url",
            "description": "The webhook URL for the Telegram bot"
          },
          {
            "key": "message",
            "type": "paragraph",
            "description": "The text content to send"
          },
        ] as Parameter[]
      }
    }
  },
  "TOKENS": {
    "ERC20": {
      "CHAINS": [
        0
      ],
      "TRANSFER": {
        "id": 100004,
        "name": "Transfer token",
        "description": "Transfers an ERC20 token",
        "type": 1,
        "method": "Transfer(address from, address to, uint256 value)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network"
          },
          {
            "key": "abiParams.value",
            "type": "uint256",
            "description": "Amount of crypto to transfer"
          },
          {
            "key": "abiParams.to",
            "type": "address",
            "description": "Address to transfer crypto to"
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "The contract address of the ERC20"
          },
        ] as Parameter[]
      }
    }
  }
};