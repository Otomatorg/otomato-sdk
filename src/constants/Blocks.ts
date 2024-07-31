import { Parameter } from '../models/Parameter.js';

export const TRIGGERS = {
  "TOKENS": {
    "ERC20": {
      "description": "The most used standard for tokens on ethereum compatible blockchains",
      "chains": [
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethereum.webp",
      "TRANSFER": {
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
        ] as Parameter[],
        "blockId": 1,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethereum.webp"
      },
      "BALANCE": {
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
        ] as Parameter[],
        "blockId": 5,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethereum.webp"
      }
    }
  },
  "YIELD": {
    "SPLICE_FI": {
      "description": "Split any yield-bearing asset into separate yield and principal components",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png",
      "SWAP": {
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
        ] as Parameter[],
        "blockId": 2,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
      },
      "LIQUIDITY_REMOVED": {
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
        ] as Parameter[],
        "blockId": 6,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
      },
      "MARKET_CREATION": {
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
        ] as Parameter[],
        "blockId": 7,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
      },
      "INTEREST_RATE_UPDATE": {
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
        ] as Parameter[],
        "blockId": 9,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
      }
    }
  },
  "LENDING": {
    "ASTARIA": {
      "description": "Astaria is an oracle-less, intent-based, fixed-rate lending protocol supporting unlimited loan durations for any asset",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/astaria.png",
      "LEND_RECALLED": {
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
        ] as Parameter[],
        "blockId": 8,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/astaria.png"
      }
    }
  },
  "DEXES": {
    "ODOS": {
      "description": "Smart Order Routing across multiple blockchain protocols, 700+ Liquidity Sources and thousands of token pairs, delivering ultimate savings to users",
      "chains": [
        34443,
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.jpg",
      "SWAP": {
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
        ] as Parameter[],
        "blockId": 4,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.jpg"
      }
    }
  },
  "SOCIALS": {
    "MODE_NAME_SERVICE": {
      "description": "Next generation of Mode Mainnet Domains",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/modens.png",
      "NAME_REGISTERED": {
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
        ] as Parameter[],
        "blockId": 3,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/modens.png"
      }
    },
    "FEAR_AND_GREED": {
      "description": "Fetches the Fear and Greed Index",
      "tags": {},
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/modens.png",
      "GET_FEAR_AND_GREED_INDEX": {
        "name": "Fear and Greed Index",
        "description": "Fetches the Fear and Greed Index from the specified API and processes the result.",
        "type": 3,
        "url": "https://api.alternative.me/fng/",
        "handler": "async (res) => { return res.data?.[0]?.value }",
        "parameters": [
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ..."
          },
          {
            "key": "comparisonValue",
            "type": "integer",
            "description": "The value to compare to"
          },
        ] as Parameter[],
        "blockId": 11,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/modens.png"
      }
    }
  },
  "PRICE_ACTION": {
    "ON_CHAIN_PRICE_MOVEMENT": {
      "description": "Triggers based on the movement of on-chain prices against specified currencies",
      "chains": [
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/trend-up.png",
      "PRICE_MOVEMENT_AGAINST_CURRENCY": {
        "name": "On-Chain Price Movement Against Fiat Currency",
        "description": "This trigger activates when the on-chain price of an asset moves against a specified currency based on the given condition.",
        "type": 2,
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the blockchain to monitor"
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The price to compare against"
          },
          {
            "key": "currency",
            "type": "string",
            "description": "The currency in which the comparison price is denominated",
            "enum": [
              "USD"
            ]
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "The logic operator used for the comparison (e.g., >, <, >=, <=, ==, !=)"
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "The asset that you want to track"
          },
        ] as Parameter[],
        "blockId": 10,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/trend-up.png"
      }
    }
  }
};

export const ACTIONS = {
  "NOTIFICATIONS": {
    "SLACK": {
      "description": "Slack is a messaging app for businesses that connects people to the information they need.",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/slack.png",
      "SEND_MESSAGE": {
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
        ] as Parameter[],
        "blockId": 100002,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/slack.png"
      }
    },
    "DISCORD": {
      "description": "Discord is a communication service to talk with your favorite communities.",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/discord.png",
      "SEND_MESSAGE": {
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
        ] as Parameter[],
        "blockId": 100003,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/discord.png"
      }
    },
    "TELEGRAM": {
      "description": "Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/telegram.jpeg",
      "SEND_MESSAGE": {
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
        ] as Parameter[],
        "blockId": 100001,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/telegram.jpeg"
      }
    }
  },
  "TOKENS": {
    "ERC20": {
      "description": "The most used standard for tokens on ethereum compatible blockchains",
      "chains": [
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethereum.webp",
      "TRANSFER": {
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
        ] as Parameter[],
        "permissions": {
          "approvedTargets": [
            "$contractAddress"
          ],
          "label": [
            "Transfer $tokenSymbol($chainId, $contractAddress)"
          ],
          "labelNotAuthorized": [
            "Transfer $otherTokenSymbol($chainId, $contractAddress)"
          ]
        },
        "blockId": 100004,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethereum.webp"
      }
    }
  }
};