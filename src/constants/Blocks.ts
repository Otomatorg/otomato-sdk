import { Parameter } from '../models/Parameter.js';

export const TRIGGERS = {
  "CORE": {
    "EVERY_PERIOD": {
      "description": "Triggers the workflow every period (e.g every hour)",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/every_hour_trigger.png",
      "EVERY_PERIOD": {
        "name": "Every period",
        "type": 4,
        "description": "Triggers the workflow every period (e.g every hour)",
        "parameters": [
          {
            "key": "period",
            "type": "integer",
            "description": "The period to wait between each run (in ms)",
            "mandatory": true,
            "minValue": 600000,
            "category": 0
          },
          {
            "key": "timeout",
            "type": "integer",
            "description": "The maximum amount of time to wait before stopping the trigger (in ms)",
            "mandatory": true,
            "category": 1,
            "hideInUI": true,
            "value": 63072000000
          },
          {
            "key": "limit",
            "type": "integer",
            "description": "The maximum number of times this trigger should execute before stopping.",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Run it every day for 2 weeks",
            "description": "Set the period to 1 day and the limit to 14 to execute daily for 2 weeks.",
            "parameters": [
              {
                "key": "period",
                "value": 86400000
              },
              {
                "key": "limit",
                "value": 14
              }
            ]
          }
        ],
        "blockId": 18,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/every_hour_trigger.png"
      }
    }
  },
  "TOKENS": {
    "TRANSFER": {
      "description": "Monitors token transfers",
      "chains": [
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/Transfer.svg",
      "TRANSFER": {
        "name": "Transfer token",
        "description": "This block gets triggered when someone transfers the ERC20 configured in the params",
        "type": 0,
        "output": {
          "value": "float",
          "from": "address",
          "to": "address",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the EVM blockchain",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.from",
            "type": "address",
            "description": "Address that transfers the funds",
            "category": 1
          },
          {
            "key": "abiParams.value",
            "type": "uint256",
            "description": "Amount of crypto to transfer",
            "category": 1,
            "erc20FormattedAmount": {
              "contractAddress": "{{parameters.contractAddress}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.to",
            "type": "address",
            "description": "Address that receives the funds",
            "category": 1
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "The contract address of the ERC20",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "value": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Mode transfer",
            "description": "Gets triggered when someone transfers MODE",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "contractAddress",
                "value": "0xDfc7C877a950e49D2610114102175A06C2e3167a"
              }
            ]
          }
        ],
        "blockId": 1,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/Transfer.svg"
      }
    },
    "BALANCE": {
      "description": "Monitors token balance of selected addresses",
      "chains": [
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/BalanceCheck.svg",
      "BALANCE": {
        "name": "ERC20 balance check",
        "description": "Fetches the balance of an ERC20 and checks it against the specified condition.",
        "prototype": "erc20Balance",
        "type": 1,
        "method": "function balanceOf(address account) view returns ((uint256 balance))",
        "output": {
          "balance": "float"
        },
        "frontendHelpers": {
          "output": {
            "balance": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the EVM blockchain",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.account",
            "type": "address",
            "description": "The wallet address to check for the token balance",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "The contract address of the ERC20",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Mode balance check",
            "description": "Gets triggered when the MODE balance of vitalik.eth falls below 10,000",
            "externalVariableDescription": "Fetches the MODE balance of vitalik.eth on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "comparisonValue",
                "value": 10000
              },
              {
                "key": "condition",
                "value": "lt"
              },
              {
                "key": "contractAddress",
                "value": "0xDfc7C877a950e49D2610114102175A06C2e3167a"
              },
              {
                "key": "abiParams.account",
                "value": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              }
            ]
          },
          {
            "name": "Binance balance check",
            "description": "Gets triggered when the Binance hot wallet balance falls below 7B USDT",
            "externalVariableDescription": "Fetches the USDT balance of Binance hot wallet on Ethereum",
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "comparisonValue",
                "value": 7000000000
              },
              {
                "key": "condition",
                "value": "lt"
              },
              {
                "key": "contractAddress",
                "value": "0xdac17f958d2ee523a2206206994597c13d831ec7"
              },
              {
                "key": "abiParams.account",
                "value": "0xF977814e90dA44bFA03b6295A0616a897441aceC"
              }
            ]
          }
        ],
        "blockId": 5,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/BalanceCheck.svg"
      }
    },
    "APPROVAL": {
      "description": "Monitors token approvals",
      "chains": [
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/approval.png",
      "APPROVAL": {
        "name": "Token Approval",
        "description": "Triggers when someone approves this token.",
        "type": 0,
        "output": {
          "owner": "address",
          "spender": "address",
          "value": "float",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "The network where the token is deployed (e.g., Ethereum or Base).",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "The token you want to monitor for approvals.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.owner",
            "type": "address",
            "description": "Filter by the wallet that approved the token",
            "category": 1
          },
          {
            "key": "abiParams.spender",
            "type": "address",
            "description": "Filter by the wallet that was approved to spend the token",
            "category": 1
          },
          {
            "key": "abiParams.value",
            "type": "uint256",
            "description": "Filter by the amount of tokens approved",
            "category": 1
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "value": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Track all MODE approvals",
            "description": "Get notified whenever someone approves the use of this token.",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "contractAddress",
                "value": "0xDfc7C877a950e49D2610114102175A06C2e3167a"
              }
            ]
          },
          {
            "name": "Track USDC approvals for a specific app",
            "description": "Get notified when someone approves Uniswap to use their tokens.",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "contractAddress",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "abiParams.spender",
                "value": "0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4"
              }
            ]
          }
        ],
        "blockId": 27,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/approval.png"
      }
    },
    "PRICE": {
      "description": "Triggers based on on-chain price changes",
      "chains": [
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/trend-up.png",
      "PRICE_MOVEMENT_AGAINST_CURRENCY": {
        "name": "On-Chain Price Movement Against Fiat Currency",
        "prototype": "priceMovementAgainstCurrency",
        "description": "This trigger activates when the on-chain price of an asset moves against a specified currency based on the given condition.",
        "type": 2,
        "output": {
          "price": "float"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the blockchain to monitor",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The price to compare against",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "currency",
            "type": "string",
            "description": "The currency in which the comparison price is denominated",
            "enum": [
              "USD"
            ],
            "value": "USD",
            "mandatory": true,
            "category": 1
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "The logic operator used for the comparison (e.g., >, <, >=, <=, ==, !=)",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "The asset that you want to track",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "ETH > 2850$",
            "description": "Gets triggered when ETH rises above 2850$ on Base",
            "externalVariableDescription": "Fetches the current ETH price in USD on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "comparisonValue",
                "value": 2850
              },
              {
                "key": "currency",
                "value": "USD"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "contractAddress",
                "value": "0x4200000000000000000000000000000000000006"
              }
            ]
          },
          {
            "name": "ETH < 2100$",
            "description": "Gets triggered when ETH falls below 2100$ on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "comparisonValue",
                "value": 2100
              },
              {
                "key": "currency",
                "value": "USD"
              },
              {
                "key": "condition",
                "value": "lt"
              },
              {
                "key": "contractAddress",
                "value": "0x4200000000000000000000000000000000000006"
              }
            ]
          },
          {
            "name": "MODE < 0.01$",
            "description": "Gets triggered when MODE falls below 0.01$ on Mode Network",
            "externalVariableDescription": "Fetches the current MODE price in USD on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "comparisonValue",
                "value": 0.01
              },
              {
                "key": "currency",
                "value": "USD"
              },
              {
                "key": "condition",
                "value": "lt"
              },
              {
                "key": "contractAddress",
                "value": "0xDfc7C877a950e49D2610114102175A06C2e3167a"
              }
            ]
          }
        ],
        "blockId": 10,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/trend-up.png"
      }
    }
  },
  "YIELD": {
    "ETHENA": {
      "description": "Ethena is a synthetic dollar protocol on Ethereum",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethena.svg",
      "SUSDE_YIELD": {
        "name": "sUSDE yield",
        "description": "Fetches Ethena's sUSDE yield",
        "type": 3,
        "prototype": "sUSDEYield",
        "output": {
          "yield": "float"
        },
        "parameters": [
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Yield decreasing below 8%",
            "description": "Gets triggered when the yield is below 8%",
            "externalVariableDescription": "Fetches the current sUSDE staking yield",
            "parameters": [
              {
                "key": "condition",
                "value": "lte"
              },
              {
                "key": "comparisonValue",
                "value": 8
              }
            ]
          },
          {
            "name": "Yield increasing above 20%",
            "description": "Gets triggered when the yield is above 20%",
            "parameters": [
              {
                "key": "condition",
                "value": "gte"
              },
              {
                "key": "comparisonValue",
                "value": 20
              }
            ]
          }
        ],
        "blockId": 12,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethena.svg"
      },
      "TVL": {
        "name": "USDE supply",
        "description": "Fetches Ethena's USDE supply",
        "type": 1,
        "prototype": "usdeSupply",
        "method": "function totalSupply() public view virtual override returns (uint256)",
        "output": {
          "supply": "integer"
        },
        "contractAddress": "0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
        "chainId": 1,
        "parameters": [
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "integer",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Supply above 3B$",
            "description": "Gets triggered when the USDE supply is above 3B$",
            "externalVariableDescription": "Fetches the USDE total supply",
            "parameters": [
              {
                "key": "comparisonValue",
                "value": 3000000000
              },
              {
                "key": "condition",
                "value": "gt"
              }
            ]
          }
        ],
        "blockId": 13,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ethena.svg"
      }
    },
    "PENDLE": {
      "description": "Pendle protocol functions for market yield calculation.",
      "chains": [
        1,
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/pendle.webp",
      "comingSoon": true,
      "PT_IMPLIED_YIELD": {
        "name": "PT Implied Yield",
        "description": "Retrieves the PT implied yield for a specified Pendle market by reading its state and computing exp(lnImpliedRate) - 1.",
        "prototype": "pendlePtImpliedYield",
        "type": 1,
        "method": "function readState(address marketAddress) external view returns (int256 totalPt, int256 totalSy, int256 totalLp, address treasury, int256 scalarRoot, uint256 expiry, uint256 lnFeeRateRoot, uint256 reserveFeePercent, uint256 lastLnImpliedRate)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.marketAddress",
            "type": "address",
            "description": "The Pendle market address",
            "mandatory": true,
            "category": 0,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"1\": [\n    {\n      \"value\": \"0xc374f7ec85f8c7de3207a10bb1978ba104bda3b2\",\n      \"label\": \"stETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ac9b8802-61d9-4c3f-a2de-2da35c87e24b.svg\"\n    },\n    {\n      \"value\": \"0x34280882267ffa6383b363e278b027be083bbe3b\",\n      \"label\": \"stETH\",\n      \"expiry\": \"DEC 30, 2027\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f7d6a626-a00e-4150-aadc-e937e34818ca.svg\"\n    },\n    {\n      \"value\": \"0xe6d4986cd935529fc4505d48e926bcd36a58a0f0\",\n      \"label\": \"apxETH\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/151c9217-2512-4d26-b9d0-755c49299b12.svg\"\n    },\n    {\n      \"value\": \"0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/56eb1ed3-d1f7-4685-a7b2-5a6e05cb234f.svg\"\n    },\n    {\n      \"value\": \"0xb451a36c8b6b2eac77ad0737ba732818143a0e25\",\n      \"label\": \"USDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7299bcd0-6ba1-411e-8d54-f7e5b68aa154.svg\"\n    },\n    {\n      \"value\": \"0x7e0209ab6fa3c7730603b68799bbe9327dab7e88\",\n      \"label\": \"rsENA\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/37110810-606f-4d92-8ea8-5ede71d6abdc.svg\"\n    },\n    {\n      \"value\": \"0x890b6afc834c2a2cc6cb9b6627272ab4ecfd8271\",\n      \"label\": \"rsUSDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1d444261-bdf7-483b-8e35-bdb725a702ce.svg\"\n    },\n    {\n      \"value\": \"0x70b70ac0445c3ef04e314dfda6caafd825428221\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/773047f5-3963-4577-93f9-4333f225442c.svg\"\n    },\n    {\n      \"value\": \"0x977ebf77581f94de969349549ab2108a681e8f4c\",\n      \"label\": \"USDS Rewards\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/bdf98058-9191-44bf-b9a7-4a460457f756.svg\"\n    },\n    {\n      \"value\": \"0xc64056237c8107ecb9860cbd4519644e9ba2aed4\",\n      \"label\": \"sENA\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/34ccfdb6-4acf-4d13-8dc9-080b47dfb8fa.svg\"\n    },\n    {\n      \"value\": \"0x21d85ff3bedff031ef466c7d5295240c8ab2a2b8\",\n      \"label\": \"sUSDS\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3226daff-03a2-4078-af4e-28a72ef5b252.svg\"\n    },\n    {\n      \"value\": \"0x8098b48a1c4e4080b30a43a7ebc0c87b52f17222\",\n      \"label\": \"pumpBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/df3270cd-7ee9-4119-8ad8-c81336fad690.svg\"\n    },\n    {\n      \"value\": \"0x2c71ead7ac9ae53d05f8664e77031d4f9eba064b\",\n      \"label\": \"eBTC (Corn)\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/35a6e08f-82da-49cf-8dc0-c120a4386b0f.svg\"\n    },\n    {\n      \"value\": \"0xafdc922d0059147486cc1f0f32e3a2354b0d35cc\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x07c5b1f5265591a8e0e541466654b07dd2d1a6fd\",\n      \"label\": \"eEIGEN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/33c90ae2-9675-4f9f-80e8-0554dc0dc5b5.svg\"\n    },\n    {\n      \"value\": \"0xff81180a7f949ba1f940eae6aa3b3ceb890b1912\",\n      \"label\": \"stkGHO\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/05cdb874-4679-4b6a-bedc-9de81e817e79.svg\"\n    },\n    {\n      \"value\": \"0xfd482179ddee989c45eab19991852f80ff31457a\",\n      \"label\": \"rsETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/be3e997d-8f3c-46ed-b978-2518668aaa2b.svg\"\n    },\n    {\n      \"value\": \"0xf4cf59259d007a96c641b41621ab52c93b9691b1\",\n      \"label\": \"eETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/58971e16-6cf3-4ac4-9f3a-df82267fc5c8.svg\"\n    },\n    {\n      \"value\": \"0x98ffefd1a51d322c8def6d0ba183e71547216f7f\",\n      \"label\": \"eBTC (Zerolend)\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/39b1b707-b537-4c87-811d-110047aa7b9f.svg\"\n    },\n    {\n      \"value\": \"0xbe8549a20257917a0a9ef8911daf18190a8842a4\",\n      \"label\": \"agETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d4f45c90-7317-4d07-ae67-1e8ec9caa9a7.svg\"\n    },\n    {\n      \"value\": \"0xbba9baaa6b3107182147a12177e0f1ec46b8b072\",\n      \"label\": \"uniETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/025623d4-1fc4-44db-b981-03d60d93d90a.svg\"\n    },\n    {\n      \"value\": \"0x58612beb0e8a126735b19bb222cbc7fc2c162d2a\",\n      \"label\": \"pufETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ad53c3bf-7a0c-481e-80cd-0eea4e0e9554.svg\"\n    },\n    {\n      \"value\": \"0xb162b764044697cf03617c2efbcb1f42e31e4766\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8fdd3402-5238-4e90-b4db-12e32ea28e67.svg\"\n    },\n    {\n      \"value\": \"0xfd5cf95e8b886ace955057ca4dc69466e793fbbe\",\n      \"label\": \"rswETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/221673b1-5839-4140-ad82-3f865dc05c4d.png\"\n    },\n    {\n      \"value\": \"0x048680f64d6dff1748ba6d9a01f578433787e24b\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x461cd9222e130d1dc0bd79dab4643952430937c1\",\n      \"label\": \"pWBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f59d005c-a34f-40e3-bdf7-bd84c2094765.svg\"\n    },\n    {\n      \"value\": \"0x2bf616c236d1abd31ff105247a774e6e738b5f4e\",\n      \"label\": \"scrvUSD\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/50bc1fdb-ca50-4c38-9a0c-1669e35896f1.svg\"\n    },\n    {\n      \"value\": \"0x15e434c42ab4c9a62ed7db53baaf9d255ea51e0e\",\n      \"label\": \"OETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/af71269f-d089-47f1-8106-532af44b49e0.svg\"\n    },\n    {\n      \"value\": \"0x3fd13bad9fc47e001bf9088afd1a1b2fc24673d5\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/abdb21c4-7fc2-44f7-bbbb-27416583ac66.svg\"\n    },\n    {\n      \"value\": \"0x380c751bd0412f47ca560b6afeb566d88dc18630\",\n      \"label\": \"uniBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/04bdd8ee-4a79-48c5-88a0-b2593ebf939d.svg\"\n    },\n    {\n      \"value\": \"0xd3c29550d12a5234e6aeb5aea7c841134cd6ddd5\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ecaa79c6-7223-48e9-a3f0-30e10dbbfbfe.svg\"\n    },\n    {\n      \"value\": \"0x22a72b0c504cbb7f8245208f84d8f035c311adec\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x81f3a11db1de16f4f9ba8bf46b71d2b168c64899\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x8539b41ca14148d1f7400d399723827a80579414\",\n      \"label\": \"aUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1d127217-c2d1-4e5c-9bf4-70ae1a208d28.svg\"\n    },\n    {\n      \"value\": \"0x12f6139a5dc6d80990d30a4d45bb86449ff804d8\",\n      \"label\": \"aUSDT\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a875dcab-6a6d-449a-b519-dce222d873c9.svg\"\n    },\n    {\n      \"value\": \"0x925cd38a68993819eef0138a463308c840080f17\",\n      \"label\": \"fUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9049a93c-6645-4c84-b19f-9ebfa0cce6dd.svg\"\n    },\n    {\n      \"value\": \"0x8e1c2be682b0d3d8f8ee32024455a34cc724cf08\",\n      \"label\": \"fUSDT\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/6c349c1b-9671-489c-be2c-8750738da3aa.svg\"\n    },\n    {\n      \"value\": \"0xab182e2a98234db8298565f0eb9327206b558c57\",\n      \"label\": \"weETHk\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9f9ec77b-efe0-4119-a4fc-a733ff5fd04a.svg\"\n    },\n    {\n      \"value\": \"0x7509b6bdb9e6dbf6c4b054434dcb46c40000303b\",\n      \"label\": \"weETHs\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2244883b-428a-4f86-ad63-dcaa143b70d6.svg\"\n    },\n    {\n      \"value\": \"0xa25f5ed89e6e7b3d23ebaf067a30ac3d550a19c1\",\n      \"label\": \"eBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/685e07f1-e50d-4ff9-bac2-158611f718a6.svg\"\n    },\n    {\n      \"value\": \"0x523f9441853467477b4dde653c554942f8e17162\",\n      \"label\": \"eBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/685e07f1-e50d-4ff9-bac2-158611f718a6.svg\"\n    },\n    {\n      \"value\": \"0xb9b7840ec34094ce1269c38ba7a6ac7407f9c4e3\",\n      \"label\": \"USUALx\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ff146e2f-3e2d-4e71-9a9d-e1a866b75da2.svg\"\n    },\n    {\n      \"value\": \"0x353d0b2efb5b3a7987fb06d30ad6160522d08426\",\n      \"label\": \"wstUSR\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7a8188bd-cae6-492d-b30d-cbd128493f00.svg\"\n    },\n    {\n      \"value\": \"0x99b633a6a2e0d6414e7c7ecea1134c0a330a73fe\",\n      \"label\": \"uniBTC (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7ce722a1-c74e-4226-a80d-1028861e4b62.svg\"\n    },\n    {\n      \"value\": \"0xc118635bcde024c5b01c6be2b0569a2608a8032c\",\n      \"label\": \"LBTC (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/0b1f24c8-2a29-46bd-b400-5f7043e3c573.svg\"\n    },\n    {\n      \"value\": \"0xe6b03f3182692db1ed7d3a91f6fadf3e4dff2b95\",\n      \"label\": \"SolvBTC.BBN (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/4b1032d7-94ba-4075-8233-85808d186ebd.svg\"\n    },\n    {\n      \"value\": \"0x3dc05f96160bdf70cf23989a632c087ebc022f92\",\n      \"label\": \"pumpBTC\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/df3270cd-7ee9-4119-8ad8-c81336fad690.svg\"\n    },\n    {\n      \"value\": \"0xebf5c58b74a836f1e51d08e9c909c4a4530afd41\",\n      \"label\": \"liquidBeraBTC\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5506f24b-06b7-4f28-af95-11f5c8b0e085.svg\"\n    },\n    {\n      \"value\": \"0x46e6b4a950eb1abba159517dea956afd01ea9497\",\n      \"label\": \"liquidBeraETH\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5ab37246-4c5b-4a95-a534-e60ec618010b.svg\"\n    },\n    {\n      \"value\": \"0xad016c9565a4aeec6d4cfc8a01c648ecbea1a602\",\n      \"label\": \"sUSDe (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/aa218d17-62e2-42a4-986b-4f6fcebf9aa4.svg\"\n    },\n    {\n      \"value\": \"0xe6df8d8879595100e4b6b359e6d0712e107c7472\",\n      \"label\": \"USDe (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/85be79d7-942c-4cc9-b364-5e1c891a242b.svg\"\n    },\n    {\n      \"value\": \"0x7561c5ccfe41a26b33944b58c70d6a3cb63e881c\",\n      \"label\": \"beraSTONE\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/378a54dc-779f-40f0-b859-03dbb3b425e8.svg\"\n    },\n    {\n      \"value\": \"0x83916356556f51dcbcb226202c3efeefc88d5eaa\",\n      \"label\": \"LBTC (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/39e54d77-2c8f-49f2-ba92-b40386a55673.svg\"\n    },\n    {\n      \"value\": \"0x9471d9c5b57b59d42b739b00389a6d520c33a7a9\",\n      \"label\": \"WBTC (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/0a043dbb-827c-4692-9c52-272745db30c3.svg\"\n    },\n    {\n      \"value\": \"0x580e40c15261f7baf18ea50f562118ae99361096\",\n      \"label\": \"syrupUSDC\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3bebc608-b228-4b1a-81de-363ee24b999b.svg\"\n    },\n    {\n      \"value\": \"0xc387ad871d94990e073f1bd0b759ffdb5e0313aa\",\n      \"label\": \"SolvBTC.BERA\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/b9407b43-e7fe-4b27-a78d-0e1db14b8a4b.svg\"\n    },\n    {\n      \"value\": \"0xd75fc2b1ca52e72163787d1c370650f952e75dd7\",\n      \"label\": \"sUSDa\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ddcbbbc3-af3c-4b35-a2a6-ebd4e0189256.svg\"\n    },\n    {\n      \"value\": \"0xbdb8f9729d3194f75fd1a3d9bc4ffe0dde3a404c\",\n      \"label\": \"tETH\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d8db35e6-a493-4879-b0de-a9b3fb40924c.svg\"\n    },\n    {\n      \"value\": \"0x4d7356369273c6373e6c5074fe540cb070acfe6b\",\n      \"label\": \"asdCRV\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2ad15ff1-e832-4786-9da3-fac560d1a34c.svg\"\n    },\n    {\n      \"value\": \"0x82d810ededb09614144900f914e75dd76700f19d\",\n      \"label\": \"GHO-USR\",\n      \"expiry\": \"JUL 31, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dd2ad4a1-0279-4b85-a53a-22a79b8f4268.svg\"\n    },\n    {\n      \"value\": \"0x1bd1ae9d7a377e63cd0c584a2c42b8c614937e81\",\n      \"label\": \"SuperUSDC\",\n      \"expiry\": \"APR 17, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/cd6bc969-f075-4fc3-8aa8-463e9b6c9eec.svg\"\n    },\n    {\n      \"value\": \"0x931f7ea0c31c14914a452d341bc5cb5d996be71d\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/773047f5-3963-4577-93f9-4333f225442c.svg\"\n    },\n    {\n      \"value\": \"0xb6b2cf977c512bcd195b58e2ccfb3fb15535cb19\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/abdb21c4-7fc2-44f7-bbbb-27416583ac66.svg\"\n    },\n    {\n      \"value\": \"0x928e2e42f3b21c9af0e0454d7bb3884e5d36e1be\",\n      \"label\": \"uniBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/04bdd8ee-4a79-48c5-88a0-b2593ebf939d.svg\"\n    },\n    {\n      \"value\": \"0xf6906f99e2ce8cf2d7098216da87e261b13554c8\",\n      \"label\": \"USDe\",\n      \"expiry\": \"JUL 31, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7d81c8c9-f99a-4682-bbfc-b1814b8bd799.svg\"\n    },\n    {\n      \"value\": \"0x887f62e4189c6b04cc6db1478fb71976fd1e84bf\",\n      \"label\": \"eUSDe\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/4528cf44-94f3-4c34-a88a-21ef0afa8e5a.svg\"\n    },\n    {\n      \"value\": \"0x887f62e4189c6b04cc6db1478fb71976fd1e84bf\",\n      \"label\": \"eUSDe\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1870cf48-db97-4339-b63d-57779cd883b8.svg\"\n    },\n    {\n      \"value\": \"0x35a18cd59a214c9e797e14b1191b700eea251f6a\",\n      \"label\": \"USR\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8ff8d223-0c47-411d-9588-1ca661543bf4.svg\"\n    },\n    {\n      \"value\": \"0xe45d2ce15abba3c67b9ff1e7a69225c855d3da82\",\n      \"label\": \"lvlUSD\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/6dde8fbb-d393-4d90-b3c3-6fc42b4adec7.svg\"\n    },\n    {\n      \"value\": \"0x1c71752a6c10d66375702aafad4b6d20393702cf\",\n      \"label\": \"slvlUSD\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/47ad4ea5-29ad-404e-8b86-a30b689dd4c3.svg\"\n    },\n    {\n      \"value\": \"0x9df192d13d61609d1852461c4850595e1f56e714\",\n      \"label\": \"USDe\",\n      \"expiry\": \"JUL 31, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7d81c8c9-f99a-4682-bbfc-b1814b8bd799.svg\"\n    },\n    {\n      \"value\": \"0xdfaab89058daca36759aafa80bebbc6dbf4c2e4e\",\n      \"label\": \"hgETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8054bcd0-a827-4fc8-868a-9164af9b3ac1.svg\"\n    }\n  ],\n  \"56\": [\n    {\n      \"value\": \"0xeda1d0e1681d59dea451702963d6287b844cb94c\",\n      \"label\": \"ankrBNB\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c172da67-2428-48cb-8602-58bfc0276af0.svg\"\n    },\n    {\n      \"value\": \"0x9daa2878a8739e66e08e7ad35316c5143c0ea7c7\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/eab31d5d-401e-4720-a5b4-6b90b73611e0.svg\"\n    },\n    {\n      \"value\": \"0x0921ccc98956b1599003fd9739d5e66bf319a161\",\n      \"label\": \"vBNB\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/821bd337-240a-4c03-b4cb-07c7f0d59544.svg\"\n    },\n    {\n      \"value\": \"0x1d9d27f0b89181cf1593ac2b36a37b444eb66bee\",\n      \"label\": \"clisBNB\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/609a2f5a-d97e-4015-b1c9-f93893e94620.svg\"\n    },\n    {\n      \"value\": \"0x9e515a7115c86d7314159dbdab41e555d5330dfe\",\n      \"label\": \"asUSDF\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c57a4c26-5a86-4171-b824-786243b15551.svg\"\n    },\n    {\n      \"value\": \"0xe08fc3054450053cd341da695f72b18e6110fffc\",\n      \"label\": \"sUSDX\",\n      \"expiry\": \"SEP 1, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ede8e258-479b-4705-a98b-5c506ffd3832.svg\"\n    }\n  ],\n  \"146\": [\n    {\n      \"value\": \"0x6e4e95fab7db1f0524b4b0a05f0b9c96380b7dfa\",\n      \"label\": \"wstkscUSD\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9d33074f-3fe7-4bf5-b12d-9cfe73c7d26d.svg\"\n    },\n    {\n      \"value\": \"0xd14117baf6ec5d12be68cd06e763a4b82c9b6d1d\",\n      \"label\": \"wstkscETH\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9674f014-0800-49a4-8fc9-a45c39f699d5.svg\"\n    },\n    {\n      \"value\": \"0x3aef1d372d0a7a7e482f465bc14a42d78f920392\",\n      \"label\": \"stS\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1bb28886-399a-484f-ac3d-19263a36ab73.svg\"\n    },\n    {\n      \"value\": \"0x4e82347bc41cfd5d62cef483c7f0a739a8158963\",\n      \"label\": \"wOS\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f8f75880-395d-49a0-9c58-17d0b149def3.svg\"\n    }\n  ],\n  \"5000\": [\n    {\n      \"value\": \"0x0b923f8039ae827e963fcc1b48ab5b903d01925b\",\n      \"label\": \"cmETH\",\n      \"expiry\": \"FEB 13, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/16ebbece-2e29-4e7b-acba-d3d23fa8dec0.svg\"\n    },\n    {\n      \"value\": \"0xec3fb79d229ef53c8b5cd64c171097ffc8a00dc5\",\n      \"label\": \"cmETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/16ebbece-2e29-4e7b-acba-d3d23fa8dec0.svg\"\n    }\n  ],\n  \"8453\": [\n    {\n      \"value\": null,\n      \"label\": \"LBTC-29MAY2025\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0x483f2e223c58a5ef19c4b32fbc6de57709749cb3\",\n      \"label\": \"cbETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/cec7c095-6d6c-400b-9509-c2b68a1f54f3.svg\"\n    },\n    {\n      \"value\": \"0x727cebacfb10ffd353fc221d06a862b437ec1735\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/95280b7c-e3a4-43ce-8a73-e544e2600624.svg\"\n    },\n    {\n      \"value\": \"0x3124d41708edbdc7995a55183e802e3d9d0d5ef1\",\n      \"label\": \"mUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dd3dd5af-a072-409a-af35-3ac803ede34a.svg\"\n    },\n    {\n      \"value\": \"0xd94fd7bceb29159405ae1e06ce80e51ef1a484b0\",\n      \"label\": \"mcbBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c877240e-a45b-4e8c-b42e-a2b6d96ed332.svg\"\n    },\n    {\n      \"value\": null,\n      \"label\": \"wsupperOETHb-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0xecc2c994aa0c599a7f69a7cfb9106fe4dffb4341\",\n      \"label\": \"wsuperOETHb\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ac4127a6-cda2-41ba-8db7-9cda2d2c2e94.svg\"\n    },\n    {\n      \"value\": \"0x14936c9b8eb798ca6291c2d6ce5de2c6cb5f1f9c\",\n      \"label\": \"sUSDz\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/296a6c38-c626-42f0-9cf1-456837aa29d4.svg\"\n    },\n    {\n      \"value\": \"0x621d4d92e9bed484e6d2cb8a37d342c804a0908c\",\n      \"label\": \"VIRTUAL/cbBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/706e880e-c1ee-4258-827e-5be4e935b0a8.svg\"\n    },\n    {\n      \"value\": \"0xe15578523937ed7f08e8f7a1fa8a021e07025a08\",\n      \"label\": \"USR\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ceb019d3-32ce-4dc5-875f-c930a0f2bde8.svg\"\n    }\n  ],\n  \"42161\": [\n    {\n      \"value\": null,\n      \"label\": \"wstETH-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": null,\n      \"label\": \"rETH-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0x08a152834de126d2ef83d612ff36e4523fd0017f\",\n      \"label\": \"wstETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ae07850a-421b-4fe1-87ec-5ba8fa65da68.svg\"\n    },\n    {\n      \"value\": \"0x14fbc760efaf36781cb0eb3cb255ad976117b9bd\",\n      \"label\": \"rETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dca97a36-3121-46db-a22f-154d68e4b466.svg\"\n    },\n    {\n      \"value\": \"0xe9e114d1b119bbdeb7a35e1ce3c82db01622ada2\",\n      \"label\": \"PENDLE-ETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c1e597df-fb6b-4475-9d3f-7f8bcd08bbeb.svg\"\n    },\n    {\n      \"value\": \"0x526c73e0ba9cedb44546da4506eaee0b39be8d76\",\n      \"label\": \"gDAI\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d21b47c3-f316-430e-ba22-1bd07e63f0bb.svg\"\n    },\n    {\n      \"value\": \"0x0bd6890b3bb15f16430546147734b254d0b03059\",\n      \"label\": \"dUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/590ebc0d-ad8a-4574-92c7-364c557a2a13.svg\"\n    },\n    {\n      \"value\": \"0x8cab5fd029ae2fbf28c53e965e4194c7260adf0c\",\n      \"label\": \"dWBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/b0d49b1b-01ed-4c17-b07c-bd66159b94a2.svg\"\n    },\n    {\n      \"value\": \"0x816f59ffa2239fd7106f94eabdc0a9547a892f2f\",\n      \"label\": \"rsETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/aa206b8c-0a44-4ee3-aeb4-95e9087424d0.svg\"\n    },\n    {\n      \"value\": \"0x3be83cc235455ae1b624cf6e326505769ad8f9ea\",\n      \"label\": \"spSILO\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/79b08c9a-ac55-41b9-b767-96c95afb8269.svg\"\n    },\n    {\n      \"value\": \"0xbf5e60ddf654085f80dae9dd33ec0e345773e1f8\",\n      \"label\": \"eETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d5b1f12c-7cb3-4572-9bb7-68865c138cd6.svg\"\n    },\n    {\n      \"value\": \"0x3e4e3291ed667fb4dee680d19e5702ef8275493d\",\n      \"label\": \"uniETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/507bfb70-4c6b-4480-8ef8-b7cc250b82e2.svg\"\n    },\n    {\n      \"value\": \"0xf1de71573ee482f13ae4dcf980e83bfaba8b233d\",\n      \"label\": \"MUXLP\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5a74829d-0611-46cc-9fa5-98fcc13870a8.svg\"\n    },\n    {\n      \"value\": \"0x22e0f26320ace985e3cb2434095f18bfe114e28e\",\n      \"label\": \"gUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/fc507e18-ddcd-48ce-8518-8f3610719a2b.svg\"\n    },\n    {\n      \"value\": \"0x4505ec38982bb796b34d050ca8d765acff1abdee\",\n      \"label\": \"aUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/db96e8da-a779-43df-b012-ceeb3d298c8d.svg\"\n    },\n    {\n      \"value\": \"0x9ff912568eb011d719b5f4e940f8135633f4bcdc\",\n      \"label\": \"mPENDLE\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8592b56d-0004-4b30-9604-9f82bb32abac.png\"\n    },\n    {\n      \"value\": \"0xd0fdb5ee558b3bcd9e5bc1344b28b2249de6559c\",\n      \"label\": \"ePENDLE\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/e7a078b9-3bb4-4fdf-9319-124e0389b463.svg\"\n    }\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "renderEnum": "\n    (env) => {\n      if (!env.parameters.chainId)\n        throw new Error('You need to provide the chainId first');\n\n      const availableMarketsList = {\n  \"1\": [\n    {\n      \"value\": \"0xc374f7ec85f8c7de3207a10bb1978ba104bda3b2\",\n      \"label\": \"stETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ac9b8802-61d9-4c3f-a2de-2da35c87e24b.svg\"\n    },\n    {\n      \"value\": \"0x34280882267ffa6383b363e278b027be083bbe3b\",\n      \"label\": \"stETH\",\n      \"expiry\": \"DEC 30, 2027\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f7d6a626-a00e-4150-aadc-e937e34818ca.svg\"\n    },\n    {\n      \"value\": \"0xe6d4986cd935529fc4505d48e926bcd36a58a0f0\",\n      \"label\": \"apxETH\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/151c9217-2512-4d26-b9d0-755c49299b12.svg\"\n    },\n    {\n      \"value\": \"0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/56eb1ed3-d1f7-4685-a7b2-5a6e05cb234f.svg\"\n    },\n    {\n      \"value\": \"0xb451a36c8b6b2eac77ad0737ba732818143a0e25\",\n      \"label\": \"USDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7299bcd0-6ba1-411e-8d54-f7e5b68aa154.svg\"\n    },\n    {\n      \"value\": \"0x7e0209ab6fa3c7730603b68799bbe9327dab7e88\",\n      \"label\": \"rsENA\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/37110810-606f-4d92-8ea8-5ede71d6abdc.svg\"\n    },\n    {\n      \"value\": \"0x890b6afc834c2a2cc6cb9b6627272ab4ecfd8271\",\n      \"label\": \"rsUSDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1d444261-bdf7-483b-8e35-bdb725a702ce.svg\"\n    },\n    {\n      \"value\": \"0x70b70ac0445c3ef04e314dfda6caafd825428221\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/773047f5-3963-4577-93f9-4333f225442c.svg\"\n    },\n    {\n      \"value\": \"0x977ebf77581f94de969349549ab2108a681e8f4c\",\n      \"label\": \"USDS Rewards\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/bdf98058-9191-44bf-b9a7-4a460457f756.svg\"\n    },\n    {\n      \"value\": \"0xc64056237c8107ecb9860cbd4519644e9ba2aed4\",\n      \"label\": \"sENA\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/34ccfdb6-4acf-4d13-8dc9-080b47dfb8fa.svg\"\n    },\n    {\n      \"value\": \"0x21d85ff3bedff031ef466c7d5295240c8ab2a2b8\",\n      \"label\": \"sUSDS\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3226daff-03a2-4078-af4e-28a72ef5b252.svg\"\n    },\n    {\n      \"value\": \"0x8098b48a1c4e4080b30a43a7ebc0c87b52f17222\",\n      \"label\": \"pumpBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/df3270cd-7ee9-4119-8ad8-c81336fad690.svg\"\n    },\n    {\n      \"value\": \"0x2c71ead7ac9ae53d05f8664e77031d4f9eba064b\",\n      \"label\": \"eBTC (Corn)\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/35a6e08f-82da-49cf-8dc0-c120a4386b0f.svg\"\n    },\n    {\n      \"value\": \"0xafdc922d0059147486cc1f0f32e3a2354b0d35cc\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x07c5b1f5265591a8e0e541466654b07dd2d1a6fd\",\n      \"label\": \"eEIGEN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/33c90ae2-9675-4f9f-80e8-0554dc0dc5b5.svg\"\n    },\n    {\n      \"value\": \"0xff81180a7f949ba1f940eae6aa3b3ceb890b1912\",\n      \"label\": \"stkGHO\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/05cdb874-4679-4b6a-bedc-9de81e817e79.svg\"\n    },\n    {\n      \"value\": \"0xfd482179ddee989c45eab19991852f80ff31457a\",\n      \"label\": \"rsETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/be3e997d-8f3c-46ed-b978-2518668aaa2b.svg\"\n    },\n    {\n      \"value\": \"0xf4cf59259d007a96c641b41621ab52c93b9691b1\",\n      \"label\": \"eETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/58971e16-6cf3-4ac4-9f3a-df82267fc5c8.svg\"\n    },\n    {\n      \"value\": \"0x98ffefd1a51d322c8def6d0ba183e71547216f7f\",\n      \"label\": \"eBTC (Zerolend)\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/39b1b707-b537-4c87-811d-110047aa7b9f.svg\"\n    },\n    {\n      \"value\": \"0xbe8549a20257917a0a9ef8911daf18190a8842a4\",\n      \"label\": \"agETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d4f45c90-7317-4d07-ae67-1e8ec9caa9a7.svg\"\n    },\n    {\n      \"value\": \"0xbba9baaa6b3107182147a12177e0f1ec46b8b072\",\n      \"label\": \"uniETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/025623d4-1fc4-44db-b981-03d60d93d90a.svg\"\n    },\n    {\n      \"value\": \"0x58612beb0e8a126735b19bb222cbc7fc2c162d2a\",\n      \"label\": \"pufETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ad53c3bf-7a0c-481e-80cd-0eea4e0e9554.svg\"\n    },\n    {\n      \"value\": \"0xb162b764044697cf03617c2efbcb1f42e31e4766\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8fdd3402-5238-4e90-b4db-12e32ea28e67.svg\"\n    },\n    {\n      \"value\": \"0xfd5cf95e8b886ace955057ca4dc69466e793fbbe\",\n      \"label\": \"rswETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/221673b1-5839-4140-ad82-3f865dc05c4d.png\"\n    },\n    {\n      \"value\": \"0x048680f64d6dff1748ba6d9a01f578433787e24b\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x461cd9222e130d1dc0bd79dab4643952430937c1\",\n      \"label\": \"pWBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f59d005c-a34f-40e3-bdf7-bd84c2094765.svg\"\n    },\n    {\n      \"value\": \"0x2bf616c236d1abd31ff105247a774e6e738b5f4e\",\n      \"label\": \"scrvUSD\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/50bc1fdb-ca50-4c38-9a0c-1669e35896f1.svg\"\n    },\n    {\n      \"value\": \"0x15e434c42ab4c9a62ed7db53baaf9d255ea51e0e\",\n      \"label\": \"OETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/af71269f-d089-47f1-8106-532af44b49e0.svg\"\n    },\n    {\n      \"value\": \"0x3fd13bad9fc47e001bf9088afd1a1b2fc24673d5\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/abdb21c4-7fc2-44f7-bbbb-27416583ac66.svg\"\n    },\n    {\n      \"value\": \"0x380c751bd0412f47ca560b6afeb566d88dc18630\",\n      \"label\": \"uniBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/04bdd8ee-4a79-48c5-88a0-b2593ebf939d.svg\"\n    },\n    {\n      \"value\": \"0xd3c29550d12a5234e6aeb5aea7c841134cd6ddd5\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ecaa79c6-7223-48e9-a3f0-30e10dbbfbfe.svg\"\n    },\n    {\n      \"value\": \"0x22a72b0c504cbb7f8245208f84d8f035c311adec\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x81f3a11db1de16f4f9ba8bf46b71d2b168c64899\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x8539b41ca14148d1f7400d399723827a80579414\",\n      \"label\": \"aUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1d127217-c2d1-4e5c-9bf4-70ae1a208d28.svg\"\n    },\n    {\n      \"value\": \"0x12f6139a5dc6d80990d30a4d45bb86449ff804d8\",\n      \"label\": \"aUSDT\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a875dcab-6a6d-449a-b519-dce222d873c9.svg\"\n    },\n    {\n      \"value\": \"0x925cd38a68993819eef0138a463308c840080f17\",\n      \"label\": \"fUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9049a93c-6645-4c84-b19f-9ebfa0cce6dd.svg\"\n    },\n    {\n      \"value\": \"0x8e1c2be682b0d3d8f8ee32024455a34cc724cf08\",\n      \"label\": \"fUSDT\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/6c349c1b-9671-489c-be2c-8750738da3aa.svg\"\n    },\n    {\n      \"value\": \"0xab182e2a98234db8298565f0eb9327206b558c57\",\n      \"label\": \"weETHk\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9f9ec77b-efe0-4119-a4fc-a733ff5fd04a.svg\"\n    },\n    {\n      \"value\": \"0x7509b6bdb9e6dbf6c4b054434dcb46c40000303b\",\n      \"label\": \"weETHs\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2244883b-428a-4f86-ad63-dcaa143b70d6.svg\"\n    },\n    {\n      \"value\": \"0xa25f5ed89e6e7b3d23ebaf067a30ac3d550a19c1\",\n      \"label\": \"eBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/685e07f1-e50d-4ff9-bac2-158611f718a6.svg\"\n    },\n    {\n      \"value\": \"0x523f9441853467477b4dde653c554942f8e17162\",\n      \"label\": \"eBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/685e07f1-e50d-4ff9-bac2-158611f718a6.svg\"\n    },\n    {\n      \"value\": \"0xb9b7840ec34094ce1269c38ba7a6ac7407f9c4e3\",\n      \"label\": \"USUALx\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ff146e2f-3e2d-4e71-9a9d-e1a866b75da2.svg\"\n    },\n    {\n      \"value\": \"0x353d0b2efb5b3a7987fb06d30ad6160522d08426\",\n      \"label\": \"wstUSR\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7a8188bd-cae6-492d-b30d-cbd128493f00.svg\"\n    },\n    {\n      \"value\": \"0x99b633a6a2e0d6414e7c7ecea1134c0a330a73fe\",\n      \"label\": \"uniBTC (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7ce722a1-c74e-4226-a80d-1028861e4b62.svg\"\n    },\n    {\n      \"value\": \"0xc118635bcde024c5b01c6be2b0569a2608a8032c\",\n      \"label\": \"LBTC (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/0b1f24c8-2a29-46bd-b400-5f7043e3c573.svg\"\n    },\n    {\n      \"value\": \"0xe6b03f3182692db1ed7d3a91f6fadf3e4dff2b95\",\n      \"label\": \"SolvBTC.BBN (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/4b1032d7-94ba-4075-8233-85808d186ebd.svg\"\n    },\n    {\n      \"value\": \"0x3dc05f96160bdf70cf23989a632c087ebc022f92\",\n      \"label\": \"pumpBTC\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/df3270cd-7ee9-4119-8ad8-c81336fad690.svg\"\n    },\n    {\n      \"value\": \"0xebf5c58b74a836f1e51d08e9c909c4a4530afd41\",\n      \"label\": \"liquidBeraBTC\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5506f24b-06b7-4f28-af95-11f5c8b0e085.svg\"\n    },\n    {\n      \"value\": \"0x46e6b4a950eb1abba159517dea956afd01ea9497\",\n      \"label\": \"liquidBeraETH\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5ab37246-4c5b-4a95-a534-e60ec618010b.svg\"\n    },\n    {\n      \"value\": \"0xad016c9565a4aeec6d4cfc8a01c648ecbea1a602\",\n      \"label\": \"sUSDe (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/aa218d17-62e2-42a4-986b-4f6fcebf9aa4.svg\"\n    },\n    {\n      \"value\": \"0xe6df8d8879595100e4b6b359e6d0712e107c7472\",\n      \"label\": \"USDe (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/85be79d7-942c-4cc9-b364-5e1c891a242b.svg\"\n    },\n    {\n      \"value\": \"0x7561c5ccfe41a26b33944b58c70d6a3cb63e881c\",\n      \"label\": \"beraSTONE\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/378a54dc-779f-40f0-b859-03dbb3b425e8.svg\"\n    },\n    {\n      \"value\": \"0x83916356556f51dcbcb226202c3efeefc88d5eaa\",\n      \"label\": \"LBTC (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/39e54d77-2c8f-49f2-ba92-b40386a55673.svg\"\n    },\n    {\n      \"value\": \"0x9471d9c5b57b59d42b739b00389a6d520c33a7a9\",\n      \"label\": \"WBTC (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/0a043dbb-827c-4692-9c52-272745db30c3.svg\"\n    },\n    {\n      \"value\": \"0x580e40c15261f7baf18ea50f562118ae99361096\",\n      \"label\": \"syrupUSDC\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3bebc608-b228-4b1a-81de-363ee24b999b.svg\"\n    },\n    {\n      \"value\": \"0xc387ad871d94990e073f1bd0b759ffdb5e0313aa\",\n      \"label\": \"SolvBTC.BERA\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/b9407b43-e7fe-4b27-a78d-0e1db14b8a4b.svg\"\n    },\n    {\n      \"value\": \"0xd75fc2b1ca52e72163787d1c370650f952e75dd7\",\n      \"label\": \"sUSDa\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ddcbbbc3-af3c-4b35-a2a6-ebd4e0189256.svg\"\n    },\n    {\n      \"value\": \"0xbdb8f9729d3194f75fd1a3d9bc4ffe0dde3a404c\",\n      \"label\": \"tETH\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d8db35e6-a493-4879-b0de-a9b3fb40924c.svg\"\n    },\n    {\n      \"value\": \"0x4d7356369273c6373e6c5074fe540cb070acfe6b\",\n      \"label\": \"asdCRV\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2ad15ff1-e832-4786-9da3-fac560d1a34c.svg\"\n    },\n    {\n      \"value\": \"0x82d810ededb09614144900f914e75dd76700f19d\",\n      \"label\": \"GHO-USR\",\n      \"expiry\": \"JUL 31, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dd2ad4a1-0279-4b85-a53a-22a79b8f4268.svg\"\n    },\n    {\n      \"value\": \"0x1bd1ae9d7a377e63cd0c584a2c42b8c614937e81\",\n      \"label\": \"SuperUSDC\",\n      \"expiry\": \"APR 17, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/cd6bc969-f075-4fc3-8aa8-463e9b6c9eec.svg\"\n    },\n    {\n      \"value\": \"0x931f7ea0c31c14914a452d341bc5cb5d996be71d\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/773047f5-3963-4577-93f9-4333f225442c.svg\"\n    },\n    {\n      \"value\": \"0xb6b2cf977c512bcd195b58e2ccfb3fb15535cb19\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/abdb21c4-7fc2-44f7-bbbb-27416583ac66.svg\"\n    },\n    {\n      \"value\": \"0x928e2e42f3b21c9af0e0454d7bb3884e5d36e1be\",\n      \"label\": \"uniBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/04bdd8ee-4a79-48c5-88a0-b2593ebf939d.svg\"\n    },\n    {\n      \"value\": \"0xf6906f99e2ce8cf2d7098216da87e261b13554c8\",\n      \"label\": \"USDe\",\n      \"expiry\": \"JUL 31, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7d81c8c9-f99a-4682-bbfc-b1814b8bd799.svg\"\n    },\n    {\n      \"value\": \"0x887f62e4189c6b04cc6db1478fb71976fd1e84bf\",\n      \"label\": \"eUSDe\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/4528cf44-94f3-4c34-a88a-21ef0afa8e5a.svg\"\n    },\n    {\n      \"value\": \"0x887f62e4189c6b04cc6db1478fb71976fd1e84bf\",\n      \"label\": \"eUSDe\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1870cf48-db97-4339-b63d-57779cd883b8.svg\"\n    },\n    {\n      \"value\": \"0x35a18cd59a214c9e797e14b1191b700eea251f6a\",\n      \"label\": \"USR\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8ff8d223-0c47-411d-9588-1ca661543bf4.svg\"\n    },\n    {\n      \"value\": \"0xe45d2ce15abba3c67b9ff1e7a69225c855d3da82\",\n      \"label\": \"lvlUSD\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/6dde8fbb-d393-4d90-b3c3-6fc42b4adec7.svg\"\n    },\n    {\n      \"value\": \"0x1c71752a6c10d66375702aafad4b6d20393702cf\",\n      \"label\": \"slvlUSD\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/47ad4ea5-29ad-404e-8b86-a30b689dd4c3.svg\"\n    },\n    {\n      \"value\": \"0x9df192d13d61609d1852461c4850595e1f56e714\",\n      \"label\": \"USDe\",\n      \"expiry\": \"JUL 31, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7d81c8c9-f99a-4682-bbfc-b1814b8bd799.svg\"\n    },\n    {\n      \"value\": \"0xdfaab89058daca36759aafa80bebbc6dbf4c2e4e\",\n      \"label\": \"hgETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8054bcd0-a827-4fc8-868a-9164af9b3ac1.svg\"\n    }\n  ],\n  \"56\": [\n    {\n      \"value\": \"0xeda1d0e1681d59dea451702963d6287b844cb94c\",\n      \"label\": \"ankrBNB\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c172da67-2428-48cb-8602-58bfc0276af0.svg\"\n    },\n    {\n      \"value\": \"0x9daa2878a8739e66e08e7ad35316c5143c0ea7c7\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/eab31d5d-401e-4720-a5b4-6b90b73611e0.svg\"\n    },\n    {\n      \"value\": \"0x0921ccc98956b1599003fd9739d5e66bf319a161\",\n      \"label\": \"vBNB\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/821bd337-240a-4c03-b4cb-07c7f0d59544.svg\"\n    },\n    {\n      \"value\": \"0x1d9d27f0b89181cf1593ac2b36a37b444eb66bee\",\n      \"label\": \"clisBNB\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/609a2f5a-d97e-4015-b1c9-f93893e94620.svg\"\n    },\n    {\n      \"value\": \"0x9e515a7115c86d7314159dbdab41e555d5330dfe\",\n      \"label\": \"asUSDF\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c57a4c26-5a86-4171-b824-786243b15551.svg\"\n    },\n    {\n      \"value\": \"0xe08fc3054450053cd341da695f72b18e6110fffc\",\n      \"label\": \"sUSDX\",\n      \"expiry\": \"SEP 1, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ede8e258-479b-4705-a98b-5c506ffd3832.svg\"\n    }\n  ],\n  \"146\": [\n    {\n      \"value\": \"0x6e4e95fab7db1f0524b4b0a05f0b9c96380b7dfa\",\n      \"label\": \"wstkscUSD\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9d33074f-3fe7-4bf5-b12d-9cfe73c7d26d.svg\"\n    },\n    {\n      \"value\": \"0xd14117baf6ec5d12be68cd06e763a4b82c9b6d1d\",\n      \"label\": \"wstkscETH\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9674f014-0800-49a4-8fc9-a45c39f699d5.svg\"\n    },\n    {\n      \"value\": \"0x3aef1d372d0a7a7e482f465bc14a42d78f920392\",\n      \"label\": \"stS\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1bb28886-399a-484f-ac3d-19263a36ab73.svg\"\n    },\n    {\n      \"value\": \"0x4e82347bc41cfd5d62cef483c7f0a739a8158963\",\n      \"label\": \"wOS\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f8f75880-395d-49a0-9c58-17d0b149def3.svg\"\n    }\n  ],\n  \"5000\": [\n    {\n      \"value\": \"0x0b923f8039ae827e963fcc1b48ab5b903d01925b\",\n      \"label\": \"cmETH\",\n      \"expiry\": \"FEB 13, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/16ebbece-2e29-4e7b-acba-d3d23fa8dec0.svg\"\n    },\n    {\n      \"value\": \"0xec3fb79d229ef53c8b5cd64c171097ffc8a00dc5\",\n      \"label\": \"cmETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/16ebbece-2e29-4e7b-acba-d3d23fa8dec0.svg\"\n    }\n  ],\n  \"8453\": [\n    {\n      \"value\": null,\n      \"label\": \"LBTC-29MAY2025\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0x483f2e223c58a5ef19c4b32fbc6de57709749cb3\",\n      \"label\": \"cbETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/cec7c095-6d6c-400b-9509-c2b68a1f54f3.svg\"\n    },\n    {\n      \"value\": \"0x727cebacfb10ffd353fc221d06a862b437ec1735\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/95280b7c-e3a4-43ce-8a73-e544e2600624.svg\"\n    },\n    {\n      \"value\": \"0x3124d41708edbdc7995a55183e802e3d9d0d5ef1\",\n      \"label\": \"mUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dd3dd5af-a072-409a-af35-3ac803ede34a.svg\"\n    },\n    {\n      \"value\": \"0xd94fd7bceb29159405ae1e06ce80e51ef1a484b0\",\n      \"label\": \"mcbBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c877240e-a45b-4e8c-b42e-a2b6d96ed332.svg\"\n    },\n    {\n      \"value\": null,\n      \"label\": \"wsupperOETHb-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0xecc2c994aa0c599a7f69a7cfb9106fe4dffb4341\",\n      \"label\": \"wsuperOETHb\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ac4127a6-cda2-41ba-8db7-9cda2d2c2e94.svg\"\n    },\n    {\n      \"value\": \"0x14936c9b8eb798ca6291c2d6ce5de2c6cb5f1f9c\",\n      \"label\": \"sUSDz\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/296a6c38-c626-42f0-9cf1-456837aa29d4.svg\"\n    },\n    {\n      \"value\": \"0x621d4d92e9bed484e6d2cb8a37d342c804a0908c\",\n      \"label\": \"VIRTUAL/cbBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/706e880e-c1ee-4258-827e-5be4e935b0a8.svg\"\n    },\n    {\n      \"value\": \"0xe15578523937ed7f08e8f7a1fa8a021e07025a08\",\n      \"label\": \"USR\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ceb019d3-32ce-4dc5-875f-c930a0f2bde8.svg\"\n    }\n  ],\n  \"42161\": [\n    {\n      \"value\": null,\n      \"label\": \"wstETH-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": null,\n      \"label\": \"rETH-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0x08a152834de126d2ef83d612ff36e4523fd0017f\",\n      \"label\": \"wstETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ae07850a-421b-4fe1-87ec-5ba8fa65da68.svg\"\n    },\n    {\n      \"value\": \"0x14fbc760efaf36781cb0eb3cb255ad976117b9bd\",\n      \"label\": \"rETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dca97a36-3121-46db-a22f-154d68e4b466.svg\"\n    },\n    {\n      \"value\": \"0xe9e114d1b119bbdeb7a35e1ce3c82db01622ada2\",\n      \"label\": \"PENDLE-ETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c1e597df-fb6b-4475-9d3f-7f8bcd08bbeb.svg\"\n    },\n    {\n      \"value\": \"0x526c73e0ba9cedb44546da4506eaee0b39be8d76\",\n      \"label\": \"gDAI\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d21b47c3-f316-430e-ba22-1bd07e63f0bb.svg\"\n    },\n    {\n      \"value\": \"0x0bd6890b3bb15f16430546147734b254d0b03059\",\n      \"label\": \"dUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/590ebc0d-ad8a-4574-92c7-364c557a2a13.svg\"\n    },\n    {\n      \"value\": \"0x8cab5fd029ae2fbf28c53e965e4194c7260adf0c\",\n      \"label\": \"dWBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/b0d49b1b-01ed-4c17-b07c-bd66159b94a2.svg\"\n    },\n    {\n      \"value\": \"0x816f59ffa2239fd7106f94eabdc0a9547a892f2f\",\n      \"label\": \"rsETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/aa206b8c-0a44-4ee3-aeb4-95e9087424d0.svg\"\n    },\n    {\n      \"value\": \"0x3be83cc235455ae1b624cf6e326505769ad8f9ea\",\n      \"label\": \"spSILO\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/79b08c9a-ac55-41b9-b767-96c95afb8269.svg\"\n    },\n    {\n      \"value\": \"0xbf5e60ddf654085f80dae9dd33ec0e345773e1f8\",\n      \"label\": \"eETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d5b1f12c-7cb3-4572-9bb7-68865c138cd6.svg\"\n    },\n    {\n      \"value\": \"0x3e4e3291ed667fb4dee680d19e5702ef8275493d\",\n      \"label\": \"uniETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/507bfb70-4c6b-4480-8ef8-b7cc250b82e2.svg\"\n    },\n    {\n      \"value\": \"0xf1de71573ee482f13ae4dcf980e83bfaba8b233d\",\n      \"label\": \"MUXLP\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5a74829d-0611-46cc-9fa5-98fcc13870a8.svg\"\n    },\n    {\n      \"value\": \"0x22e0f26320ace985e3cb2434095f18bfe114e28e\",\n      \"label\": \"gUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/fc507e18-ddcd-48ce-8518-8f3610719a2b.svg\"\n    },\n    {\n      \"value\": \"0x4505ec38982bb796b34d050ca8d765acff1abdee\",\n      \"label\": \"aUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/db96e8da-a779-43df-b012-ceeb3d298c8d.svg\"\n    },\n    {\n      \"value\": \"0x9ff912568eb011d719b5f4e940f8135633f4bcdc\",\n      \"label\": \"mPENDLE\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8592b56d-0004-4b30-9604-9f82bb32abac.png\"\n    },\n    {\n      \"value\": \"0xd0fdb5ee558b3bcd9e5bc1344b28b2249de6559c\",\n      \"label\": \"ePENDLE\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/e7a078b9-3bb4-4fdf-9319-124e0389b463.svg\"\n    }\n  ]\n};\n      const chainId = env.parameters.chainId;\n      const availableMarkets = availableMarketsList[chainId] || [];\n\n      const htmlGrid = `\n        <div style=\"\n          maxWidth: 1200px;\n          margin: 20px auto;\n          padding: 20px;\">\n          \n          <div style=\"\n            backgroundColor: #1f1f23;\n            borderRadius: 8px;\n            padding: 20px;\n            boxShadow: 0 4px 6px rgba(0, 0, 0, 0.1);\">\n            \n            <div style=\"\n              display: grid;\n              gridTemplateColumns: repeat(auto-fill, minmax(300px, 1fr));\n              gap: 16px;\">\n              \n              ${availableMarkets.map(market => `\n                <div\n                  class=\"rendered-enum-row\"\n                  key=\"${market.address}\"\n                  id=\"${market.address}\" \n                  target-param=\"abiParams.marketAddress\"\n                  data-market=\"${market.address}\"\n                  style=\"\n                    display: flex;\n                    alignItems: center;\n                    gap: 12px;\n                    padding: 12px;\n                    borderRadius: 6px;\n                    cursor: pointer;\n                    transition: background-color 0.2s;\n                    backgroundColor: transparent;\"\n                  onMouseEnter=\"this.style.backgroundColor='#2d2d33'\"\n                  onMouseLeave=\"this.style.backgroundColor='transparent'\">\n                  \n                  <img\n                    src=\"${market.image || '/placeholder.svg'}\"\n                    alt=\"${market.label}\"\n                    style=\"\n                      width: 40px;\n                      height: 40px;\n                      borderRadius: 50%;\" />\n                      \n                  <div>\n                    <div style=\"\n                      color: white;\n                      fontWeight: 500;\n                      fontSize: 16px;\">\n                      ${market.label}\n                    </div>\n                    <div style=\"\n                      color: #a1a1aa;\n                      fontSize: 14px;\">\n                      ${market.expiry}\n                    </div>\n                  </div>\n                </div>\n              `).join('')}\n            </div>\n          </div>\n        </div>\n      `;\n\n      return htmlGrid;\n    }\n  "
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "ptImpliedYield": "float"
        },
        "examples": [
          {
            "name": "PT Implied Yield for USUALx Market",
            "description": "Retrieves the PT implied yield for the USUALx market on Ethereum.",
            "externalVariableDescription": "Fetches the current PT implied yield for USUALx market on Ethereum",
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "marketAddress",
                "value": "0xb9b7840ec34094ce1269c38ba7a6ac7407f9c4e3"
              }
            ]
          }
        ],
        "blockId": 101,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/pendle.webp",
        "comingSoon": true
      }
    }
  },
  "LENDING": {
    "IONIC": {
      "description": "Yield-bearing money market on the OP Superchain",
      "chains": [
        34443,
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any asset on Ionic",
        "prototype": "ionicLendingRate",
        "type": 1,
        "method": "function supplyRatePerBlock() external view returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "token",
            "type": "erc20",
            "description": "The token you want to fetch the yield",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "USDT Yield is above 5%",
            "description": "Gets triggered when USDT yield rises above 5% on Ionic",
            "externalVariableDescription": "Fetches the current USDT lending rate on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "token",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              },
              {
                "key": "condition",
                "value": "gte"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "output": {
          "lendingRate": "float"
        },
        "blockId": 15,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg"
      },
      "BORROWING_RATES": {
        "name": "Borrowing rate",
        "description": "Get the borrowing rate of any asset on Ionic",
        "type": 1,
        "prototype": "ionicBorrowingRate",
        "method": "function borrowRatePerBlock() external view returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "token",
            "type": "erc20",
            "description": "The token you want to fetch the borrow rate for",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "USDT Borrowing Rate is below 3%",
            "description": "Gets triggered when the USDT borrowing rate falls below 3% on Ionic",
            "externalVariableDescription": "Fetches the current USDT borrowing rate on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "token",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              },
              {
                "key": "condition",
                "value": "lte"
              },
              {
                "key": "comparisonValue",
                "value": 3
              }
            ]
          }
        ],
        "output": {
          "borrowingRate": "float"
        },
        "blockId": 17,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg"
      }
    },
    "ASTARIA": {
      "description": "Intent-based lending protocol",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/astaria.png",
      "LEND_RECALLED": {
        "name": "Lend Recalled",
        "description": "Lend recalled in Astaria",
        "type": 0,
        "contractAddress": "0x0000000002546f9C641E000DD4b22875236BC147",
        "output": {
          "loanId": "uint256",
          "recaller": "address",
          "end": "uint256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the EVM blockchain",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.loanId",
            "type": "uint256",
            "description": "Loan ID",
            "category": 0
          },
          {
            "key": "abiParams.recaller",
            "type": "address",
            "description": "Recaller address",
            "category": 1
          },
          {
            "key": "abiParams.end",
            "type": "uint256",
            "description": "End time",
            "category": 1
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Any loan recalled",
            "description": "Gets triggered when a loan is recalled on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              }
            ]
          },
          {
            "name": "A specific loan recalled",
            "description": "Gets triggered when loan #123 is recalled",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.loanId",
                "value": 123
              }
            ]
          },
          {
            "name": "Recalled by specific address",
            "description": "Gets triggered when vitalik.eth recalls a loan",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.recaller",
                "value": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              }
            ]
          }
        ],
        "blockId": 8,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/astaria.png"
      }
    },
    "AAVE": {
      "description": "The most used protocol for borrowing and lending",
      "chains": [
        8453,
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any asset on Aave",
        "prototype": "aaveLendingRate",
        "type": 1,
        "method": "function getReserveData(address asset) external view returns (uint256 totalLiquidity, uint256 availableLiquidity, uint256 totalBorrowsStable, uint256 totalBorrowsVariable, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 utilizationRate, uint256 liquidityIndex, uint256 variableBorrowIndex, address aTokenAddress, uint40 lastUpdateTimestamp)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token you want to fetch the lending rate",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "lendingRate": "float"
        },
        "examples": [
          {
            "name": "USDC Lending Rate is above 5%",
            "description": "USDC Lending Rate is above 5% on Base",
            "externalVariableDescription": "Fetches the current USDC lending rate on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "blockId": 19,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png"
      },
      "BORROWING_RATES": {
        "name": "Borrowing rate",
        "description": "Get the borrowing rate of any asset on Aave",
        "type": 1,
        "prototype": "aaveBorrowingRate",
        "method": "function getReserveData(address asset) external view returns (uint256 totalLiquidity, uint256 availableLiquidity, uint256 totalBorrowsStable, uint256 totalBorrowsVariable, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 utilizationRate, uint256 liquidityIndex, uint256 variableBorrowIndex, address aTokenAddress, uint40 lastUpdateTimestamp)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token you want to fetch the borrow rate for",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "borrowingRate": "float"
        },
        "examples": [
          {
            "name": "USDC Borrowing Rate is above 3%",
            "description": "USDC Borrowing Rate is above 3% on Base",
            "externalVariableDescription": "Fetches the current USDC borrowing rate on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 3
              }
            ]
          }
        ],
        "blockId": 20,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png"
      },
      "LTV": {
        "name": "LTV",
        "description": "Get the maximum and current Loan-to-Value (LTV) ratios for the given wallet address on Aave",
        "type": 1,
        "prototype": "aaveLTV",
        "method": "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.user",
            "type": "address",
            "description": "The wallet address to fetch Aave account data for",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "maxLTV": "float",
          "currentLTV": "float"
        },
        "examples": [
          {
            "name": "AAVE LTV for wallet address",
            "description": "Fetches the maximum and current LTV for the given wallet address on Aave on Ethereum",
            "externalVariableDescription": "AAVE LTV data",
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "abiParams.user",
                "value": "0x9332D0cE5D45184515e0EA85bf9f4af09Cbf10Af"
              },
              {
                "key": "condition",
                "value": "gte"
              },
              {
                "key": "comparisonValue",
                "value": 60
              }
            ]
          }
        ],
        "blockId": 2,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png"
      },
      "HEALTH_FACTOR": {
        "name": "Health Factor",
        "description": "Get the health factor for a given account on Aave",
        "type": 1,
        "prototype": "aaveHealthFactor",
        "method": "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.user",
            "type": "address",
            "description": "The wallet address to fetch Aave account data for",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "healthFactor": "float"
        },
        "examples": [
          {
            "name": "AAVE Health Factor for wallet address",
            "description": "Fetches the health factor for the given wallet address on Aave on Ethereum",
            "externalVariableDescription": "AAVE health factor",
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "abiParams.user",
                "value": "0x9332D0cE5D45184515e0EA85bf9f4af09Cbf10Af"
              },
              {
                "key": "condition",
                "value": "lte"
              },
              {
                "key": "comparisonValue",
                "value": 1.2
              }
            ]
          }
        ],
        "blockId": 3,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png"
      }
    },
    "MOONWELL": {
      "description": "Yield-bearing money market",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of an asset on Moonwell",
        "prototype": "moonwellLendingRate",
        "type": 1,
        "method": "function getMarketInfo(address token) external view returns ((address market, bool isListed, uint256 borrowCap, uint256 supplyCap, bool mintPaused, bool borrowPaused, uint256 collateralFactor, uint256 underlyingPrice, uint256 totalSupply, uint256 totalBorrows, uint256 totalReserves, uint256 cash, uint256 exchangeRate, uint256 borrowIndex, uint256 reserveFactor, uint256 borrowRate, uint256 supplyRate, (address token, uint256 supplyIncentivesPerSec, uint256 borrowIncentivesPerSec)[] incentives))",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token you want to fetch the yield",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\n    \"0xEDfa23602D0EC14714057867A78d01e94176BEA0\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "lendingRate": "float",
          "incentives": "[]",
          "underlyingPrice": "uint256",
          "totalSupply": "uint256",
          "supplyRate": "uint256",
          "exchangeRate": "uint256"
        },
        "examples": [
          {
            "name": "USDC Lending Rate is above 5%",
            "description": "USDC Lending Rate is above 5%",
            "externalVariableDescription": "Fetches the current USDC lending rate on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "blockId": 21,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png"
      },
      "BORROWING_RATES": {
        "name": "Borrowing rate",
        "description": "Get the borrowing rate of any asset on Moonwell",
        "type": 1,
        "prototype": "moonwellBorrowingRate",
        "method": "function getMarketInfo(address token) external view returns ((address market, bool isListed, uint256 borrowCap, uint256 supplyCap, bool mintPaused, bool borrowPaused, uint256 collateralFactor, uint256 underlyingPrice, uint256 totalSupply, uint256 totalBorrows, uint256 totalReserves, uint256 cash, uint256 exchangeRate, uint256 borrowIndex, uint256 reserveFactor, uint256 borrowRate, uint256 supplyRate, (address token, uint256 supplyIncentivesPerSec, uint256 borrowIncentivesPerSec)[] incentives))",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token you want to fetch the borrow rate for",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\n    \"0xEDfa23602D0EC14714057867A78d01e94176BEA0\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "collateralFactor": "uint256",
          "borrowingRate": "float",
          "incentives": "[]",
          "underlyingPrice": "uint256",
          "totalBorrows": "uint256",
          "borrowRate": "uint256"
        },
        "examples": [
          {
            "name": "USDC Borrowing Rate is above 3%",
            "description": "USDC Borrowing Rate is above 3%",
            "externalVariableDescription": "Fetches the current USDC borrowing rate on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 3
              }
            ]
          }
        ],
        "blockId": 22,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png"
      }
    },
    "COMPOUND": {
      "description": "One of the biggest yield-bearing money market",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/compound.png",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any asset on Compound",
        "prototype": "compoundLendingRate",
        "type": 1,
        "method": "function getSupplyRate(uint utilization) public view returns ((uint256 supplyRate))",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "token",
            "type": "erc20",
            "description": "The token you want to fetch the yield",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.utilization",
            "type": "uint32",
            "description": "The utilization",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "USDC Yield is above 5%",
            "description": "Gets triggered when USDC yield rises above 5% on Compound",
            "externalVariableDescription": "Fetches the current USDC lending rate on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "token",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "output": {
          "lendingRate": "float",
          "supplyRate": "uint256"
        },
        "blockId": 23,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/compound.png"
      },
      "BORROWING_RATES": {
        "name": "Borrowing rate",
        "description": "Get the borrowing rate of any asset on Compound",
        "type": 1,
        "prototype": "compoundBorrowingRate",
        "method": "function getBorrowRate(uint utilization) public view returns ((uint256 borrowRate))",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "token",
            "type": "erc20",
            "description": "The token you want to fetch the borrow rate for",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.utilization",
            "type": "uint32",
            "description": "The utilization",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "USDC Borrowing Rate is below 10%",
            "description": "Gets triggered when the USDC borrowing rate falls below 10% on Compound",
            "externalVariableDescription": "Fetches the current USDC borrowing rate on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "token",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "condition",
                "value": "lt"
              },
              {
                "key": "comparisonValue",
                "value": 10
              }
            ]
          }
        ],
        "output": {
          "borrowingRate": "float",
          "borrowRate": "uint256"
        },
        "blockId": 24,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/compound.png"
      }
    },
    "IRONCLAD": {
      "description": "Yield-bearing money market available on multiple chains.",
      "chains": [
        8453,
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ironclad.png",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any asset on Ironclad",
        "prototype": "ironcladLendingRate",
        "type": 1,
        "method": "function getReserveData(address asset) external view returns ((uint256 data) configuration, uint128 liquidityIndex, uint128 variableBorrowIndex, uint128 currentLiquidityRate, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint8 id)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token you want to fetch the lending rate",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\"\n  ],\n  \"34443\": [\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xDfc7C877a950e49D2610114102175A06C2e3167a\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "lendingRate": "float"
        },
        "examples": [
          {
            "name": "USDT Lending Rate is above 5%",
            "description": "USDT Lending Rate is above 5%",
            "externalVariableDescription": "Fetches the current USDT lending rate on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.asset",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "blockId": 25,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ironclad.png"
      },
      "BORROWING_RATES": {
        "name": "Borrowing rate",
        "description": "Get the borrowing rate of any asset on Ironclad",
        "type": 1,
        "prototype": "ironcladBorrowingRate",
        "method": "function getReserveData(address asset) external view returns ((uint256 data) configuration, uint128 liquidityIndex, uint128 variableBorrowIndex, uint128 currentLiquidityRate, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint8 id)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token you want to fetch the borrow rate for",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\"\n  ],\n  \"34443\": [\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xDfc7C877a950e49D2610114102175A06C2e3167a\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "output": {
          "borrowingRate": "float"
        },
        "examples": [
          {
            "name": "USDT Borrowing Rate is above 3%",
            "description": "USDT Borrowing Rate is above 3%",
            "externalVariableDescription": "Fetches the current USDT borrowing rate on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.asset",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 3
              }
            ]
          }
        ],
        "blockId": 26,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ironclad.png"
      }
    },
    "ZEROLEND": {
      "description": "A leading DeFi protocol enabling secure borrowing, lending, and yield generation across multiple assets.",
      "chains": [
        8453,
        null,
        null
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/zerolend.webp",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any asset on zerolend",
        "prototype": "zerolendLendingRate",
        "type": 3,
        "method": "GET",
        "output": {
          "lendingRate": "float"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token you want to fetch the lending rate",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"2741\": [\n    \"0x3439153eb7af838ad19d56e1571fbd09333c2809\",\n    \"0x0709f39376deee2a2dfc94a58edeb2eb9df012bd\",\n    \"0x84a71ccd554cc1b02749b35d22f684cc8ec987e1\",\n    \"0x9ebe3a824ca958e4b3da772d2065518f009cba62\"\n  ],\n  \"8453\": [\n    \"0xecac9c5f704e954931349da37f60e39f515c11c1\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x7fcd174e80f264448ebee8c88a7c4476aaf58ea6\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\"\n  ],\n  \"59144\": [\n    \"0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f\",\n    \"0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5\",\n    \"0x176211869ca2b568f2a7d4ee941e073a821ee1ff\",\n    \"0xa219439258ca9da29e9cc4ce5596924745e12b93\",\n    \"0x2416092f143378750bb29b79ed961ab195cceea5\",\n    \"0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34\",\n    \"0x3aab2285ddcddad8edf438c1bab47e1a9d05a9b4\",\n    \"0x1bf74c010e6320bab11e2e5a532b5ac15e0b8aa6\",\n    \"0xd2671165570f41bbb3b0097893300b6eb6101e6c\",\n    \"0xb5bedd42000b71fdde22d3ee8a79bd49a568fc8f\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "USDC Lending Rate is above 5%",
            "description": "USDC Lending Rate is above 5% on Base",
            "externalVariableDescription": "Fetches the current USDC lending rate on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "blockId": 36,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/zerolend.webp"
      }
    },
    "FLUID": {
      "description": "A leading DeFi protocol enabling secure borrowing, lending, and yield generation across multiple assets.",
      "chains": [
        8453,
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/fluid.webp",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any asset on Fluid",
        "prototype": "fluidLendingRate",
        "type": 3,
        "method": "GET",
        "output": {
          "lendingRate": "float"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token you want to fetch the lending rate",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"1\": [\n    \"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\",\n    \"0xdac17f958d2ee523a2206206994597c13d831ec7\",\n    \"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\n    \"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"\n  ],\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "USDC Lending Rate is above 5%",
            "description": "USDC Lending Rate is above 5% on Mainnet",
            "externalVariableDescription": "Fetches the current WETH lending rate on Ethereum",
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "asset",
                "value": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "blockId": 37,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/fluid.webp"
      }
    },
    "MORPHO": {
      "description": "Morpho is a decentralized lending protocol with different entities and individuals contributing to its development and adoption",
      "chains": [
        8453,
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any vault on Morpho",
        "prototype": "morphoLendingRate",
        "type": 3,
        "method": "Post",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "vault",
            "type": "address",
            "description": "Vault address you want to fetch the yield",
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n\n          const availableVaultsList = {\"1\":[{\"icon\":\"https://cdn.morpho.org/v2/assets/images/m0-vault-mev.png\",\"name\":\"MEV Capital M^0 Vault\",\"address\":\"0xfbDEE8670b273E12b019210426E70091464b02Ab\",\"amount\":\"4886716.00M\",\"symbol\":\"wM\",\"asset\":{\"symbol\":\"wM\",\"address\":\"0x437cc33344a0B27A429f795ff6B469C72698B291\",\"name\":\"WrappedM by M^0\"},\"usdValue\":\"4.91M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Gauntlet cbBTC Core\",\"address\":\"0xF587f2e8AfF7D76618d3B6B4626621860FbD54e3\",\"amount\":\"2823204692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"2486909.27M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet MKR Blended\",\"address\":\"0xEbFA750279dEfa89b8D99bdd145a016F6292757b\",\"amount\":\"1111399302.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"1115.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.05\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"name\":\"Re7 wstETH\",\"address\":\"0xE87ed29896B91421ff43f69257ABF78300e40c7a\",\"amount\":\"99899948717228688.00M\",\"symbol\":\"wstETH\",\"asset\":{\"symbol\":\"wstETH\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\",\"name\":\"Wrapped liquid staked Ether 2.0\"},\"usdValue\":\"295.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\"],\"apy\":\"1.09\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"name\":\"Re7 WBTC\",\"address\":\"0xE0C98605f279e4D7946d25B75869c69802823763\",\"amount\":\"3731976044.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3286129.45M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pumpbtc.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.61\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Prime\",\"address\":\"0xdd0f28e19C1780eb6396170735D45153D261490d\",\"amount\":\"27325357416392.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"27410565.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"5.79\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet LBTC Core\",\"address\":\"0xdC94785959B73F7A168452b3654E44fEc6A750e4\",\"amount\":\"4546123877.00M\",\"symbol\":\"LBTC\",\"asset\":{\"symbol\":\"LBTC\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\",\"name\":\"Lombard Staked Bitcoin\"},\"usdValue\":\"4004597.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\"],\"apy\":\"4.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet-solvbtc-babylon.svg\",\"name\":\"SolvBTC Babylon Vault\",\"address\":\"0xdBB316375B4dC992B2c8827D120c09dFB1d3455D\",\"amount\":\"10000030000000000000.00M\",\"symbol\":\"SolvBTC.BBN\",\"asset\":{\"symbol\":\"SolvBTC.BBN\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\",\"name\":\"SolvBTC Babylon\"},\"usdValue\":\"880605.94M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/usual.svg\",\"name\":\" Usual Boosted USDC\",\"address\":\"0xd63070114470f685b75B74D60EEc7c1113d33a3D\",\"amount\":\"23474623919224.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"23522528.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd0usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/lvlusd.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/sdeusd.svg\"],\"apy\":\"45.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-usdc.svg\",\"name\":\"9Summits USDC Core\",\"address\":\"0xD5Ac156319f2491d4ad1Ec4aA5ed0ED48C0fa173\",\"amount\":\"1193190215700.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"1197857.86M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"5.50\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/resolv-vault.png\",\"name\":\"MEV Capital Resolv USR\",\"address\":\"0xD50DA5F859811A91fD1876C9461fD39c23C747Ad\",\"amount\":\"3.943973448431187e+23M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\",\"name\":\"Resolv USD\"},\"usdValue\":\"394397.34M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\"],\"apy\":\"7.77\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Frontier\",\"address\":\"0xc582F04d8a82795aa2Ff9c8bb4c1c889fe7b754e\",\"amount\":\"225164741838.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"225299.02M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/uscc.svg\"],\"apy\":\"33.33\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/fence_vault.jpg\",\"name\":\"EUR Real Yield\",\"address\":\"0xC21DB71648B18C5B9E038d88393C9b254cf8eaC8\",\"amount\":\"1.1634998094176076e+21M\",\"symbol\":\"EURe\",\"asset\":{\"symbol\":\"EURe\",\"address\":\"0x3231Cb76718CDeF2155FC47b5286d82e6eDA273f\",\"name\":\"Monerium EUR emoney\"},\"usdValue\":\"1222.14M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/fence.svg\",\"name\":\"Fence\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/steur.svg\",\"https://cdn.morpho.org/assets/logos/wbc3m.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital USD0\",\"address\":\"0xC0A14627D6a23f70c809777CEd873238581C1032\",\"amount\":\"51090439990918324224.00M\",\"symbol\":\"USD0\",\"asset\":{\"symbol\":\"USD0\",\"address\":\"0x73A15FeD60Bf67631dC6cd7Bc5B6e8da8190aCF5\",\"name\":\"Usual USD\"},\"usdValue\":\"50.98M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet eUSD Core\",\"address\":\"0xc080f56504e0278828A403269DB945F6c6D6E014\",\"amount\":\"3.825932225636031e+24M\",\"symbol\":\"eUSD\",\"asset\":{\"symbol\":\"eUSD\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\",\"name\":\"Electronic Dollar\"},\"usdValue\":\"3823191.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"18.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/smokehouse_dai.svg\",\"name\":\"Smokehouse DAI\",\"address\":\"0xbeeFfF68CC520D68f82641EFF84330C631E2490E\",\"amount\":\"2.5823386125784788e+23M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"258208.22M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\"],\"apy\":\"20.44\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/smokehouse_usdc.svg\",\"name\":\"Smokehouse USDC\",\"address\":\"0xBEeFFF209270748ddd194831b3fa287a5386f5bC\",\"amount\":\"20014271231044.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"20051053.28M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/uscc.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/csusdl.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/uni.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"14.94\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdl-vault.svg\",\"name\":\"Coinshift USDL\",\"address\":\"0xbEEFC01767ed5086f35deCb6C00e6C12bc7476C1\",\"amount\":\"7.504110009219575e+21M\",\"symbol\":\"wUSDL\",\"asset\":{\"symbol\":\"wUSDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\",\"name\":\"Wrapped USDL\"},\"usdValue\":\"7622.46M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"4.06\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdl-vault.svg\",\"name\":\"Coinshift USDL\",\"address\":\"0xbEeFc011e94f43b8B7b455eBaB290C7Ab4E216f1\",\"amount\":\"1.1624532661245971e+25M\",\"symbol\":\"wUSDL\",\"asset\":{\"symbol\":\"wUSDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\",\"name\":\"Wrapped USDL\"},\"usdValue\":\"11807869.42M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"2.31\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PAXG\",\"address\":\"0xBeEf796ae50ba5423857CAc27DD36369cfc8241b\",\"amount\":\"1500000000000000.00M\",\"symbol\":\"PAXG\",\"asset\":{\"symbol\":\"PAXG\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\",\"name\":\"PAX Gold\"},\"usdValue\":\"4.43M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PAXG\",\"address\":\"0xBeeF7959aE71D4e45e1863dae0B94C35244AF816\",\"amount\":\"216296713623299522560.00M\",\"symbol\":\"PAXG\",\"asset\":{\"symbol\":\"PAXG\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\",\"name\":\"PAX Gold\"},\"usdValue\":\"638500.40M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse RUSD\",\"address\":\"0xBeEf11eCb698f4B5378685C05A210bdF71093521\",\"amount\":\"3.1515592246634458e+25M\",\"symbol\":\"rUSD\",\"asset\":{\"symbol\":\"rUSD\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\",\"name\":\"Reservoir Stablecoin\"},\"usdValue\":\"31515592.25M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"8.29\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse WBTC\",\"address\":\"0xbeEf094333AEdD535c130958c204E84f681FD9FA\",\"amount\":\"37725552.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"33218.70M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse ETH\",\"address\":\"0xBEEf050ecd6a16c4e7bfFbB52Ebba7846C4b8cD4\",\"amount\":\"5.368022669686909e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"13278609.28M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDT\",\"address\":\"0xbEef047a543E45807105E51A8BBEFCc5950fcfBa\",\"amount\":\"8351623154821.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"8354730.53M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susds.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\"],\"apy\":\"6.96\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PYUSD\",\"address\":\"0xbEEF02e5E13584ab96848af90261f0C8Ee04722a\",\"amount\":\"1406089475048.00M\",\"symbol\":\"PYUSD\",\"asset\":{\"symbol\":\"PYUSD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\",\"name\":\"PayPal USD\"},\"usdValue\":\"1410468.24M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"https://cdn.morpho.org/assets/logos/usyc.svg\",\"https://cdn.morpho.org/assets/logos/wbib01.svg\"],\"apy\":\"6.46\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC\",\"address\":\"0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB\",\"amount\":\"35090650590603.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"35158602.52M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\"],\"apy\":\"5.79\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 FRAX\",\"address\":\"0xBE40491F3261Fd42724F1AEb465796eb11c06ddF\",\"amount\":\"1.8525675767872602e+22M\",\"symbol\":\"FRAX\",\"asset\":{\"symbol\":\"FRAX\",\"address\":\"0x853d955aCEf822Db058eb8505911ED77F175b99e\",\"name\":\"Frax\"},\"usdValue\":\"18454.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\"],\"apy\":\"3.95\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Relend cbBTC\",\"address\":\"0xB9C9158aB81f90996cAD891fFbAdfBaad733c8C6\",\"amount\":\"931154261.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"820236.72M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\"],\"apy\":\"0.29\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet-midas.svg\",\"name\":\"Midas USDC\",\"address\":\"0xA8875aaeBc4f830524e35d57F9772FfAcbdD6C45\",\"amount\":\"2000000000.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"2007.82M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"https://cdn.morpho.org/assets/logos/mbasis.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-m.svg\",\"name\":\"Steakhouse M\",\"address\":\"0xa5aA40F27DAeDE9748822ef836170f202e196B5A\",\"amount\":\"1000000.00M\",\"symbol\":\"wM\",\"asset\":{\"symbol\":\"wM\",\"address\":\"0x437cc33344a0B27A429f795ff6B469C72698B291\",\"name\":\"WrappedM by M^0\"},\"usdValue\":\"1.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-usdq.svg\",\"name\":\"Steakhouse USDQ\",\"address\":\"0xA1b60d96e5C50dA627095B9381dc5a46AF1a9a42\",\"amount\":\"344281027799.00M\",\"symbol\":\"USDQ\",\"asset\":{\"symbol\":\"USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\",\"name\":\"Quantoz USDQ\"},\"usdValue\":\"344281.03M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bbqusdt.svg\",\"name\":\"Smokehouse USDT\",\"address\":\"0xA0804346780b4c2e3bE118ac957D1DB82F9d7484\",\"amount\":\"977743897000.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"979509.72M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"6.87\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Re7 cbBTC\",\"address\":\"0xA02F5E93f783baF150Aa1F8b341Ae90fe0a772f7\",\"amount\":\"975605944.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"859393.40M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pumpbtc.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"MEV Capital wETH\",\"address\":\"0x9a8bC3B04b7f3D87cfC09ba407dCED575f2d61D8\",\"amount\":\"2.7067390438466414e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"6695525.04M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/apxeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-teth-29may2025.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"5.75\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital cbBTC\",\"address\":\"0x98cF0B67Da0F16E1F8f1a1D23ad8Dc64c0c70E0b\",\"amount\":\"2823204692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"2486909.27M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"name\":\"Re7 USDT\",\"address\":\"0x95EeF579155cd2C5510F312c8fA39208c3Be01a8\",\"amount\":\"523358804598.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"523465.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"6.22\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Core\",\"address\":\"0x8eB67A509616cd6A7c1B3c8C21D48FF57df3d458\",\"amount\":\"33216280207891.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"33303066.74M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/link.svg\",\"https://cdn.morpho.org/assets/logos/uni.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/sdeusd.svg\"],\"apy\":\"12.35\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDT Prime\",\"address\":\"0x8CB3649114051cA5119141a34C200D65dc0Faa73\",\"amount\":\"4490293707985.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"4498403.25M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\"],\"apy\":\"6.99\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"name\":\"Re7 USDA\",\"address\":\"0x89D80f5e9BC88d8021b352064ae73F0eAf79EBd8\",\"amount\":\"1.366371325778496e+22M\",\"symbol\":\"USDA\",\"asset\":{\"symbol\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\",\"name\":\"USDA\"},\"usdValue\":\"13661.98M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-31oct2024.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bbqwsteth.svg\",\"name\":\"Smokehouse WSTETH\",\"address\":\"0x833AdaeF212c5cD3f78906B44bBfb18258F238F0\",\"amount\":\"104099016004590059520.00M\",\"symbol\":\"wstETH\",\"asset\":{\"symbol\":\"wstETH\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\",\"name\":\"Wrapped liquid staked Ether 2.0\"},\"usdValue\":\"308831.11M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"1.09\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 WETH\",\"address\":\"0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0\",\"amount\":\"5.692717726491903e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"14081791.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/re7wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/apxeth.svg\",\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.02\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msETH Vault\",\"address\":\"0x78B18E07dc43017fcEaabaD0751d6464c0F56b25\",\"amount\":\"75701180803203006464.00M\",\"symbol\":\"msETH\",\"asset\":{\"symbol\":\"msETH\",\"address\":\"0x64351fC9810aDAd17A690E4e1717Df5e7e085160\",\"name\":\"Metronome Synth ETH\"},\"usdValue\":\"187258.23M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rsweth.svg\"],\"apy\":\"2.69\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-eurcv.svg\",\"name\":\"Steakhouse EURCV\",\"address\":\"0x75741A12B36D181f44F389E0c6B1E0210311e3Ff\",\"amount\":\"1000136824993298304.00M\",\"symbol\":\"EURCV\",\"asset\":{\"symbol\":\"EURCV\",\"address\":\"0x5F7827FDeb7c20b443265Fc2F40845B715385Ff2\",\"name\":\"EUR CoinVertible\"},\"usdValue\":\"1.05M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"name\":\"Spark DAI Vault\",\"address\":\"0x73e65DBD630f90604062f6E02fAb9138e713edD9\",\"amount\":\"8.059925519238407e+25M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"80581265.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/spark.svg\",\"name\":\"SparkDAO\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-29may2025.svg\"],\"apy\":\"16.31\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdc-vault.svg\",\"name\":\"Coinshift USDC\",\"address\":\"0x7204B7Dbf9412567835633B6F00C3Edc3a8D6330\",\"amount\":\"3343669443899.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"3356749.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/csusdl.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"5.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/index_coop_hyeth_vault.png\",\"name\":\"Index Coop hyETH\",\"address\":\"0x701907283a57FF77E255C3f1aAD790466B8CE4ef\",\"amount\":\"6.752699569423558e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"16703815.29M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/pt-ageth-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\"],\"apy\":\"4.33\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC RWA\",\"address\":\"0x6D4e530B8431a52FFDA4516BA4Aadc0951897F8C\",\"amount\":\"599924811901.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"600278.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/uscc.svg\"],\"apy\":\"13.09\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msUSD Vault\",\"address\":\"0x6859B34a9379122d25A9FA46f0882d434fee36c3\",\"amount\":\"2.4014580705370727e+23M\",\"symbol\":\"msUSD\",\"asset\":{\"symbol\":\"msUSD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\",\"name\":\"Metronome Synth USD\"},\"usdValue\":\"240145.81M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\"],\"apy\":\"4.24\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"name\":\"LlamaRisk crvUSD Vault\",\"address\":\"0x67315dd969B8Cd3a3520C245837Bf71f54579C75\",\"amount\":\"3.868251435951369e+23M\",\"symbol\":\"crvUSD\",\"asset\":{\"symbol\":\"crvUSD\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\",\"name\":\"Curve.Fi USD Stablecoin\"},\"usdValue\":\"387183.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"name\":\"LlamaRisk\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdtwbtcweth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdcwbtcweth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvcrvusdtbtcwsteth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxtrylsd-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\"],\"apy\":\"15.29\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Re7 USDC\",\"address\":\"0x60d715515d4411f7F43e4206dc5d4a3677f0eC78\",\"amount\":\"308.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"0.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/sand.svg\",\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"12.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/resolv-vault.png\",\"name\":\"Apostro Resolv USR\",\"address\":\"0x5085Dd6FAd07c12e38fae01bc2a4938d2C08B1Bc\",\"amount\":\"9.850714815327631e+23M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\",\"name\":\"Resolv USD\"},\"usdValue\":\"985071.48M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\"],\"apy\":\"4.04\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet DAI Core\",\"address\":\"0x500331c9fF24D9d11aee6B07734Aa72343EA74a5\",\"amount\":\"1.3822723756222332e+25M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"13821351.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-29may2025.svg\"],\"apy\":\"10.80\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/sbmorphousdc.svg\",\"name\":\"SwissBorg Morpho USDC\",\"address\":\"0x4Ff4186188f8406917293A9e01A1ca16d3cf9E59\",\"amount\":\"9691069591894.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"9728144.89M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"5.28\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"f(x) Protocol Morpho USDC\",\"address\":\"0x4F460bb11cf958606C69A963B4A17f9DaEEea8b6\",\"amount\":\"109831265981.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"110260.92M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/arusd.svg\"],\"apy\":\"6.12\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/rwa_leadblock.png\",\"name\":\"LeadBlock USDC RWA\",\"address\":\"0x4cA0E178c94f039d7F202E09d8d1a655Ed3fb6b6\",\"amount\":\"572851727106.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"575092.67M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/leadblock.png\",\"name\":\"LeadBlock\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd0usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mtbill.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet LRT Core\",\"address\":\"0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658\",\"amount\":\"3.994710315872713e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"9881515.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\"],\"apy\":\"8.13\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/xaum.svg\",\"name\":\"Relend Gold\",\"address\":\"0x45c1875F1C48622b3D9740Af2D7dc62Bc9a72422\",\"amount\":\"600000000099999940608.00M\",\"symbol\":\"XAUM\",\"asset\":{\"symbol\":\"XAUM\",\"address\":\"0x2103E845C5E135493Bb6c2A4f0B8651956eA8682\",\"name\":\"Matrixdock Gold\"},\"usdValue\":\"1746934.50M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/crvusd.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet WBTC Core\",\"address\":\"0x443df5eEE3196e9b2Dd77CaBd3eA76C3dee8f9b2\",\"amount\":\"4328382210.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3811296.10M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/swbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\"],\"apy\":\"0.62\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Flagship ETH\",\"address\":\"0x38989BBA00BDF8181F4082995b3DEAe96163aC5D\",\"amount\":\"531794377078535684096.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"1315473.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"2.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-r.svg\",\"name\":\"Steakhouse USDR\",\"address\":\"0x30881Baa943777f92DC934d53D3bFdF33382cab3\",\"amount\":\"344168357316.00M\",\"symbol\":\"USDR\",\"asset\":{\"symbol\":\"USDR\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\",\"name\":\"StablR USD\"},\"usdValue\":\"344168.36M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/xaut.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/pendle-wbtc-vault.svg\",\"name\":\"Pendle WBTC\",\"address\":\"0x2f1aBb81ed86Be95bcf8178bA62C8e72D6834775\",\"amount\":\"4001640934.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3523587.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\"],\"apy\":\"0.63\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"name\":\"Flagship USDT\",\"address\":\"0x2C25f6C25770fFEC5959D34B94Bf898865e5D6b1\",\"amount\":\"197586290993.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"197943.14M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"4.95\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alpha USDC Vault\",\"address\":\"0xD50B9Bbf136D1BD5CD5AC6ed9b3F26c458a6d4A6\",\"amount\":\"5467848.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"5.45M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alphaping\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/deusd.svg\"],\"apy\":\"9.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alpha WETH Vault\",\"address\":\"0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC\",\"amount\":\"2105831930136005.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"4.44M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alphaping\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\"],\"apy\":\"11.38\"}],\"8453\":[{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-eth.svg\",\"name\":\"9Summits WETH Core\",\"address\":\"0xF540D790413FCFAedAC93518Ae99EdDacE82cb78\",\"amount\":\"293173410772970995712.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"728381.70M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\"],\"apy\":\"1.49\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"name\":\"Moonwell Flagship EURC\",\"address\":\"0xf24608E0CCb972b0b0f4A6446a0BBf58c701a026\",\"amount\":\"4611146279221.00M\",\"symbol\":\"EURC\",\"asset\":{\"symbol\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\"name\":\"EURC\"},\"usdValue\":\"4861503.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.49\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Prime\",\"address\":\"0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61\",\"amount\":\"6177504038069.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"6177512.07M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.03\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Degen USDC\",\"address\":\"0xdB90A4e973B7663ce0Ccc32B6FbD37ffb19BfA83\",\"amount\":\"27791210.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"27.79M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/degen.svg\"],\"apy\":\"5.01\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro Resolv USDC\",\"address\":\"0xcdDCDd18A16ED441F6CB10c3909e5e7ec2B9e8f3\",\"amount\":\"36723010932.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"36723.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\"],\"apy\":\"14.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem USDC\",\"address\":\"0xCd347c1e7d600a9A3e403497562eDd0A7Bc3Ef21\",\"amount\":\"73836791181.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"73836.89M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"6.97\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro Resolv USR\",\"address\":\"0xC484D83F667b779cc9907248101214235642258B\",\"amount\":\"2.731061761406047e+21M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\",\"name\":\"Resolv USD\"},\"usdValue\":\"2731.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"7.42\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Moonwell Flagship USDC\",\"address\":\"0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca\",\"amount\":\"21466989405948.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21467017.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.26\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Core\",\"address\":\"0xc0c5689e6f4D256E861F65465b691aeEcC0dEb12\",\"amount\":\"4854633998349.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"4854640.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/aero.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/usdz.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"7.51\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Steakhouse USDC RWA\",\"address\":\"0xbEefc4aDBE58173FCa2C042097Fe33095E68C3D6\",\"amount\":\"142005044191.00M\",\"symbol\":\"verUSDC\",\"asset\":{\"symbol\":\"verUSDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\",\"name\":\"Verified USDC\"},\"usdValue\":\"142005.23M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usyc.svg\",\"https://cdn.morpho.org/assets/logos/jtrsy.svg\",\"https://cdn.morpho.org/assets/logos/mtbill.svg\"],\"apy\":\"11.01\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse EURA\",\"address\":\"0xBEeFA28D5e56d41D35df760AB53B94D9FfD7051F\",\"amount\":\"3.203903777071764e+23M\",\"symbol\":\"EURA\",\"asset\":{\"symbol\":\"EURA\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\",\"name\":\"EURA (previously agEUR)\"},\"usdValue\":\"337117.96M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"1.48\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDA\",\"address\":\"0xbEEfa1aBfEbE621DF50ceaEF9f54FdB73648c92C\",\"amount\":\"4.487377764932623e+23M\",\"symbol\":\"USDA\",\"asset\":{\"symbol\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\",\"name\":\"USDA\"},\"usdValue\":\"448737.78M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/steur.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\"],\"apy\":\"3.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse EURC\",\"address\":\"0xBeEF086b8807Dc5E5A1740C5E3a7C4c366eA6ab5\",\"amount\":\"111986267714.00M\",\"symbol\":\"EURC\",\"asset\":{\"symbol\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\"name\":\"EURC\"},\"usdValue\":\"117918.87M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"16.18\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse ETH\",\"address\":\"0xbEEf050a7485865A7a8d8Ca0CC5f7536b7a3443e\",\"amount\":\"184659872439385194496.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"458782.64M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.60\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDM\",\"address\":\"0xBEef03f0BF3cb2e348393008a826538AaDD7d183\",\"amount\":\"3.958601843377425e+23M\",\"symbol\":\"wUSDM\",\"asset\":{\"symbol\":\"wUSDM\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\",\"name\":\"Wrapped Mountain Protocol USD\"},\"usdValue\":\"423244.60M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\"],\"apy\":\"2.98\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC\",\"address\":\"0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183\",\"amount\":\"2310868092500.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"2310871.10M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.76\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"name\":\"Morpho eUSD\",\"address\":\"0xbb819D845b573B5D7C538F5b85057160cfb5f313\",\"amount\":\"1.5955728234338277e+24M\",\"symbol\":\"eUSD\",\"asset\":{\"symbol\":\"eUSD\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\"name\":\"Electronic Dollar\"},\"usdValue\":\"1594015.21M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/hyusd.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"13.22\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Universal USDC\",\"address\":\"0xB7890CEE6CF4792cdCC13489D36D9d42726ab863\",\"amount\":\"187793526001.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"187793.77M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/uxrp.svg\",\"https://cdn.morpho.org/assets/logos/usol.svg\",\"https://cdn.morpho.org/assets/logos/usui.svg\",\"https://cdn.morpho.org/assets/logos/uapt.svg\"],\"apy\":\"9.66\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse sUSDS\",\"address\":\"0xB17B070A56043e1a5a1AB7443AfAFDEbcc1168D7\",\"amount\":\"1000000000000000000.00M\",\"symbol\":\"sUSDS\",\"asset\":{\"symbol\":\"sUSDS\",\"address\":\"0x5875eEE11Cf8398102FdAd704C9E96607675467a\",\"name\":\"Savings USDS\"},\"usdValue\":\"1.04M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"4.42\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 WETH\",\"address\":\"0xA2Cac0023a4797b4729Db94783405189a4203AFc\",\"amount\":\"2.1828211735125825e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"5418859.62M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\"],\"apy\":\"2.83\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Moonwell Flagship ETH\",\"address\":\"0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1\",\"amount\":\"2.546967774229026e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"6327500.82M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"3.53\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem WETH\",\"address\":\"0x9aB2d181E4b87ba57D5eD564D3eF652C4E710707\",\"amount\":\"137209809205159002112.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"339875.85M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"7.65\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/degen.svg\",\"name\":\"Morpho Degen\",\"address\":\"0x8c3A6B12332a6354805Eb4b72ef619aEdd22BcdD\",\"amount\":\"2.468464079065287e+25M\",\"symbol\":\"DEGEN\",\"asset\":{\"symbol\":\"DEGEN\",\"address\":\"0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed\",\"name\":\"Degen\"},\"usdValue\":\"103576.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"0.39\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Pyth ETH\",\"address\":\"0x80D9964fEb4A507dD697b4437Fc5b25b618CE446\",\"amount\":\"185405112846054653952.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"460634.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.03\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Spark USDC Vault\",\"address\":\"0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A\",\"amount\":\"21129842017824.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21129869.49M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/spark.svg\",\"name\":\"SparkDAO\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.18\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cdxusd.svg\",\"name\":\"Re7 cdxUSD\",\"address\":\"0x74B6EA9BFee07C3756969b0139CFacBBa5845969\",\"amount\":\"1.295027780957741e+22M\",\"symbol\":\"cdxUSD\",\"asset\":{\"symbol\":\"cdxUSD\",\"address\":\"0xC0D3700000987C99b3C9009069E4f8413fD22330\",\"name\":\"Cod3x USD\"},\"usdValue\":\"12933.34M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mbasis.svg\"],\"apy\":\"1.08\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Relend ETH\",\"address\":\"0x70F796946eD919E4Bc6cD506F8dACC45E4539771\",\"amount\":\"1287544653455166976.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"3198.87M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\"],\"apy\":\"1.49\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Re7 RWA\",\"address\":\"0x6e37C95b43566E538D8C278eb69B00FC717a001b\",\"amount\":\"162488588434.00M\",\"symbol\":\"verUSDC\",\"asset\":{\"symbol\":\"verUSDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\",\"name\":\"Verified USDC\"},\"usdValue\":\"162488.80M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"https://cdn.morpho.org/assets/logos/jtrsy.svg\"],\"apy\":\"10.67\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet WETH Core\",\"address\":\"0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844\",\"amount\":\"4.597041924847126e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"11415909.81M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"3.36\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet cbBTC Core\",\"address\":\"0x6770216aC60F634483Ec073cBABC4011c94307Cb\",\"amount\":\"8062003767.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"7104072.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"0.74\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/seamless-vault.png\",\"name\":\"Seamless USDC Vault\",\"address\":\"0x616a4E1db48e22028f6bbf20444Cd3b8e3273738\",\"amount\":\"21687895306147.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21687923.50M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"9.76\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/seamless-vault.png\",\"name\":\"Seamless cbBTC Vault\",\"address\":\"0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7\",\"amount\":\"11557412692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"10184154.73M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"3.63\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem WETH\",\"address\":\"0x5A32099837D89E3a794a44fb131CBbAD41f87a8C\",\"amount\":\"810038201286899793920.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"2007197.76M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-eth.svg\",\"name\":\"9Summits WETH Core 1.1\",\"address\":\"0x5496b42ad0deCebFab0db944D83260e60D54f667\",\"amount\":\"4.228309188535861e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"10498096.38M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.81\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Moonwell Frontier cbBTC\",\"address\":\"0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796\",\"amount\":\"4836920235.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"4262194.78M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"2.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msETH Vault\",\"address\":\"0x43Cd00De63485618A5CEEBE0de364cD6cBeB26E7\",\"amount\":\"97508524637609721856.00M\",\"symbol\":\"msETH\",\"asset\":{\"symbol\":\"msETH\",\"address\":\"0x7Ba6F01772924a82D9626c126347A28299E98c98\",\"name\":\"Metronome Synth ETH\"},\"usdValue\":\"242257.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\"],\"apy\":\"3.95\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"name\":\"Morpho MAI\",\"address\":\"0x30B8A2c8E7Fa41e77b54b8FaF45c610e7aD909E3\",\"amount\":\"1.3447407070281856e+22M\",\"symbol\":\"MAI\",\"asset\":{\"symbol\":\"MAI\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\",\"name\":\"Mai Stablecoin\"},\"usdValue\":\"13447.41M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.81\"}]};\n          const chainId = env.parameters.chainId;\n          const availableVaults = availableVaultsList[chainId] || [];\n\n          const htmlGrid = `\n          <div style=\"\n            min-height: 100vh;\n            background-color: #121212;\n            color: white;\n            padding: 24px;\">\n            \n            <div style=\"max-width: 1280px; margin: 0 auto;\">\n              \n              <div style=\"\n                display: grid;\n                grid-template-columns: 2fr 1fr 1fr 1fr 1fr;\n                align-items: center;\n                padding: 16px;\n                color: #9CA3AF;\">\n                <div>Vault</div>\n                <div style=\"display: flex; align-items: center; gap: 4px;\">Asset</div>\n                <div>Curator</div>\n                <div>Collateral</div>\n                <div style=\"text-align: right;\">APY</div>\n              </div>\n        \n              ${availableVaults\n                .map(\n                  (vault) => `\n                  <div\n                    class=\"rendered-enum-row\" \n                    key=\"${vault.address}\"\n                    id=\"${vault.address}\"\n                    target-param=\"vault\"\n                    data-vault=\"${vault.address}\"\n                    data-asset-address=\"${vault.asset.address}\"\n                    data-asset-symbol=\"${vault.asset.symbol}\"\n                    style=\"\n                      display: grid;\n                      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;\n                      align-items: center;\n                      padding: 16px;\n                      border-radius: 8px;\n                      transition: background-color 0.2s;\n                      cursor: pointer;\n                      background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\"\n                  >\n                    <div style=\"display: flex; align-items: center; gap: 12px;\">\n                      <div style=\"width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                        <img src=\"${vault.icon}\" alt=\"${vault.name} icon\" width=\"32\" height=\"32\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                      </div>\n                      <span style=\"color: #F3F4F6; font-weight: 500;\">${vault.name}</span>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 8px;\">\n                      <div>\n                        <div style=\"color: #F3F4F6; font-weight: 500;\">${vault.asset.symbol}</div>\n                      </div>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 12px;\">\n                      <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                        <img src=\"${vault.protocol.icon}\" alt=\"${vault.protocol.name} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                      </div>\n                      <span style=\"color: #F3F4F6; font-weight: 500;\">${vault.protocol.name}</span>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center;\">\n                      ${vault.collateralIcons\n                        .slice(0, 3)\n                        .map(\n                          (icon, i) => `\n                          <div style=\"\n                            width: 24px;\n                            height: 24px;\n                            border-radius: 50%;\n                            overflow: hidden;\n                            background-color: #2D2D2D;\n                            margin-left: ${i === 0 ? \"0\" : \"-4px\"};\n                            position: relative;\n                            z-index: ${vault.collateralIcons.length - i};\">\n                            <img src=\"${icon}\" alt=\"Collateral icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                          </div>`\n                        )\n                        .join(\"\")}\n                      ${vault.collateralIcons.length > 3\n                        ? `<div style=\"\n                            width: 24px;\n                            height: 24px;\n                            border-radius: 50%;\n                            background-color: #444;\n                            display: flex;\n                            align-items: center;\n                            justify-content: center;\n                            font-size: 12px;\n                            font-weight: bold;\n                            color: white;\n                            margin-left: -4px;\">\n                            +${vault.collateralIcons.length - 3}\n                          </div>`\n                        : \"\"}\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                      <span>${vault.apy}%</span>\n                    </div>\n                  </div>`\n                )\n                .join(\"\")}\n            </div>\n          </div>`;\n\n          return htmlGrid;\n      }\n  "
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Lending rate of Steakhouse USDC above 5%",
            "description": "Gets triggered when Lending rate of Steakhouse USDC vault above 5% on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "vault",
                "value": "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          },
          {
            "name": "Lending rate of Smokehouse USDC above 5%",
            "description": "Gets triggered when Lending rate of Smokehouse USDC vault above 5% on Ethereum",
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "vault",
                "value": "0xBEeFFF209270748ddd194831b3fa287a5386f5bC"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "output": {
          "lendingRate": "float"
        },
        "blockId": 38,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      },
      "BORROWING_RATES": {
        "name": "Market Borrowing rate",
        "description": "Get the market borrowing rate of any market on Morpho",
        "prototype": "morphoBorrowingRate",
        "type": 3,
        "method": "Post",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "marketId",
            "type": "string",
            "description": "Market Id",
            "mandatory": true,
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n          \n          const availableMarketsList = {\"1\":[{\"uniqueKey\":\"0xfd8493f09eb6203615221378d89f53fcd92ff4f7d62cca87eece9a2fff59e86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"1.42\"},{\"uniqueKey\":\"0xfd3e5c20340aeba93f78f7dc4657dc1e11b553c68c545acc836321a14b47e457\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"symbol\":\"wUSDL\",\"name\":\"Wrapped USDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFb4b...55e1\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xfad6df5845f5e298fd64f574ffc4024e487856663c535a31bb9c366473aa18b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xD64A...09B6\",\"rate\":\"1.10\"},{\"uniqueKey\":\"0xf84288cdcf652627f66cd7a6d4c43c3ee43ca7146d9a9cfab3a136a861144d6f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa300...5815\",\"rate\":\"60.45\"},{\"uniqueKey\":\"0xf78b7d3a62437f78097745a5e3117a50c56a02ec5f072cba8d988a129c6d4fb6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"symbol\":\"beraSTONE\",\"name\":\"Berachain STONE\",\"address\":\"0x97Ad75064b20fb2B2447feD4fa953bF7F007a706\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xaE95...dEE5\",\"rate\":\"6.97\"},{\"uniqueKey\":\"0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xa981...4F80\",\"rate\":\"0.41\"},{\"uniqueKey\":\"0xf6422731a8f84d9ab7e8b6da15ab9ecc243e12a78200dfb7fd1cdf2391e38068\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"symbol\":\"USD3\",\"name\":\"Web 3 Dollar\",\"address\":\"0x0d86883FAf4FfD7aEb116390af37746F45b6f378\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xe35f...9e4C\",\"rate\":\"3.64\"},{\"uniqueKey\":\"0xf4614dc6ce4ee662b23762d4b01d158a4a5b437d38022855fa4787db13183299\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x71a8...5B18\",\"rate\":\"2.34\"},{\"uniqueKey\":\"0xeeabdcb98e9f7ec216d259a2c026bbb701971efae0b44eec79a86053f9b128b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4236...8a4e\",\"rate\":\"54.32\"},{\"uniqueKey\":\"0xeea9a2431eba248f1cc4d8d3d2a34b31cbf4884ecc602f9270372f892a2ba185\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"symbol\":\"PAXG\",\"name\":\"PAX Gold\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xa051...FACE\",\"rate\":\"5.27\"},{\"uniqueKey\":\"0xed9e817ac29464b3cc520bf124fb333c330021a8ae768889f414d21df35686e0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"symbol\":\"PT-ezETH-26DEC2024\",\"name\":\"PT Renzo ezETH 26DEC2024\",\"address\":\"0xf7906F274c174A52d444175729E3fa98f9bde285\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xfE63...B248\",\"rate\":\"4.27\"},{\"uniqueKey\":\"0xea023e57814fb9a814a5a9ee9f3e7ece5b771dd8cc703e50b911e9cde064a12d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"symbol\":\"WOETH\",\"name\":\"Wrapped OETH\",\"address\":\"0xDcEe70654261AF21C44c093C300eD3Bb97b78192\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb794...420e\",\"rate\":\"12533.22\"},{\"uniqueKey\":\"0xe95187ba4e7668ab4434bbb17d1dfd7b87e878242eee3e73dac9fdb79a4d0d99\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"symbol\":\"EIGEN\",\"name\":\"Eigen\",\"address\":\"0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x9cfc...5770\",\"rate\":\"6.03\"},{\"uniqueKey\":\"0xe7e9694b754c4d4f7e21faf7223f6fa71abaeb10296a4c43a54a7977149687d2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x95DB...6992\",\"rate\":\"6.04\"},{\"uniqueKey\":\"0xe4cfbee9af4ad713b41bf79f009ca02b17c001a0c0e7bd2e6a89b1111b3d3f08\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"symbol\":\"tBTC\",\"name\":\"tBTC\",\"address\":\"0x18084fbA666a33d37592fA2633fD49a74DD93a88\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x57bf...CA5b\",\"rate\":\"24.37\"},{\"uniqueKey\":\"0xe475337d11be1db07f7c5a156e511f05d1844308e66e17d2ba5da0839d3b34d9\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"11.04\"},{\"uniqueKey\":\"0xe37784e5ff9c2795395c5a41a0cb7ae1da4a93d67bfdd8654b9ff86b3065941c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"symbol\":\"PT-sUSDE-26DEC2024\",\"name\":\"PT Ethena sUSDE 26DEC2024\",\"address\":\"0xEe9085fC268F6727d5D4293dBABccF901ffDCC29\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x81E5...4595\",\"rate\":\"1.33\"},{\"uniqueKey\":\"0xe1b65304edd8ceaea9b629df4c3c926a37d1216e27900505c04f14b2ed279f33\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"symbol\":\"RLP\",\"name\":\"Resolv Liquidity Provider Token\",\"address\":\"0x4956b52aE2fF65D74CA2d61207523288e4528f96\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1901...626a\",\"rate\":\"11.94\"},{\"uniqueKey\":\"0xdd3989b8bdf3abd2b4f16896b76209893664ea6a82444dd039977f52aa8e07a1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"symbol\":\"PT-SolvBTC.BBN-27MAR2025\",\"name\":\"PT SolvBTC Babylon 27MAR2025 \",\"address\":\"0xd1A1984cc5CAcbd36F6a511877d13662C950fd62\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/solvbtc.bbn.svg\",\"symbol\":\"SolvBTC.BBN\",\"name\":\"SolvBTC Babylon\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE405...38C4\",\"rate\":\"2.33\"},{\"uniqueKey\":\"0xdcfd3558f75a13a3c430ee71df056b5570cbd628da91e33c27eec7c42603247b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x6f2B...E36f\",\"rate\":\"3.05\"},{\"uniqueKey\":\"0xdc5333039bcf15f1237133f74d5806675d83d9cf19cfd4cfdd9be674842651bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE47E...bd99\",\"rate\":\"7.40\"},{\"uniqueKey\":\"0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xe9eE...3d7f\",\"rate\":\"42.03\"},{\"uniqueKey\":\"0xdbd8f3e55e5005a3922e3df4b1ba636ff9998b94588597420281e3641a05bf59\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x830d...509A\",\"rate\":\"12.78\"},{\"uniqueKey\":\"0xdb760246f6859780f6c1b272d47a8f64710777121118e56e0cdb4b8b744a3094\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"4.07\"},{\"uniqueKey\":\"0xd9e34b1eed46d123ac1b69b224de1881dbc88798bc7b70f504920f62f58f28cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xDa85...0760\",\"rate\":\"9.01\"},{\"uniqueKey\":\"0xd95c5285ed6009b272a25a94539bd1ae5af0e9020ad482123e01539ae43844e1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb6F9...3bC8\",\"rate\":\"0.06\"},{\"uniqueKey\":\"0xd925961ad5df1d12f677ff14cf20bac37ea5ef3b325d64d5a9f4c0cc013a1d47\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"symbol\":\"stUSD\",\"name\":\"Staked USDA\",\"address\":\"0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xd884...1CC3\",\"rate\":\"5.65\"},{\"uniqueKey\":\"0xd8909210afccc90a67730342d4a4695d437cd898164c59e2f54dfa40b53db2c0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"symbol\":\"sDAI\",\"name\":\"Savings Dai\",\"address\":\"0x83F20F44975D03b1b09e64809B757c47f942BEeA\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x9d4e...4B65\",\"rate\":\"6.26\"},{\"uniqueKey\":\"0xd6a9afe53c062d793f561fdc6458bf2e24d3fc17f4674d7e95f4dfd0e951e06d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdr.svg\",\"symbol\":\"USDR\",\"name\":\"StablR USD\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"4.06\"},{\"uniqueKey\":\"0xd65e28bab75824acd03cbdc2c1a090d758b936e0aaba7bdaef8228bd1f1ada13\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdq.svg\",\"symbol\":\"USDQ\",\"name\":\"Quantoz USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb5c9...F194\",\"rate\":\"3.82\"},{\"uniqueKey\":\"0xd5211d0e3f4a30d5c98653d988585792bb7812221f04801be73a44ceecb11e89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"symbol\":\"osETH\",\"name\":\"Staked ETH\",\"address\":\"0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x224F...4498\",\"rate\":\"9.45\"},{\"uniqueKey\":\"0xd3d60d19f04614baecb74e134b7bdd775dd7b37950f084ffcf4c05869ed260f1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2767...5C53\",\"rate\":\"0.37\"},{\"uniqueKey\":\"0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"1.67\"},{\"uniqueKey\":\"0xcfe8238ad5567886652ced15ee29a431c161a5904e5a6f380baaa1b4fdc8e302\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1982...5AF1\",\"rate\":\"0.63\"},{\"uniqueKey\":\"0xcfd9f683c6ab4b3c95e450e3faaf582c2b5fe938ef7405c4d60f2e9fd77415cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"symbol\":\"PT-corn-SolvBTC.BBN-26DEC2024\",\"name\":\"PT Corn SolvBTC Babylon 26DEC2024\",\"address\":\"0x23e479ddcda990E8523494895759bD98cD2fDBF6\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x309b...d08B\",\"rate\":\"1.23\"},{\"uniqueKey\":\"0xcec858380cba2d9ca710fce3ce864d74c3f620d53826f69d08508902e09be86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xAf50...A72d\",\"rate\":\"4.91\"},{\"uniqueKey\":\"0xcce802466ea61ec62007fe60d7b4370a10e765f9f223592790b2b7178abb9383\",\"collateral\":{\"icon\":\"\",\"symbol\":\"PT-sdeUSD-1753142406\",\"name\":\"Principal Token: sdeUSD-1753142406\",\"address\":\"0xb4B8925c4CBce692F37C9D946883f2E330a042a9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1ebe...DC27\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xcc63ab57cdcd6dd24cd42db3ebe829fb1b56da89fcd17cea6202cf6b69d02393\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"symbol\":\"PT-wstUSR-27MAR2025\",\"name\":\"PT Wrapped stUSR 27MAR2025\",\"address\":\"0xA8c8861b5ccF8CCe0ade6811CD2A7A7d3222B0B8\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7B45...dd36\",\"rate\":\"29.04\"},{\"uniqueKey\":\"0xcacd4c39af872ddecd48b650557ff5bcc7d3338194c0f5b2038e0d4dec5dc022\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"symbol\":\"rswETH\",\"name\":\"rswETH\",\"address\":\"0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x56e2...bd9b\",\"rate\":\"2.49\"},{\"uniqueKey\":\"0xca35ba8a7dfbb886b1e5ca7f5a600484518788feb038bf59b906e7f1e86fdbb4\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2dC7...1FC9\",\"rate\":\"2.73\"},{\"uniqueKey\":\"0xc9098061d437a9dd53b0070cb33df6fca1a0a5ead288588c88699b0420c1c078\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/msusd.svg\",\"symbol\":\"msUSD\",\"name\":\"Metronome Synth USD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"5.37\"},{\"uniqueKey\":\"0xc84cdb5a63207d8c2e7251f758a435c6bd10b4eaefdaf36d7650159bf035962e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rusd.svg\",\"symbol\":\"rUSD\",\"name\":\"Reservoir Stablecoin\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\"},\"lltv\":\"98.00\",\"oracleAddress\":\"0x3aBB...b43a\",\"rate\":\"10.17\"},{\"uniqueKey\":\"0xc581c5f70bd1afa283eed57d1418c6432cbff1d862f94eaf58fdd4e46afbb67f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"11.92\"},{\"uniqueKey\":\"0xc576cddfd1ee8332d683417548801d6835fa15fb2332a647452248987a8eded3\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbib01.svg\",\"symbol\":\"wbIB01\",\"name\":\"Wrapped Backed IB01 $ Treasury Bond 0-1yr\",\"address\":\"0xcA2A7068e551d5C4482eb34880b194E4b945712F\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xf71C...Cb40\",\"rate\":\"41.14\"},{\"uniqueKey\":\"0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2a01...AD72\",\"rate\":\"3.80\"},{\"uniqueKey\":\"0xc4e18eb6d0e9b0fa90a15bc0a98190cbf3d5ba763af410346f5174b014cefd8d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x873C...fb87\",\"rate\":\"5.93\"},{\"uniqueKey\":\"0xc3250fa72657f5d956a55fd7febf5bf953c18aa04bff2e4088415b1e5c2923b0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"symbol\":\"PT-rsETH-26JUN2025\",\"name\":\"PT Kelp rsETH 26JUN2025\",\"address\":\"0xE08C45F3cfE70f4e03668Dc6E84Af842bEE95A68\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7b27...80a2\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xbfed072faee09b963949defcdb91094465c34c6c62d798b906274ef3563c9cac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xf3FB...3B6d\",\"rate\":\"9.79\"},{\"uniqueKey\":\"0xbf4d7952ceeb29d52678172c348b8ef112d6e32413c547cbf56bbf6addcfa13e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2da4...8Cc8\",\"rate\":\"33.64\"},{\"uniqueKey\":\"0xbf02d6c6852fa0b8247d5514d0c91e6c1fbde9a168ac3fd2033028b5ee5ce6d0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xDCc0...29DB\",\"rate\":\"4.36\"},{\"uniqueKey\":\"0xbed21964cf290ab95fa458da6c1f302f2278aec5f897c1b1da3054553ef5e90c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x9F48...8f5e\",\"rate\":\"2.42\"},{\"uniqueKey\":\"0xbd2a27358bdaf3fb902a0ad17f86d4633f9ac5377941298720b37a4d90deab96\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\",\"symbol\":\"stkcvxcrvUSDETHCRV-morpho\",\"name\":\"Staked TriCRV Convex Deposit Morpho\",\"address\":\"0xAc904BAfBb5FB04Deb2b6198FdCEedE75a78Ce5a\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"symbol\":\"crvUSD\",\"name\":\"Curve.Fi USD Stablecoin\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xad7e...60bb\",\"rate\":\"8.38\"},{\"uniqueKey\":\"0xbd1ad3b968f5f0552dbd8cf1989a62881407c5cccf9e49fb3657c8731caf0c1f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/deusd.svg\",\"symbol\":\"deUSD\",\"name\":\"deUSD\",\"address\":\"0x15700B564Ca08D9439C58cA5053166E8317aa138\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1325...7eF8\",\"rate\":\"11.00\"},{\"uniqueKey\":\"0xba761af4134efb0855adfba638945f454f0a704af11fc93439e20c7c5ebab942\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2A26...6877\",\"rate\":\"11.62\"},{\"uniqueKey\":\"0xb98ad8501bd97ce0684b30b3645e31713e658e98d1955e8b677fb2585eaa9893\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"mTBILL\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x253a...3041\",\"rate\":\"0.04\"},{\"uniqueKey\":\"0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xb7ad412532006bf876534ccae59900ddd9d1d1e394959065cb39b12b22f94ff5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"symbol\":\"agETH\",\"name\":\"Kelp Gain\",\"address\":\"0xe1B4d34E8754600962Cd944B535180Bd758E6c2e\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xcb6a...f89A\",\"rate\":\"6.47\"},{\"uniqueKey\":\"0xb7843fe78e7e7fd3106a1b939645367967d1f986c2e45edb8932ad1896450877\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"6.62\"},{\"uniqueKey\":\"0xb6f4eebd60871f99bf464ae0b67045a26797cf7ef57c458d57e08c205f84feac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1bE2...3D1f\",\"rate\":\"7.49\"},{\"uniqueKey\":\"0xb5b0ff0fccf16dff5bef6d2d001d60f5c4ab49df1020a01073d3ad635c80e8d5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x0C42...4C79\",\"rate\":\"2.38\"}],\"8453\":[{\"uniqueKey\":\"0xff0f2bd52ca786a4f8149f96622885e880222d8bed12bbbf5950296be8d03f89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xa40E...9EFB\",\"rate\":\"18.65\"},{\"uniqueKey\":\"0xf9ed1dba3b6ba1ede10e2115a9554e9c52091c9f1b1af21f9e0fecc855ee74bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc866...b1BE\",\"rate\":\"1.18\"},{\"uniqueKey\":\"0xf7e40290f8ca1d5848b3c129502599aa0f0602eb5f5235218797a34242719561\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"symbol\":\"EURC\",\"name\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa541...54F4\",\"rate\":\"18.34\"},{\"uniqueKey\":\"0xf761e909ee2f87f118e36b7efb42c5915752a6d39263eec0c000c15d0ab7f489\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"symbol\":\"MAI\",\"name\":\"Mai Stablecoin\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"0.26\"},{\"uniqueKey\":\"0xf24417ee06adc0b0836cf0dbec3ba56c1059f62f53a55990a38356d42fa75fa2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x1BAa...C973\",\"rate\":\"13.84\"},{\"uniqueKey\":\"0xefb576606581c5ac9f731d80cb453519d06776fdc1de51d6230d180d74890c3b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eura.svg\",\"symbol\":\"EURA\",\"name\":\"EURA (previously agEUR)\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xA479...a48f\",\"rate\":\"3.00\"},{\"uniqueKey\":\"0xe73d71cacb1a11ce1033966787e21b85573b8b8a3936bbd7d83b2546a1077c26\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x8370...0ed1\",\"rate\":\"2.38\"},{\"uniqueKey\":\"0xe63d3f30d872e49e86cf06b2ffab5aa016f26095e560cb8d6486f9a5f774631e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xe3c4d4d0e214fdc52635d7f9b2f7b3b0081771ae2efeb3cb5aae26009f34f7a7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE10...a7A4\",\"rate\":\"0.40\"},{\"uniqueKey\":\"0xe0a6ea61ee79c0ea05268064525538b8290139b60b972fc83c5d5d26cec7cc89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/uapt.svg\",\"symbol\":\"uAPT\",\"name\":\"Aptos (Universal)\",\"address\":\"0x9c0e042d65a2e1fF31aC83f404E5Cb79F452c337\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x5110...e9E9\",\"rate\":\"-63.35\"},{\"uniqueKey\":\"0xdfd701f0e53c7281432a11743408cc52a6cf27761e7c70829318a0213a61b1b2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFd00...8F29\",\"rate\":\"9.21\"},{\"uniqueKey\":\"0xdf6aa0df4eb647966018f324db97aea09d2a7dde0d3c0a72115e8b20d58ea81f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x237a...ebE2\",\"rate\":\"21.33\"},{\"uniqueKey\":\"0xdf13c46bf7bd41597f27e32ae9c306eb63859c134073cb81c796ff20b520c7cf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x09EC...D91F\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xde1979b67c815863afd1105cae097ecb71b05b0978bc1605d0a58a25231d924f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1F83...FB73\",\"rate\":\"9.33\"},{\"uniqueKey\":\"0xdc69cf2caae7b7d1783fb5a9576dc875888afad17ab3d1a3fc102f741441c165\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x05f7...98f2\",\"rate\":\"1.80\"},{\"uniqueKey\":\"0xdba352d93a64b17c71104cbddc6aef85cd432322a1446b5b65163cbbc615cd0c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4756...9425\",\"rate\":\"14.06\"},{\"uniqueKey\":\"0xdb0bc9f10a174f29a345c5f30a719933f71ccea7a2a75a632a281929bba1b535\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x7E11...b228\",\"rate\":\"15.81\"},{\"uniqueKey\":\"0xdaa04f6819210b11fe4e3b65300c725c32e55755e3598671559b9ae3bac453d7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"62.50\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"9.76\"},{\"uniqueKey\":\"0xd75387f30c983be0aec58b03b51cca52337b496e38cf4effbe995531bf34901c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xD7E2...ceC3\",\"rate\":\"-0.10\"},{\"uniqueKey\":\"0xcf21c3ca9434959fbf882f7d977f90fe22b7a79e6f39cada5702b56b25e58613\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"symbol\":\"PT-USR-24APR2025\",\"name\":\"PT Resolv USD 24APR2025\",\"address\":\"0xec443e7E0e745348E500084892C89218B3ba4683\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1Eea...0d31\",\"rate\":\"21.10\"},{\"uniqueKey\":\"0xce89aeb081d719cd35cb1aafb31239c4dfd9c017b2fec26fc2e9a443461e9aea\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"3.88\"},{\"uniqueKey\":\"0xca2e6f878e273f6587276b44470467f94175e92840ad0d7231e9deb64c190591\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"Midas US Treasury Bill Token\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/verusdc.svg\",\"symbol\":\"verUSDC\",\"name\":\"Verified USDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbd8F...42eA\",\"rate\":\"10.85\"},{\"uniqueKey\":\"0xc9658cac13a9b9b5c1ebaa8ce19c735283cc761ff528d149a7221047bb7fab45\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"5.61\"},{\"uniqueKey\":\"0xc338cc2dc3f6a25bace40a920eea39ff27f184899def6bda478e27e591e5cef2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x451B...eF20\",\"rate\":\"0.25\"},{\"uniqueKey\":\"0xb95dd880d553f5d874534d66eb337a4811608331768c2b208440dfe0e6d901fa\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"symbol\":\"wUSDM\",\"name\":\"Wrapped Mountain Protocol USD\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x06aE...9a5a\",\"rate\":\"0.59\"},{\"uniqueKey\":\"0xb5d424e4af49244b074790f1f2dc9c20df948ce291fc6bcc6b59149ecf91196d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"1.99\"},{\"uniqueKey\":\"0xf8b9786f2f2163e7d618cd8eaf5c0380a1af22424184356dfdd1912f18cb069a\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"0.17\"},{\"uniqueKey\":\"0xc2be602059f1218751ec6f137a8405166419ce408d191fc70f9714eeb301c32b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"0.17\"}]};\n          const chainId = env.parameters.chainId;\n          const availableMarket = availableMarketsList[chainId] || [];\n\n          const htmlMarketGrid = `\n            <div style=\"min-height: 100vh; background-color: #121212; color: white; padding: 24px;\">\n              <div style=\"max-width: 1280px; margin: 0 auto;\">\n                <div style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; color: #9CA3AF;\">\n                  <div>Collateral</div>\n                  <div>Loan</div>\n                  <div>LLTV</div>\n                  <div>Oracle</div>\n                  <div style=\"text-align: right;\">Rate</div>\n                </div>\n                ${availableMarket\n                  .map(\n                    (market) => `\n                    <div\n                      key=\"${market.uniqueKey}\"\n                      id=\"${market.uniqueKey}\"\n                      target-param=\"marketId\"\n                      data-market=\"${market.uniqueKey}\"\n                      data-asset-address=\"${assetType == 'loan' ? market.loan.address : market.collateral.address}\"\n                      data-asset-symbol=\"${assetType == 'loan' ? market.loan.name : market.collateral.name}\"\n                      style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; border-radius: 8px; transition: background-color 0.2s; cursor: pointer; background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\">\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.collateral.icon}\" alt=\"${market.collateral.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.collateral.symbol}</span>\n                      </div>\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.loan.icon}\" alt=\"${market.loan.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.loan.symbol}</span>\n                      </div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.lltv}%</div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.oracleAddress}</div>\n                      <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                        <span>${market.rate}%</span>\n                      </div>\n                    </div>`\n                  )\n                  .join(\"\")}\n              </div>\n            </div>`;\n\n          return htmlMarketGrid;\n      }\n  "
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Market bsdETH-eUSD's borrowing Rate is above 5%",
            "description": "Gets triggered when the market bsdETH-eUSD's borrowing Rate is above 5% on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "marketId",
                "value": "0xf9ed1dba3b6ba1ede10e2115a9554e9c52091c9f1b1af21f9e0fecc855ee74bf"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          },
          {
            "name": "Market WBTC-USDC's borrowing Rate is above 5%",
            "description": "Gets triggered when the market WBTC-USDC's borrowing Rate is above 5% on Ethereum",
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "marketId",
                "value": "0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49"
              },
              {
                "key": "condition",
                "value": "gt"
              },
              {
                "key": "comparisonValue",
                "value": 5
              }
            ]
          }
        ],
        "output": {
          "borrowingRate": "float"
        },
        "blockId": 39,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      }
    }
  },
  "DEXES": {
    "ODOS": {
      "description": "Monitors events on Odos router",
      "chains": [
        34443,
        1,
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.png",
      "SWAP": {
        "name": "Odos Swap",
        "description": "Swap on Odos",
        "type": 0,
        "output": {
          "sender": "address",
          "inputAmount": "float",
          "inputToken": "erc20",
          "amountOut": "float",
          "outputToken": "erc20",
          "exchangeRate": "float",
          "transactionHash": "string"
        },
        "frontendHelpers": {
          "output": {
            "inputAmount": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{output.inputToken}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amountOut": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{output.outputToken}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the EVM blockchain",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.sender",
            "type": "address",
            "description": "Sender address",
            "category": 1
          },
          {
            "key": "abiParams.inputAmount",
            "type": "uint256",
            "description": "Input amount",
            "category": 1
          },
          {
            "key": "abiParams.inputToken",
            "type": "erc20",
            "description": "Input token address",
            "category": 0
          },
          {
            "key": "abiParams.amountOut",
            "type": "uint256",
            "description": "Output amount",
            "category": 1
          },
          {
            "key": "abiParams.outputToken",
            "type": "erc20",
            "description": "Output token address",
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Any Odos swap",
            "description": "Gets triggered when someone does a swap on Base using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              }
            ]
          },
          {
            "name": "Sell ETH",
            "description": "Gets triggered when someone sells ETH on Base using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.inputToken",
                "value": "0x4200000000000000000000000000000000000006"
              }
            ]
          }
        ],
        "blockId": 4,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.png"
      }
    },
    "UNISWAP": {
      "description": "Monitors events on Uniswap pools",
      "chains": [
        8453,
        0
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/uniswap.jpg",
      "V3_SWAP": {
        "name": "Track swaps on Uniswap V3",
        "description": "Triggers every time there is a swap on a Uniswap V3 pool.",
        "type": 0,
        "output": {
          "sender": "address",
          "recipient": "address",
          "token0": "erc20",
          "token1": "erc20",
          "amount0": "int256",
          "amount1": "int256",
          "sqrtPriceX96": "uint160",
          "liquidity": "uint128",
          "tick": "int24",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "The network to monitor swaps on (e.g., Base, Ethereum).",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "The address of the Uniswap V3 pool to monitor.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.amount0",
            "type": "int256",
            "description": "Filter by the amount of token0 swapped (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount1",
            "type": "int256",
            "description": "Filter by the amount of token1 swapped (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.sender",
            "type": "address",
            "description": "Filter by the address initiating the swap.",
            "category": 1
          },
          {
            "key": "abiParams.recipient",
            "type": "address",
            "description": "Filter by the address receiving the swapped tokens.",
            "category": 1
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "amount0": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Monitor all swaps",
            "description": "Triggers whenever a swap occurs on a specific Uniswap V3 pool (ETH/FAI 1%).",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "contractAddress",
                "value": "0x68B27E9066d3aAdC6078E17C8611b37868F96A1D"
              }
            ]
          }
        ],
        "blockId": 28,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/uniswap.jpg"
      },
      "V2_SWAP": {
        "name": "Track swaps on Uniswap V2",
        "description": "Triggers every time there is a swap on a Uniswap V2 pool.",
        "type": 0,
        "output": {
          "sender": "address",
          "token0": "erc20",
          "token1": "erc20",
          "amount0In": "uint256",
          "amount1In": "uint256",
          "amount0Out": "uint256",
          "amount1Out": "uint256",
          "to": "address",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "The network to monitor swaps on (e.g., Base, Ethereum).",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "The address of the Uniswap V2 pool to monitor.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.amount0In",
            "type": "uint256",
            "description": "Filter by the amount of token0 input (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount1In",
            "type": "uint256",
            "description": "Filter by the amount of token1 input (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount0Out",
            "type": "uint256",
            "description": "Filter by the amount of token0 output (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount1Out",
            "type": "uint256",
            "description": "Filter by the amount of token1 output (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.sender",
            "type": "address",
            "description": "Filter by the address initiating the swap.",
            "category": 1
          },
          {
            "key": "abiParams.to",
            "type": "address",
            "description": "Filter by the address receiving the swapped tokens.",
            "category": 1
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "amount0In": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1In": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Monitor all swaps",
            "description": "Triggers whenever a swap occurs on a specific Uniswap V2 pool (ETH/USDC 0.3%)",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "contractAddress",
                "value": "0x88A43bbDF9D098eEC7bCEda4e2494615dfD9bB9C"
              }
            ]
          }
        ],
        "blockId": 33,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/uniswap.jpg"
      }
    },
    "AERODROME": {
      "description": "Monitors swaps on Aerodrome pools",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aerodrome.jpg",
      "SWAP_IN_CONCENTRATED_POOL": {
        "name": "Swap in Concentrated Pool",
        "description": "Triggers every time there is a swap in an Aerodrome concentrated liquidity pool.",
        "type": 0,
        "output": {
          "sender": "address",
          "recipient": "address",
          "token0": "erc20",
          "token1": "erc20",
          "amount0": "int256",
          "amount1": "int256",
          "sqrtPriceX96": "uint160",
          "liquidity": "uint128",
          "tick": "int24",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "The network to monitor swaps on (Base).",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "The address of the liquidity pool.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.amount0",
            "type": "int256",
            "description": "Filter by the amount of token0 swapped (exact amount)",
            "category": 1
          },
          {
            "key": "abiParams.amount1",
            "type": "int256",
            "description": "Filter by the amount of token1 swapped (exact amount)",
            "category": 1
          },
          {
            "key": "abiParams.sender",
            "type": "address",
            "description": "Filter by the address initiating the swap.",
            "category": 1
          },
          {
            "key": "abiParams.recipient",
            "type": "address",
            "description": "Filter by the address receiving the swapped tokens.",
            "category": 1
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "amount0": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Monitor all swaps in concentrated pool",
            "description": "Triggers whenever a swap occurs in an Aerodrome concentrated liquidity pool (WETH/USDC 0.04%)",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "contractAddress",
                "value": "0xb2cc224c1c9feE385f8ad6a55b4d94E92359DC59"
              }
            ]
          }
        ],
        "blockId": 29,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aerodrome.jpg"
      },
      "SWAP_IN_BASIC_POOL": {
        "name": "Swap in Basic Pool",
        "description": "Triggers every time there is a swap in an Aerodrome basic liquidity pool.",
        "type": 0,
        "output": {
          "sender": "address",
          "to": "address",
          "token0": "erc20",
          "token1": "erc20",
          "amount0In": "uint256",
          "amount1In": "uint256",
          "amount0Out": "uint256",
          "amount1Out": "uint256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "The network to monitor swaps on (Base).",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "The address of the liquidity pool.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.amount0In",
            "type": "uint256",
            "description": "Filter by the amount of token0 input (exact amount)",
            "category": 1
          },
          {
            "key": "abiParams.amount1In",
            "type": "uint256",
            "description": "Filter by the amount of token1 input (exact amount)",
            "category": 1
          },
          {
            "key": "abiParams.amount0Out",
            "type": "uint256",
            "description": "Filter by the amount of token0 output (exact amount)",
            "category": 1
          },
          {
            "key": "abiParams.amount1Out",
            "type": "uint256",
            "description": "Filter by the amount of token1 output (exact amount)",
            "category": 1
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "amount0In": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1In": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Monitor all swaps in basic pool",
            "description": "Triggers whenever a swap occurs in an Aerodrome basic liquidity pool (USDC/AERO 0.3%)",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "contractAddress",
                "value": "0x6cDcb1C4A4D1C3C6d054b27AC5B77e89eAFb971d"
              }
            ]
          }
        ],
        "blockId": 30,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aerodrome.jpg"
      }
    },
    "VELODROME": {
      "description": "Monitors swaps on Velodrome pools",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/velodrome.jpg",
      "SWAP_IN_CONCENTRATED_POOL": {
        "name": "Swap in Concentrated Pool",
        "description": "Triggers every time there is a swap in a Velodrome concentrated liquidity pool.",
        "type": 0,
        "output": {
          "sender": "address",
          "recipient": "address",
          "token0": "erc20",
          "token1": "erc20",
          "amount0": "int256",
          "amount1": "int256",
          "sqrtPriceX96": "uint160",
          "liquidity": "uint128",
          "tick": "int24",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "The network to monitor swaps on (MODE).",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "The address of the liquidity pool.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.amount0",
            "type": "int256",
            "description": "Filter by the amount of token0 swapped (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount1",
            "type": "int256",
            "description": "Filter by the amount of token1 swapped (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.sender",
            "type": "address",
            "description": "Filter by the address initiating the swap.",
            "category": 1
          },
          {
            "key": "abiParams.recipient",
            "type": "address",
            "description": "Filter by the address receiving the swapped tokens.",
            "category": 1
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "amount0": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Monitor all swaps in concentrated pool",
            "description": "Triggers whenever a swap occurs in a Velodrome concentrated liquidity pool (WETH/USDC 0.05%).",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "contractAddress",
                "value": "0x3Adf15f77F2911f84b0FE9DbdfF43ef60D40012c"
              }
            ]
          }
        ],
        "blockId": 31,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/velodrome.jpg"
      },
      "SWAP_IN_BASIC_POOL": {
        "name": "Swap in Basic Pool",
        "description": "Triggers every time there is a swap in a Velodrome basic liquidity pool.",
        "type": 0,
        "output": {
          "sender": "address",
          "to": "address",
          "amount0In": "uint256",
          "amount1In": "uint256",
          "amount0Out": "uint256",
          "amount1Out": "uint256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "The network to monitor swaps on (MODE).",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "contractAddress",
            "type": "address",
            "description": "The address of the liquidity pool.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.amount0In",
            "type": "uint256",
            "description": "Filter by the amount of token0 input (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount1In",
            "type": "uint256",
            "description": "Filter by the amount of token1 input (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount0Out",
            "type": "uint256",
            "description": "Filter by the amount of token0 output (exact amount).",
            "category": 1
          },
          {
            "key": "abiParams.amount1Out",
            "type": "uint256",
            "description": "Filter by the amount of token1 output (exact amount).",
            "category": 1
          },
        ] as Parameter[],
        "frontendHelpers": {
          "output": {
            "amount0In": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1In": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "examples": [
          {
            "name": "Monitor all swaps in basic pool",
            "description": "Triggers whenever a swap occurs in a Velodrome basic liquidity pool (WETH/MODE 0.3%).",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "contractAddress",
                "value": "0x0fba984c97539B3fb49ACDA6973288D0EFA903DB"
              }
            ]
          }
        ],
        "blockId": 32,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/velodrome.jpg"
      }
    },
    "HYPERLIQUID": {
      "description": "Monitor funding rates of any token",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/hyperliquid.webp",
      "FUNDING_RATE": {
        "name": "Funding rate",
        "description": "Fetches the hourly rate of an asset",
        "prototype": "hyperliquidFunding",
        "type": 3,
        "method": "POST",
        "output": {
          "hourlyRate": "float",
          "annualizedRate": "float",
          "data": "array"
        },
        "parameters": [
          {
            "key": "asset",
            "type": "string",
            "description": "The Hyperliquid token you want to fetch the funding rate",
            "mandatory": true,
            "enum": [
              "AAVE",
              "ACE",
              "ADA",
              "AI",
              "AI16Z",
              "AIXBT",
              "ALGO",
              "ALT",
              "ANIME",
              "APE",
              "APT",
              "AR",
              "ARB",
              "ARK",
              "ATOM",
              "AVAX",
              "BADGER",
              "BANANA",
              "BCH",
              "BERA",
              "BIGTIME",
              "BIO",
              "BLAST",
              "BLUR",
              "BLZ",
              "BNB",
              "BNT",
              "BOME",
              "BRETT",
              "BSV",
              "BTC",
              "CAKE",
              "CANTO",
              "CATI",
              "CELO",
              "CFX",
              "CHILLGUY",
              "COMP",
              "CRV",
              "CYBER",
              "DOGE",
              "DOT",
              "DYDX",
              "DYM",
              "EIGEN",
              "ENA",
              "ENS",
              "ETC",
              "ETH",
              "ETHFI",
              "FARTCOIN",
              "FET",
              "FIL",
              "FRIEND",
              "FTM",
              "FTT",
              "FXS",
              "GALA",
              "GAS",
              "GMT",
              "GMX",
              "GOAT",
              "GRASS",
              "GRIFFAIN",
              "HBAR",
              "HMSTR",
              "HPOS",
              "HYPE",
              "ILV",
              "IMX",
              "INJ",
              "IO",
              "IOTA",
              "IP",
              "JELLY",
              "JTO",
              "JUP",
              "KAITO",
              "KAS",
              "LAYER",
              "LDO",
              "LINK",
              "LISTA",
              "LOOM",
              "LTC",
              "MANTA",
              "MATIC",
              "MAV",
              "MAVIA",
              "ME",
              "MELANIA",
              "MEME",
              "MERL",
              "MEW",
              "MINA",
              "MKR",
              "MNT",
              "MOODENG",
              "MORPHO",
              "MOVE",
              "MYRO",
              "NEAR",
              "NEIROETH",
              "NEO",
              "NFTI",
              "NOT",
              "NTRN",
              "OGN",
              "OM",
              "OMNI",
              "ONDO",
              "OP",
              "ORBS",
              "ORDI",
              "OX",
              "PANDORA",
              "PENDLE",
              "PENGU",
              "PEOPLE",
              "PIXEL",
              "PNUT",
              "POL",
              "POLYX",
              "POPCAT",
              "PURR",
              "PYTH",
              "RDNT",
              "RENDER",
              "REQ",
              "REZ",
              "RLB",
              "RNDR",
              "RSR",
              "RUNE",
              "S",
              "SAGA",
              "SAND",
              "SCR",
              "SEI",
              "SHIA",
              "SNX",
              "SOL",
              "SPX",
              "STG",
              "STRAX",
              "STRK",
              "STX",
              "SUI",
              "SUPER",
              "SUSHI",
              "TAO",
              "TIA",
              "TNSR",
              "TON",
              "TRB",
              "TRUMP",
              "TRX",
              "TST",
              "TURBO",
              "UMA",
              "UNI",
              "UNIBOT",
              "USTC",
              "USUAL",
              "VINE",
              "VIRTUAL",
              "VVV",
              "W",
              "WIF",
              "WLD",
              "XAI",
              "XLM",
              "XRP",
              "YGG",
              "ZEN",
              "ZEREBRO",
              "ZETA",
              "ZK",
              "ZRO",
              "kBONK",
              "kDOGS",
              "kFLOKI",
              "kLUNC",
              "kNEIRO",
              "kPEPE",
              "kSHIB"
            ],
            "category": 0
          },
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Aave hourly rate above 0.01%",
            "description": "Gets triggered when Aave hourly funding rate above 0.01%",
            "externalVariableDescription": "Gets the AAVE hourly funding rate",
            "parameters": [
              {
                "key": "asset",
                "value": "AAVE"
              },
              {
                "key": "condition",
                "value": "gte"
              },
              {
                "key": "comparisonValue",
                "value": 0.01
              }
            ]
          }
        ],
        "blockId": 40,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/hyperliquid.webp"
      }
    }
  },
  "SOCIALS": {
    "FEAR_AND_GREED": {
      "description": "Fetches the Fear and Greed Index",
      "tags": {},
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/fearAndGreed.png",
      "GET_FEAR_AND_GREED_INDEX": {
        "name": "Fear and Greed Index",
        "description": "Fetches the Fear and Greed Index from the specified API and processes the result.",
        "prototype": "btcFearAndGreed",
        "type": 3,
        "output": {
          "value": "integer"
        },
        "parameters": [
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "integer",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Market in extreme fear",
            "description": "Gets triggered when the index is below 20",
            "externalVariableDescription": "Fetches the Bitcoin Fear and Greed Index value",
            "parameters": [
              {
                "key": "condition",
                "value": "lte"
              },
              {
                "key": "comparisonValue",
                "value": 20
              }
            ]
          },
          {
            "name": "Market in greed",
            "description": "Gets triggered when the index is above 65",
            "parameters": [
              {
                "key": "condition",
                "value": "gte"
              },
              {
                "key": "comparisonValue",
                "value": 65
              }
            ]
          }
        ],
        "blockId": 11,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/fearAndGreed.png"
      }
    },
    "X": {
      "description": "Tracks new tweets in real time",
      "tags": {},
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/X.webp",
      "comingSoon": true,
      "X_POST_TRIGGER": {
        "name": "X Post Trigger",
        "description": "Track an account activity via their posts",
        "type": 5,
        "output": {
          "tweetContent": "string",
          "tweetURL": "string",
          "timestamp": "string",
          "account": "string"
        },
        "parameters": [
          {
            "key": "username",
            "type": "string",
            "description": "Username of the twitter account you want to track",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "includeRetweets",
            "type": "string",
            "description": "Toggle trigger if it is retweet",
            "category": 0,
            "default": "false",
            "value": "false"
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "GCR tweets",
            "description": "Gets triggered when GCR tweets something",
            "parameters": [
              {
                "key": "username",
                "value": "GiganticRebirth"
              },
              {
                "key": "includeRetweets",
                "value": false
              }
            ]
          }
        ],
        "blockId": 34,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/X.webp",
        "comingSoon": true
      }
    }
  },
  "ETFS": {
    "IBIT": {
      "description": "IBIT is Blackrock's Bitcoin ETF",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/blackrock.jpeg",
      "AUM": {
        "name": "Assets under management",
        "description": "Fetches IBIT net assets (USD)",
        "prototype": "ibitAum",
        "type": 3,
        "output": {
          "asset_under_management": "integer"
        },
        "parameters": [
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "Logic operator used for the comparison: <, >, <=, >=, ==, ...",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "integer",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "AUM above 30B$",
            "description": "Gets triggered when the assets under management are above 30B$",
            "externalVariableDescription": "Fetches IBIT's current assets under management in USD",
            "parameters": [
              {
                "key": "condition",
                "value": "gte"
              },
              {
                "key": "comparisonValue",
                "value": 30000000000
              }
            ]
          },
          {
            "name": "AUM below 15B$",
            "description": "Gets triggered when the assets under management are below 15B$",
            "parameters": [
              {
                "key": "condition",
                "value": "lt"
              },
              {
                "key": "comparisonValue",
                "value": 15000000000
              }
            ]
          }
        ],
        "blockId": 14,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/blackrock.jpeg"
      }
    }
  },
  "NFTS": {
    "BLUR": {
      "description": "Get real-time NFT listings",
      "chains": [
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/blur.jpg",
      "comingSoon": true,
      "LISTING": {
        "name": "NFT Listing",
        "description": "Subscribe to live NFT listing events based on filters.",
        "type": 5,
        "parameters": [
          {
            "key": "contract",
            "type": "address",
            "description": "The NFT collection to monitor.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "price",
            "type": "float",
            "description": "Maximum price filter for the listings (in ETH). The workflow won't be triggered if a NFT that matches the other criterias is listed above this defined price limit.",
            "mandatory": false,
            "category": 1
          },
          {
            "key": "traits",
            "description": "Trait-based filters. For example, you can only monitor punks with specific traits you are interested in.",
            "mandatory": false,
            "category": 1
          },
        ] as Parameter[],
        "output": {
          "listingId": "string",
          "tokenId": "string",
          "price": "float",
          "source": "string",
          "imageUrl": "string",
          "attributes": "array"
        },
        "examples": [
          {
            "name": "Monitor Pudgy listings",
            "description": "Subscribe to Pudgy Penguins listings with a pineapple suit and blue background filtered for prices below 30 ETH.",
            "parameters": [
              {
                "key": "contract",
                "value": "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"
              },
              {
                "key": "price",
                "value": 30
              },
              {
                "key": "traits",
                "value": "{\"Background\":[\"Blue\"],\"Body\":[\"Pineapple Suit\"]}"
              }
            ]
          }
        ],
        "blockId": 35,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/blur.jpg",
        "comingSoon": true
      }
    }
  },
  "PRE_MARKET": {
    "WHALES_MARKET": {
      "description": "Trade Airdrop allocations and points",
      "chains": [
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/whalesmarket.png"
    }
  },
  "TECHNICAL": {
    "GAS": {
      "description": "Monitors Ethereum gas prices",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/gas.svg",
      "GAS_API": {
        "name": "Ethereum Gas Price Monitor",
        "description": "Monitors Ethereum gas prices and triggers when the gas price meets the defined condition.",
        "prototype": "mainnetGasPrice",
        "type": 3,
        "output": {
          "gasPrice": "float"
        },
        "parameters": [
          {
            "key": "condition",
            "type": "logic_operator",
            "description": "The logical operator to compare the gas price, such as <, >, <=, >=, ==, etc.",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "comparisonValue",
            "type": "float",
            "description": "The gas price value to compare against (in Gwei).",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Gas Price Below 6 Gwei",
            "description": "Triggers when the gas price is below 6 Gwei.",
            "externalVariableDescription": "Fetches the current Ethereum gas price in Gwei",
            "parameters": [
              {
                "key": "condition",
                "value": "lte"
              },
              {
                "key": "comparisonValue",
                "value": "6"
              }
            ]
          },
          {
            "name": "Gas Price Below 12 Gwei",
            "description": "Triggers when the gas price is below 12 Gwei.",
            "parameters": [
              {
                "key": "condition",
                "value": "lte"
              },
              {
                "key": "comparisonValue",
                "value": "12"
              }
            ]
          },
          {
            "name": "Gas Price Above 40 Gwei",
            "description": "Triggers when the gas price exceeds 40 Gwei.",
            "parameters": [
              {
                "key": "condition",
                "value": "gte"
              },
              {
                "key": "comparisonValue",
                "value": "40"
              }
            ]
          }
        ],
        "blockId": 16,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/gas.svg"
      }
    }
  }
};

export const ACTIONS = {
  "CORE": {
    "EMPTYBLOCK": {
      "image": "",
      "description": "",
      "chains": [],
      "EMPTYBLOCK": {
        "name": "Empty block",
        "description": "This block is just used in the app while waiting for the user to choose an actual block.",
        "type": 2,
        "checks": [],
        "output": {},
        "parameters": [
        ] as Parameter[],
        "examples": [],
        "blockId": 0,
        "image": ""
      }
    },
    "DELAY": {
      "description": "Set of functions to delay the executions of the following blocks.",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/delay.png",
      "WAIT_FOR": {
        "name": "Wait for",
        "type": 2,
        "description": "Wait before executing the following blocks",
        "output": {
          "message": "string"
        },
        "parameters": [
          {
            "key": "time",
            "type": "string",
            "description": "The time to wait (in seconds)",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Wait 1 hour",
            "description": "Wait for an hour before executing the next block",
            "parameters": [
              {
                "key": "time",
                "value": "3600000"
              }
            ]
          }
        ],
        "blockId": 100010,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/delay.png"
      },
      "WAIT_UNTIL": {
        "name": "Wait until",
        "type": 2,
        "description": "Wait before executing the following blocks",
        "output": {
          "message": "string"
        },
        "parameters": [
          {
            "key": "until",
            "type": "string",
            "description": "The date to wait for (UTC timestamp in milliseconds)",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Wait until a specific date",
            "description": "Wait until 00:00 (UTC) Friday 23rd of August 2024",
            "parameters": [
              {
                "key": "until",
                "value": "1724371200000"
              }
            ]
          }
        ],
        "blockId": 100011,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/delay.png"
      }
    },
    "SWAP": {
      "description": "Swap two assets using the best market rates accross multiple pools",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/swap.png",
      "chains": [
        34443,
        8453
      ],
      "SWAP": {
        "name": "Swap",
        "description": "Swap two assets using the best market rates accross multiple pools",
        "type": 1,
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenIn}}",
            "amount": "{{parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.tokenIn}}",
            "amount": "{{parameters.amount}}"
          }
        ],
        "output": {
          "amountIn": "uint256",
          "tokenIn": "erc20",
          "amountOut": "uint256",
          "tokenOut": "erc20",
          "transactionHash": "string",
          "exchangeRate": "float",
          "logs": "Object"
        },
        "frontendHelpers": {
          "output": {
            "amountIn": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{output.tokenIn}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amountOut": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{output.tokenOut}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenIn",
            "type": "erc20",
            "description": "Token to sell",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenOut",
            "type": "erc20",
            "description": "Token to buy",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "amount",
            "type": "float",
            "description": "Amount to sell",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenIn}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "slippage",
            "type": "percentage",
            "description": "The maximum allowable difference between the expected price and the actual price at the time of execution, expressed as a percentage. This protects the transaction from significant price fluctuations.",
            "value": 1,
            "mandatory": true,
            "category": 1
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Swap USDC to WETH",
            "description": "Swap 100 USDC to WETH on Base using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "tokenIn",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "tokenOut",
                "value": "0x4200000000000000000000000000000000000006"
              },
              {
                "key": "amount",
                "value": 100
              },
              {
                "key": "slippage",
                "value": 0.3
              }
            ]
          }
        ],
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}",
            "{{parameters.tokenIn}}"
          ],
          "label": [
            "Swap {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenIn}})}} to {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenOut}})}}"
          ],
          "labelNotAuthorized": [
            "Transfer ETH"
          ]
        },
        "blockId": 100013,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/swap.png"
      }
    },
    "CONDITION": {
      "description": "Checks for a condition before proceeding",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/if.png",
      "IF": {
        "name": "Condition",
        "type": 5,
        "description": "Checks for a condition before proceeding",
        "parameters": [
          {
            "key": "logic",
            "type": "and_or",
            "description": "",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "groups",
            "type": "condition_groups",
            "description": "",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [],
        "blockId": 100016,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/if.png"
      }
    },
    "SPLIT": {
      "description": "Split a branch in multiple ones to parallelized executions",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/split.png",
      "SPLIT": {
        "name": "Split",
        "type": 4,
        "description": "Split a branch in multiple ones to parallelized executions",
        "parameters": [
          {
            "key": "branchesAmount",
            "type": "integer",
            "description": "Amount of parallel branches",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Split the flow in 3 branches",
            "description": "Split the flow in 3 branches",
            "parameters": [
              {
                "key": "branchesAmount",
                "value": 3
              }
            ]
          }
        ],
        "blockId": 100015,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/split.png"
      }
    },
    "MATHEMATICS": {
      "description": "Perform basic mathematical operations between two numbers",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/mathematics.svg",
      "MATHEMATICS": {
        "name": "Mathematics",
        "type": 6,
        "description": "Perform mathematical operations between two numbers",
        "output": {
          "resultAsFloat": "float",
          "resultAsInteger": "integer"
        },
        "parameters": [
          {
            "key": "number1",
            "type": "float",
            "description": "First number for the operation",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "operator",
            "type": "string",
            "description": "Mathematical operator to use",
            "mandatory": true,
            "enum": [
              "+",
              "-",
              "*",
              "/"
            ],
            "category": 0
          },
          {
            "key": "number2",
            "type": "float",
            "description": "Second number for the operation",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Multiply two numbers",
            "description": "Multiply by 1.1 the AAVE USDC lending rate on Base",
            "parameters": [
              {
                "key": "number1",
                "value": "{{external.functions.aaveLendingRate(8453,0x833589fcd6edb6e08f4c7c32d4f71b54bda02913,,)}}"
              },
              {
                "key": "operator",
                "value": "*"
              },
              {
                "key": "number2",
                "value": 1.1
              }
            ]
          }
        ],
        "blockId": 100019,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/mathematics.svg"
      }
    },
    "SCRIPT": {
      "description": "Execute a custom script",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/script.webp",
      "comingSoon": true,
      "SCRIPT": {
        "name": "Script",
        "type": 6,
        "description": "Execute a custom script",
        "parameters": [
        ] as Parameter[],
        "examples": [],
        "blockId": 100037,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/script.webp",
        "comingSoon": true
      }
    }
  },
  "NOTIFICATIONS": {
    "EMAIL": {
      "description": "Sends an email to the specified recipient",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/email.png",
      "SEND_EMAIL": {
        "name": "Send email",
        "type": 3,
        "description": "Sends an email to the specified recipient",
        "output": {
          "message": "string"
        },
        "parameters": [
          {
            "key": "to",
            "type": "email",
            "description": "The recipient's email address",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "subject",
            "type": "string",
            "description": "The subject of the email",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "body",
            "type": "paragraph",
            "description": "The body content of the email",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Basic notification",
            "description": "Notify you that the flow has been triggered",
            "parameters": [
              {
                "key": "to",
                "value": "your-email@gmail.com"
              },
              {
                "key": "subject",
                "value": "Workflow triggered"
              },
              {
                "key": "body",
                "value": "Your workflow has been triggered! Go to https://app.otomato.xyz/execution-history to see its execution details"
              }
            ]
          }
        ],
        "blockId": 100014,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/email.png"
      }
    },
    "SLACK": {
      "description": "Slack is a messaging app for businesses that connects people to the information they need.",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/slack.png",
      "SEND_MESSAGE": {
        "name": "Send message",
        "type": 0,
        "description": "Notifies you by sending a Slack message to the channel of your choice",
        "output": {
          "message": "string"
        },
        "parameters": [
          {
            "key": "webhook",
            "type": "url",
            "description": "The webhook URL for the Slack channel (e.g https://hooks.slack.com/services/T087SUVQ0DA/B07DEEGF9PK/FKkRaqagLR)",
            "mandatory": true,
            "private": true,
            "category": 0
          },
          {
            "key": "message",
            "type": "paragraph",
            "description": "The text content to send",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "template": {
          "url": "{{webhook}}",
          "body": {
            "text": "{{message}}"
          }
        },
        "examples": [],
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
        "output": {
          "message": "string"
        },
        "parameters": [
          {
            "key": "webhook",
            "type": "url",
            "description": "The webhook URL for the Discord channel",
            "mandatory": true,
            "private": true,
            "category": 0
          },
          {
            "key": "message",
            "type": "paragraph",
            "description": "The text content to send",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "template": {
          "url": "{{webhook}}",
          "body": {
            "content": "{{message}}"
          }
        },
        "examples": [
          {
            "name": "Basic notification",
            "description": "Notify you that the flow has been triggered on the otomato discord",
            "parameters": [
              {
                "key": "webhook",
                "value": "https://discord.com/api/webhooks/1303000202818621542/Wv7pGzZ8ZNGBk38uPJ5u4NPhghbARwKHXw3RN3QAKax6jKH85XOggRFFbGoDLI_sWSpt"
              },
              {
                "key": "message",
                "value": "Your workflow has been triggered! Go to https://app.otomato.xyz/execution-history to see its execution details"
              }
            ]
          }
        ],
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
        "output": {
          "message": "string"
        },
        "parameters": [
          {
            "key": "message",
            "type": "paragraph",
            "description": "The text content to send",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "chat_id",
            "type": "string",
            "description": "Channel id",
            "private": true,
            "category": 1
          },
          {
            "key": "webhook",
            "type": "string",
            "description": "Webhook",
            "private": true,
            "category": 1
          },
        ] as Parameter[],
        "template": {
          "url": "{{webhook}}",
          "body": {
            "chat_id": "{{chat_id}}",
            "text": "{{message}}"
          }
        },
        "examples": [],
        "blockId": 100001,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/telegram.jpeg"
      }
    }
  },
  "LENDING": {
    "IONIC": {
      "description": "Yield-bearing money market on the OP Superchain",
      "chains": [
        34443,
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg",
      "DEPOSIT": {
        "name": "Supply asset to Ionic",
        "description": "Deposit token in any Ionic lending pool",
        "type": 1,
        "method": "function mint(uint256 amount) public returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToDeposit",
            "type": "erc20",
            "description": "The token to deposit",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenToDeposit}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Deposit 100 USDT",
            "description": "Lend 100 USDT on Ionic on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToDeposit",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              }
            ]
          }
        ],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.tokenToDeposit}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenToDeposit}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.tokenToDeposit}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Deposit {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToDeposit}})}} on IONIC"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToDeposit}})}}"
          ]
        },
        "batchWith": [
          {
            "id": 100012,
            "type": 0,
            "conditions": [],
            "parameters": {
              "chainId": "{{parameters.chainId}}",
              "abi": {
                "parameters": {
                  "tokens": [
                    "{{before.contractAddress}}"
                  ]
                }
              }
            }
          }
        ],
        "blockId": 100006,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg"
      },
      "WITHDRAW": {
        "name": "Withdraw Asset from Ionic",
        "description": "Withdraw token deposited in any lending pool",
        "type": 1,
        "method": "function redeemUnderlying(uint256 amount) public returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToWithdraw",
            "type": "erc20",
            "description": "The token to withdraw",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{before.contractAddress}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Withdraw 100 USDT",
            "description": "Withdraw 100 USDT on Ionic on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToWithdraw",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              }
            ]
          },
          {
            "name": "Withdraw all",
            "description": "Withdraw all supplied amount of an asset",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935n"
              }
            ]
          }
        ],
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToWithdraw}})}} from IONIC"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToWithdraw}})}}"
          ]
        },
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.contractAddress}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "blockId": 100007,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg"
      },
      "BORROW": {
        "name": "Borrow asset",
        "description": "Borrow any token against your collateral",
        "type": 1,
        "method": "function borrow(uint256 amount) external returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToBorrow",
            "type": "erc20",
            "description": "The token to borrow",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "uint256",
            "description": "Amount of crypto to borrow",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenToBorrow}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Borrow 100 USDT",
            "description": "Borrow 100 USDT on Ionic on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToBorrow",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              }
            ]
          }
        ],
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Borrow {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToBorrow}})}} on IONIC"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToBorrow}})}}"
          ]
        },
        "blockId": 100008,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg"
      },
      "REPAY": {
        "name": "Repay asset",
        "description": "Repay a token that you borrowed",
        "type": 1,
        "method": "function repayBorrow(uint256 amount) external returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToRepay",
            "type": "erc20",
            "description": "The token to repay",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to repay",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenToRepay}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.tokenToRepay}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "examples": [
          {
            "name": "Repay 100 USDT",
            "description": "Repay 100 USDT on Ionic on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToRepay",
                "value": "0xf0F161fDA2712DB8b566946122a5af183995e2eD"
              }
            ]
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenToRepay}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}",
            "{{parameters.tokenToRepay}}"
          ],
          "label": [
            "Repay {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToRepay}})}} on IONIC"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToRepay}})}}"
          ]
        },
        "blockId": 100009,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg"
      },
      "ENABLE_COLLATERAL": {
        "showInUI": false,
        "name": "Enable collaterals",
        "description": "Enable collateral to be able to borrow against it.",
        "type": 1,
        "method": "function enterMarkets(address[] tokens) returns (uint256[])",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.tokens",
            "type": "addresses_array",
            "description": "List of collaterals",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [],
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Enable {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.tokens[0]}})}} as collateral on IONIC"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.tokens[0]}})}}"
          ]
        },
        "blockId": 100012,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ionic.jpg"
      }
    },
    "AAVE": {
      "description": "The most used protocol for borrowing and lending",
      "chains": [
        8453,
        534352
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png",
      "SUPPLY": {
        "name": "Supply asset to Aave",
        "description": "Supply an asset to AAVE",
        "type": 1,
        "method": "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token to supply",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "The amount of the asset to supply",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.abi.parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.onBehalfOf",
            "type": "address",
            "description": "The address to receive aTokens",
            "hideInUI": true,
            "category": 1
          },
          {
            "key": "abiParams.referralCode",
            "type": "uint16",
            "description": "Referral code (use 0, as inactive)",
            "hideInUI": true,
            "category": 1,
            "value": 0
          },
        ] as Parameter[],
        "requiredApprovals": [
          {
            "address": "{{parameters.abi.parameters.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.abi.parameters.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "examples": [
          {
            "name": "Supply USDC",
            "description": "Supply 100 USDC to Aave on the Base network",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "abiParams.onBehalfOf",
                "value": ""
              },
              {
                "key": "abiParams.referralCode",
                "value": 0
              }
            ]
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.abi.parameters.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Supply {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}} on Aave"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}}"
          ]
        },
        "blockId": 100020,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png"
      },
      "WITHDRAW": {
        "name": "Withdraw Asset from Aave",
        "description": "Withdraw a supplied asset from the Aave pool.",
        "type": 1,
        "method": "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The address of the asset to withdraw",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "The amount of the asset to withdraw. Use type(uint).max for full balance.",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.abi.parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            },
            "default": "type(uint256).max"
          },
          {
            "key": "abiParams.to",
            "type": "address",
            "description": "The address to receive the withdrawn asset",
            "category": 0,
            "hideInUI": true
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Withdraw USDC",
            "description": "Withdraw 10 USDC from Aave on the Base network",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "abiParams.amount",
                "value": 10
              },
              {
                "key": "abiParams.to",
                "value": ""
              }
            ]
          },
          {
            "name": "Withdraw all",
            "description": "Withdraw all supplied amount of an asset",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935n"
              },
              {
                "key": "abiParams.to",
                "value": ""
              }
            ]
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.abi.parameters.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}} from Aave"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}}"
          ]
        },
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.aaveToken}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "blockId": 100021,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png"
      }
    },
    "MOONWELL": {
      "description": "Yield-bearing money market",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png",
      "DEPOSIT": {
        "name": "Supply asset to Moonwell",
        "description": "Deposit token in any Moonwell lending pool",
        "type": 1,
        "method": "function mint(uint256 amount) external returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToDeposit",
            "type": "erc20",
            "description": "The token to deposit",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\n    \"0xEDfa23602D0EC14714057867A78d01e94176BEA0\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of token to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenToDeposit}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.tokenToDeposit}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenToDeposit}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.tokenToDeposit}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Deposit {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToDeposit}})}} on MOONWELL"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToDeposit}})}}"
          ]
        },
        "batchWith": [
          {
            "id": 100026,
            "type": 0,
            "conditions": [],
            "parameters": {
              "chainId": "{{parameters.chainId}}",
              "abi": {
                "parameters": {
                  "tokens": [
                    "{{before.contractAddress}}"
                  ]
                }
              }
            }
          }
        ],
        "examples": [
          {
            "name": "Deposit 100 USDC",
            "description": "Lend 100 USDC on Moonwell on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToDeposit",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              }
            ]
          }
        ],
        "blockId": 100022,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png"
      },
      "WITHDRAW": {
        "name": "Withdraw asset from Ionic",
        "description": "Withdraw token deposited in any lending pool",
        "type": 1,
        "method": "function redeemUnderlying(uint256 amount) external returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToWithdraw",
            "type": "erc20",
            "description": "The token to withdraw",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\n    \"0xEDfa23602D0EC14714057867A78d01e94176BEA0\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of token to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenToWithdraw}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Withdraw 100 USDC",
            "description": "Withdraw 100 USDC on Moonwell on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToWithdraw",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              }
            ]
          },
          {
            "name": "Withdraw all",
            "description": "Withdraw all supplied amount of an asset",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935n"
              }
            ]
          }
        ],
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToWithdraw}})}} from MOONWELL"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToWithdraw}})}}"
          ]
        },
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.contractAddress}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "blockId": 100023,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png"
      },
      "BORROW": {
        "name": "Borrow asset",
        "description": "Borrow any token against your collateral",
        "type": 1,
        "method": "function borrow(uint256 amount) external returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToBorrow",
            "type": "erc20",
            "description": "The token to borrow",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\n    \"0xEDfa23602D0EC14714057867A78d01e94176BEA0\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to borrow",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenToBorrow}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Borrow 100 USDC",
            "description": "Borrow 100 USDC on Moonwell on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToBorrow",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              }
            ]
          }
        ],
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Borrow {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToBorrow}})}} on MOONWELL"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToBorrow}})}}"
          ]
        },
        "blockId": 100024,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png"
      },
      "REPAY": {
        "name": "Repay asset",
        "description": "Repay a token that you borrowed",
        "type": 1,
        "method": "function repayBorrow(uint256 amount) external returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenToRepay",
            "type": "erc20",
            "description": "The token to repay",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\n    \"0xEDfa23602D0EC14714057867A78d01e94176BEA0\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to repay",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenToRepay}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.tokenToRepay}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "examples": [
          {
            "name": "Repay 100 USDC",
            "description": "Repay 100 USDC on Moonwell on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "tokenToRepay",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              }
            ]
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenToRepay}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}",
            "{{parameters.tokenToRepay}}"
          ],
          "label": [
            "Repay {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToRepay}})}} on MOONWELL"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToRepay}})}}"
          ]
        },
        "blockId": 100025,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png"
      },
      "ENABLE_COLLATERAL": {
        "showInUI": false,
        "name": "Enable collaterals",
        "description": "Enable collateral to be able to borrow against it.",
        "type": 1,
        "method": "function enterMarkets(address[] tokens) returns (uint256[])",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.tokens",
            "type": "addresses_array",
            "description": "List of collaterals",
            "mandatory": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [],
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Enable {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.tokens[0]}})}} as collateral on MOONWELL"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.tokens[0]}})}}"
          ]
        },
        "blockId": 100026,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.png"
      }
    },
    "COMPOUND": {
      "description": "One of the biggest yield-bearing money market",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/compound.png",
      "DEPOSIT": {
        "name": "Supply asset to Compound",
        "description": "Deposit token in any Compound lending pool",
        "type": 1,
        "method": "function supply(address asset, uint amount)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token to deposit",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.abi.parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Deposit 100 USDC",
            "description": "Lend 100 USDC on Compound on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "abiParams.asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              }
            ]
          }
        ],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.abi.parameters.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{parameters.abi.parameters.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.abi.parameters.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Deposit {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}} on COMPOUND"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}}"
          ]
        },
        "blockId": 100027,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/compound.png"
      },
      "WITHDRAW": {
        "name": "Withdraw Asset from Compound",
        "description": "Withdraw token deposited in any lending pool",
        "type": 1,
        "method": "function withdraw(address asset, uint amount)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token to withdraw",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.abi.parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.contractAddress}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "examples": [
          {
            "name": "Withdraw 100 USDC",
            "description": "Withdraw 100 USDC on Compound on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "abiParams.asset",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              }
            ]
          },
          {
            "name": "Withdraw all",
            "description": "Withdraw all supplied amount of an asset",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935n"
              }
            ]
          }
        ],
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.abi.parameters.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}} from COMPOUND"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}}"
          ]
        },
        "blockId": 100028,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/compound.png"
      }
    },
    "IRONCLAD": {
      "description": "Yield-bearing money market available on multiple chains.",
      "chains": [
        8453,
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ironclad.png",
      "SUPPLY": {
        "name": "Supply Asset to Ironclad",
        "description": "Supply an asset to ironclad",
        "type": 1,
        "method": "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The token to supply",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\"\n  ],\n  \"34443\": [\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xDfc7C877a950e49D2610114102175A06C2e3167a\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "The amount of the asset to supply",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.abi.parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.onBehalfOf",
            "type": "address",
            "description": "The address to receive aTokens",
            "hideInUI": true,
            "category": 1
          },
          {
            "key": "abiParams.referralCode",
            "type": "uint16",
            "description": "Referral code (use 0, as inactive)",
            "hideInUI": true,
            "category": 1,
            "value": 0
          },
        ] as Parameter[],
        "requiredApprovals": [
          {
            "address": "{{parameters.abi.parameters.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.abi.parameters.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "examples": [
          {
            "name": "Supply USDC",
            "description": "Supply 100 USDC to Ironclad on the Mode network",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.asset",
                "value": "0xd988097fb8612cc24eeC14542bC03424c656005f"
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "abiParams.onBehalfOf",
                "value": ""
              },
              {
                "key": "abiParams.referralCode",
                "value": 0
              }
            ]
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.abi.parameters.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Supply {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}} on Ironclad"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}}"
          ]
        },
        "blockId": 100029,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ironclad.png"
      },
      "WITHDRAW": {
        "name": "Withdraw Asset from Ironclad",
        "description": "Withdraw a supplied asset from the Ironclad pool.",
        "type": 1,
        "method": "function withdraw(address asset, uint256 amount, address to) returns (uint256)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.asset",
            "type": "erc20",
            "description": "The address of the asset to withdraw",
            "mandatory": true,
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"8453\": [\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA\",\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\"\n  ],\n  \"34443\": [\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xDfc7C877a950e49D2610114102175A06C2e3167a\"\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "The amount of the asset to withdraw. Use type(uint).max for full balance.",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.abi.parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            },
            "default": "type(uint256).max"
          },
          {
            "key": "abiParams.to",
            "type": "address",
            "description": "The address to receive the withdrawn asset",
            "category": 0,
            "hideInUI": true
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Withdraw USDC",
            "description": "Withdraw 10 USDC from Ironclad on the Mode network",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.asset",
                "value": "0xd988097fb8612cc24eeC14542bC03424c656005f"
              },
              {
                "key": "abiParams.amount",
                "value": 10
              },
              {
                "key": "abiParams.to",
                "value": ""
              }
            ]
          },
          {
            "name": "Withdraw all",
            "description": "Withdraw all supplied amount of an asset",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935n"
              },
              {
                "key": "abiParams.to",
                "value": ""
              }
            ]
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.abi.parameters.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}} from Ironclad"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}}"
          ]
        },
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.ironcladToken}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "blockId": 100030,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/ironclad.png"
      }
    },
    "MORPHO": {
      "description": "Morpho is a decentralized lending protocol with different entities and individuals contributing to its development and adoption",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp",
      "DEPOSIT": {
        "name": "Lend asset",
        "description": "Lend token in any Morpho vault",
        "type": 1,
        "method": "function deposit(uint256 amount, address receiver)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "vault",
            "type": "string",
            "description": "The vault address",
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n\n          const availableVaultsList = {\"1\":[{\"icon\":\"https://cdn.morpho.org/v2/assets/images/m0-vault-mev.png\",\"name\":\"MEV Capital M^0 Vault\",\"address\":\"0xfbDEE8670b273E12b019210426E70091464b02Ab\",\"amount\":\"4886716.00M\",\"symbol\":\"wM\",\"asset\":{\"symbol\":\"wM\",\"address\":\"0x437cc33344a0B27A429f795ff6B469C72698B291\",\"name\":\"WrappedM by M^0\"},\"usdValue\":\"4.91M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Gauntlet cbBTC Core\",\"address\":\"0xF587f2e8AfF7D76618d3B6B4626621860FbD54e3\",\"amount\":\"2823204692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"2486909.27M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet MKR Blended\",\"address\":\"0xEbFA750279dEfa89b8D99bdd145a016F6292757b\",\"amount\":\"1111399302.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"1115.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.05\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"name\":\"Re7 wstETH\",\"address\":\"0xE87ed29896B91421ff43f69257ABF78300e40c7a\",\"amount\":\"99899948717228688.00M\",\"symbol\":\"wstETH\",\"asset\":{\"symbol\":\"wstETH\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\",\"name\":\"Wrapped liquid staked Ether 2.0\"},\"usdValue\":\"295.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\"],\"apy\":\"1.09\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"name\":\"Re7 WBTC\",\"address\":\"0xE0C98605f279e4D7946d25B75869c69802823763\",\"amount\":\"3731976044.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3286129.45M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pumpbtc.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.61\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Prime\",\"address\":\"0xdd0f28e19C1780eb6396170735D45153D261490d\",\"amount\":\"27325357416392.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"27410565.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"5.79\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet LBTC Core\",\"address\":\"0xdC94785959B73F7A168452b3654E44fEc6A750e4\",\"amount\":\"4546123877.00M\",\"symbol\":\"LBTC\",\"asset\":{\"symbol\":\"LBTC\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\",\"name\":\"Lombard Staked Bitcoin\"},\"usdValue\":\"4004597.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\"],\"apy\":\"4.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet-solvbtc-babylon.svg\",\"name\":\"SolvBTC Babylon Vault\",\"address\":\"0xdBB316375B4dC992B2c8827D120c09dFB1d3455D\",\"amount\":\"10000030000000000000.00M\",\"symbol\":\"SolvBTC.BBN\",\"asset\":{\"symbol\":\"SolvBTC.BBN\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\",\"name\":\"SolvBTC Babylon\"},\"usdValue\":\"880605.94M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/usual.svg\",\"name\":\" Usual Boosted USDC\",\"address\":\"0xd63070114470f685b75B74D60EEc7c1113d33a3D\",\"amount\":\"23474623919224.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"23522528.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd0usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/lvlusd.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/sdeusd.svg\"],\"apy\":\"45.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-usdc.svg\",\"name\":\"9Summits USDC Core\",\"address\":\"0xD5Ac156319f2491d4ad1Ec4aA5ed0ED48C0fa173\",\"amount\":\"1193190215700.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"1197857.86M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"5.50\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/resolv-vault.png\",\"name\":\"MEV Capital Resolv USR\",\"address\":\"0xD50DA5F859811A91fD1876C9461fD39c23C747Ad\",\"amount\":\"3.943973448431187e+23M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\",\"name\":\"Resolv USD\"},\"usdValue\":\"394397.34M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\"],\"apy\":\"7.77\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Frontier\",\"address\":\"0xc582F04d8a82795aa2Ff9c8bb4c1c889fe7b754e\",\"amount\":\"225164741838.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"225299.02M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/uscc.svg\"],\"apy\":\"33.33\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/fence_vault.jpg\",\"name\":\"EUR Real Yield\",\"address\":\"0xC21DB71648B18C5B9E038d88393C9b254cf8eaC8\",\"amount\":\"1.1634998094176076e+21M\",\"symbol\":\"EURe\",\"asset\":{\"symbol\":\"EURe\",\"address\":\"0x3231Cb76718CDeF2155FC47b5286d82e6eDA273f\",\"name\":\"Monerium EUR emoney\"},\"usdValue\":\"1222.14M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/fence.svg\",\"name\":\"Fence\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/steur.svg\",\"https://cdn.morpho.org/assets/logos/wbc3m.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital USD0\",\"address\":\"0xC0A14627D6a23f70c809777CEd873238581C1032\",\"amount\":\"51090439990918324224.00M\",\"symbol\":\"USD0\",\"asset\":{\"symbol\":\"USD0\",\"address\":\"0x73A15FeD60Bf67631dC6cd7Bc5B6e8da8190aCF5\",\"name\":\"Usual USD\"},\"usdValue\":\"50.98M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet eUSD Core\",\"address\":\"0xc080f56504e0278828A403269DB945F6c6D6E014\",\"amount\":\"3.825932225636031e+24M\",\"symbol\":\"eUSD\",\"asset\":{\"symbol\":\"eUSD\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\",\"name\":\"Electronic Dollar\"},\"usdValue\":\"3823191.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"18.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/smokehouse_dai.svg\",\"name\":\"Smokehouse DAI\",\"address\":\"0xbeeFfF68CC520D68f82641EFF84330C631E2490E\",\"amount\":\"2.5823386125784788e+23M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"258208.22M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\"],\"apy\":\"20.44\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/smokehouse_usdc.svg\",\"name\":\"Smokehouse USDC\",\"address\":\"0xBEeFFF209270748ddd194831b3fa287a5386f5bC\",\"amount\":\"20014271231044.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"20051053.28M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/uscc.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/csusdl.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/uni.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"14.94\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdl-vault.svg\",\"name\":\"Coinshift USDL\",\"address\":\"0xbEEFC01767ed5086f35deCb6C00e6C12bc7476C1\",\"amount\":\"7.504110009219575e+21M\",\"symbol\":\"wUSDL\",\"asset\":{\"symbol\":\"wUSDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\",\"name\":\"Wrapped USDL\"},\"usdValue\":\"7622.46M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"4.06\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdl-vault.svg\",\"name\":\"Coinshift USDL\",\"address\":\"0xbEeFc011e94f43b8B7b455eBaB290C7Ab4E216f1\",\"amount\":\"1.1624532661245971e+25M\",\"symbol\":\"wUSDL\",\"asset\":{\"symbol\":\"wUSDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\",\"name\":\"Wrapped USDL\"},\"usdValue\":\"11807869.42M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"2.31\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PAXG\",\"address\":\"0xBeEf796ae50ba5423857CAc27DD36369cfc8241b\",\"amount\":\"1500000000000000.00M\",\"symbol\":\"PAXG\",\"asset\":{\"symbol\":\"PAXG\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\",\"name\":\"PAX Gold\"},\"usdValue\":\"4.43M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PAXG\",\"address\":\"0xBeeF7959aE71D4e45e1863dae0B94C35244AF816\",\"amount\":\"216296713623299522560.00M\",\"symbol\":\"PAXG\",\"asset\":{\"symbol\":\"PAXG\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\",\"name\":\"PAX Gold\"},\"usdValue\":\"638500.40M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse RUSD\",\"address\":\"0xBeEf11eCb698f4B5378685C05A210bdF71093521\",\"amount\":\"3.1515592246634458e+25M\",\"symbol\":\"rUSD\",\"asset\":{\"symbol\":\"rUSD\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\",\"name\":\"Reservoir Stablecoin\"},\"usdValue\":\"31515592.25M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"8.29\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse WBTC\",\"address\":\"0xbeEf094333AEdD535c130958c204E84f681FD9FA\",\"amount\":\"37725552.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"33218.70M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse ETH\",\"address\":\"0xBEEf050ecd6a16c4e7bfFbB52Ebba7846C4b8cD4\",\"amount\":\"5.368022669686909e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"13278609.28M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDT\",\"address\":\"0xbEef047a543E45807105E51A8BBEFCc5950fcfBa\",\"amount\":\"8351623154821.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"8354730.53M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susds.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\"],\"apy\":\"6.96\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PYUSD\",\"address\":\"0xbEEF02e5E13584ab96848af90261f0C8Ee04722a\",\"amount\":\"1406089475048.00M\",\"symbol\":\"PYUSD\",\"asset\":{\"symbol\":\"PYUSD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\",\"name\":\"PayPal USD\"},\"usdValue\":\"1410468.24M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"https://cdn.morpho.org/assets/logos/usyc.svg\",\"https://cdn.morpho.org/assets/logos/wbib01.svg\"],\"apy\":\"6.46\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC\",\"address\":\"0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB\",\"amount\":\"35090650590603.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"35158602.52M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\"],\"apy\":\"5.79\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 FRAX\",\"address\":\"0xBE40491F3261Fd42724F1AEb465796eb11c06ddF\",\"amount\":\"1.8525675767872602e+22M\",\"symbol\":\"FRAX\",\"asset\":{\"symbol\":\"FRAX\",\"address\":\"0x853d955aCEf822Db058eb8505911ED77F175b99e\",\"name\":\"Frax\"},\"usdValue\":\"18454.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\"],\"apy\":\"3.95\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Relend cbBTC\",\"address\":\"0xB9C9158aB81f90996cAD891fFbAdfBaad733c8C6\",\"amount\":\"931154261.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"820236.72M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\"],\"apy\":\"0.29\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet-midas.svg\",\"name\":\"Midas USDC\",\"address\":\"0xA8875aaeBc4f830524e35d57F9772FfAcbdD6C45\",\"amount\":\"2000000000.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"2007.82M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"https://cdn.morpho.org/assets/logos/mbasis.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-m.svg\",\"name\":\"Steakhouse M\",\"address\":\"0xa5aA40F27DAeDE9748822ef836170f202e196B5A\",\"amount\":\"1000000.00M\",\"symbol\":\"wM\",\"asset\":{\"symbol\":\"wM\",\"address\":\"0x437cc33344a0B27A429f795ff6B469C72698B291\",\"name\":\"WrappedM by M^0\"},\"usdValue\":\"1.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-usdq.svg\",\"name\":\"Steakhouse USDQ\",\"address\":\"0xA1b60d96e5C50dA627095B9381dc5a46AF1a9a42\",\"amount\":\"344281027799.00M\",\"symbol\":\"USDQ\",\"asset\":{\"symbol\":\"USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\",\"name\":\"Quantoz USDQ\"},\"usdValue\":\"344281.03M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bbqusdt.svg\",\"name\":\"Smokehouse USDT\",\"address\":\"0xA0804346780b4c2e3bE118ac957D1DB82F9d7484\",\"amount\":\"977743897000.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"979509.72M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"6.87\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Re7 cbBTC\",\"address\":\"0xA02F5E93f783baF150Aa1F8b341Ae90fe0a772f7\",\"amount\":\"975605944.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"859393.40M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pumpbtc.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"MEV Capital wETH\",\"address\":\"0x9a8bC3B04b7f3D87cfC09ba407dCED575f2d61D8\",\"amount\":\"2.7067390438466414e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"6695525.04M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/apxeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-teth-29may2025.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"5.75\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital cbBTC\",\"address\":\"0x98cF0B67Da0F16E1F8f1a1D23ad8Dc64c0c70E0b\",\"amount\":\"2823204692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"2486909.27M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"name\":\"Re7 USDT\",\"address\":\"0x95EeF579155cd2C5510F312c8fA39208c3Be01a8\",\"amount\":\"523358804598.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"523465.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"6.22\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Core\",\"address\":\"0x8eB67A509616cd6A7c1B3c8C21D48FF57df3d458\",\"amount\":\"33216280207891.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"33303066.74M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/link.svg\",\"https://cdn.morpho.org/assets/logos/uni.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/sdeusd.svg\"],\"apy\":\"12.35\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDT Prime\",\"address\":\"0x8CB3649114051cA5119141a34C200D65dc0Faa73\",\"amount\":\"4490293707985.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"4498403.25M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\"],\"apy\":\"6.99\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"name\":\"Re7 USDA\",\"address\":\"0x89D80f5e9BC88d8021b352064ae73F0eAf79EBd8\",\"amount\":\"1.366371325778496e+22M\",\"symbol\":\"USDA\",\"asset\":{\"symbol\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\",\"name\":\"USDA\"},\"usdValue\":\"13661.98M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-31oct2024.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bbqwsteth.svg\",\"name\":\"Smokehouse WSTETH\",\"address\":\"0x833AdaeF212c5cD3f78906B44bBfb18258F238F0\",\"amount\":\"104099016004590059520.00M\",\"symbol\":\"wstETH\",\"asset\":{\"symbol\":\"wstETH\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\",\"name\":\"Wrapped liquid staked Ether 2.0\"},\"usdValue\":\"308831.11M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"1.09\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 WETH\",\"address\":\"0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0\",\"amount\":\"5.692717726491903e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"14081791.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/re7wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/apxeth.svg\",\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.02\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msETH Vault\",\"address\":\"0x78B18E07dc43017fcEaabaD0751d6464c0F56b25\",\"amount\":\"75701180803203006464.00M\",\"symbol\":\"msETH\",\"asset\":{\"symbol\":\"msETH\",\"address\":\"0x64351fC9810aDAd17A690E4e1717Df5e7e085160\",\"name\":\"Metronome Synth ETH\"},\"usdValue\":\"187258.23M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rsweth.svg\"],\"apy\":\"2.69\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-eurcv.svg\",\"name\":\"Steakhouse EURCV\",\"address\":\"0x75741A12B36D181f44F389E0c6B1E0210311e3Ff\",\"amount\":\"1000136824993298304.00M\",\"symbol\":\"EURCV\",\"asset\":{\"symbol\":\"EURCV\",\"address\":\"0x5F7827FDeb7c20b443265Fc2F40845B715385Ff2\",\"name\":\"EUR CoinVertible\"},\"usdValue\":\"1.05M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"name\":\"Spark DAI Vault\",\"address\":\"0x73e65DBD630f90604062f6E02fAb9138e713edD9\",\"amount\":\"8.059925519238407e+25M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"80581265.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/spark.svg\",\"name\":\"SparkDAO\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-29may2025.svg\"],\"apy\":\"16.31\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdc-vault.svg\",\"name\":\"Coinshift USDC\",\"address\":\"0x7204B7Dbf9412567835633B6F00C3Edc3a8D6330\",\"amount\":\"3343669443899.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"3356749.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/csusdl.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"5.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/index_coop_hyeth_vault.png\",\"name\":\"Index Coop hyETH\",\"address\":\"0x701907283a57FF77E255C3f1aAD790466B8CE4ef\",\"amount\":\"6.752699569423558e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"16703815.29M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/pt-ageth-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\"],\"apy\":\"4.33\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC RWA\",\"address\":\"0x6D4e530B8431a52FFDA4516BA4Aadc0951897F8C\",\"amount\":\"599924811901.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"600278.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/uscc.svg\"],\"apy\":\"13.09\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msUSD Vault\",\"address\":\"0x6859B34a9379122d25A9FA46f0882d434fee36c3\",\"amount\":\"2.4014580705370727e+23M\",\"symbol\":\"msUSD\",\"asset\":{\"symbol\":\"msUSD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\",\"name\":\"Metronome Synth USD\"},\"usdValue\":\"240145.81M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\"],\"apy\":\"4.24\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"name\":\"LlamaRisk crvUSD Vault\",\"address\":\"0x67315dd969B8Cd3a3520C245837Bf71f54579C75\",\"amount\":\"3.868251435951369e+23M\",\"symbol\":\"crvUSD\",\"asset\":{\"symbol\":\"crvUSD\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\",\"name\":\"Curve.Fi USD Stablecoin\"},\"usdValue\":\"387183.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"name\":\"LlamaRisk\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdtwbtcweth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdcwbtcweth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvcrvusdtbtcwsteth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxtrylsd-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\"],\"apy\":\"15.29\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Re7 USDC\",\"address\":\"0x60d715515d4411f7F43e4206dc5d4a3677f0eC78\",\"amount\":\"308.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"0.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/sand.svg\",\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"12.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/resolv-vault.png\",\"name\":\"Apostro Resolv USR\",\"address\":\"0x5085Dd6FAd07c12e38fae01bc2a4938d2C08B1Bc\",\"amount\":\"9.850714815327631e+23M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\",\"name\":\"Resolv USD\"},\"usdValue\":\"985071.48M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\"],\"apy\":\"4.04\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet DAI Core\",\"address\":\"0x500331c9fF24D9d11aee6B07734Aa72343EA74a5\",\"amount\":\"1.3822723756222332e+25M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"13821351.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-29may2025.svg\"],\"apy\":\"10.80\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/sbmorphousdc.svg\",\"name\":\"SwissBorg Morpho USDC\",\"address\":\"0x4Ff4186188f8406917293A9e01A1ca16d3cf9E59\",\"amount\":\"9691069591894.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"9728144.89M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"5.28\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"f(x) Protocol Morpho USDC\",\"address\":\"0x4F460bb11cf958606C69A963B4A17f9DaEEea8b6\",\"amount\":\"109831265981.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"110260.92M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/arusd.svg\"],\"apy\":\"6.12\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/rwa_leadblock.png\",\"name\":\"LeadBlock USDC RWA\",\"address\":\"0x4cA0E178c94f039d7F202E09d8d1a655Ed3fb6b6\",\"amount\":\"572851727106.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"575092.67M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/leadblock.png\",\"name\":\"LeadBlock\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd0usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mtbill.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet LRT Core\",\"address\":\"0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658\",\"amount\":\"3.994710315872713e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"9881515.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\"],\"apy\":\"8.13\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/xaum.svg\",\"name\":\"Relend Gold\",\"address\":\"0x45c1875F1C48622b3D9740Af2D7dc62Bc9a72422\",\"amount\":\"600000000099999940608.00M\",\"symbol\":\"XAUM\",\"asset\":{\"symbol\":\"XAUM\",\"address\":\"0x2103E845C5E135493Bb6c2A4f0B8651956eA8682\",\"name\":\"Matrixdock Gold\"},\"usdValue\":\"1746934.50M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/crvusd.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet WBTC Core\",\"address\":\"0x443df5eEE3196e9b2Dd77CaBd3eA76C3dee8f9b2\",\"amount\":\"4328382210.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3811296.10M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/swbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\"],\"apy\":\"0.62\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Flagship ETH\",\"address\":\"0x38989BBA00BDF8181F4082995b3DEAe96163aC5D\",\"amount\":\"531794377078535684096.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"1315473.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"2.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-r.svg\",\"name\":\"Steakhouse USDR\",\"address\":\"0x30881Baa943777f92DC934d53D3bFdF33382cab3\",\"amount\":\"344168357316.00M\",\"symbol\":\"USDR\",\"asset\":{\"symbol\":\"USDR\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\",\"name\":\"StablR USD\"},\"usdValue\":\"344168.36M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/xaut.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/pendle-wbtc-vault.svg\",\"name\":\"Pendle WBTC\",\"address\":\"0x2f1aBb81ed86Be95bcf8178bA62C8e72D6834775\",\"amount\":\"4001640934.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3523587.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\"],\"apy\":\"0.63\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"name\":\"Flagship USDT\",\"address\":\"0x2C25f6C25770fFEC5959D34B94Bf898865e5D6b1\",\"amount\":\"197586290993.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"197943.14M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"4.95\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alpha USDC Vault\",\"address\":\"0xD50B9Bbf136D1BD5CD5AC6ed9b3F26c458a6d4A6\",\"amount\":\"5467848.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"5.45M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alphaping\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/deusd.svg\"],\"apy\":\"9.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alpha WETH Vault\",\"address\":\"0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC\",\"amount\":\"2105831930136005.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"4.44M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alphaping\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\"],\"apy\":\"11.38\"}],\"8453\":[{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-eth.svg\",\"name\":\"9Summits WETH Core\",\"address\":\"0xF540D790413FCFAedAC93518Ae99EdDacE82cb78\",\"amount\":\"293173410772970995712.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"728381.70M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\"],\"apy\":\"1.49\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"name\":\"Moonwell Flagship EURC\",\"address\":\"0xf24608E0CCb972b0b0f4A6446a0BBf58c701a026\",\"amount\":\"4611146279221.00M\",\"symbol\":\"EURC\",\"asset\":{\"symbol\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\"name\":\"EURC\"},\"usdValue\":\"4861503.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.49\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Prime\",\"address\":\"0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61\",\"amount\":\"6177504038069.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"6177512.07M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.03\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Degen USDC\",\"address\":\"0xdB90A4e973B7663ce0Ccc32B6FbD37ffb19BfA83\",\"amount\":\"27791210.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"27.79M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/degen.svg\"],\"apy\":\"5.01\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro Resolv USDC\",\"address\":\"0xcdDCDd18A16ED441F6CB10c3909e5e7ec2B9e8f3\",\"amount\":\"36723010932.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"36723.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\"],\"apy\":\"14.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem USDC\",\"address\":\"0xCd347c1e7d600a9A3e403497562eDd0A7Bc3Ef21\",\"amount\":\"73836791181.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"73836.89M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"6.97\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro Resolv USR\",\"address\":\"0xC484D83F667b779cc9907248101214235642258B\",\"amount\":\"2.731061761406047e+21M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\",\"name\":\"Resolv USD\"},\"usdValue\":\"2731.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"7.42\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Moonwell Flagship USDC\",\"address\":\"0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca\",\"amount\":\"21466989405948.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21467017.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.26\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Core\",\"address\":\"0xc0c5689e6f4D256E861F65465b691aeEcC0dEb12\",\"amount\":\"4854633998349.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"4854640.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/aero.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/usdz.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"7.51\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Steakhouse USDC RWA\",\"address\":\"0xbEefc4aDBE58173FCa2C042097Fe33095E68C3D6\",\"amount\":\"142005044191.00M\",\"symbol\":\"verUSDC\",\"asset\":{\"symbol\":\"verUSDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\",\"name\":\"Verified USDC\"},\"usdValue\":\"142005.23M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usyc.svg\",\"https://cdn.morpho.org/assets/logos/jtrsy.svg\",\"https://cdn.morpho.org/assets/logos/mtbill.svg\"],\"apy\":\"11.01\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse EURA\",\"address\":\"0xBEeFA28D5e56d41D35df760AB53B94D9FfD7051F\",\"amount\":\"3.203903777071764e+23M\",\"symbol\":\"EURA\",\"asset\":{\"symbol\":\"EURA\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\",\"name\":\"EURA (previously agEUR)\"},\"usdValue\":\"337117.96M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"1.48\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDA\",\"address\":\"0xbEEfa1aBfEbE621DF50ceaEF9f54FdB73648c92C\",\"amount\":\"4.487377764932623e+23M\",\"symbol\":\"USDA\",\"asset\":{\"symbol\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\",\"name\":\"USDA\"},\"usdValue\":\"448737.78M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/steur.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\"],\"apy\":\"3.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse EURC\",\"address\":\"0xBeEF086b8807Dc5E5A1740C5E3a7C4c366eA6ab5\",\"amount\":\"111986267714.00M\",\"symbol\":\"EURC\",\"asset\":{\"symbol\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\"name\":\"EURC\"},\"usdValue\":\"117918.87M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"16.18\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse ETH\",\"address\":\"0xbEEf050a7485865A7a8d8Ca0CC5f7536b7a3443e\",\"amount\":\"184659872439385194496.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"458782.64M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.60\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDM\",\"address\":\"0xBEef03f0BF3cb2e348393008a826538AaDD7d183\",\"amount\":\"3.958601843377425e+23M\",\"symbol\":\"wUSDM\",\"asset\":{\"symbol\":\"wUSDM\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\",\"name\":\"Wrapped Mountain Protocol USD\"},\"usdValue\":\"423244.60M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\"],\"apy\":\"2.98\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC\",\"address\":\"0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183\",\"amount\":\"2310868092500.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"2310871.10M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.76\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"name\":\"Morpho eUSD\",\"address\":\"0xbb819D845b573B5D7C538F5b85057160cfb5f313\",\"amount\":\"1.5955728234338277e+24M\",\"symbol\":\"eUSD\",\"asset\":{\"symbol\":\"eUSD\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\"name\":\"Electronic Dollar\"},\"usdValue\":\"1594015.21M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/hyusd.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"13.22\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Universal USDC\",\"address\":\"0xB7890CEE6CF4792cdCC13489D36D9d42726ab863\",\"amount\":\"187793526001.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"187793.77M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/uxrp.svg\",\"https://cdn.morpho.org/assets/logos/usol.svg\",\"https://cdn.morpho.org/assets/logos/usui.svg\",\"https://cdn.morpho.org/assets/logos/uapt.svg\"],\"apy\":\"9.66\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse sUSDS\",\"address\":\"0xB17B070A56043e1a5a1AB7443AfAFDEbcc1168D7\",\"amount\":\"1000000000000000000.00M\",\"symbol\":\"sUSDS\",\"asset\":{\"symbol\":\"sUSDS\",\"address\":\"0x5875eEE11Cf8398102FdAd704C9E96607675467a\",\"name\":\"Savings USDS\"},\"usdValue\":\"1.04M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"4.42\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 WETH\",\"address\":\"0xA2Cac0023a4797b4729Db94783405189a4203AFc\",\"amount\":\"2.1828211735125825e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"5418859.62M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\"],\"apy\":\"2.83\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Moonwell Flagship ETH\",\"address\":\"0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1\",\"amount\":\"2.546967774229026e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"6327500.82M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"3.53\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem WETH\",\"address\":\"0x9aB2d181E4b87ba57D5eD564D3eF652C4E710707\",\"amount\":\"137209809205159002112.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"339875.85M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"7.65\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/degen.svg\",\"name\":\"Morpho Degen\",\"address\":\"0x8c3A6B12332a6354805Eb4b72ef619aEdd22BcdD\",\"amount\":\"2.468464079065287e+25M\",\"symbol\":\"DEGEN\",\"asset\":{\"symbol\":\"DEGEN\",\"address\":\"0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed\",\"name\":\"Degen\"},\"usdValue\":\"103576.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"0.39\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Pyth ETH\",\"address\":\"0x80D9964fEb4A507dD697b4437Fc5b25b618CE446\",\"amount\":\"185405112846054653952.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"460634.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.03\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Spark USDC Vault\",\"address\":\"0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A\",\"amount\":\"21129842017824.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21129869.49M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/spark.svg\",\"name\":\"SparkDAO\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.18\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cdxusd.svg\",\"name\":\"Re7 cdxUSD\",\"address\":\"0x74B6EA9BFee07C3756969b0139CFacBBa5845969\",\"amount\":\"1.295027780957741e+22M\",\"symbol\":\"cdxUSD\",\"asset\":{\"symbol\":\"cdxUSD\",\"address\":\"0xC0D3700000987C99b3C9009069E4f8413fD22330\",\"name\":\"Cod3x USD\"},\"usdValue\":\"12933.34M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mbasis.svg\"],\"apy\":\"1.08\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Relend ETH\",\"address\":\"0x70F796946eD919E4Bc6cD506F8dACC45E4539771\",\"amount\":\"1287544653455166976.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"3198.87M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\"],\"apy\":\"1.49\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Re7 RWA\",\"address\":\"0x6e37C95b43566E538D8C278eb69B00FC717a001b\",\"amount\":\"162488588434.00M\",\"symbol\":\"verUSDC\",\"asset\":{\"symbol\":\"verUSDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\",\"name\":\"Verified USDC\"},\"usdValue\":\"162488.80M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"https://cdn.morpho.org/assets/logos/jtrsy.svg\"],\"apy\":\"10.67\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet WETH Core\",\"address\":\"0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844\",\"amount\":\"4.597041924847126e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"11415909.81M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"3.36\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet cbBTC Core\",\"address\":\"0x6770216aC60F634483Ec073cBABC4011c94307Cb\",\"amount\":\"8062003767.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"7104072.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"0.74\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/seamless-vault.png\",\"name\":\"Seamless USDC Vault\",\"address\":\"0x616a4E1db48e22028f6bbf20444Cd3b8e3273738\",\"amount\":\"21687895306147.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21687923.50M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"9.76\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/seamless-vault.png\",\"name\":\"Seamless cbBTC Vault\",\"address\":\"0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7\",\"amount\":\"11557412692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"10184154.73M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"3.63\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem WETH\",\"address\":\"0x5A32099837D89E3a794a44fb131CBbAD41f87a8C\",\"amount\":\"810038201286899793920.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"2007197.76M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-eth.svg\",\"name\":\"9Summits WETH Core 1.1\",\"address\":\"0x5496b42ad0deCebFab0db944D83260e60D54f667\",\"amount\":\"4.228309188535861e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"10498096.38M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.81\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Moonwell Frontier cbBTC\",\"address\":\"0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796\",\"amount\":\"4836920235.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"4262194.78M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"2.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msETH Vault\",\"address\":\"0x43Cd00De63485618A5CEEBE0de364cD6cBeB26E7\",\"amount\":\"97508524637609721856.00M\",\"symbol\":\"msETH\",\"asset\":{\"symbol\":\"msETH\",\"address\":\"0x7Ba6F01772924a82D9626c126347A28299E98c98\",\"name\":\"Metronome Synth ETH\"},\"usdValue\":\"242257.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\"],\"apy\":\"3.95\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"name\":\"Morpho MAI\",\"address\":\"0x30B8A2c8E7Fa41e77b54b8FaF45c610e7aD909E3\",\"amount\":\"1.3447407070281856e+22M\",\"symbol\":\"MAI\",\"asset\":{\"symbol\":\"MAI\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\",\"name\":\"Mai Stablecoin\"},\"usdValue\":\"13447.41M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.81\"}]};\n          const chainId = env.parameters.chainId;\n          const availableVaults = availableVaultsList[chainId] || [];\n\n          const htmlGrid = `\n          <div style=\"\n            min-height: 100vh;\n            background-color: #121212;\n            color: white;\n            padding: 24px;\">\n            \n            <div style=\"max-width: 1280px; margin: 0 auto;\">\n              \n              <div style=\"\n                display: grid;\n                grid-template-columns: 2fr 1fr 1fr 1fr 1fr;\n                align-items: center;\n                padding: 16px;\n                color: #9CA3AF;\">\n                <div>Vault</div>\n                <div style=\"display: flex; align-items: center; gap: 4px;\">Asset</div>\n                <div>Curator</div>\n                <div>Collateral</div>\n                <div style=\"text-align: right;\">APY</div>\n              </div>\n        \n              ${availableVaults\n                .map(\n                  (vault) => `\n                  <div\n                    class=\"rendered-enum-row\" \n                    key=\"${vault.address}\"\n                    id=\"${vault.address}\"\n                    target-param=\"vault\"\n                    data-vault=\"${vault.address}\"\n                    data-asset-address=\"${vault.asset.address}\"\n                    data-asset-symbol=\"${vault.asset.symbol}\"\n                    style=\"\n                      display: grid;\n                      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;\n                      align-items: center;\n                      padding: 16px;\n                      border-radius: 8px;\n                      transition: background-color 0.2s;\n                      cursor: pointer;\n                      background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\"\n                  >\n                    <div style=\"display: flex; align-items: center; gap: 12px;\">\n                      <div style=\"width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                        <img src=\"${vault.icon}\" alt=\"${vault.name} icon\" width=\"32\" height=\"32\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                      </div>\n                      <span style=\"color: #F3F4F6; font-weight: 500;\">${vault.name}</span>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 8px;\">\n                      <div>\n                        <div style=\"color: #F3F4F6; font-weight: 500;\">${vault.asset.symbol}</div>\n                      </div>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 12px;\">\n                      <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                        <img src=\"${vault.protocol.icon}\" alt=\"${vault.protocol.name} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                      </div>\n                      <span style=\"color: #F3F4F6; font-weight: 500;\">${vault.protocol.name}</span>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center;\">\n                      ${vault.collateralIcons\n                        .slice(0, 3)\n                        .map(\n                          (icon, i) => `\n                          <div style=\"\n                            width: 24px;\n                            height: 24px;\n                            border-radius: 50%;\n                            overflow: hidden;\n                            background-color: #2D2D2D;\n                            margin-left: ${i === 0 ? \"0\" : \"-4px\"};\n                            position: relative;\n                            z-index: ${vault.collateralIcons.length - i};\">\n                            <img src=\"${icon}\" alt=\"Collateral icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                          </div>`\n                        )\n                        .join(\"\")}\n                      ${vault.collateralIcons.length > 3\n                        ? `<div style=\"\n                            width: 24px;\n                            height: 24px;\n                            border-radius: 50%;\n                            background-color: #444;\n                            display: flex;\n                            align-items: center;\n                            justify-content: center;\n                            font-size: 12px;\n                            font-weight: bold;\n                            color: white;\n                            margin-left: -4px;\">\n                            +${vault.collateralIcons.length - 3}\n                          </div>`\n                        : \"\"}\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                      <span>${vault.apy}%</span>\n                    </div>\n                  </div>`\n                )\n                .join(\"\")}\n            </div>\n          </div>`;\n\n          return htmlGrid;\n      }\n  "
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "The receiver address",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token to deposit",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Deposit 100 USDC",
            "description": "Lend 100 USDC on Morpho on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "vault",
                "value": "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183"
              }
            ]
          }
        ],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{before.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Deposit {{tokenSymbol({{parameters.chainId}}, {{before.asset}})}} on MORPHO"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{before.asset}})}}"
          ]
        },
        "blockId": 100031,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      },
      "WITHDRAW": {
        "name": "Withdraw asset",
        "description": "Withdraw token deposited in any lending pool",
        "type": 1,
        "method": "function withdraw(uint256 amount, address receiver, address owner)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "vault",
            "type": "string",
            "description": "Vault's address",
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n\n          const availableVaultsList = {\"1\":[{\"icon\":\"https://cdn.morpho.org/v2/assets/images/m0-vault-mev.png\",\"name\":\"MEV Capital M^0 Vault\",\"address\":\"0xfbDEE8670b273E12b019210426E70091464b02Ab\",\"amount\":\"4886716.00M\",\"symbol\":\"wM\",\"asset\":{\"symbol\":\"wM\",\"address\":\"0x437cc33344a0B27A429f795ff6B469C72698B291\",\"name\":\"WrappedM by M^0\"},\"usdValue\":\"4.91M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Gauntlet cbBTC Core\",\"address\":\"0xF587f2e8AfF7D76618d3B6B4626621860FbD54e3\",\"amount\":\"2823204692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"2486909.27M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet MKR Blended\",\"address\":\"0xEbFA750279dEfa89b8D99bdd145a016F6292757b\",\"amount\":\"1111399302.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"1115.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.05\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"name\":\"Re7 wstETH\",\"address\":\"0xE87ed29896B91421ff43f69257ABF78300e40c7a\",\"amount\":\"99899948717228688.00M\",\"symbol\":\"wstETH\",\"asset\":{\"symbol\":\"wstETH\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\",\"name\":\"Wrapped liquid staked Ether 2.0\"},\"usdValue\":\"295.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\"],\"apy\":\"1.09\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"name\":\"Re7 WBTC\",\"address\":\"0xE0C98605f279e4D7946d25B75869c69802823763\",\"amount\":\"3731976044.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3286129.45M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pumpbtc.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.61\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Prime\",\"address\":\"0xdd0f28e19C1780eb6396170735D45153D261490d\",\"amount\":\"27325357416392.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"27410565.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"5.79\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet LBTC Core\",\"address\":\"0xdC94785959B73F7A168452b3654E44fEc6A750e4\",\"amount\":\"4546123877.00M\",\"symbol\":\"LBTC\",\"asset\":{\"symbol\":\"LBTC\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\",\"name\":\"Lombard Staked Bitcoin\"},\"usdValue\":\"4004597.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\"],\"apy\":\"4.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet-solvbtc-babylon.svg\",\"name\":\"SolvBTC Babylon Vault\",\"address\":\"0xdBB316375B4dC992B2c8827D120c09dFB1d3455D\",\"amount\":\"10000030000000000000.00M\",\"symbol\":\"SolvBTC.BBN\",\"asset\":{\"symbol\":\"SolvBTC.BBN\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\",\"name\":\"SolvBTC Babylon\"},\"usdValue\":\"880605.94M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/usual.svg\",\"name\":\" Usual Boosted USDC\",\"address\":\"0xd63070114470f685b75B74D60EEc7c1113d33a3D\",\"amount\":\"23474623919224.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"23522528.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd0usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/lvlusd.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/sdeusd.svg\"],\"apy\":\"45.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-usdc.svg\",\"name\":\"9Summits USDC Core\",\"address\":\"0xD5Ac156319f2491d4ad1Ec4aA5ed0ED48C0fa173\",\"amount\":\"1193190215700.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"1197857.86M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"5.50\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/resolv-vault.png\",\"name\":\"MEV Capital Resolv USR\",\"address\":\"0xD50DA5F859811A91fD1876C9461fD39c23C747Ad\",\"amount\":\"3.943973448431187e+23M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\",\"name\":\"Resolv USD\"},\"usdValue\":\"394397.34M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\"],\"apy\":\"7.77\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Frontier\",\"address\":\"0xc582F04d8a82795aa2Ff9c8bb4c1c889fe7b754e\",\"amount\":\"225164741838.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"225299.02M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/uscc.svg\"],\"apy\":\"33.33\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/fence_vault.jpg\",\"name\":\"EUR Real Yield\",\"address\":\"0xC21DB71648B18C5B9E038d88393C9b254cf8eaC8\",\"amount\":\"1.1634998094176076e+21M\",\"symbol\":\"EURe\",\"asset\":{\"symbol\":\"EURe\",\"address\":\"0x3231Cb76718CDeF2155FC47b5286d82e6eDA273f\",\"name\":\"Monerium EUR emoney\"},\"usdValue\":\"1222.14M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/fence.svg\",\"name\":\"Fence\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/steur.svg\",\"https://cdn.morpho.org/assets/logos/wbc3m.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital USD0\",\"address\":\"0xC0A14627D6a23f70c809777CEd873238581C1032\",\"amount\":\"51090439990918324224.00M\",\"symbol\":\"USD0\",\"asset\":{\"symbol\":\"USD0\",\"address\":\"0x73A15FeD60Bf67631dC6cd7Bc5B6e8da8190aCF5\",\"name\":\"Usual USD\"},\"usdValue\":\"50.98M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet eUSD Core\",\"address\":\"0xc080f56504e0278828A403269DB945F6c6D6E014\",\"amount\":\"3.825932225636031e+24M\",\"symbol\":\"eUSD\",\"asset\":{\"symbol\":\"eUSD\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\",\"name\":\"Electronic Dollar\"},\"usdValue\":\"3823191.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"18.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/smokehouse_dai.svg\",\"name\":\"Smokehouse DAI\",\"address\":\"0xbeeFfF68CC520D68f82641EFF84330C631E2490E\",\"amount\":\"2.5823386125784788e+23M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"258208.22M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\"],\"apy\":\"20.44\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/smokehouse_usdc.svg\",\"name\":\"Smokehouse USDC\",\"address\":\"0xBEeFFF209270748ddd194831b3fa287a5386f5bC\",\"amount\":\"20014271231044.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"20051053.28M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/uscc.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/csusdl.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/uni.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"14.94\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdl-vault.svg\",\"name\":\"Coinshift USDL\",\"address\":\"0xbEEFC01767ed5086f35deCb6C00e6C12bc7476C1\",\"amount\":\"7.504110009219575e+21M\",\"symbol\":\"wUSDL\",\"asset\":{\"symbol\":\"wUSDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\",\"name\":\"Wrapped USDL\"},\"usdValue\":\"7622.46M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"4.06\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdl-vault.svg\",\"name\":\"Coinshift USDL\",\"address\":\"0xbEeFc011e94f43b8B7b455eBaB290C7Ab4E216f1\",\"amount\":\"1.1624532661245971e+25M\",\"symbol\":\"wUSDL\",\"asset\":{\"symbol\":\"wUSDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\",\"name\":\"Wrapped USDL\"},\"usdValue\":\"11807869.42M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"2.31\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PAXG\",\"address\":\"0xBeEf796ae50ba5423857CAc27DD36369cfc8241b\",\"amount\":\"1500000000000000.00M\",\"symbol\":\"PAXG\",\"asset\":{\"symbol\":\"PAXG\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\",\"name\":\"PAX Gold\"},\"usdValue\":\"4.43M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PAXG\",\"address\":\"0xBeeF7959aE71D4e45e1863dae0B94C35244AF816\",\"amount\":\"216296713623299522560.00M\",\"symbol\":\"PAXG\",\"asset\":{\"symbol\":\"PAXG\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\",\"name\":\"PAX Gold\"},\"usdValue\":\"638500.40M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse RUSD\",\"address\":\"0xBeEf11eCb698f4B5378685C05A210bdF71093521\",\"amount\":\"3.1515592246634458e+25M\",\"symbol\":\"rUSD\",\"asset\":{\"symbol\":\"rUSD\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\",\"name\":\"Reservoir Stablecoin\"},\"usdValue\":\"31515592.25M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"8.29\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse WBTC\",\"address\":\"0xbeEf094333AEdD535c130958c204E84f681FD9FA\",\"amount\":\"37725552.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"33218.70M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse ETH\",\"address\":\"0xBEEf050ecd6a16c4e7bfFbB52Ebba7846C4b8cD4\",\"amount\":\"5.368022669686909e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"13278609.28M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDT\",\"address\":\"0xbEef047a543E45807105E51A8BBEFCc5950fcfBa\",\"amount\":\"8351623154821.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"8354730.53M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susds.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\"],\"apy\":\"6.96\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse PYUSD\",\"address\":\"0xbEEF02e5E13584ab96848af90261f0C8Ee04722a\",\"amount\":\"1406089475048.00M\",\"symbol\":\"PYUSD\",\"asset\":{\"symbol\":\"PYUSD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\",\"name\":\"PayPal USD\"},\"usdValue\":\"1410468.24M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"https://cdn.morpho.org/assets/logos/usyc.svg\",\"https://cdn.morpho.org/assets/logos/wbib01.svg\"],\"apy\":\"6.46\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC\",\"address\":\"0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB\",\"amount\":\"35090650590603.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"35158602.52M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\"],\"apy\":\"5.79\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 FRAX\",\"address\":\"0xBE40491F3261Fd42724F1AEb465796eb11c06ddF\",\"amount\":\"1.8525675767872602e+22M\",\"symbol\":\"FRAX\",\"asset\":{\"symbol\":\"FRAX\",\"address\":\"0x853d955aCEf822Db058eb8505911ED77F175b99e\",\"name\":\"Frax\"},\"usdValue\":\"18454.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\"],\"apy\":\"3.95\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Relend cbBTC\",\"address\":\"0xB9C9158aB81f90996cAD891fFbAdfBaad733c8C6\",\"amount\":\"931154261.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"820236.72M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\"],\"apy\":\"0.29\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet-midas.svg\",\"name\":\"Midas USDC\",\"address\":\"0xA8875aaeBc4f830524e35d57F9772FfAcbdD6C45\",\"amount\":\"2000000000.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"2007.82M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"https://cdn.morpho.org/assets/logos/mbasis.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-m.svg\",\"name\":\"Steakhouse M\",\"address\":\"0xa5aA40F27DAeDE9748822ef836170f202e196B5A\",\"amount\":\"1000000.00M\",\"symbol\":\"wM\",\"asset\":{\"symbol\":\"wM\",\"address\":\"0x437cc33344a0B27A429f795ff6B469C72698B291\",\"name\":\"WrappedM by M^0\"},\"usdValue\":\"1.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-usdq.svg\",\"name\":\"Steakhouse USDQ\",\"address\":\"0xA1b60d96e5C50dA627095B9381dc5a46AF1a9a42\",\"amount\":\"344281027799.00M\",\"symbol\":\"USDQ\",\"asset\":{\"symbol\":\"USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\",\"name\":\"Quantoz USDQ\"},\"usdValue\":\"344281.03M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bbqusdt.svg\",\"name\":\"Smokehouse USDT\",\"address\":\"0xA0804346780b4c2e3bE118ac957D1DB82F9d7484\",\"amount\":\"977743897000.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"979509.72M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"6.87\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Re7 cbBTC\",\"address\":\"0xA02F5E93f783baF150Aa1F8b341Ae90fe0a772f7\",\"amount\":\"975605944.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"859393.40M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pumpbtc.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"MEV Capital wETH\",\"address\":\"0x9a8bC3B04b7f3D87cfC09ba407dCED575f2d61D8\",\"amount\":\"2.7067390438466414e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"6695525.04M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/apxeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-teth-29may2025.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"5.75\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital cbBTC\",\"address\":\"0x98cF0B67Da0F16E1F8f1a1D23ad8Dc64c0c70E0b\",\"amount\":\"2823204692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"2486909.27M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"1.26\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"name\":\"Re7 USDT\",\"address\":\"0x95EeF579155cd2C5510F312c8fA39208c3Be01a8\",\"amount\":\"523358804598.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"523465.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"6.22\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Core\",\"address\":\"0x8eB67A509616cd6A7c1B3c8C21D48FF57df3d458\",\"amount\":\"33216280207891.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"33303066.74M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-27feb2025.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/link.svg\",\"https://cdn.morpho.org/assets/logos/uni.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/sdeusd.svg\"],\"apy\":\"12.35\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDT Prime\",\"address\":\"0x8CB3649114051cA5119141a34C200D65dc0Faa73\",\"amount\":\"4490293707985.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"4498403.25M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\"],\"apy\":\"6.99\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"name\":\"Re7 USDA\",\"address\":\"0x89D80f5e9BC88d8021b352064ae73F0eAf79EBd8\",\"amount\":\"1.366371325778496e+22M\",\"symbol\":\"USDA\",\"asset\":{\"symbol\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\",\"name\":\"USDA\"},\"usdValue\":\"13661.98M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usd0%2B%2B-31oct2024.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bbqwsteth.svg\",\"name\":\"Smokehouse WSTETH\",\"address\":\"0x833AdaeF212c5cD3f78906B44bBfb18258F238F0\",\"amount\":\"104099016004590059520.00M\",\"symbol\":\"wstETH\",\"asset\":{\"symbol\":\"wstETH\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\",\"name\":\"Wrapped liquid staked Ether 2.0\"},\"usdValue\":\"308831.11M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"1.09\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 WETH\",\"address\":\"0x78Fc2c2eD1A4cDb5402365934aE5648aDAd094d0\",\"amount\":\"5.692717726491903e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"14081791.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/re7wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/apxeth.svg\",\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.02\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msETH Vault\",\"address\":\"0x78B18E07dc43017fcEaabaD0751d6464c0F56b25\",\"amount\":\"75701180803203006464.00M\",\"symbol\":\"msETH\",\"asset\":{\"symbol\":\"msETH\",\"address\":\"0x64351fC9810aDAd17A690E4e1717Df5e7e085160\",\"name\":\"Metronome Synth ETH\"},\"usdValue\":\"187258.23M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rsweth.svg\"],\"apy\":\"2.69\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-eurcv.svg\",\"name\":\"Steakhouse EURCV\",\"address\":\"0x75741A12B36D181f44F389E0c6B1E0210311e3Ff\",\"amount\":\"1000136824993298304.00M\",\"symbol\":\"EURCV\",\"asset\":{\"symbol\":\"EURCV\",\"address\":\"0x5F7827FDeb7c20b443265Fc2F40845B715385Ff2\",\"name\":\"EUR CoinVertible\"},\"usdValue\":\"1.05M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"name\":\"Spark DAI Vault\",\"address\":\"0x73e65DBD630f90604062f6E02fAb9138e713edD9\",\"amount\":\"8.059925519238407e+25M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"80581265.20M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/spark.svg\",\"name\":\"SparkDAO\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-29may2025.svg\"],\"apy\":\"16.31\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/coinshift-usdc-vault.svg\",\"name\":\"Coinshift USDC\",\"address\":\"0x7204B7Dbf9412567835633B6F00C3Edc3a8D6330\",\"amount\":\"3343669443899.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"3356749.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/csusdl.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"5.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/index_coop_hyeth_vault.png\",\"name\":\"Index Coop hyETH\",\"address\":\"0x701907283a57FF77E255C3f1aAD790466B8CE4ef\",\"amount\":\"6.752699569423558e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"16703815.29M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/pt-ageth-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\"],\"apy\":\"4.33\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC RWA\",\"address\":\"0x6D4e530B8431a52FFDA4516BA4Aadc0951897F8C\",\"amount\":\"599924811901.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"600278.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/uscc.svg\"],\"apy\":\"13.09\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msUSD Vault\",\"address\":\"0x6859B34a9379122d25A9FA46f0882d434fee36c3\",\"amount\":\"2.4014580705370727e+23M\",\"symbol\":\"msUSD\",\"asset\":{\"symbol\":\"msUSD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\",\"name\":\"Metronome Synth USD\"},\"usdValue\":\"240145.81M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/susde.svg\"],\"apy\":\"4.24\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"name\":\"LlamaRisk crvUSD Vault\",\"address\":\"0x67315dd969B8Cd3a3520C245837Bf71f54579C75\",\"amount\":\"3.868251435951369e+23M\",\"symbol\":\"crvUSD\",\"asset\":{\"symbol\":\"crvUSD\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\",\"name\":\"Curve.Fi USD Stablecoin\"},\"usdValue\":\"387183.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"name\":\"LlamaRisk\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdtwbtcweth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdcwbtcweth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvcrvusdtbtcwsteth-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxtrylsd-morpho.svg\",\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\"],\"apy\":\"15.29\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Re7 USDC\",\"address\":\"0x60d715515d4411f7F43e4206dc5d4a3677f0eC78\",\"amount\":\"308.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"0.00M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/sand.svg\",\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"12.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/resolv-vault.png\",\"name\":\"Apostro Resolv USR\",\"address\":\"0x5085Dd6FAd07c12e38fae01bc2a4938d2C08B1Bc\",\"amount\":\"9.850714815327631e+23M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\",\"name\":\"Resolv USD\"},\"usdValue\":\"985071.48M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\"],\"apy\":\"4.04\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet DAI Core\",\"address\":\"0x500331c9fF24D9d11aee6B07734Aa72343EA74a5\",\"amount\":\"1.3822723756222332e+25M\",\"symbol\":\"DAI\",\"asset\":{\"symbol\":\"DAI\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\",\"name\":\"Dai Stablecoin\"},\"usdValue\":\"13821351.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"https://cdn.morpho.org/assets/logos/susde.svg\",\"https://cdn.morpho.org/assets/logos/usde.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/pt-usde-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-susde-29may2025.svg\"],\"apy\":\"10.80\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/sbmorphousdc.svg\",\"name\":\"SwissBorg Morpho USDC\",\"address\":\"0x4Ff4186188f8406917293A9e01A1ca16d3cf9E59\",\"amount\":\"9691069591894.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"9728144.89M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"5.28\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"f(x) Protocol Morpho USDC\",\"address\":\"0x4F460bb11cf958606C69A963B4A17f9DaEEea8b6\",\"amount\":\"109831265981.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"110260.92M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/arusd.svg\"],\"apy\":\"6.12\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/rwa_leadblock.png\",\"name\":\"LeadBlock USDC RWA\",\"address\":\"0x4cA0E178c94f039d7F202E09d8d1a655Ed3fb6b6\",\"amount\":\"572851727106.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"575092.67M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/leadblock.png\",\"name\":\"LeadBlock\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/usd0usd0%2B%2B.svg\",\"https://cdn.morpho.org/assets/logos/mkr.svg\",\"https://cdn.morpho.org/assets/logos/mtbill.svg\"],\"apy\":\"1.64\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet LRT Core\",\"address\":\"0x4881Ef0BF6d2365D3dd6499ccd7532bcdBCE0658\",\"amount\":\"3.994710315872713e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"9881515.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/pufeth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"https://cdn.morpho.org/assets/logos/eth%2B.svg\",\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"https://cdn.morpho.org/assets/logos/berastone.svg\"],\"apy\":\"8.13\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/xaum.svg\",\"name\":\"Relend Gold\",\"address\":\"0x45c1875F1C48622b3D9740Af2D7dc62Bc9a72422\",\"amount\":\"600000000099999940608.00M\",\"symbol\":\"XAUM\",\"asset\":{\"symbol\":\"XAUM\",\"address\":\"0x2103E845C5E135493Bb6c2A4f0B8651956eA8682\",\"name\":\"Matrixdock Gold\"},\"usdValue\":\"1746934.50M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/crvusd.svg\"],\"apy\":\"0.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet WBTC Core\",\"address\":\"0x443df5eEE3196e9b2Dd77CaBd3eA76C3dee8f9b2\",\"amount\":\"4328382210.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3811296.10M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/swbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\"],\"apy\":\"0.62\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Flagship ETH\",\"address\":\"0x38989BBA00BDF8181F4082995b3DEAe96163aC5D\",\"amount\":\"531794377078535684096.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"1315473.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"2.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steak-r.svg\",\"name\":\"Steakhouse USDR\",\"address\":\"0x30881Baa943777f92DC934d53D3bFdF33382cab3\",\"amount\":\"344168357316.00M\",\"symbol\":\"USDR\",\"asset\":{\"symbol\":\"USDR\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\",\"name\":\"StablR USD\"},\"usdValue\":\"344168.36M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/xaut.svg\"],\"apy\":\"0.00\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/pendle-wbtc-vault.svg\",\"name\":\"Pendle WBTC\",\"address\":\"0x2f1aBb81ed86Be95bcf8178bA62C8e72D6834775\",\"amount\":\"4001640934.00M\",\"symbol\":\"WBTC\",\"asset\":{\"symbol\":\"WBTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\",\"name\":\"Wrapped BTC\"},\"usdValue\":\"3523587.56M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/mevcapital.png\",\"name\":\"MEV Capital\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/pt-corn-ebtc-27mar2025.svg\"],\"apy\":\"0.63\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"name\":\"Flagship USDT\",\"address\":\"0x2C25f6C25770fFEC5959D34B94Bf898865e5D6b1\",\"amount\":\"197586290993.00M\",\"symbol\":\"USDT\",\"asset\":{\"symbol\":\"USDT\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\",\"name\":\"Tether USD\"},\"usdValue\":\"197943.14M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"https://cdn.morpho.org/assets/logos/susds.svg\"],\"apy\":\"4.95\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alpha USDC Vault\",\"address\":\"0xD50B9Bbf136D1BD5CD5AC6ed9b3F26c458a6d4A6\",\"amount\":\"5467848.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\",\"name\":\"USDCoin\"},\"usdValue\":\"5.45M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alphaping\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/deusd.svg\"],\"apy\":\"9.51\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alpha WETH Vault\",\"address\":\"0x47fe8Ab9eE47DD65c24df52324181790b9F47EfC\",\"amount\":\"2105831930136005.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"4.44M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/alphaping.png\",\"name\":\"Alphaping\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"https://cdn.morpho.org/assets/logos/stone.svg\",\"https://cdn.morpho.org/assets/logos/heth.svg\"],\"apy\":\"11.38\"}],\"8453\":[{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-eth.svg\",\"name\":\"9Summits WETH Core\",\"address\":\"0xF540D790413FCFAedAC93518Ae99EdDacE82cb78\",\"amount\":\"293173410772970995712.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"728381.70M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\"],\"apy\":\"1.49\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"name\":\"Moonwell Flagship EURC\",\"address\":\"0xf24608E0CCb972b0b0f4A6446a0BBf58c701a026\",\"amount\":\"4611146279221.00M\",\"symbol\":\"EURC\",\"asset\":{\"symbol\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\"name\":\"EURC\"},\"usdValue\":\"4861503.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.49\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Prime\",\"address\":\"0xeE8F4eC5672F09119b96Ab6fB59C27E1b7e44b61\",\"amount\":\"6177504038069.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"6177512.07M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.03\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Degen USDC\",\"address\":\"0xdB90A4e973B7663ce0Ccc32B6FbD37ffb19BfA83\",\"amount\":\"27791210.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"27.79M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/degen.svg\"],\"apy\":\"5.01\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro Resolv USDC\",\"address\":\"0xcdDCDd18A16ED441F6CB10c3909e5e7ec2B9e8f3\",\"amount\":\"36723010932.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"36723.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\"],\"apy\":\"14.28\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem USDC\",\"address\":\"0xCd347c1e7d600a9A3e403497562eDd0A7Bc3Ef21\",\"amount\":\"73836791181.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"73836.89M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\"],\"apy\":\"6.97\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro Resolv USR\",\"address\":\"0xC484D83F667b779cc9907248101214235642258B\",\"amount\":\"2.731061761406047e+21M\",\"symbol\":\"USR\",\"asset\":{\"symbol\":\"USR\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\",\"name\":\"Resolv USD\"},\"usdValue\":\"2731.06M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/apostro.svg\",\"name\":\"Apostro\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"7.42\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Moonwell Flagship USDC\",\"address\":\"0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca\",\"amount\":\"21466989405948.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21467017.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.26\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet USDC Core\",\"address\":\"0xc0c5689e6f4D256E861F65465b691aeEcC0dEb12\",\"amount\":\"4854633998349.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"4854640.31M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/aero.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/usdz.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"7.51\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Steakhouse USDC RWA\",\"address\":\"0xbEefc4aDBE58173FCa2C042097Fe33095E68C3D6\",\"amount\":\"142005044191.00M\",\"symbol\":\"verUSDC\",\"asset\":{\"symbol\":\"verUSDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\",\"name\":\"Verified USDC\"},\"usdValue\":\"142005.23M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/usyc.svg\",\"https://cdn.morpho.org/assets/logos/jtrsy.svg\",\"https://cdn.morpho.org/assets/logos/mtbill.svg\"],\"apy\":\"11.01\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse EURA\",\"address\":\"0xBEeFA28D5e56d41D35df760AB53B94D9FfD7051F\",\"amount\":\"3.203903777071764e+23M\",\"symbol\":\"EURA\",\"asset\":{\"symbol\":\"EURA\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\",\"name\":\"EURA (previously agEUR)\"},\"usdValue\":\"337117.96M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"1.48\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDA\",\"address\":\"0xbEEfa1aBfEbE621DF50ceaEF9f54FdB73648c92C\",\"amount\":\"4.487377764932623e+23M\",\"symbol\":\"USDA\",\"asset\":{\"symbol\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\",\"name\":\"USDA\"},\"usdValue\":\"448737.78M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/steur.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\"],\"apy\":\"3.27\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse EURC\",\"address\":\"0xBeEF086b8807Dc5E5A1740C5E3a7C4c366eA6ab5\",\"amount\":\"111986267714.00M\",\"symbol\":\"EURC\",\"asset\":{\"symbol\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\",\"name\":\"EURC\"},\"usdValue\":\"117918.87M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"16.18\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse ETH\",\"address\":\"0xbEEf050a7485865A7a8d8Ca0CC5f7536b7a3443e\",\"amount\":\"184659872439385194496.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"458782.64M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.60\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDM\",\"address\":\"0xBEef03f0BF3cb2e348393008a826538AaDD7d183\",\"amount\":\"3.958601843377425e+23M\",\"symbol\":\"wUSDM\",\"asset\":{\"symbol\":\"wUSDM\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\",\"name\":\"Wrapped Mountain Protocol USD\"},\"usdValue\":\"423244.60M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\"],\"apy\":\"2.98\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.png\",\"name\":\"Steakhouse USDC\",\"address\":\"0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183\",\"amount\":\"2310868092500.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"2310871.10M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"7.76\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"name\":\"Morpho eUSD\",\"address\":\"0xbb819D845b573B5D7C538F5b85057160cfb5f313\",\"amount\":\"1.5955728234338277e+24M\",\"symbol\":\"eUSD\",\"asset\":{\"symbol\":\"eUSD\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\"name\":\"Electronic Dollar\"},\"usdValue\":\"1594015.21M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/hyusd.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"13.22\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Universal USDC\",\"address\":\"0xB7890CEE6CF4792cdCC13489D36D9d42726ab863\",\"amount\":\"187793526001.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"187793.77M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/uxrp.svg\",\"https://cdn.morpho.org/assets/logos/usol.svg\",\"https://cdn.morpho.org/assets/logos/usui.svg\",\"https://cdn.morpho.org/assets/logos/uapt.svg\"],\"apy\":\"9.66\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse sUSDS\",\"address\":\"0xB17B070A56043e1a5a1AB7443AfAFDEbcc1168D7\",\"amount\":\"1000000000000000000.00M\",\"symbol\":\"sUSDS\",\"asset\":{\"symbol\":\"sUSDS\",\"address\":\"0x5875eEE11Cf8398102FdAd704C9E96607675467a\",\"name\":\"Savings USDS\"},\"usdValue\":\"1.04M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/steakhouse.svg\",\"name\":\"Steakhouse Financial\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"4.42\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Re7 WETH\",\"address\":\"0xA2Cac0023a4797b4729Db94783405189a4203AFc\",\"amount\":\"2.1828211735125825e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"5418859.62M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\"],\"apy\":\"2.83\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Moonwell Flagship ETH\",\"address\":\"0xa0E430870c4604CcfC7B38Ca7845B1FF653D0ff1\",\"amount\":\"2.546967774229026e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"6327500.82M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"3.53\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem WETH\",\"address\":\"0x9aB2d181E4b87ba57D5eD564D3eF652C4E710707\",\"amount\":\"137209809205159002112.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"339875.85M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\"],\"apy\":\"7.65\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/degen.svg\",\"name\":\"Morpho Degen\",\"address\":\"0x8c3A6B12332a6354805Eb4b72ef619aEdd22BcdD\",\"amount\":\"2.468464079065287e+25M\",\"symbol\":\"DEGEN\",\"asset\":{\"symbol\":\"DEGEN\",\"address\":\"0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed\",\"name\":\"Degen\"},\"usdValue\":\"103576.75M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"0.39\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/eth.svg\",\"name\":\"Pyth ETH\",\"address\":\"0x80D9964fEb4A507dD697b4437Fc5b25b618CE446\",\"amount\":\"185405112846054653952.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"460634.17M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.03\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Spark USDC Vault\",\"address\":\"0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A\",\"amount\":\"21129842017824.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21129869.49M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/spark.svg\",\"name\":\"SparkDAO\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"7.18\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cdxusd.svg\",\"name\":\"Re7 cdxUSD\",\"address\":\"0x74B6EA9BFee07C3756969b0139CFacBBa5845969\",\"amount\":\"1.295027780957741e+22M\",\"symbol\":\"cdxUSD\",\"asset\":{\"symbol\":\"cdxUSD\",\"address\":\"0xC0D3700000987C99b3C9009069E4f8413fD22330\",\"name\":\"Cod3x USD\"},\"usdValue\":\"12933.34M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mbasis.svg\"],\"apy\":\"1.08\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Relend ETH\",\"address\":\"0x70F796946eD919E4Bc6cD506F8dACC45E4539771\",\"amount\":\"1287544653455166976.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"3198.87M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/bprotocol.png\",\"name\":\"B.Protocol\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\"],\"apy\":\"1.49\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"name\":\"Re7 RWA\",\"address\":\"0x6e37C95b43566E538D8C278eb69B00FC717a001b\",\"amount\":\"162488588434.00M\",\"symbol\":\"verUSDC\",\"asset\":{\"symbol\":\"verUSDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\",\"name\":\"Verified USDC\"},\"usdValue\":\"162488.80M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"https://cdn.morpho.org/assets/logos/jtrsy.svg\"],\"apy\":\"10.67\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet WETH Core\",\"address\":\"0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844\",\"amount\":\"4.597041924847126e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"11415909.81M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\"],\"apy\":\"3.36\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet cbBTC Core\",\"address\":\"0x6770216aC60F634483Ec073cBABC4011c94307Cb\",\"amount\":\"8062003767.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"7104072.16M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"0.74\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/seamless-vault.png\",\"name\":\"Seamless USDC Vault\",\"address\":\"0x616a4E1db48e22028f6bbf20444Cd3b8e3273738\",\"amount\":\"21687895306147.00M\",\"symbol\":\"USDC\",\"asset\":{\"symbol\":\"USDC\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\",\"name\":\"USD Coin\"},\"usdValue\":\"21687923.50M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/usr.svg\",\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/ptusr.svg\"],\"apy\":\"9.76\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/seamless-vault.png\",\"name\":\"Seamless cbBTC Vault\",\"address\":\"0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7\",\"amount\":\"11557412692.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"10184154.73M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/weth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"3.63\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/ionic_vault.svg\",\"name\":\"Ionic Ecosystem WETH\",\"address\":\"0x5A32099837D89E3a794a44fb131CBbAD41f87a8C\",\"amount\":\"810038201286899793920.00M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"2007197.76M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\",\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\"],\"apy\":\"3.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits-eth.svg\",\"name\":\"9Summits WETH Core 1.1\",\"address\":\"0x5496b42ad0deCebFab0db944D83260e60D54f667\",\"amount\":\"4.228309188535861e+21M\",\"symbol\":\"WETH\",\"asset\":{\"symbol\":\"WETH\",\"address\":\"0x4200000000000000000000000000000000000006\",\"name\":\"Wrapped Ether\"},\"usdValue\":\"10498096.38M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/9summits.png\",\"name\":\"9Summits\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"https://cdn.morpho.org/assets/logos/weeth.svg\",\"https://cdn.morpho.org/assets/logos/wrseth.svg\",\"https://cdn.morpho.org/assets/logos/reth.svg\",\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.81\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"name\":\"Moonwell Frontier cbBTC\",\"address\":\"0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796\",\"amount\":\"4836920235.00M\",\"symbol\":\"cbBTC\",\"asset\":{\"symbol\":\"cbBTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\",\"name\":\"Coinbase Wrapped BTC\"},\"usdValue\":\"4262194.78M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/block-analitica.png\",\"name\":\"Block Analitica\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"https://cdn.morpho.org/assets/logos/pt-lbtc-29may2025.svg\"],\"apy\":\"2.59\"},{\"icon\":\"https://cdn.morpho.org/v2/assets/images/metronome.svg\",\"name\":\"Metronome msETH Vault\",\"address\":\"0x43Cd00De63485618A5CEEBE0de364cD6cBeB26E7\",\"amount\":\"97508524637609721856.00M\",\"symbol\":\"msETH\",\"asset\":{\"symbol\":\"msETH\",\"address\":\"0x7Ba6F01772924a82D9626c126347A28299E98c98\",\"name\":\"Metronome Synth ETH\"},\"usdValue\":\"242257.39M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/gauntlet.svg\",\"name\":\"Gauntlet\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsuperoethb.svg\"],\"apy\":\"3.95\"},{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"name\":\"Morpho MAI\",\"address\":\"0x30B8A2c8E7Fa41e77b54b8FaF45c610e7aD909E3\",\"amount\":\"1.3447407070281856e+22M\",\"symbol\":\"MAI\",\"asset\":{\"symbol\":\"MAI\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\",\"name\":\"Mai Stablecoin\"},\"usdValue\":\"13447.41M\",\"protocol\":{\"icon\":\"https://cdn.morpho.org/v2/assets/images/re7.png\",\"name\":\"RE7 Labs\"},\"collateralIcons\":[\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"https://cdn.morpho.org/assets/logos/cbeth.svg\"],\"apy\":\"2.81\"}]};\n          const chainId = env.parameters.chainId;\n          const availableVaults = availableVaultsList[chainId] || [];\n\n          const htmlGrid = `\n          <div style=\"\n            min-height: 100vh;\n            background-color: #121212;\n            color: white;\n            padding: 24px;\">\n            \n            <div style=\"max-width: 1280px; margin: 0 auto;\">\n              \n              <div style=\"\n                display: grid;\n                grid-template-columns: 2fr 1fr 1fr 1fr 1fr;\n                align-items: center;\n                padding: 16px;\n                color: #9CA3AF;\">\n                <div>Vault</div>\n                <div style=\"display: flex; align-items: center; gap: 4px;\">Asset</div>\n                <div>Curator</div>\n                <div>Collateral</div>\n                <div style=\"text-align: right;\">APY</div>\n              </div>\n        \n              ${availableVaults\n                .map(\n                  (vault) => `\n                  <div\n                    class=\"rendered-enum-row\" \n                    key=\"${vault.address}\"\n                    id=\"${vault.address}\"\n                    target-param=\"vault\"\n                    data-vault=\"${vault.address}\"\n                    data-asset-address=\"${vault.asset.address}\"\n                    data-asset-symbol=\"${vault.asset.symbol}\"\n                    style=\"\n                      display: grid;\n                      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;\n                      align-items: center;\n                      padding: 16px;\n                      border-radius: 8px;\n                      transition: background-color 0.2s;\n                      cursor: pointer;\n                      background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\"\n                  >\n                    <div style=\"display: flex; align-items: center; gap: 12px;\">\n                      <div style=\"width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                        <img src=\"${vault.icon}\" alt=\"${vault.name} icon\" width=\"32\" height=\"32\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                      </div>\n                      <span style=\"color: #F3F4F6; font-weight: 500;\">${vault.name}</span>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 8px;\">\n                      <div>\n                        <div style=\"color: #F3F4F6; font-weight: 500;\">${vault.asset.symbol}</div>\n                      </div>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 12px;\">\n                      <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                        <img src=\"${vault.protocol.icon}\" alt=\"${vault.protocol.name} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                      </div>\n                      <span style=\"color: #F3F4F6; font-weight: 500;\">${vault.protocol.name}</span>\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center;\">\n                      ${vault.collateralIcons\n                        .slice(0, 3)\n                        .map(\n                          (icon, i) => `\n                          <div style=\"\n                            width: 24px;\n                            height: 24px;\n                            border-radius: 50%;\n                            overflow: hidden;\n                            background-color: #2D2D2D;\n                            margin-left: ${i === 0 ? \"0\" : \"-4px\"};\n                            position: relative;\n                            z-index: ${vault.collateralIcons.length - i};\">\n                            <img src=\"${icon}\" alt=\"Collateral icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                          </div>`\n                        )\n                        .join(\"\")}\n                      ${vault.collateralIcons.length > 3\n                        ? `<div style=\"\n                            width: 24px;\n                            height: 24px;\n                            border-radius: 50%;\n                            background-color: #444;\n                            display: flex;\n                            align-items: center;\n                            justify-content: center;\n                            font-size: 12px;\n                            font-weight: bold;\n                            color: white;\n                            margin-left: -4px;\">\n                            +${vault.collateralIcons.length - 3}\n                          </div>`\n                        : \"\"}\n                    </div>\n        \n                    <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                      <span>${vault.apy}%</span>\n                    </div>\n                  </div>`\n                )\n                .join(\"\")}\n            </div>\n          </div>`;\n\n          return htmlGrid;\n      }\n  "
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token to deposit",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "The receiver address",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.owner",
            "type": "address",
            "description": "The owner address",
            "hideInUI": true,
            "category": 0
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.contractAddress}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "examples": [
          {
            "name": "Withdraw 100 USDC",
            "description": "Withdraw 100 USDC on Morpho on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "vault",
                "value": "0xbeeF010f9cb27031ad51e3333f9aF9C6B1228183"
              }
            ]
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.asset}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{before.asset}})}} on MORPHO"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{before.asset}})}}"
          ]
        },
        "blockId": 100032,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      },
      "BORROW": {
        "name": "Borrow asset",
        "description": "Borrow asset from market",
        "type": 1,
        "method": "function borrow((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount, uint256 shares, address onBehalf, address receiver)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "marketId",
            "type": "string",
            "description": "data",
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n          \n          const availableMarketsList = {\"1\":[{\"uniqueKey\":\"0xfd8493f09eb6203615221378d89f53fcd92ff4f7d62cca87eece9a2fff59e86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"1.42\"},{\"uniqueKey\":\"0xfd3e5c20340aeba93f78f7dc4657dc1e11b553c68c545acc836321a14b47e457\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"symbol\":\"wUSDL\",\"name\":\"Wrapped USDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFb4b...55e1\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xfad6df5845f5e298fd64f574ffc4024e487856663c535a31bb9c366473aa18b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xD64A...09B6\",\"rate\":\"1.10\"},{\"uniqueKey\":\"0xf84288cdcf652627f66cd7a6d4c43c3ee43ca7146d9a9cfab3a136a861144d6f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa300...5815\",\"rate\":\"60.45\"},{\"uniqueKey\":\"0xf78b7d3a62437f78097745a5e3117a50c56a02ec5f072cba8d988a129c6d4fb6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"symbol\":\"beraSTONE\",\"name\":\"Berachain STONE\",\"address\":\"0x97Ad75064b20fb2B2447feD4fa953bF7F007a706\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xaE95...dEE5\",\"rate\":\"6.97\"},{\"uniqueKey\":\"0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xa981...4F80\",\"rate\":\"0.41\"},{\"uniqueKey\":\"0xf6422731a8f84d9ab7e8b6da15ab9ecc243e12a78200dfb7fd1cdf2391e38068\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"symbol\":\"USD3\",\"name\":\"Web 3 Dollar\",\"address\":\"0x0d86883FAf4FfD7aEb116390af37746F45b6f378\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xe35f...9e4C\",\"rate\":\"3.64\"},{\"uniqueKey\":\"0xf4614dc6ce4ee662b23762d4b01d158a4a5b437d38022855fa4787db13183299\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x71a8...5B18\",\"rate\":\"2.34\"},{\"uniqueKey\":\"0xeeabdcb98e9f7ec216d259a2c026bbb701971efae0b44eec79a86053f9b128b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4236...8a4e\",\"rate\":\"54.32\"},{\"uniqueKey\":\"0xeea9a2431eba248f1cc4d8d3d2a34b31cbf4884ecc602f9270372f892a2ba185\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"symbol\":\"PAXG\",\"name\":\"PAX Gold\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xa051...FACE\",\"rate\":\"5.27\"},{\"uniqueKey\":\"0xed9e817ac29464b3cc520bf124fb333c330021a8ae768889f414d21df35686e0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"symbol\":\"PT-ezETH-26DEC2024\",\"name\":\"PT Renzo ezETH 26DEC2024\",\"address\":\"0xf7906F274c174A52d444175729E3fa98f9bde285\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xfE63...B248\",\"rate\":\"4.27\"},{\"uniqueKey\":\"0xea023e57814fb9a814a5a9ee9f3e7ece5b771dd8cc703e50b911e9cde064a12d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"symbol\":\"WOETH\",\"name\":\"Wrapped OETH\",\"address\":\"0xDcEe70654261AF21C44c093C300eD3Bb97b78192\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb794...420e\",\"rate\":\"12533.22\"},{\"uniqueKey\":\"0xe95187ba4e7668ab4434bbb17d1dfd7b87e878242eee3e73dac9fdb79a4d0d99\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"symbol\":\"EIGEN\",\"name\":\"Eigen\",\"address\":\"0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x9cfc...5770\",\"rate\":\"6.03\"},{\"uniqueKey\":\"0xe7e9694b754c4d4f7e21faf7223f6fa71abaeb10296a4c43a54a7977149687d2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x95DB...6992\",\"rate\":\"6.04\"},{\"uniqueKey\":\"0xe4cfbee9af4ad713b41bf79f009ca02b17c001a0c0e7bd2e6a89b1111b3d3f08\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"symbol\":\"tBTC\",\"name\":\"tBTC\",\"address\":\"0x18084fbA666a33d37592fA2633fD49a74DD93a88\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x57bf...CA5b\",\"rate\":\"24.37\"},{\"uniqueKey\":\"0xe475337d11be1db07f7c5a156e511f05d1844308e66e17d2ba5da0839d3b34d9\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"11.04\"},{\"uniqueKey\":\"0xe37784e5ff9c2795395c5a41a0cb7ae1da4a93d67bfdd8654b9ff86b3065941c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"symbol\":\"PT-sUSDE-26DEC2024\",\"name\":\"PT Ethena sUSDE 26DEC2024\",\"address\":\"0xEe9085fC268F6727d5D4293dBABccF901ffDCC29\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x81E5...4595\",\"rate\":\"1.33\"},{\"uniqueKey\":\"0xe1b65304edd8ceaea9b629df4c3c926a37d1216e27900505c04f14b2ed279f33\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"symbol\":\"RLP\",\"name\":\"Resolv Liquidity Provider Token\",\"address\":\"0x4956b52aE2fF65D74CA2d61207523288e4528f96\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1901...626a\",\"rate\":\"11.94\"},{\"uniqueKey\":\"0xdd3989b8bdf3abd2b4f16896b76209893664ea6a82444dd039977f52aa8e07a1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"symbol\":\"PT-SolvBTC.BBN-27MAR2025\",\"name\":\"PT SolvBTC Babylon 27MAR2025 \",\"address\":\"0xd1A1984cc5CAcbd36F6a511877d13662C950fd62\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/solvbtc.bbn.svg\",\"symbol\":\"SolvBTC.BBN\",\"name\":\"SolvBTC Babylon\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE405...38C4\",\"rate\":\"2.33\"},{\"uniqueKey\":\"0xdcfd3558f75a13a3c430ee71df056b5570cbd628da91e33c27eec7c42603247b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x6f2B...E36f\",\"rate\":\"3.05\"},{\"uniqueKey\":\"0xdc5333039bcf15f1237133f74d5806675d83d9cf19cfd4cfdd9be674842651bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE47E...bd99\",\"rate\":\"7.40\"},{\"uniqueKey\":\"0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xe9eE...3d7f\",\"rate\":\"42.03\"},{\"uniqueKey\":\"0xdbd8f3e55e5005a3922e3df4b1ba636ff9998b94588597420281e3641a05bf59\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x830d...509A\",\"rate\":\"12.78\"},{\"uniqueKey\":\"0xdb760246f6859780f6c1b272d47a8f64710777121118e56e0cdb4b8b744a3094\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"4.07\"},{\"uniqueKey\":\"0xd9e34b1eed46d123ac1b69b224de1881dbc88798bc7b70f504920f62f58f28cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xDa85...0760\",\"rate\":\"9.01\"},{\"uniqueKey\":\"0xd95c5285ed6009b272a25a94539bd1ae5af0e9020ad482123e01539ae43844e1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb6F9...3bC8\",\"rate\":\"0.06\"},{\"uniqueKey\":\"0xd925961ad5df1d12f677ff14cf20bac37ea5ef3b325d64d5a9f4c0cc013a1d47\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"symbol\":\"stUSD\",\"name\":\"Staked USDA\",\"address\":\"0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xd884...1CC3\",\"rate\":\"5.65\"},{\"uniqueKey\":\"0xd8909210afccc90a67730342d4a4695d437cd898164c59e2f54dfa40b53db2c0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"symbol\":\"sDAI\",\"name\":\"Savings Dai\",\"address\":\"0x83F20F44975D03b1b09e64809B757c47f942BEeA\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x9d4e...4B65\",\"rate\":\"6.26\"},{\"uniqueKey\":\"0xd6a9afe53c062d793f561fdc6458bf2e24d3fc17f4674d7e95f4dfd0e951e06d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdr.svg\",\"symbol\":\"USDR\",\"name\":\"StablR USD\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"4.06\"},{\"uniqueKey\":\"0xd65e28bab75824acd03cbdc2c1a090d758b936e0aaba7bdaef8228bd1f1ada13\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdq.svg\",\"symbol\":\"USDQ\",\"name\":\"Quantoz USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb5c9...F194\",\"rate\":\"3.82\"},{\"uniqueKey\":\"0xd5211d0e3f4a30d5c98653d988585792bb7812221f04801be73a44ceecb11e89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"symbol\":\"osETH\",\"name\":\"Staked ETH\",\"address\":\"0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x224F...4498\",\"rate\":\"9.45\"},{\"uniqueKey\":\"0xd3d60d19f04614baecb74e134b7bdd775dd7b37950f084ffcf4c05869ed260f1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2767...5C53\",\"rate\":\"0.37\"},{\"uniqueKey\":\"0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"1.67\"},{\"uniqueKey\":\"0xcfe8238ad5567886652ced15ee29a431c161a5904e5a6f380baaa1b4fdc8e302\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1982...5AF1\",\"rate\":\"0.63\"},{\"uniqueKey\":\"0xcfd9f683c6ab4b3c95e450e3faaf582c2b5fe938ef7405c4d60f2e9fd77415cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"symbol\":\"PT-corn-SolvBTC.BBN-26DEC2024\",\"name\":\"PT Corn SolvBTC Babylon 26DEC2024\",\"address\":\"0x23e479ddcda990E8523494895759bD98cD2fDBF6\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x309b...d08B\",\"rate\":\"1.23\"},{\"uniqueKey\":\"0xcec858380cba2d9ca710fce3ce864d74c3f620d53826f69d08508902e09be86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xAf50...A72d\",\"rate\":\"4.91\"},{\"uniqueKey\":\"0xcce802466ea61ec62007fe60d7b4370a10e765f9f223592790b2b7178abb9383\",\"collateral\":{\"icon\":\"\",\"symbol\":\"PT-sdeUSD-1753142406\",\"name\":\"Principal Token: sdeUSD-1753142406\",\"address\":\"0xb4B8925c4CBce692F37C9D946883f2E330a042a9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1ebe...DC27\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xcc63ab57cdcd6dd24cd42db3ebe829fb1b56da89fcd17cea6202cf6b69d02393\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"symbol\":\"PT-wstUSR-27MAR2025\",\"name\":\"PT Wrapped stUSR 27MAR2025\",\"address\":\"0xA8c8861b5ccF8CCe0ade6811CD2A7A7d3222B0B8\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7B45...dd36\",\"rate\":\"29.04\"},{\"uniqueKey\":\"0xcacd4c39af872ddecd48b650557ff5bcc7d3338194c0f5b2038e0d4dec5dc022\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"symbol\":\"rswETH\",\"name\":\"rswETH\",\"address\":\"0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x56e2...bd9b\",\"rate\":\"2.49\"},{\"uniqueKey\":\"0xca35ba8a7dfbb886b1e5ca7f5a600484518788feb038bf59b906e7f1e86fdbb4\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2dC7...1FC9\",\"rate\":\"2.73\"},{\"uniqueKey\":\"0xc9098061d437a9dd53b0070cb33df6fca1a0a5ead288588c88699b0420c1c078\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/msusd.svg\",\"symbol\":\"msUSD\",\"name\":\"Metronome Synth USD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"5.37\"},{\"uniqueKey\":\"0xc84cdb5a63207d8c2e7251f758a435c6bd10b4eaefdaf36d7650159bf035962e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rusd.svg\",\"symbol\":\"rUSD\",\"name\":\"Reservoir Stablecoin\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\"},\"lltv\":\"98.00\",\"oracleAddress\":\"0x3aBB...b43a\",\"rate\":\"10.17\"},{\"uniqueKey\":\"0xc581c5f70bd1afa283eed57d1418c6432cbff1d862f94eaf58fdd4e46afbb67f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"11.92\"},{\"uniqueKey\":\"0xc576cddfd1ee8332d683417548801d6835fa15fb2332a647452248987a8eded3\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbib01.svg\",\"symbol\":\"wbIB01\",\"name\":\"Wrapped Backed IB01 $ Treasury Bond 0-1yr\",\"address\":\"0xcA2A7068e551d5C4482eb34880b194E4b945712F\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xf71C...Cb40\",\"rate\":\"41.14\"},{\"uniqueKey\":\"0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2a01...AD72\",\"rate\":\"3.80\"},{\"uniqueKey\":\"0xc4e18eb6d0e9b0fa90a15bc0a98190cbf3d5ba763af410346f5174b014cefd8d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x873C...fb87\",\"rate\":\"5.93\"},{\"uniqueKey\":\"0xc3250fa72657f5d956a55fd7febf5bf953c18aa04bff2e4088415b1e5c2923b0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"symbol\":\"PT-rsETH-26JUN2025\",\"name\":\"PT Kelp rsETH 26JUN2025\",\"address\":\"0xE08C45F3cfE70f4e03668Dc6E84Af842bEE95A68\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7b27...80a2\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xbfed072faee09b963949defcdb91094465c34c6c62d798b906274ef3563c9cac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xf3FB...3B6d\",\"rate\":\"9.79\"},{\"uniqueKey\":\"0xbf4d7952ceeb29d52678172c348b8ef112d6e32413c547cbf56bbf6addcfa13e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2da4...8Cc8\",\"rate\":\"33.64\"},{\"uniqueKey\":\"0xbf02d6c6852fa0b8247d5514d0c91e6c1fbde9a168ac3fd2033028b5ee5ce6d0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xDCc0...29DB\",\"rate\":\"4.36\"},{\"uniqueKey\":\"0xbed21964cf290ab95fa458da6c1f302f2278aec5f897c1b1da3054553ef5e90c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x9F48...8f5e\",\"rate\":\"2.42\"},{\"uniqueKey\":\"0xbd2a27358bdaf3fb902a0ad17f86d4633f9ac5377941298720b37a4d90deab96\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\",\"symbol\":\"stkcvxcrvUSDETHCRV-morpho\",\"name\":\"Staked TriCRV Convex Deposit Morpho\",\"address\":\"0xAc904BAfBb5FB04Deb2b6198FdCEedE75a78Ce5a\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"symbol\":\"crvUSD\",\"name\":\"Curve.Fi USD Stablecoin\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xad7e...60bb\",\"rate\":\"8.38\"},{\"uniqueKey\":\"0xbd1ad3b968f5f0552dbd8cf1989a62881407c5cccf9e49fb3657c8731caf0c1f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/deusd.svg\",\"symbol\":\"deUSD\",\"name\":\"deUSD\",\"address\":\"0x15700B564Ca08D9439C58cA5053166E8317aa138\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1325...7eF8\",\"rate\":\"11.00\"},{\"uniqueKey\":\"0xba761af4134efb0855adfba638945f454f0a704af11fc93439e20c7c5ebab942\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2A26...6877\",\"rate\":\"11.62\"},{\"uniqueKey\":\"0xb98ad8501bd97ce0684b30b3645e31713e658e98d1955e8b677fb2585eaa9893\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"mTBILL\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x253a...3041\",\"rate\":\"0.04\"},{\"uniqueKey\":\"0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xb7ad412532006bf876534ccae59900ddd9d1d1e394959065cb39b12b22f94ff5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"symbol\":\"agETH\",\"name\":\"Kelp Gain\",\"address\":\"0xe1B4d34E8754600962Cd944B535180Bd758E6c2e\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xcb6a...f89A\",\"rate\":\"6.47\"},{\"uniqueKey\":\"0xb7843fe78e7e7fd3106a1b939645367967d1f986c2e45edb8932ad1896450877\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"6.62\"},{\"uniqueKey\":\"0xb6f4eebd60871f99bf464ae0b67045a26797cf7ef57c458d57e08c205f84feac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1bE2...3D1f\",\"rate\":\"7.49\"},{\"uniqueKey\":\"0xb5b0ff0fccf16dff5bef6d2d001d60f5c4ab49df1020a01073d3ad635c80e8d5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x0C42...4C79\",\"rate\":\"2.38\"}],\"8453\":[{\"uniqueKey\":\"0xff0f2bd52ca786a4f8149f96622885e880222d8bed12bbbf5950296be8d03f89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xa40E...9EFB\",\"rate\":\"18.65\"},{\"uniqueKey\":\"0xf9ed1dba3b6ba1ede10e2115a9554e9c52091c9f1b1af21f9e0fecc855ee74bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc866...b1BE\",\"rate\":\"1.18\"},{\"uniqueKey\":\"0xf7e40290f8ca1d5848b3c129502599aa0f0602eb5f5235218797a34242719561\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"symbol\":\"EURC\",\"name\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa541...54F4\",\"rate\":\"18.34\"},{\"uniqueKey\":\"0xf761e909ee2f87f118e36b7efb42c5915752a6d39263eec0c000c15d0ab7f489\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"symbol\":\"MAI\",\"name\":\"Mai Stablecoin\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"0.26\"},{\"uniqueKey\":\"0xf24417ee06adc0b0836cf0dbec3ba56c1059f62f53a55990a38356d42fa75fa2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x1BAa...C973\",\"rate\":\"13.84\"},{\"uniqueKey\":\"0xefb576606581c5ac9f731d80cb453519d06776fdc1de51d6230d180d74890c3b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eura.svg\",\"symbol\":\"EURA\",\"name\":\"EURA (previously agEUR)\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xA479...a48f\",\"rate\":\"3.00\"},{\"uniqueKey\":\"0xe73d71cacb1a11ce1033966787e21b85573b8b8a3936bbd7d83b2546a1077c26\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x8370...0ed1\",\"rate\":\"2.38\"},{\"uniqueKey\":\"0xe63d3f30d872e49e86cf06b2ffab5aa016f26095e560cb8d6486f9a5f774631e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xe3c4d4d0e214fdc52635d7f9b2f7b3b0081771ae2efeb3cb5aae26009f34f7a7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE10...a7A4\",\"rate\":\"0.40\"},{\"uniqueKey\":\"0xe0a6ea61ee79c0ea05268064525538b8290139b60b972fc83c5d5d26cec7cc89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/uapt.svg\",\"symbol\":\"uAPT\",\"name\":\"Aptos (Universal)\",\"address\":\"0x9c0e042d65a2e1fF31aC83f404E5Cb79F452c337\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x5110...e9E9\",\"rate\":\"-63.35\"},{\"uniqueKey\":\"0xdfd701f0e53c7281432a11743408cc52a6cf27761e7c70829318a0213a61b1b2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFd00...8F29\",\"rate\":\"9.21\"},{\"uniqueKey\":\"0xdf6aa0df4eb647966018f324db97aea09d2a7dde0d3c0a72115e8b20d58ea81f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x237a...ebE2\",\"rate\":\"21.33\"},{\"uniqueKey\":\"0xdf13c46bf7bd41597f27e32ae9c306eb63859c134073cb81c796ff20b520c7cf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x09EC...D91F\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xde1979b67c815863afd1105cae097ecb71b05b0978bc1605d0a58a25231d924f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1F83...FB73\",\"rate\":\"9.33\"},{\"uniqueKey\":\"0xdc69cf2caae7b7d1783fb5a9576dc875888afad17ab3d1a3fc102f741441c165\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x05f7...98f2\",\"rate\":\"1.80\"},{\"uniqueKey\":\"0xdba352d93a64b17c71104cbddc6aef85cd432322a1446b5b65163cbbc615cd0c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4756...9425\",\"rate\":\"14.06\"},{\"uniqueKey\":\"0xdb0bc9f10a174f29a345c5f30a719933f71ccea7a2a75a632a281929bba1b535\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x7E11...b228\",\"rate\":\"15.81\"},{\"uniqueKey\":\"0xdaa04f6819210b11fe4e3b65300c725c32e55755e3598671559b9ae3bac453d7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"62.50\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"9.76\"},{\"uniqueKey\":\"0xd75387f30c983be0aec58b03b51cca52337b496e38cf4effbe995531bf34901c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xD7E2...ceC3\",\"rate\":\"-0.10\"},{\"uniqueKey\":\"0xcf21c3ca9434959fbf882f7d977f90fe22b7a79e6f39cada5702b56b25e58613\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"symbol\":\"PT-USR-24APR2025\",\"name\":\"PT Resolv USD 24APR2025\",\"address\":\"0xec443e7E0e745348E500084892C89218B3ba4683\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1Eea...0d31\",\"rate\":\"21.10\"},{\"uniqueKey\":\"0xce89aeb081d719cd35cb1aafb31239c4dfd9c017b2fec26fc2e9a443461e9aea\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"3.88\"},{\"uniqueKey\":\"0xca2e6f878e273f6587276b44470467f94175e92840ad0d7231e9deb64c190591\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"Midas US Treasury Bill Token\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/verusdc.svg\",\"symbol\":\"verUSDC\",\"name\":\"Verified USDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbd8F...42eA\",\"rate\":\"10.85\"},{\"uniqueKey\":\"0xc9658cac13a9b9b5c1ebaa8ce19c735283cc761ff528d149a7221047bb7fab45\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"5.61\"},{\"uniqueKey\":\"0xc338cc2dc3f6a25bace40a920eea39ff27f184899def6bda478e27e591e5cef2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x451B...eF20\",\"rate\":\"0.25\"},{\"uniqueKey\":\"0xb95dd880d553f5d874534d66eb337a4811608331768c2b208440dfe0e6d901fa\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"symbol\":\"wUSDM\",\"name\":\"Wrapped Mountain Protocol USD\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x06aE...9a5a\",\"rate\":\"0.59\"},{\"uniqueKey\":\"0xb5d424e4af49244b074790f1f2dc9c20df948ce291fc6bcc6b59149ecf91196d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"1.99\"},{\"uniqueKey\":\"0xf8b9786f2f2163e7d618cd8eaf5c0380a1af22424184356dfdd1912f18cb069a\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"0.17\"},{\"uniqueKey\":\"0xc2be602059f1218751ec6f137a8405166419ce408d191fc70f9714eeb301c32b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"0.17\"}]};\n          const chainId = env.parameters.chainId;\n          const availableMarket = availableMarketsList[chainId] || [];\n\n          const htmlMarketGrid = `\n            <div style=\"min-height: 100vh; background-color: #121212; color: white; padding: 24px;\">\n              <div style=\"max-width: 1280px; margin: 0 auto;\">\n                <div style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; color: #9CA3AF;\">\n                  <div>Collateral</div>\n                  <div>Loan</div>\n                  <div>LLTV</div>\n                  <div>Oracle</div>\n                  <div style=\"text-align: right;\">Rate</div>\n                </div>\n                ${availableMarket\n                  .map(\n                    (market) => `\n                    <div\n                      key=\"${market.uniqueKey}\"\n                      id=\"${market.uniqueKey}\"\n                      target-param=\"marketId\"\n                      data-market=\"${market.uniqueKey}\"\n                      data-asset-address=\"${assetType == 'loan' ? market.loan.address : market.collateral.address}\"\n                      data-asset-symbol=\"${assetType == 'loan' ? market.loan.name : market.collateral.name}\"\n                      style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; border-radius: 8px; transition: background-color 0.2s; cursor: pointer; background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\">\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.collateral.icon}\" alt=\"${market.collateral.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.collateral.symbol}</span>\n                      </div>\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.loan.icon}\" alt=\"${market.loan.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.loan.symbol}</span>\n                      </div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.lltv}%</div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.oracleAddress}</div>\n                      <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                        <span>${market.rate}%</span>\n                      </div>\n                    </div>`\n                  )\n                  .join(\"\")}\n              </div>\n            </div>`;\n\n          return htmlMarketGrid;\n      }\n  "
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to borrow",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.onBehalf",
            "type": "address",
            "description": "Wallet",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "The token to deposit",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token to deposit",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "abiParams.shares",
            "type": "uint256",
            "description": "Amount of crypto to borrow",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "abiParams.marketParams",
            "type": "paragraph",
            "description": "marketParams",
            "hideInUI": true,
            "category": 0
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Borrow 0.03 WETH",
            "description": "Borrow 0.03 WETH from market USDC/WETH on Morpho on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 0.03
              },
              {
                "key": "abiParams.marketId",
                "value": "0x3b3769cfca57be2eaed03fcc5299c25691b77781a1e124e7a8d520eb9a7eabb5"
              }
            ]
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{before.marketParams.loanToken}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.marketParams.loanToken}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Borrow {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.loanToken}})}} on MORPHO"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.loanToken}})}}"
          ]
        },
        "blockId": 100033,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      },
      "REPAY": {
        "name": "Repay asset",
        "description": "Repay asset to market",
        "type": 1,
        "method": "function repay((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount, uint256 shares, address onBehalf, bytes data)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "marketId",
            "type": "string",
            "description": "data",
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n          \n          const availableMarketsList = {\"1\":[{\"uniqueKey\":\"0xfd8493f09eb6203615221378d89f53fcd92ff4f7d62cca87eece9a2fff59e86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"1.42\"},{\"uniqueKey\":\"0xfd3e5c20340aeba93f78f7dc4657dc1e11b553c68c545acc836321a14b47e457\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"symbol\":\"wUSDL\",\"name\":\"Wrapped USDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFb4b...55e1\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xfad6df5845f5e298fd64f574ffc4024e487856663c535a31bb9c366473aa18b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xD64A...09B6\",\"rate\":\"1.10\"},{\"uniqueKey\":\"0xf84288cdcf652627f66cd7a6d4c43c3ee43ca7146d9a9cfab3a136a861144d6f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa300...5815\",\"rate\":\"60.45\"},{\"uniqueKey\":\"0xf78b7d3a62437f78097745a5e3117a50c56a02ec5f072cba8d988a129c6d4fb6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"symbol\":\"beraSTONE\",\"name\":\"Berachain STONE\",\"address\":\"0x97Ad75064b20fb2B2447feD4fa953bF7F007a706\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xaE95...dEE5\",\"rate\":\"6.97\"},{\"uniqueKey\":\"0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xa981...4F80\",\"rate\":\"0.41\"},{\"uniqueKey\":\"0xf6422731a8f84d9ab7e8b6da15ab9ecc243e12a78200dfb7fd1cdf2391e38068\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"symbol\":\"USD3\",\"name\":\"Web 3 Dollar\",\"address\":\"0x0d86883FAf4FfD7aEb116390af37746F45b6f378\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xe35f...9e4C\",\"rate\":\"3.64\"},{\"uniqueKey\":\"0xf4614dc6ce4ee662b23762d4b01d158a4a5b437d38022855fa4787db13183299\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x71a8...5B18\",\"rate\":\"2.34\"},{\"uniqueKey\":\"0xeeabdcb98e9f7ec216d259a2c026bbb701971efae0b44eec79a86053f9b128b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4236...8a4e\",\"rate\":\"54.32\"},{\"uniqueKey\":\"0xeea9a2431eba248f1cc4d8d3d2a34b31cbf4884ecc602f9270372f892a2ba185\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"symbol\":\"PAXG\",\"name\":\"PAX Gold\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xa051...FACE\",\"rate\":\"5.27\"},{\"uniqueKey\":\"0xed9e817ac29464b3cc520bf124fb333c330021a8ae768889f414d21df35686e0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"symbol\":\"PT-ezETH-26DEC2024\",\"name\":\"PT Renzo ezETH 26DEC2024\",\"address\":\"0xf7906F274c174A52d444175729E3fa98f9bde285\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xfE63...B248\",\"rate\":\"4.27\"},{\"uniqueKey\":\"0xea023e57814fb9a814a5a9ee9f3e7ece5b771dd8cc703e50b911e9cde064a12d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"symbol\":\"WOETH\",\"name\":\"Wrapped OETH\",\"address\":\"0xDcEe70654261AF21C44c093C300eD3Bb97b78192\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb794...420e\",\"rate\":\"12533.22\"},{\"uniqueKey\":\"0xe95187ba4e7668ab4434bbb17d1dfd7b87e878242eee3e73dac9fdb79a4d0d99\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"symbol\":\"EIGEN\",\"name\":\"Eigen\",\"address\":\"0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x9cfc...5770\",\"rate\":\"6.03\"},{\"uniqueKey\":\"0xe7e9694b754c4d4f7e21faf7223f6fa71abaeb10296a4c43a54a7977149687d2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x95DB...6992\",\"rate\":\"6.04\"},{\"uniqueKey\":\"0xe4cfbee9af4ad713b41bf79f009ca02b17c001a0c0e7bd2e6a89b1111b3d3f08\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"symbol\":\"tBTC\",\"name\":\"tBTC\",\"address\":\"0x18084fbA666a33d37592fA2633fD49a74DD93a88\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x57bf...CA5b\",\"rate\":\"24.37\"},{\"uniqueKey\":\"0xe475337d11be1db07f7c5a156e511f05d1844308e66e17d2ba5da0839d3b34d9\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"11.04\"},{\"uniqueKey\":\"0xe37784e5ff9c2795395c5a41a0cb7ae1da4a93d67bfdd8654b9ff86b3065941c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"symbol\":\"PT-sUSDE-26DEC2024\",\"name\":\"PT Ethena sUSDE 26DEC2024\",\"address\":\"0xEe9085fC268F6727d5D4293dBABccF901ffDCC29\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x81E5...4595\",\"rate\":\"1.33\"},{\"uniqueKey\":\"0xe1b65304edd8ceaea9b629df4c3c926a37d1216e27900505c04f14b2ed279f33\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"symbol\":\"RLP\",\"name\":\"Resolv Liquidity Provider Token\",\"address\":\"0x4956b52aE2fF65D74CA2d61207523288e4528f96\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1901...626a\",\"rate\":\"11.94\"},{\"uniqueKey\":\"0xdd3989b8bdf3abd2b4f16896b76209893664ea6a82444dd039977f52aa8e07a1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"symbol\":\"PT-SolvBTC.BBN-27MAR2025\",\"name\":\"PT SolvBTC Babylon 27MAR2025 \",\"address\":\"0xd1A1984cc5CAcbd36F6a511877d13662C950fd62\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/solvbtc.bbn.svg\",\"symbol\":\"SolvBTC.BBN\",\"name\":\"SolvBTC Babylon\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE405...38C4\",\"rate\":\"2.33\"},{\"uniqueKey\":\"0xdcfd3558f75a13a3c430ee71df056b5570cbd628da91e33c27eec7c42603247b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x6f2B...E36f\",\"rate\":\"3.05\"},{\"uniqueKey\":\"0xdc5333039bcf15f1237133f74d5806675d83d9cf19cfd4cfdd9be674842651bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE47E...bd99\",\"rate\":\"7.40\"},{\"uniqueKey\":\"0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xe9eE...3d7f\",\"rate\":\"42.03\"},{\"uniqueKey\":\"0xdbd8f3e55e5005a3922e3df4b1ba636ff9998b94588597420281e3641a05bf59\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x830d...509A\",\"rate\":\"12.78\"},{\"uniqueKey\":\"0xdb760246f6859780f6c1b272d47a8f64710777121118e56e0cdb4b8b744a3094\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"4.07\"},{\"uniqueKey\":\"0xd9e34b1eed46d123ac1b69b224de1881dbc88798bc7b70f504920f62f58f28cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xDa85...0760\",\"rate\":\"9.01\"},{\"uniqueKey\":\"0xd95c5285ed6009b272a25a94539bd1ae5af0e9020ad482123e01539ae43844e1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb6F9...3bC8\",\"rate\":\"0.06\"},{\"uniqueKey\":\"0xd925961ad5df1d12f677ff14cf20bac37ea5ef3b325d64d5a9f4c0cc013a1d47\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"symbol\":\"stUSD\",\"name\":\"Staked USDA\",\"address\":\"0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xd884...1CC3\",\"rate\":\"5.65\"},{\"uniqueKey\":\"0xd8909210afccc90a67730342d4a4695d437cd898164c59e2f54dfa40b53db2c0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"symbol\":\"sDAI\",\"name\":\"Savings Dai\",\"address\":\"0x83F20F44975D03b1b09e64809B757c47f942BEeA\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x9d4e...4B65\",\"rate\":\"6.26\"},{\"uniqueKey\":\"0xd6a9afe53c062d793f561fdc6458bf2e24d3fc17f4674d7e95f4dfd0e951e06d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdr.svg\",\"symbol\":\"USDR\",\"name\":\"StablR USD\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"4.06\"},{\"uniqueKey\":\"0xd65e28bab75824acd03cbdc2c1a090d758b936e0aaba7bdaef8228bd1f1ada13\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdq.svg\",\"symbol\":\"USDQ\",\"name\":\"Quantoz USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb5c9...F194\",\"rate\":\"3.82\"},{\"uniqueKey\":\"0xd5211d0e3f4a30d5c98653d988585792bb7812221f04801be73a44ceecb11e89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"symbol\":\"osETH\",\"name\":\"Staked ETH\",\"address\":\"0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x224F...4498\",\"rate\":\"9.45\"},{\"uniqueKey\":\"0xd3d60d19f04614baecb74e134b7bdd775dd7b37950f084ffcf4c05869ed260f1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2767...5C53\",\"rate\":\"0.37\"},{\"uniqueKey\":\"0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"1.67\"},{\"uniqueKey\":\"0xcfe8238ad5567886652ced15ee29a431c161a5904e5a6f380baaa1b4fdc8e302\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1982...5AF1\",\"rate\":\"0.63\"},{\"uniqueKey\":\"0xcfd9f683c6ab4b3c95e450e3faaf582c2b5fe938ef7405c4d60f2e9fd77415cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"symbol\":\"PT-corn-SolvBTC.BBN-26DEC2024\",\"name\":\"PT Corn SolvBTC Babylon 26DEC2024\",\"address\":\"0x23e479ddcda990E8523494895759bD98cD2fDBF6\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x309b...d08B\",\"rate\":\"1.23\"},{\"uniqueKey\":\"0xcec858380cba2d9ca710fce3ce864d74c3f620d53826f69d08508902e09be86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xAf50...A72d\",\"rate\":\"4.91\"},{\"uniqueKey\":\"0xcce802466ea61ec62007fe60d7b4370a10e765f9f223592790b2b7178abb9383\",\"collateral\":{\"icon\":\"\",\"symbol\":\"PT-sdeUSD-1753142406\",\"name\":\"Principal Token: sdeUSD-1753142406\",\"address\":\"0xb4B8925c4CBce692F37C9D946883f2E330a042a9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1ebe...DC27\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xcc63ab57cdcd6dd24cd42db3ebe829fb1b56da89fcd17cea6202cf6b69d02393\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"symbol\":\"PT-wstUSR-27MAR2025\",\"name\":\"PT Wrapped stUSR 27MAR2025\",\"address\":\"0xA8c8861b5ccF8CCe0ade6811CD2A7A7d3222B0B8\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7B45...dd36\",\"rate\":\"29.04\"},{\"uniqueKey\":\"0xcacd4c39af872ddecd48b650557ff5bcc7d3338194c0f5b2038e0d4dec5dc022\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"symbol\":\"rswETH\",\"name\":\"rswETH\",\"address\":\"0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x56e2...bd9b\",\"rate\":\"2.49\"},{\"uniqueKey\":\"0xca35ba8a7dfbb886b1e5ca7f5a600484518788feb038bf59b906e7f1e86fdbb4\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2dC7...1FC9\",\"rate\":\"2.73\"},{\"uniqueKey\":\"0xc9098061d437a9dd53b0070cb33df6fca1a0a5ead288588c88699b0420c1c078\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/msusd.svg\",\"symbol\":\"msUSD\",\"name\":\"Metronome Synth USD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"5.37\"},{\"uniqueKey\":\"0xc84cdb5a63207d8c2e7251f758a435c6bd10b4eaefdaf36d7650159bf035962e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rusd.svg\",\"symbol\":\"rUSD\",\"name\":\"Reservoir Stablecoin\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\"},\"lltv\":\"98.00\",\"oracleAddress\":\"0x3aBB...b43a\",\"rate\":\"10.17\"},{\"uniqueKey\":\"0xc581c5f70bd1afa283eed57d1418c6432cbff1d862f94eaf58fdd4e46afbb67f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"11.92\"},{\"uniqueKey\":\"0xc576cddfd1ee8332d683417548801d6835fa15fb2332a647452248987a8eded3\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbib01.svg\",\"symbol\":\"wbIB01\",\"name\":\"Wrapped Backed IB01 $ Treasury Bond 0-1yr\",\"address\":\"0xcA2A7068e551d5C4482eb34880b194E4b945712F\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xf71C...Cb40\",\"rate\":\"41.14\"},{\"uniqueKey\":\"0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2a01...AD72\",\"rate\":\"3.80\"},{\"uniqueKey\":\"0xc4e18eb6d0e9b0fa90a15bc0a98190cbf3d5ba763af410346f5174b014cefd8d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x873C...fb87\",\"rate\":\"5.93\"},{\"uniqueKey\":\"0xc3250fa72657f5d956a55fd7febf5bf953c18aa04bff2e4088415b1e5c2923b0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"symbol\":\"PT-rsETH-26JUN2025\",\"name\":\"PT Kelp rsETH 26JUN2025\",\"address\":\"0xE08C45F3cfE70f4e03668Dc6E84Af842bEE95A68\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7b27...80a2\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xbfed072faee09b963949defcdb91094465c34c6c62d798b906274ef3563c9cac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xf3FB...3B6d\",\"rate\":\"9.79\"},{\"uniqueKey\":\"0xbf4d7952ceeb29d52678172c348b8ef112d6e32413c547cbf56bbf6addcfa13e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2da4...8Cc8\",\"rate\":\"33.64\"},{\"uniqueKey\":\"0xbf02d6c6852fa0b8247d5514d0c91e6c1fbde9a168ac3fd2033028b5ee5ce6d0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xDCc0...29DB\",\"rate\":\"4.36\"},{\"uniqueKey\":\"0xbed21964cf290ab95fa458da6c1f302f2278aec5f897c1b1da3054553ef5e90c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x9F48...8f5e\",\"rate\":\"2.42\"},{\"uniqueKey\":\"0xbd2a27358bdaf3fb902a0ad17f86d4633f9ac5377941298720b37a4d90deab96\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\",\"symbol\":\"stkcvxcrvUSDETHCRV-morpho\",\"name\":\"Staked TriCRV Convex Deposit Morpho\",\"address\":\"0xAc904BAfBb5FB04Deb2b6198FdCEedE75a78Ce5a\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"symbol\":\"crvUSD\",\"name\":\"Curve.Fi USD Stablecoin\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xad7e...60bb\",\"rate\":\"8.38\"},{\"uniqueKey\":\"0xbd1ad3b968f5f0552dbd8cf1989a62881407c5cccf9e49fb3657c8731caf0c1f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/deusd.svg\",\"symbol\":\"deUSD\",\"name\":\"deUSD\",\"address\":\"0x15700B564Ca08D9439C58cA5053166E8317aa138\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1325...7eF8\",\"rate\":\"11.00\"},{\"uniqueKey\":\"0xba761af4134efb0855adfba638945f454f0a704af11fc93439e20c7c5ebab942\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2A26...6877\",\"rate\":\"11.62\"},{\"uniqueKey\":\"0xb98ad8501bd97ce0684b30b3645e31713e658e98d1955e8b677fb2585eaa9893\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"mTBILL\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x253a...3041\",\"rate\":\"0.04\"},{\"uniqueKey\":\"0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xb7ad412532006bf876534ccae59900ddd9d1d1e394959065cb39b12b22f94ff5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"symbol\":\"agETH\",\"name\":\"Kelp Gain\",\"address\":\"0xe1B4d34E8754600962Cd944B535180Bd758E6c2e\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xcb6a...f89A\",\"rate\":\"6.47\"},{\"uniqueKey\":\"0xb7843fe78e7e7fd3106a1b939645367967d1f986c2e45edb8932ad1896450877\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"6.62\"},{\"uniqueKey\":\"0xb6f4eebd60871f99bf464ae0b67045a26797cf7ef57c458d57e08c205f84feac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1bE2...3D1f\",\"rate\":\"7.49\"},{\"uniqueKey\":\"0xb5b0ff0fccf16dff5bef6d2d001d60f5c4ab49df1020a01073d3ad635c80e8d5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x0C42...4C79\",\"rate\":\"2.38\"}],\"8453\":[{\"uniqueKey\":\"0xff0f2bd52ca786a4f8149f96622885e880222d8bed12bbbf5950296be8d03f89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xa40E...9EFB\",\"rate\":\"18.65\"},{\"uniqueKey\":\"0xf9ed1dba3b6ba1ede10e2115a9554e9c52091c9f1b1af21f9e0fecc855ee74bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc866...b1BE\",\"rate\":\"1.18\"},{\"uniqueKey\":\"0xf7e40290f8ca1d5848b3c129502599aa0f0602eb5f5235218797a34242719561\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"symbol\":\"EURC\",\"name\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa541...54F4\",\"rate\":\"18.34\"},{\"uniqueKey\":\"0xf761e909ee2f87f118e36b7efb42c5915752a6d39263eec0c000c15d0ab7f489\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"symbol\":\"MAI\",\"name\":\"Mai Stablecoin\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"0.26\"},{\"uniqueKey\":\"0xf24417ee06adc0b0836cf0dbec3ba56c1059f62f53a55990a38356d42fa75fa2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x1BAa...C973\",\"rate\":\"13.84\"},{\"uniqueKey\":\"0xefb576606581c5ac9f731d80cb453519d06776fdc1de51d6230d180d74890c3b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eura.svg\",\"symbol\":\"EURA\",\"name\":\"EURA (previously agEUR)\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xA479...a48f\",\"rate\":\"3.00\"},{\"uniqueKey\":\"0xe73d71cacb1a11ce1033966787e21b85573b8b8a3936bbd7d83b2546a1077c26\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x8370...0ed1\",\"rate\":\"2.38\"},{\"uniqueKey\":\"0xe63d3f30d872e49e86cf06b2ffab5aa016f26095e560cb8d6486f9a5f774631e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xe3c4d4d0e214fdc52635d7f9b2f7b3b0081771ae2efeb3cb5aae26009f34f7a7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE10...a7A4\",\"rate\":\"0.40\"},{\"uniqueKey\":\"0xe0a6ea61ee79c0ea05268064525538b8290139b60b972fc83c5d5d26cec7cc89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/uapt.svg\",\"symbol\":\"uAPT\",\"name\":\"Aptos (Universal)\",\"address\":\"0x9c0e042d65a2e1fF31aC83f404E5Cb79F452c337\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x5110...e9E9\",\"rate\":\"-63.35\"},{\"uniqueKey\":\"0xdfd701f0e53c7281432a11743408cc52a6cf27761e7c70829318a0213a61b1b2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFd00...8F29\",\"rate\":\"9.21\"},{\"uniqueKey\":\"0xdf6aa0df4eb647966018f324db97aea09d2a7dde0d3c0a72115e8b20d58ea81f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x237a...ebE2\",\"rate\":\"21.33\"},{\"uniqueKey\":\"0xdf13c46bf7bd41597f27e32ae9c306eb63859c134073cb81c796ff20b520c7cf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x09EC...D91F\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xde1979b67c815863afd1105cae097ecb71b05b0978bc1605d0a58a25231d924f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1F83...FB73\",\"rate\":\"9.33\"},{\"uniqueKey\":\"0xdc69cf2caae7b7d1783fb5a9576dc875888afad17ab3d1a3fc102f741441c165\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x05f7...98f2\",\"rate\":\"1.80\"},{\"uniqueKey\":\"0xdba352d93a64b17c71104cbddc6aef85cd432322a1446b5b65163cbbc615cd0c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4756...9425\",\"rate\":\"14.06\"},{\"uniqueKey\":\"0xdb0bc9f10a174f29a345c5f30a719933f71ccea7a2a75a632a281929bba1b535\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x7E11...b228\",\"rate\":\"15.81\"},{\"uniqueKey\":\"0xdaa04f6819210b11fe4e3b65300c725c32e55755e3598671559b9ae3bac453d7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"62.50\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"9.76\"},{\"uniqueKey\":\"0xd75387f30c983be0aec58b03b51cca52337b496e38cf4effbe995531bf34901c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xD7E2...ceC3\",\"rate\":\"-0.10\"},{\"uniqueKey\":\"0xcf21c3ca9434959fbf882f7d977f90fe22b7a79e6f39cada5702b56b25e58613\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"symbol\":\"PT-USR-24APR2025\",\"name\":\"PT Resolv USD 24APR2025\",\"address\":\"0xec443e7E0e745348E500084892C89218B3ba4683\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1Eea...0d31\",\"rate\":\"21.10\"},{\"uniqueKey\":\"0xce89aeb081d719cd35cb1aafb31239c4dfd9c017b2fec26fc2e9a443461e9aea\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"3.88\"},{\"uniqueKey\":\"0xca2e6f878e273f6587276b44470467f94175e92840ad0d7231e9deb64c190591\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"Midas US Treasury Bill Token\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/verusdc.svg\",\"symbol\":\"verUSDC\",\"name\":\"Verified USDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbd8F...42eA\",\"rate\":\"10.85\"},{\"uniqueKey\":\"0xc9658cac13a9b9b5c1ebaa8ce19c735283cc761ff528d149a7221047bb7fab45\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"5.61\"},{\"uniqueKey\":\"0xc338cc2dc3f6a25bace40a920eea39ff27f184899def6bda478e27e591e5cef2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x451B...eF20\",\"rate\":\"0.25\"},{\"uniqueKey\":\"0xb95dd880d553f5d874534d66eb337a4811608331768c2b208440dfe0e6d901fa\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"symbol\":\"wUSDM\",\"name\":\"Wrapped Mountain Protocol USD\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x06aE...9a5a\",\"rate\":\"0.59\"},{\"uniqueKey\":\"0xb5d424e4af49244b074790f1f2dc9c20df948ce291fc6bcc6b59149ecf91196d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"1.99\"},{\"uniqueKey\":\"0xf8b9786f2f2163e7d618cd8eaf5c0380a1af22424184356dfdd1912f18cb069a\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"0.17\"},{\"uniqueKey\":\"0xc2be602059f1218751ec6f137a8405166419ce408d191fc70f9714eeb301c32b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"0.17\"}]};\n          const chainId = env.parameters.chainId;\n          const availableMarket = availableMarketsList[chainId] || [];\n\n          const htmlMarketGrid = `\n            <div style=\"min-height: 100vh; background-color: #121212; color: white; padding: 24px;\">\n              <div style=\"max-width: 1280px; margin: 0 auto;\">\n                <div style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; color: #9CA3AF;\">\n                  <div>Collateral</div>\n                  <div>Loan</div>\n                  <div>LLTV</div>\n                  <div>Oracle</div>\n                  <div style=\"text-align: right;\">Rate</div>\n                </div>\n                ${availableMarket\n                  .map(\n                    (market) => `\n                    <div\n                      key=\"${market.uniqueKey}\"\n                      id=\"${market.uniqueKey}\"\n                      target-param=\"marketId\"\n                      data-market=\"${market.uniqueKey}\"\n                      data-asset-address=\"${assetType == 'loan' ? market.loan.address : market.collateral.address}\"\n                      data-asset-symbol=\"${assetType == 'loan' ? market.loan.name : market.collateral.name}\"\n                      style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; border-radius: 8px; transition: background-color 0.2s; cursor: pointer; background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\">\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.collateral.icon}\" alt=\"${market.collateral.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.collateral.symbol}</span>\n                      </div>\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.loan.icon}\" alt=\"${market.loan.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.loan.symbol}</span>\n                      </div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.lltv}%</div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.oracleAddress}</div>\n                      <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                        <span>${market.rate}%</span>\n                      </div>\n                    </div>`\n                  )\n                  .join(\"\")}\n              </div>\n            </div>`;\n\n          return htmlMarketGrid;\n      }\n  "
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token to deposit",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.onBehalf",
            "type": "address",
            "description": "The token to deposit",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.data",
            "type": "string",
            "description": "data",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.shares",
            "type": "uint256",
            "description": "Amount of crypto to deposit",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.marketParams",
            "type": "paragraph",
            "description": "marketParams",
            "hideInUI": true,
            "category": 0
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.marketParams.loanToken}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{before.marketParams.loanToken}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "examples": [
          {
            "name": "Repay 0.03 WETH",
            "description": "Repay 0.03 WETH to market USDC/WETH on Morpho on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 0.03
              },
              {
                "key": "abiParams.marketId",
                "value": "0x3b3769cfca57be2eaed03fcc5299c25691b77781a1e124e7a8d520eb9a7eabb5"
              }
            ]
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.marketParams.loanToken}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Deposit {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.loanToken}})}} on MORPHO"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.loanToken}})}}"
          ]
        },
        "blockId": 100034,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      },
      "SUPPLY_COLLATERAL": {
        "name": "Supply collateral",
        "description": "Supply asset to market as collateral",
        "type": 1,
        "method": "function supplyCollateral((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount, address onBehalf, bytes data)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "marketId",
            "type": "string",
            "description": "data",
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n          \n          const availableMarketsList = {\"1\":[{\"uniqueKey\":\"0xfd8493f09eb6203615221378d89f53fcd92ff4f7d62cca87eece9a2fff59e86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"1.42\"},{\"uniqueKey\":\"0xfd3e5c20340aeba93f78f7dc4657dc1e11b553c68c545acc836321a14b47e457\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"symbol\":\"wUSDL\",\"name\":\"Wrapped USDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFb4b...55e1\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xfad6df5845f5e298fd64f574ffc4024e487856663c535a31bb9c366473aa18b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xD64A...09B6\",\"rate\":\"1.10\"},{\"uniqueKey\":\"0xf84288cdcf652627f66cd7a6d4c43c3ee43ca7146d9a9cfab3a136a861144d6f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa300...5815\",\"rate\":\"60.45\"},{\"uniqueKey\":\"0xf78b7d3a62437f78097745a5e3117a50c56a02ec5f072cba8d988a129c6d4fb6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"symbol\":\"beraSTONE\",\"name\":\"Berachain STONE\",\"address\":\"0x97Ad75064b20fb2B2447feD4fa953bF7F007a706\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xaE95...dEE5\",\"rate\":\"6.97\"},{\"uniqueKey\":\"0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xa981...4F80\",\"rate\":\"0.41\"},{\"uniqueKey\":\"0xf6422731a8f84d9ab7e8b6da15ab9ecc243e12a78200dfb7fd1cdf2391e38068\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"symbol\":\"USD3\",\"name\":\"Web 3 Dollar\",\"address\":\"0x0d86883FAf4FfD7aEb116390af37746F45b6f378\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xe35f...9e4C\",\"rate\":\"3.64\"},{\"uniqueKey\":\"0xf4614dc6ce4ee662b23762d4b01d158a4a5b437d38022855fa4787db13183299\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x71a8...5B18\",\"rate\":\"2.34\"},{\"uniqueKey\":\"0xeeabdcb98e9f7ec216d259a2c026bbb701971efae0b44eec79a86053f9b128b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4236...8a4e\",\"rate\":\"54.32\"},{\"uniqueKey\":\"0xeea9a2431eba248f1cc4d8d3d2a34b31cbf4884ecc602f9270372f892a2ba185\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"symbol\":\"PAXG\",\"name\":\"PAX Gold\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xa051...FACE\",\"rate\":\"5.27\"},{\"uniqueKey\":\"0xed9e817ac29464b3cc520bf124fb333c330021a8ae768889f414d21df35686e0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"symbol\":\"PT-ezETH-26DEC2024\",\"name\":\"PT Renzo ezETH 26DEC2024\",\"address\":\"0xf7906F274c174A52d444175729E3fa98f9bde285\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xfE63...B248\",\"rate\":\"4.27\"},{\"uniqueKey\":\"0xea023e57814fb9a814a5a9ee9f3e7ece5b771dd8cc703e50b911e9cde064a12d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"symbol\":\"WOETH\",\"name\":\"Wrapped OETH\",\"address\":\"0xDcEe70654261AF21C44c093C300eD3Bb97b78192\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb794...420e\",\"rate\":\"12533.22\"},{\"uniqueKey\":\"0xe95187ba4e7668ab4434bbb17d1dfd7b87e878242eee3e73dac9fdb79a4d0d99\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"symbol\":\"EIGEN\",\"name\":\"Eigen\",\"address\":\"0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x9cfc...5770\",\"rate\":\"6.03\"},{\"uniqueKey\":\"0xe7e9694b754c4d4f7e21faf7223f6fa71abaeb10296a4c43a54a7977149687d2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x95DB...6992\",\"rate\":\"6.04\"},{\"uniqueKey\":\"0xe4cfbee9af4ad713b41bf79f009ca02b17c001a0c0e7bd2e6a89b1111b3d3f08\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"symbol\":\"tBTC\",\"name\":\"tBTC\",\"address\":\"0x18084fbA666a33d37592fA2633fD49a74DD93a88\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x57bf...CA5b\",\"rate\":\"24.37\"},{\"uniqueKey\":\"0xe475337d11be1db07f7c5a156e511f05d1844308e66e17d2ba5da0839d3b34d9\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"11.04\"},{\"uniqueKey\":\"0xe37784e5ff9c2795395c5a41a0cb7ae1da4a93d67bfdd8654b9ff86b3065941c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"symbol\":\"PT-sUSDE-26DEC2024\",\"name\":\"PT Ethena sUSDE 26DEC2024\",\"address\":\"0xEe9085fC268F6727d5D4293dBABccF901ffDCC29\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x81E5...4595\",\"rate\":\"1.33\"},{\"uniqueKey\":\"0xe1b65304edd8ceaea9b629df4c3c926a37d1216e27900505c04f14b2ed279f33\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"symbol\":\"RLP\",\"name\":\"Resolv Liquidity Provider Token\",\"address\":\"0x4956b52aE2fF65D74CA2d61207523288e4528f96\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1901...626a\",\"rate\":\"11.94\"},{\"uniqueKey\":\"0xdd3989b8bdf3abd2b4f16896b76209893664ea6a82444dd039977f52aa8e07a1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"symbol\":\"PT-SolvBTC.BBN-27MAR2025\",\"name\":\"PT SolvBTC Babylon 27MAR2025 \",\"address\":\"0xd1A1984cc5CAcbd36F6a511877d13662C950fd62\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/solvbtc.bbn.svg\",\"symbol\":\"SolvBTC.BBN\",\"name\":\"SolvBTC Babylon\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE405...38C4\",\"rate\":\"2.33\"},{\"uniqueKey\":\"0xdcfd3558f75a13a3c430ee71df056b5570cbd628da91e33c27eec7c42603247b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x6f2B...E36f\",\"rate\":\"3.05\"},{\"uniqueKey\":\"0xdc5333039bcf15f1237133f74d5806675d83d9cf19cfd4cfdd9be674842651bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE47E...bd99\",\"rate\":\"7.40\"},{\"uniqueKey\":\"0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xe9eE...3d7f\",\"rate\":\"42.03\"},{\"uniqueKey\":\"0xdbd8f3e55e5005a3922e3df4b1ba636ff9998b94588597420281e3641a05bf59\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x830d...509A\",\"rate\":\"12.78\"},{\"uniqueKey\":\"0xdb760246f6859780f6c1b272d47a8f64710777121118e56e0cdb4b8b744a3094\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"4.07\"},{\"uniqueKey\":\"0xd9e34b1eed46d123ac1b69b224de1881dbc88798bc7b70f504920f62f58f28cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xDa85...0760\",\"rate\":\"9.01\"},{\"uniqueKey\":\"0xd95c5285ed6009b272a25a94539bd1ae5af0e9020ad482123e01539ae43844e1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb6F9...3bC8\",\"rate\":\"0.06\"},{\"uniqueKey\":\"0xd925961ad5df1d12f677ff14cf20bac37ea5ef3b325d64d5a9f4c0cc013a1d47\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"symbol\":\"stUSD\",\"name\":\"Staked USDA\",\"address\":\"0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xd884...1CC3\",\"rate\":\"5.65\"},{\"uniqueKey\":\"0xd8909210afccc90a67730342d4a4695d437cd898164c59e2f54dfa40b53db2c0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"symbol\":\"sDAI\",\"name\":\"Savings Dai\",\"address\":\"0x83F20F44975D03b1b09e64809B757c47f942BEeA\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x9d4e...4B65\",\"rate\":\"6.26\"},{\"uniqueKey\":\"0xd6a9afe53c062d793f561fdc6458bf2e24d3fc17f4674d7e95f4dfd0e951e06d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdr.svg\",\"symbol\":\"USDR\",\"name\":\"StablR USD\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"4.06\"},{\"uniqueKey\":\"0xd65e28bab75824acd03cbdc2c1a090d758b936e0aaba7bdaef8228bd1f1ada13\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdq.svg\",\"symbol\":\"USDQ\",\"name\":\"Quantoz USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb5c9...F194\",\"rate\":\"3.82\"},{\"uniqueKey\":\"0xd5211d0e3f4a30d5c98653d988585792bb7812221f04801be73a44ceecb11e89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"symbol\":\"osETH\",\"name\":\"Staked ETH\",\"address\":\"0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x224F...4498\",\"rate\":\"9.45\"},{\"uniqueKey\":\"0xd3d60d19f04614baecb74e134b7bdd775dd7b37950f084ffcf4c05869ed260f1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2767...5C53\",\"rate\":\"0.37\"},{\"uniqueKey\":\"0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"1.67\"},{\"uniqueKey\":\"0xcfe8238ad5567886652ced15ee29a431c161a5904e5a6f380baaa1b4fdc8e302\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1982...5AF1\",\"rate\":\"0.63\"},{\"uniqueKey\":\"0xcfd9f683c6ab4b3c95e450e3faaf582c2b5fe938ef7405c4d60f2e9fd77415cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"symbol\":\"PT-corn-SolvBTC.BBN-26DEC2024\",\"name\":\"PT Corn SolvBTC Babylon 26DEC2024\",\"address\":\"0x23e479ddcda990E8523494895759bD98cD2fDBF6\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x309b...d08B\",\"rate\":\"1.23\"},{\"uniqueKey\":\"0xcec858380cba2d9ca710fce3ce864d74c3f620d53826f69d08508902e09be86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xAf50...A72d\",\"rate\":\"4.91\"},{\"uniqueKey\":\"0xcce802466ea61ec62007fe60d7b4370a10e765f9f223592790b2b7178abb9383\",\"collateral\":{\"icon\":\"\",\"symbol\":\"PT-sdeUSD-1753142406\",\"name\":\"Principal Token: sdeUSD-1753142406\",\"address\":\"0xb4B8925c4CBce692F37C9D946883f2E330a042a9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1ebe...DC27\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xcc63ab57cdcd6dd24cd42db3ebe829fb1b56da89fcd17cea6202cf6b69d02393\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"symbol\":\"PT-wstUSR-27MAR2025\",\"name\":\"PT Wrapped stUSR 27MAR2025\",\"address\":\"0xA8c8861b5ccF8CCe0ade6811CD2A7A7d3222B0B8\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7B45...dd36\",\"rate\":\"29.04\"},{\"uniqueKey\":\"0xcacd4c39af872ddecd48b650557ff5bcc7d3338194c0f5b2038e0d4dec5dc022\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"symbol\":\"rswETH\",\"name\":\"rswETH\",\"address\":\"0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x56e2...bd9b\",\"rate\":\"2.49\"},{\"uniqueKey\":\"0xca35ba8a7dfbb886b1e5ca7f5a600484518788feb038bf59b906e7f1e86fdbb4\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2dC7...1FC9\",\"rate\":\"2.73\"},{\"uniqueKey\":\"0xc9098061d437a9dd53b0070cb33df6fca1a0a5ead288588c88699b0420c1c078\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/msusd.svg\",\"symbol\":\"msUSD\",\"name\":\"Metronome Synth USD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"5.37\"},{\"uniqueKey\":\"0xc84cdb5a63207d8c2e7251f758a435c6bd10b4eaefdaf36d7650159bf035962e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rusd.svg\",\"symbol\":\"rUSD\",\"name\":\"Reservoir Stablecoin\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\"},\"lltv\":\"98.00\",\"oracleAddress\":\"0x3aBB...b43a\",\"rate\":\"10.17\"},{\"uniqueKey\":\"0xc581c5f70bd1afa283eed57d1418c6432cbff1d862f94eaf58fdd4e46afbb67f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"11.92\"},{\"uniqueKey\":\"0xc576cddfd1ee8332d683417548801d6835fa15fb2332a647452248987a8eded3\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbib01.svg\",\"symbol\":\"wbIB01\",\"name\":\"Wrapped Backed IB01 $ Treasury Bond 0-1yr\",\"address\":\"0xcA2A7068e551d5C4482eb34880b194E4b945712F\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xf71C...Cb40\",\"rate\":\"41.14\"},{\"uniqueKey\":\"0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2a01...AD72\",\"rate\":\"3.80\"},{\"uniqueKey\":\"0xc4e18eb6d0e9b0fa90a15bc0a98190cbf3d5ba763af410346f5174b014cefd8d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x873C...fb87\",\"rate\":\"5.93\"},{\"uniqueKey\":\"0xc3250fa72657f5d956a55fd7febf5bf953c18aa04bff2e4088415b1e5c2923b0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"symbol\":\"PT-rsETH-26JUN2025\",\"name\":\"PT Kelp rsETH 26JUN2025\",\"address\":\"0xE08C45F3cfE70f4e03668Dc6E84Af842bEE95A68\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7b27...80a2\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xbfed072faee09b963949defcdb91094465c34c6c62d798b906274ef3563c9cac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xf3FB...3B6d\",\"rate\":\"9.79\"},{\"uniqueKey\":\"0xbf4d7952ceeb29d52678172c348b8ef112d6e32413c547cbf56bbf6addcfa13e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2da4...8Cc8\",\"rate\":\"33.64\"},{\"uniqueKey\":\"0xbf02d6c6852fa0b8247d5514d0c91e6c1fbde9a168ac3fd2033028b5ee5ce6d0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xDCc0...29DB\",\"rate\":\"4.36\"},{\"uniqueKey\":\"0xbed21964cf290ab95fa458da6c1f302f2278aec5f897c1b1da3054553ef5e90c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x9F48...8f5e\",\"rate\":\"2.42\"},{\"uniqueKey\":\"0xbd2a27358bdaf3fb902a0ad17f86d4633f9ac5377941298720b37a4d90deab96\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\",\"symbol\":\"stkcvxcrvUSDETHCRV-morpho\",\"name\":\"Staked TriCRV Convex Deposit Morpho\",\"address\":\"0xAc904BAfBb5FB04Deb2b6198FdCEedE75a78Ce5a\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"symbol\":\"crvUSD\",\"name\":\"Curve.Fi USD Stablecoin\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xad7e...60bb\",\"rate\":\"8.38\"},{\"uniqueKey\":\"0xbd1ad3b968f5f0552dbd8cf1989a62881407c5cccf9e49fb3657c8731caf0c1f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/deusd.svg\",\"symbol\":\"deUSD\",\"name\":\"deUSD\",\"address\":\"0x15700B564Ca08D9439C58cA5053166E8317aa138\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1325...7eF8\",\"rate\":\"11.00\"},{\"uniqueKey\":\"0xba761af4134efb0855adfba638945f454f0a704af11fc93439e20c7c5ebab942\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2A26...6877\",\"rate\":\"11.62\"},{\"uniqueKey\":\"0xb98ad8501bd97ce0684b30b3645e31713e658e98d1955e8b677fb2585eaa9893\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"mTBILL\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x253a...3041\",\"rate\":\"0.04\"},{\"uniqueKey\":\"0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xb7ad412532006bf876534ccae59900ddd9d1d1e394959065cb39b12b22f94ff5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"symbol\":\"agETH\",\"name\":\"Kelp Gain\",\"address\":\"0xe1B4d34E8754600962Cd944B535180Bd758E6c2e\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xcb6a...f89A\",\"rate\":\"6.47\"},{\"uniqueKey\":\"0xb7843fe78e7e7fd3106a1b939645367967d1f986c2e45edb8932ad1896450877\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"6.62\"},{\"uniqueKey\":\"0xb6f4eebd60871f99bf464ae0b67045a26797cf7ef57c458d57e08c205f84feac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1bE2...3D1f\",\"rate\":\"7.49\"},{\"uniqueKey\":\"0xb5b0ff0fccf16dff5bef6d2d001d60f5c4ab49df1020a01073d3ad635c80e8d5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x0C42...4C79\",\"rate\":\"2.38\"}],\"8453\":[{\"uniqueKey\":\"0xff0f2bd52ca786a4f8149f96622885e880222d8bed12bbbf5950296be8d03f89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xa40E...9EFB\",\"rate\":\"18.65\"},{\"uniqueKey\":\"0xf9ed1dba3b6ba1ede10e2115a9554e9c52091c9f1b1af21f9e0fecc855ee74bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc866...b1BE\",\"rate\":\"1.18\"},{\"uniqueKey\":\"0xf7e40290f8ca1d5848b3c129502599aa0f0602eb5f5235218797a34242719561\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"symbol\":\"EURC\",\"name\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa541...54F4\",\"rate\":\"18.34\"},{\"uniqueKey\":\"0xf761e909ee2f87f118e36b7efb42c5915752a6d39263eec0c000c15d0ab7f489\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"symbol\":\"MAI\",\"name\":\"Mai Stablecoin\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"0.26\"},{\"uniqueKey\":\"0xf24417ee06adc0b0836cf0dbec3ba56c1059f62f53a55990a38356d42fa75fa2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x1BAa...C973\",\"rate\":\"13.84\"},{\"uniqueKey\":\"0xefb576606581c5ac9f731d80cb453519d06776fdc1de51d6230d180d74890c3b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eura.svg\",\"symbol\":\"EURA\",\"name\":\"EURA (previously agEUR)\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xA479...a48f\",\"rate\":\"3.00\"},{\"uniqueKey\":\"0xe73d71cacb1a11ce1033966787e21b85573b8b8a3936bbd7d83b2546a1077c26\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x8370...0ed1\",\"rate\":\"2.38\"},{\"uniqueKey\":\"0xe63d3f30d872e49e86cf06b2ffab5aa016f26095e560cb8d6486f9a5f774631e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xe3c4d4d0e214fdc52635d7f9b2f7b3b0081771ae2efeb3cb5aae26009f34f7a7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE10...a7A4\",\"rate\":\"0.40\"},{\"uniqueKey\":\"0xe0a6ea61ee79c0ea05268064525538b8290139b60b972fc83c5d5d26cec7cc89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/uapt.svg\",\"symbol\":\"uAPT\",\"name\":\"Aptos (Universal)\",\"address\":\"0x9c0e042d65a2e1fF31aC83f404E5Cb79F452c337\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x5110...e9E9\",\"rate\":\"-63.35\"},{\"uniqueKey\":\"0xdfd701f0e53c7281432a11743408cc52a6cf27761e7c70829318a0213a61b1b2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFd00...8F29\",\"rate\":\"9.21\"},{\"uniqueKey\":\"0xdf6aa0df4eb647966018f324db97aea09d2a7dde0d3c0a72115e8b20d58ea81f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x237a...ebE2\",\"rate\":\"21.33\"},{\"uniqueKey\":\"0xdf13c46bf7bd41597f27e32ae9c306eb63859c134073cb81c796ff20b520c7cf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x09EC...D91F\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xde1979b67c815863afd1105cae097ecb71b05b0978bc1605d0a58a25231d924f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1F83...FB73\",\"rate\":\"9.33\"},{\"uniqueKey\":\"0xdc69cf2caae7b7d1783fb5a9576dc875888afad17ab3d1a3fc102f741441c165\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x05f7...98f2\",\"rate\":\"1.80\"},{\"uniqueKey\":\"0xdba352d93a64b17c71104cbddc6aef85cd432322a1446b5b65163cbbc615cd0c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4756...9425\",\"rate\":\"14.06\"},{\"uniqueKey\":\"0xdb0bc9f10a174f29a345c5f30a719933f71ccea7a2a75a632a281929bba1b535\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x7E11...b228\",\"rate\":\"15.81\"},{\"uniqueKey\":\"0xdaa04f6819210b11fe4e3b65300c725c32e55755e3598671559b9ae3bac453d7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"62.50\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"9.76\"},{\"uniqueKey\":\"0xd75387f30c983be0aec58b03b51cca52337b496e38cf4effbe995531bf34901c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xD7E2...ceC3\",\"rate\":\"-0.10\"},{\"uniqueKey\":\"0xcf21c3ca9434959fbf882f7d977f90fe22b7a79e6f39cada5702b56b25e58613\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"symbol\":\"PT-USR-24APR2025\",\"name\":\"PT Resolv USD 24APR2025\",\"address\":\"0xec443e7E0e745348E500084892C89218B3ba4683\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1Eea...0d31\",\"rate\":\"21.10\"},{\"uniqueKey\":\"0xce89aeb081d719cd35cb1aafb31239c4dfd9c017b2fec26fc2e9a443461e9aea\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"3.88\"},{\"uniqueKey\":\"0xca2e6f878e273f6587276b44470467f94175e92840ad0d7231e9deb64c190591\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"Midas US Treasury Bill Token\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/verusdc.svg\",\"symbol\":\"verUSDC\",\"name\":\"Verified USDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbd8F...42eA\",\"rate\":\"10.85\"},{\"uniqueKey\":\"0xc9658cac13a9b9b5c1ebaa8ce19c735283cc761ff528d149a7221047bb7fab45\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"5.61\"},{\"uniqueKey\":\"0xc338cc2dc3f6a25bace40a920eea39ff27f184899def6bda478e27e591e5cef2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x451B...eF20\",\"rate\":\"0.25\"},{\"uniqueKey\":\"0xb95dd880d553f5d874534d66eb337a4811608331768c2b208440dfe0e6d901fa\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"symbol\":\"wUSDM\",\"name\":\"Wrapped Mountain Protocol USD\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x06aE...9a5a\",\"rate\":\"0.59\"},{\"uniqueKey\":\"0xb5d424e4af49244b074790f1f2dc9c20df948ce291fc6bcc6b59149ecf91196d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"1.99\"},{\"uniqueKey\":\"0xf8b9786f2f2163e7d618cd8eaf5c0380a1af22424184356dfdd1912f18cb069a\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"0.17\"},{\"uniqueKey\":\"0xc2be602059f1218751ec6f137a8405166419ce408d191fc70f9714eeb301c32b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"0.17\"}]};\n          const chainId = env.parameters.chainId;\n          const availableMarket = availableMarketsList[chainId] || [];\n\n          const htmlMarketGrid = `\n            <div style=\"min-height: 100vh; background-color: #121212; color: white; padding: 24px;\">\n              <div style=\"max-width: 1280px; margin: 0 auto;\">\n                <div style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; color: #9CA3AF;\">\n                  <div>Collateral</div>\n                  <div>Loan</div>\n                  <div>LLTV</div>\n                  <div>Oracle</div>\n                  <div style=\"text-align: right;\">Rate</div>\n                </div>\n                ${availableMarket\n                  .map(\n                    (market) => `\n                    <div\n                      key=\"${market.uniqueKey}\"\n                      id=\"${market.uniqueKey}\"\n                      target-param=\"marketId\"\n                      data-market=\"${market.uniqueKey}\"\n                      data-asset-address=\"${assetType == 'loan' ? market.loan.address : market.collateral.address}\"\n                      data-asset-symbol=\"${assetType == 'loan' ? market.loan.name : market.collateral.name}\"\n                      style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; border-radius: 8px; transition: background-color 0.2s; cursor: pointer; background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\">\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.collateral.icon}\" alt=\"${market.collateral.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.collateral.symbol}</span>\n                      </div>\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.loan.icon}\" alt=\"${market.loan.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.loan.symbol}</span>\n                      </div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.lltv}%</div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.oracleAddress}</div>\n                      <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                        <span>${market.rate}%</span>\n                      </div>\n                    </div>`\n                  )\n                  .join(\"\")}\n              </div>\n            </div>`;\n\n          return htmlMarketGrid;\n      }\n  "
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token to deposit",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.onBehalf",
            "type": "address",
            "description": "Wallet",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.data",
            "type": "string",
            "description": "data",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.marketParams",
            "type": "paragraph",
            "description": "marketParams",
            "hideInUI": true,
            "category": 0
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.marketParams.collateralToken}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{before.marketParams.collateralToken}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "examples": [
          {
            "name": "Supply 100 USDC as Collateral",
            "description": "Supply 100 USDC as Collateral to market USDC/WETH on Morpho on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "abiParams.marketId",
                "value": "0x3b3769cfca57be2eaed03fcc5299c25691b77781a1e124e7a8d520eb9a7eabb5"
              }
            ]
          }
        ],
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.marketParams.collateralToken}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Supply {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.collateralToken}})}} as Collateral on MORPHO"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.collateralToken}})}}"
          ]
        },
        "blockId": 100035,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      },
      "WITHDRAW_COLLATERAL": {
        "name": "Withdraw collateral asset",
        "description": "Withdraw collateral asset from market",
        "type": 1,
        "method": "function withdrawCollateral((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount, address onBehalf, address receiver)",
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "marketId",
            "type": "string",
            "description": "data",
            "category": 0,
            "renderEnum": "\n      (env) => {\n          if (!env.parameters.chainId)\n              throw new Error('You need to provide the chainId first');\n          \n          const availableMarketsList = {\"1\":[{\"uniqueKey\":\"0xfd8493f09eb6203615221378d89f53fcd92ff4f7d62cca87eece9a2fff59e86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"1.42\"},{\"uniqueKey\":\"0xfd3e5c20340aeba93f78f7dc4657dc1e11b553c68c545acc836321a14b47e457\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdl.svg\",\"symbol\":\"wUSDL\",\"name\":\"Wrapped USDL\",\"address\":\"0x7751E2F4b8ae93EF6B79d86419d42FE3295A4559\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFb4b...55e1\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xfad6df5845f5e298fd64f574ffc4024e487856663c535a31bb9c366473aa18b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xD64A...09B6\",\"rate\":\"1.10\"},{\"uniqueKey\":\"0xf84288cdcf652627f66cd7a6d4c43c3ee43ca7146d9a9cfab3a136a861144d6f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa300...5815\",\"rate\":\"60.45\"},{\"uniqueKey\":\"0xf78b7d3a62437f78097745a5e3117a50c56a02ec5f072cba8d988a129c6d4fb6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/berastone.svg\",\"symbol\":\"beraSTONE\",\"name\":\"Berachain STONE\",\"address\":\"0x97Ad75064b20fb2B2447feD4fa953bF7F007a706\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xaE95...dEE5\",\"rate\":\"6.97\"},{\"uniqueKey\":\"0xf6a056627a51e511ec7f48332421432ea6971fc148d8f3c451e14ea108026549\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xa981...4F80\",\"rate\":\"0.41\"},{\"uniqueKey\":\"0xf6422731a8f84d9ab7e8b6da15ab9ecc243e12a78200dfb7fd1cdf2391e38068\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usd3.svg\",\"symbol\":\"USD3\",\"name\":\"Web 3 Dollar\",\"address\":\"0x0d86883FAf4FfD7aEb116390af37746F45b6f378\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xe35f...9e4C\",\"rate\":\"3.64\"},{\"uniqueKey\":\"0xf4614dc6ce4ee662b23762d4b01d158a4a5b437d38022855fa4787db13183299\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x71a8...5B18\",\"rate\":\"2.34\"},{\"uniqueKey\":\"0xeeabdcb98e9f7ec216d259a2c026bbb701971efae0b44eec79a86053f9b128b6\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4236...8a4e\",\"rate\":\"54.32\"},{\"uniqueKey\":\"0xeea9a2431eba248f1cc4d8d3d2a34b31cbf4884ecc602f9270372f892a2ba185\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/paxg.svg\",\"symbol\":\"PAXG\",\"name\":\"PAX Gold\",\"address\":\"0x45804880De22913dAFE09f4980848ECE6EcbAf78\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xa051...FACE\",\"rate\":\"5.27\"},{\"uniqueKey\":\"0xed9e817ac29464b3cc520bf124fb333c330021a8ae768889f414d21df35686e0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-ezeth-26dec2024.svg\",\"symbol\":\"PT-ezETH-26DEC2024\",\"name\":\"PT Renzo ezETH 26DEC2024\",\"address\":\"0xf7906F274c174A52d444175729E3fa98f9bde285\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xfE63...B248\",\"rate\":\"4.27\"},{\"uniqueKey\":\"0xea023e57814fb9a814a5a9ee9f3e7ece5b771dd8cc703e50b911e9cde064a12d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/woeth.svg\",\"symbol\":\"WOETH\",\"name\":\"Wrapped OETH\",\"address\":\"0xDcEe70654261AF21C44c093C300eD3Bb97b78192\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb794...420e\",\"rate\":\"12533.22\"},{\"uniqueKey\":\"0xe95187ba4e7668ab4434bbb17d1dfd7b87e878242eee3e73dac9fdb79a4d0d99\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eigen.svg\",\"symbol\":\"EIGEN\",\"name\":\"Eigen\",\"address\":\"0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x9cfc...5770\",\"rate\":\"6.03\"},{\"uniqueKey\":\"0xe7e9694b754c4d4f7e21faf7223f6fa71abaeb10296a4c43a54a7977149687d2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x95DB...6992\",\"rate\":\"6.04\"},{\"uniqueKey\":\"0xe4cfbee9af4ad713b41bf79f009ca02b17c001a0c0e7bd2e6a89b1111b3d3f08\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/tbtc.svg\",\"symbol\":\"tBTC\",\"name\":\"tBTC\",\"address\":\"0x18084fbA666a33d37592fA2633fD49a74DD93a88\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x57bf...CA5b\",\"rate\":\"24.37\"},{\"uniqueKey\":\"0xe475337d11be1db07f7c5a156e511f05d1844308e66e17d2ba5da0839d3b34d9\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"11.04\"},{\"uniqueKey\":\"0xe37784e5ff9c2795395c5a41a0cb7ae1da4a93d67bfdd8654b9ff86b3065941c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-susde-24oct2024.svg\",\"symbol\":\"PT-sUSDE-26DEC2024\",\"name\":\"PT Ethena sUSDE 26DEC2024\",\"address\":\"0xEe9085fC268F6727d5D4293dBABccF901ffDCC29\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x81E5...4595\",\"rate\":\"1.33\"},{\"uniqueKey\":\"0xe1b65304edd8ceaea9b629df4c3c926a37d1216e27900505c04f14b2ed279f33\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rlp.svg\",\"symbol\":\"RLP\",\"name\":\"Resolv Liquidity Provider Token\",\"address\":\"0x4956b52aE2fF65D74CA2d61207523288e4528f96\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1901...626a\",\"rate\":\"11.94\"},{\"uniqueKey\":\"0xdd3989b8bdf3abd2b4f16896b76209893664ea6a82444dd039977f52aa8e07a1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-solvbtc.bbn-27mar2025.svg\",\"symbol\":\"PT-SolvBTC.BBN-27MAR2025\",\"name\":\"PT SolvBTC Babylon 27MAR2025 \",\"address\":\"0xd1A1984cc5CAcbd36F6a511877d13662C950fd62\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/solvbtc.bbn.svg\",\"symbol\":\"SolvBTC.BBN\",\"name\":\"SolvBTC Babylon\",\"address\":\"0xd9D920AA40f578ab794426F5C90F6C731D159DEf\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE405...38C4\",\"rate\":\"2.33\"},{\"uniqueKey\":\"0xdcfd3558f75a13a3c430ee71df056b5570cbd628da91e33c27eec7c42603247b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x6f2B...E36f\",\"rate\":\"3.05\"},{\"uniqueKey\":\"0xdc5333039bcf15f1237133f74d5806675d83d9cf19cfd4cfdd9be674842651bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xE47E...bd99\",\"rate\":\"7.40\"},{\"uniqueKey\":\"0xdbffac82c2dc7e8aa781bd05746530b0068d80929f23ac1628580e27810bc0c5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xe9eE...3d7f\",\"rate\":\"42.03\"},{\"uniqueKey\":\"0xdbd8f3e55e5005a3922e3df4b1ba636ff9998b94588597420281e3641a05bf59\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x830d...509A\",\"rate\":\"12.78\"},{\"uniqueKey\":\"0xdb760246f6859780f6c1b272d47a8f64710777121118e56e0cdb4b8b744a3094\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"4.07\"},{\"uniqueKey\":\"0xd9e34b1eed46d123ac1b69b224de1881dbc88798bc7b70f504920f62f58f28cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xDa85...0760\",\"rate\":\"9.01\"},{\"uniqueKey\":\"0xd95c5285ed6009b272a25a94539bd1ae5af0e9020ad482123e01539ae43844e1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb6F9...3bC8\",\"rate\":\"0.06\"},{\"uniqueKey\":\"0xd925961ad5df1d12f677ff14cf20bac37ea5ef3b325d64d5a9f4c0cc013a1d47\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stusd.svg\",\"symbol\":\"stUSD\",\"name\":\"Staked USDA\",\"address\":\"0x0022228a2cc5E7eF0274A7Baa600d44da5aB5776\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xd884...1CC3\",\"rate\":\"5.65\"},{\"uniqueKey\":\"0xd8909210afccc90a67730342d4a4695d437cd898164c59e2f54dfa40b53db2c0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/sdai.svg\",\"symbol\":\"sDAI\",\"name\":\"Savings Dai\",\"address\":\"0x83F20F44975D03b1b09e64809B757c47f942BEeA\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x9d4e...4B65\",\"rate\":\"6.26\"},{\"uniqueKey\":\"0xd6a9afe53c062d793f561fdc6458bf2e24d3fc17f4674d7e95f4dfd0e951e06d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdr.svg\",\"symbol\":\"USDR\",\"name\":\"StablR USD\",\"address\":\"0x7B43E3875440B44613DC3bC08E7763e6Da63C8f8\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"4.06\"},{\"uniqueKey\":\"0xd65e28bab75824acd03cbdc2c1a090d758b936e0aaba7bdaef8228bd1f1ada13\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdq.svg\",\"symbol\":\"USDQ\",\"name\":\"Quantoz USDQ\",\"address\":\"0xc83e27f270cce0A3A3A29521173a83F402c1768b\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xb5c9...F194\",\"rate\":\"3.82\"},{\"uniqueKey\":\"0xd5211d0e3f4a30d5c98653d988585792bb7812221f04801be73a44ceecb11e89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/oseth.svg\",\"symbol\":\"osETH\",\"name\":\"Staked ETH\",\"address\":\"0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x224F...4498\",\"rate\":\"9.45\"},{\"uniqueKey\":\"0xd3d60d19f04614baecb74e134b7bdd775dd7b37950f084ffcf4c05869ed260f1\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2767...5C53\",\"rate\":\"0.37\"},{\"uniqueKey\":\"0xd0e50cdac92fe2172043f5e0c36532c6369d24947e40968f34a5e8819ca9ec5d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"1.67\"},{\"uniqueKey\":\"0xcfe8238ad5567886652ced15ee29a431c161a5904e5a6f380baaa1b4fdc8e302\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wstusr.svg\",\"symbol\":\"wstUSR\",\"name\":\"Wrapped stUSR\",\"address\":\"0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x66a1E37c9b0eAddca17d3662D6c05F4DECf3e110\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1982...5AF1\",\"rate\":\"0.63\"},{\"uniqueKey\":\"0xcfd9f683c6ab4b3c95e450e3faaf582c2b5fe938ef7405c4d60f2e9fd77415cc\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-corn-solvbtc.bbn-26dec2024.svg\",\"symbol\":\"PT-corn-SolvBTC.BBN-26DEC2024\",\"name\":\"PT Corn SolvBTC Babylon 26DEC2024\",\"address\":\"0x23e479ddcda990E8523494895759bD98cD2fDBF6\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbtc.svg\",\"symbol\":\"WBTC\",\"name\":\"Wrapped BTC\",\"address\":\"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x309b...d08B\",\"rate\":\"1.23\"},{\"uniqueKey\":\"0xcec858380cba2d9ca710fce3ce864d74c3f620d53826f69d08508902e09be86f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xAf50...A72d\",\"rate\":\"4.91\"},{\"uniqueKey\":\"0xcce802466ea61ec62007fe60d7b4370a10e765f9f223592790b2b7178abb9383\",\"collateral\":{\"icon\":\"\",\"symbol\":\"PT-sdeUSD-1753142406\",\"name\":\"Principal Token: sdeUSD-1753142406\",\"address\":\"0xb4B8925c4CBce692F37C9D946883f2E330a042a9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1ebe...DC27\",\"rate\":\"1.37\"},{\"uniqueKey\":\"0xcc63ab57cdcd6dd24cd42db3ebe829fb1b56da89fcd17cea6202cf6b69d02393\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-27mar2025.svg\",\"symbol\":\"PT-wstUSR-27MAR2025\",\"name\":\"PT Wrapped stUSR 27MAR2025\",\"address\":\"0xA8c8861b5ccF8CCe0ade6811CD2A7A7d3222B0B8\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7B45...dd36\",\"rate\":\"29.04\"},{\"uniqueKey\":\"0xcacd4c39af872ddecd48b650557ff5bcc7d3338194c0f5b2038e0d4dec5dc022\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rsweth.svg\",\"symbol\":\"rswETH\",\"name\":\"rswETH\",\"address\":\"0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x56e2...bd9b\",\"rate\":\"2.49\"},{\"uniqueKey\":\"0xca35ba8a7dfbb886b1e5ca7f5a600484518788feb038bf59b906e7f1e86fdbb4\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2dC7...1FC9\",\"rate\":\"2.73\"},{\"uniqueKey\":\"0xc9098061d437a9dd53b0070cb33df6fca1a0a5ead288588c88699b0420c1c078\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/msusd.svg\",\"symbol\":\"msUSD\",\"name\":\"Metronome Synth USD\",\"address\":\"0xab5eB14c09D416F0aC63661E57EDB7AEcDb9BEfA\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x5D91...ae25\",\"rate\":\"5.37\"},{\"uniqueKey\":\"0xc84cdb5a63207d8c2e7251f758a435c6bd10b4eaefdaf36d7650159bf035962e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rusd.svg\",\"symbol\":\"rUSD\",\"name\":\"Reservoir Stablecoin\",\"address\":\"0x09D4214C03D01F49544C0448DBE3A27f768F2b34\"},\"lltv\":\"98.00\",\"oracleAddress\":\"0x3aBB...b43a\",\"rate\":\"10.17\"},{\"uniqueKey\":\"0xc581c5f70bd1afa283eed57d1418c6432cbff1d862f94eaf58fdd4e46afbb67f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usde.svg\",\"symbol\":\"USDe\",\"name\":\"USDe\",\"address\":\"0x4c9EDD5852cd905f086C759E8383e09bff1E68B3\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/dai.svg\",\"symbol\":\"DAI\",\"name\":\"Dai Stablecoin\",\"address\":\"0x6B175474E89094C44Da98b954EedeAC495271d0F\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xaE47...cA35\",\"rate\":\"11.92\"},{\"uniqueKey\":\"0xc576cddfd1ee8332d683417548801d6835fa15fb2332a647452248987a8eded3\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wbib01.svg\",\"symbol\":\"wbIB01\",\"name\":\"Wrapped Backed IB01 $ Treasury Bond 0-1yr\",\"address\":\"0xcA2A7068e551d5C4482eb34880b194E4b945712F\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pyusd.svg\",\"symbol\":\"PYUSD\",\"name\":\"PayPal USD\",\"address\":\"0x6c3ea9036406852006290770BEdFcAbA0e23A0e8\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xf71C...Cb40\",\"rate\":\"41.14\"},{\"uniqueKey\":\"0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2a01...AD72\",\"rate\":\"3.80\"},{\"uniqueKey\":\"0xc4e18eb6d0e9b0fa90a15bc0a98190cbf3d5ba763af410346f5174b014cefd8d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susde.svg\",\"symbol\":\"sUSDe\",\"name\":\"Staked USDe\",\"address\":\"0x9D39A5DE30e57443BfF2A8307A4256c8797A3497\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ausd.svg\",\"symbol\":\"AUSD\",\"name\":\"AUSD\",\"address\":\"0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x873C...fb87\",\"rate\":\"5.93\"},{\"uniqueKey\":\"0xc3250fa72657f5d956a55fd7febf5bf953c18aa04bff2e4088415b1e5c2923b0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-rseth-26jun2025.svg\",\"symbol\":\"PT-rsETH-26JUN2025\",\"name\":\"PT Kelp rsETH 26JUN2025\",\"address\":\"0xE08C45F3cfE70f4e03668Dc6E84Af842bEE95A68\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x7b27...80a2\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xbfed072faee09b963949defcdb91094465c34c6c62d798b906274ef3563c9cac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/srusd.svg\",\"symbol\":\"srUSD\",\"name\":\"Savings rUSD\",\"address\":\"0x738d1115B90efa71AE468F1287fc864775e23a31\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xf3FB...3B6d\",\"rate\":\"9.79\"},{\"uniqueKey\":\"0xbf4d7952ceeb29d52678172c348b8ef112d6e32413c547cbf56bbf6addcfa13e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/pt-wstusr-1740182579.svg\",\"symbol\":\"PT-wstUSR-1740182579\",\"name\":\"Principal Token: wstUSR-1740182579\",\"address\":\"0xD0097149AA4CC0d0e1fC99B8BD73fC17dC32C1E9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x2da4...8Cc8\",\"rate\":\"33.64\"},{\"uniqueKey\":\"0xbf02d6c6852fa0b8247d5514d0c91e6c1fbde9a168ac3fd2033028b5ee5ce6d0\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/lbtc.svg\",\"symbol\":\"LBTC\",\"name\":\"Lombard Staked Bitcoin\",\"address\":\"0x8236a87084f8B84306f72007F36F2618A5634494\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xDCc0...29DB\",\"rate\":\"4.36\"},{\"uniqueKey\":\"0xbed21964cf290ab95fa458da6c1f302f2278aec5f897c1b1da3054553ef5e90c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x9F48...8f5e\",\"rate\":\"2.42\"},{\"uniqueKey\":\"0xbd2a27358bdaf3fb902a0ad17f86d4633f9ac5377941298720b37a4d90deab96\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/stkcvxcrvusdethcrv-morpho.svg\",\"symbol\":\"stkcvxcrvUSDETHCRV-morpho\",\"name\":\"Staked TriCRV Convex Deposit Morpho\",\"address\":\"0xAc904BAfBb5FB04Deb2b6198FdCEedE75a78Ce5a\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/crvusd.svg\",\"symbol\":\"crvUSD\",\"name\":\"Curve.Fi USD Stablecoin\",\"address\":\"0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xad7e...60bb\",\"rate\":\"8.38\"},{\"uniqueKey\":\"0xbd1ad3b968f5f0552dbd8cf1989a62881407c5cccf9e49fb3657c8731caf0c1f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/deusd.svg\",\"symbol\":\"deUSD\",\"name\":\"deUSD\",\"address\":\"0x15700B564Ca08D9439C58cA5053166E8317aa138\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1325...7eF8\",\"rate\":\"11.00\"},{\"uniqueKey\":\"0xba761af4134efb0855adfba638945f454f0a704af11fc93439e20c7c5ebab942\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/rseth.svg\",\"symbol\":\"rsETH\",\"name\":\"rsETH\",\"address\":\"0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x2A26...6877\",\"rate\":\"11.62\"},{\"uniqueKey\":\"0xb98ad8501bd97ce0684b30b3645e31713e658e98d1955e8b677fb2585eaa9893\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"mTBILL\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0x253a...3041\",\"rate\":\"0.04\"},{\"uniqueKey\":\"0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbD60...71D8\",\"rate\":\"2.43\"},{\"uniqueKey\":\"0xb7ad412532006bf876534ccae59900ddd9d1d1e394959065cb39b12b22f94ff5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ageth.svg\",\"symbol\":\"agETH\",\"name\":\"Kelp Gain\",\"address\":\"0xe1B4d34E8754600962Cd944B535180Bd758E6c2e\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xcb6a...f89A\",\"rate\":\"6.47\"},{\"uniqueKey\":\"0xb7843fe78e7e7fd3106a1b939645367967d1f986c2e45edb8932ad1896450877\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/xaut.svg\",\"symbol\":\"XAUt\",\"name\":\"Tether Gold\",\"address\":\"0x68749665FF8D2d112Fa859AA293F07A622782F38\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0xc7d1...d9dc\",\"rate\":\"6.62\"},{\"uniqueKey\":\"0xb6f4eebd60871f99bf464ae0b67045a26797cf7ef57c458d57e08c205f84feac\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ebtc.svg\",\"symbol\":\"eBTC\",\"name\":\"ether.fi BTC\",\"address\":\"0x657e8C867D8B37dCC18fA4Caead9C45EB088C642\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USDCoin\",\"address\":\"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1bE2...3D1f\",\"rate\":\"7.49\"},{\"uniqueKey\":\"0xb5b0ff0fccf16dff5bef6d2d001d60f5c4ab49df1020a01073d3ad635c80e8d5\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/susds.svg\",\"symbol\":\"sUSDS\",\"name\":\"Savings USDS\",\"address\":\"0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdt.svg\",\"symbol\":\"USDT\",\"name\":\"Tether USD\",\"address\":\"0xdAC17F958D2ee523a2206206994597C13D831ec7\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x0C42...4C79\",\"rate\":\"2.38\"}],\"8453\":[{\"uniqueKey\":\"0xff0f2bd52ca786a4f8149f96622885e880222d8bed12bbbf5950296be8d03f89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0xa40E...9EFB\",\"rate\":\"18.65\"},{\"uniqueKey\":\"0xf9ed1dba3b6ba1ede10e2115a9554e9c52091c9f1b1af21f9e0fecc855ee74bf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc866...b1BE\",\"rate\":\"1.18\"},{\"uniqueKey\":\"0xf7e40290f8ca1d5848b3c129502599aa0f0602eb5f5235218797a34242719561\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eurc.svg\",\"symbol\":\"EURC\",\"name\":\"EURC\",\"address\":\"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa541...54F4\",\"rate\":\"18.34\"},{\"uniqueKey\":\"0xf761e909ee2f87f118e36b7efb42c5915752a6d39263eec0c000c15d0ab7f489\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mai.svg\",\"symbol\":\"MAI\",\"name\":\"Mai Stablecoin\",\"address\":\"0xbf1aeA8670D2528E08334083616dD9C5F3B087aE\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"0.26\"},{\"uniqueKey\":\"0xf24417ee06adc0b0836cf0dbec3ba56c1059f62f53a55990a38356d42fa75fa2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x1BAa...C973\",\"rate\":\"13.84\"},{\"uniqueKey\":\"0xefb576606581c5ac9f731d80cb453519d06776fdc1de51d6230d180d74890c3b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eura.svg\",\"symbol\":\"EURA\",\"name\":\"EURA (previously agEUR)\",\"address\":\"0xA61BeB4A3d02decb01039e378237032B351125B4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xA479...a48f\",\"rate\":\"3.00\"},{\"uniqueKey\":\"0xe73d71cacb1a11ce1033966787e21b85573b8b8a3936bbd7d83b2546a1077c26\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x8370...0ed1\",\"rate\":\"2.38\"},{\"uniqueKey\":\"0xe63d3f30d872e49e86cf06b2ffab5aa016f26095e560cb8d6486f9a5f774631e\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xe3c4d4d0e214fdc52635d7f9b2f7b3b0081771ae2efeb3cb5aae26009f34f7a7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xaE10...a7A4\",\"rate\":\"0.40\"},{\"uniqueKey\":\"0xe0a6ea61ee79c0ea05268064525538b8290139b60b972fc83c5d5d26cec7cc89\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/uapt.svg\",\"symbol\":\"uAPT\",\"name\":\"Aptos (Universal)\",\"address\":\"0x9c0e042d65a2e1fF31aC83f404E5Cb79F452c337\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"77.00\",\"oracleAddress\":\"0x5110...e9E9\",\"rate\":\"-63.35\"},{\"uniqueKey\":\"0xdfd701f0e53c7281432a11743408cc52a6cf27761e7c70829318a0213a61b1b2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xFd00...8F29\",\"rate\":\"9.21\"},{\"uniqueKey\":\"0xdf6aa0df4eb647966018f324db97aea09d2a7dde0d3c0a72115e8b20d58ea81f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/bsdeth.svg\",\"symbol\":\"bsdETH\",\"name\":\"Based ETH\",\"address\":\"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x237a...ebE2\",\"rate\":\"21.33\"},{\"uniqueKey\":\"0xdf13c46bf7bd41597f27e32ae9c306eb63859c134073cb81c796ff20b520c7cf\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x09EC...D91F\",\"rate\":\"0.03\"},{\"uniqueKey\":\"0xde1979b67c815863afd1105cae097ecb71b05b0978bc1605d0a58a25231d924f\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usda.svg\",\"symbol\":\"USDA\",\"name\":\"USDA\",\"address\":\"0x0000206329b97DB379d5E1Bf586BbDB969C63274\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x1F83...FB73\",\"rate\":\"9.33\"},{\"uniqueKey\":\"0xdc69cf2caae7b7d1783fb5a9576dc875888afad17ab3d1a3fc102f741441c165\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0x05f7...98f2\",\"rate\":\"1.80\"},{\"uniqueKey\":\"0xdba352d93a64b17c71104cbddc6aef85cd432322a1446b5b65163cbbc615cd0c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x4756...9425\",\"rate\":\"14.06\"},{\"uniqueKey\":\"0xdb0bc9f10a174f29a345c5f30a719933f71ccea7a2a75a632a281929bba1b535\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/reth.svg\",\"symbol\":\"rETH\",\"name\":\"Rocket Pool ETH\",\"address\":\"0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x7E11...b228\",\"rate\":\"15.81\"},{\"uniqueKey\":\"0xdaa04f6819210b11fe4e3b65300c725c32e55755e3598671559b9ae3bac453d7\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/aero.svg\",\"symbol\":\"AERO\",\"name\":\"Aerodrome Finance\",\"address\":\"0x940181a94A35A4569E4529A3CDfB74e38FD98631\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"62.50\",\"oracleAddress\":\"0x96F1...2269\",\"rate\":\"9.76\"},{\"uniqueKey\":\"0xd75387f30c983be0aec58b03b51cca52337b496e38cf4effbe995531bf34901c\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"94.50\",\"oracleAddress\":\"0xD7E2...ceC3\",\"rate\":\"-0.10\"},{\"uniqueKey\":\"0xcf21c3ca9434959fbf882f7d977f90fe22b7a79e6f39cada5702b56b25e58613\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ptusr.svg\",\"symbol\":\"PT-USR-24APR2025\",\"name\":\"PT Resolv USD 24APR2025\",\"address\":\"0xec443e7E0e745348E500084892C89218B3ba4683\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usdc.svg\",\"symbol\":\"USDC\",\"name\":\"USD Coin\",\"address\":\"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x1Eea...0d31\",\"rate\":\"21.10\"},{\"uniqueKey\":\"0xce89aeb081d719cd35cb1aafb31239c4dfd9c017b2fec26fc2e9a443461e9aea\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"3.88\"},{\"uniqueKey\":\"0xca2e6f878e273f6587276b44470467f94175e92840ad0d7231e9deb64c190591\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/mtbill.svg\",\"symbol\":\"mTBILL\",\"name\":\"Midas US Treasury Bill Token\",\"address\":\"0xDD629E5241CbC5919847783e6C96B2De4754e438\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/verusdc.svg\",\"symbol\":\"verUSDC\",\"name\":\"Verified USDC\",\"address\":\"0x59aaF835D34b1E3dF2170e4872B785f11E2a964b\"},\"lltv\":\"96.50\",\"oracleAddress\":\"0xbd8F...42eA\",\"rate\":\"10.85\"},{\"uniqueKey\":\"0xc9658cac13a9b9b5c1ebaa8ce19c735283cc761ff528d149a7221047bb7fab45\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"5.61\"},{\"uniqueKey\":\"0xc338cc2dc3f6a25bace40a920eea39ff27f184899def6bda478e27e591e5cef2\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/ezeth.svg\",\"symbol\":\"ezETH\",\"name\":\"Renzo Restaked ETH\",\"address\":\"0x2416092f143378750bb29b79eD961ab195CcEea5\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/weth.svg\",\"symbol\":\"WETH\",\"name\":\"Wrapped Ether\",\"address\":\"0x4200000000000000000000000000000000000006\"},\"lltv\":\"91.50\",\"oracleAddress\":\"0x451B...eF20\",\"rate\":\"0.25\"},{\"uniqueKey\":\"0xb95dd880d553f5d874534d66eb337a4811608331768c2b208440dfe0e6d901fa\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wusdm.svg\",\"symbol\":\"wUSDM\",\"name\":\"Wrapped Mountain Protocol USD\",\"address\":\"0x57F5E098CaD7A3D1Eed53991D4d66C45C9AF7812\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x06aE...9a5a\",\"rate\":\"0.59\"},{\"uniqueKey\":\"0xb5d424e4af49244b074790f1f2dc9c20df948ce291fc6bcc6b59149ecf91196d\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbeth.svg\",\"symbol\":\"cbETH\",\"name\":\"Coinbase Wrapped Staked ETH\",\"address\":\"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/eusd.svg\",\"symbol\":\"eUSD\",\"name\":\"Electronic Dollar\",\"address\":\"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xc3Fa...9cEc\",\"rate\":\"1.99\"},{\"uniqueKey\":\"0xf8b9786f2f2163e7d618cd8eaf5c0380a1af22424184356dfdd1912f18cb069a\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/cbbtc.svg\",\"symbol\":\"cbBTC\",\"name\":\"Coinbase Wrapped BTC\",\"address\":\"0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0x2dD1...C78e\",\"rate\":\"0.17\"},{\"uniqueKey\":\"0xc2be602059f1218751ec6f137a8405166419ce408d191fc70f9714eeb301c32b\",\"collateral\":{\"icon\":\"https://cdn.morpho.org/assets/logos/wsteth.svg\",\"symbol\":\"wstETH\",\"name\":\"Wrapped liquid staked Ether 2.0\",\"address\":\"0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452\"},\"loan\":{\"icon\":\"https://cdn.morpho.org/assets/logos/usr.svg\",\"symbol\":\"USR\",\"name\":\"Resolv USD\",\"address\":\"0x35E5dB674D8e93a03d814FA0ADa70731efe8a4b9\"},\"lltv\":\"86.00\",\"oracleAddress\":\"0xa79e...5d5E\",\"rate\":\"0.17\"}]};\n          const chainId = env.parameters.chainId;\n          const availableMarket = availableMarketsList[chainId] || [];\n\n          const htmlMarketGrid = `\n            <div style=\"min-height: 100vh; background-color: #121212; color: white; padding: 24px;\">\n              <div style=\"max-width: 1280px; margin: 0 auto;\">\n                <div style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; color: #9CA3AF;\">\n                  <div>Collateral</div>\n                  <div>Loan</div>\n                  <div>LLTV</div>\n                  <div>Oracle</div>\n                  <div style=\"text-align: right;\">Rate</div>\n                </div>\n                ${availableMarket\n                  .map(\n                    (market) => `\n                    <div\n                      key=\"${market.uniqueKey}\"\n                      id=\"${market.uniqueKey}\"\n                      target-param=\"marketId\"\n                      data-market=\"${market.uniqueKey}\"\n                      data-asset-address=\"${assetType == 'loan' ? market.loan.address : market.collateral.address}\"\n                      data-asset-symbol=\"${assetType == 'loan' ? market.loan.name : market.collateral.name}\"\n                      style=\"display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 16px; border-radius: 8px; transition: background-color 0.2s; cursor: pointer; background-color: transparent;\"\n                      onMouseEnter=\"this.style.backgroundColor='rgba(31, 41, 55, 0.5)'\"\n                      onMouseLeave=\"this.style.backgroundColor='transparent'\">\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.collateral.icon}\" alt=\"${market.collateral.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.collateral.symbol}</span>\n                      </div>\n                      <div style=\"display: flex; align-items: center; gap: 12px;\">\n                        <div style=\"width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background-color: #2D2D2D;\">\n                          <img src=\"${market.loan.icon}\" alt=\"${market.loan.symbol} icon\" width=\"24\" height=\"24\" style=\"width: 100%; height: 100%; object-fit: cover;\">\n                        </div>\n                        <span style=\"color: #F3F4F6; font-weight: 500;\">${market.loan.symbol}</span>\n                      </div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.lltv}%</div>\n                      <div style=\"color: #F3F4F6; font-weight: 500;\">${market.oracleAddress}</div>\n                      <div style=\"display: flex; align-items: center; gap: 4px; color: #60A5FA; justify-content: flex-end;\">\n                        <span>${market.rate}%</span>\n                      </div>\n                    </div>`\n                  )\n                  .join(\"\")}\n              </div>\n            </div>`;\n\n          return htmlMarketGrid;\n      }\n  "
          },
          {
            "key": "asset",
            "type": "erc20",
            "description": "The token to deposit",
            "category": 0,
            "hideInUI": true
          },
          {
            "key": "abiParams.amount",
            "type": "float",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.asset}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "The token to deposit",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.onBehalf",
            "type": "address",
            "description": "The token to deposit",
            "hideInUI": true,
            "category": 0
          },
          {
            "key": "abiParams.marketParams",
            "type": "paragraph",
            "description": "marketParams",
            "hideInUI": true,
            "category": 0
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.marketParams.collateralToken}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
        "requiredApprovals": [
          {
            "address": "{{before.marketParams.collateralToken}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.marketParams.collateralToken}}",
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.collateralToken}})}} collateral on MORPHO"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{before.marketParams.collateralToken}})}}"
          ]
        },
        "examples": [
          {
            "name": "Withdraw 100 Collateral USDC",
            "description": "Withdraw 100 Collateral USDC from market USDC/WETH on Morpho on Base",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "abiParams.amount",
                "value": 100
              },
              {
                "key": "abiParams.marketId",
                "value": "0x3b3769cfca57be2eaed03fcc5299c25691b77781a1e124e7a8d520eb9a7eabb5"
              }
            ]
          }
        ],
        "blockId": 100036,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/morpho.webp"
      }
    }
  },
  "SWAP": {
    "ODOS": {
      "description": "Smart Order Routing across multiple blockchain protocols, 700+ Liquidity Sources and thousands of token pairs, delivering ultimate savings to users",
      "chains": [
        34443,
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.png",
      "SWAP": {
        "name": "Odos swap",
        "description": "Swap on Odos to get the best market rates accross multiple pools",
        "type": 1,
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenIn}}",
            "amount": "{{parameters.amount}}",
            "to": "{{before.contractAddress}}"
          }
        ],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.tokenIn}}",
            "amount": "{{parameters.amount}}"
          }
        ],
        "output": {
          "amountIn": "uint256",
          "tokenIn": "erc20",
          "amountOut": "uint256",
          "tokenOut": "erc20",
          "transactionHash": "string",
          "exchangeRate": "float",
          "logs": "Object"
        },
        "frontendHelpers": {
          "output": {
            "amountIn": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{output.tokenIn}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amountOut": {
              "formatAmount": false,
              "erc20Token": {
                "contractAddress": "{{output.tokenOut}}",
                "chainId": "{{parameters.chainId}}"
              }
            }
          }
        },
        "parameters": [
          {
            "key": "chainId",
            "type": "chainId",
            "description": "Chain ID of the network",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenIn",
            "type": "erc20",
            "description": "Token to sell",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "tokenOut",
            "type": "erc20",
            "description": "Token to buy",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "amount",
            "type": "float",
            "description": "Amount to sell",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "convertItsDecimal": false,
              "contractAddress": "{{parameters.tokenIn}}",
              "chain": "{{parameters.chainId}}"
            }
          },
          {
            "key": "slippage",
            "type": "percentage",
            "description": "The maximum allowable difference between the expected price and the actual price at the time of execution, expressed as a percentage. This protects the transaction from significant price fluctuations.",
            "value": 1,
            "mandatory": true,
            "category": 1
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Swap USDC to WETH",
            "description": "Swap 100 USDC to WETH on Base using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "tokenIn",
                "value": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
              },
              {
                "key": "tokenOut",
                "value": "0x4200000000000000000000000000000000000006"
              },
              {
                "key": "amount",
                "value": 100
              },
              {
                "key": "slippage",
                "value": 0.3
              }
            ]
          }
        ],
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{before.contractAddress}}",
            "{{parameters.tokenIn}}"
          ],
          "label": [
            "Swap {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenIn}})}} to {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenOut}})}}"
          ],
          "labelNotAuthorized": [
            "Transfer ETH"
          ]
        },
        "blockId": 100005,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.png"
      }
    }
  },
  "NFTS": {
    "BLUR": {
      "description": "The NFT marketplace for pro traders",
      "chains": [
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/blur.jpg"
    }
  }
};