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
          "value": "uint256",
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
        "method": "function balanceOf(address account) view returns (uint256)",
        "output": {
          "balance": "integer"
        },
        "frontendHelpers": {
          "output": {
            "balance": {
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
            "type": "any",
            "description": "The value to compare to",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "contractAddress": "{{parameters.contractAddress}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "examples": [
          {
            "name": "Mode balance check",
            "description": "Gets triggered when the MODE balance of vitalik.eth falls below 10,000",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "comparisonValue",
                "value": "10000000000000000000000n"
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
            "parameters": [
              {
                "key": "chainId",
                "value": 1
              },
              {
                "key": "comparisonValue",
                "value": "7000000000000000000000000000n"
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
          "value": "uint256",
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
    "ON_CHAIN_PRICE_MOVEMENT": {
      "description": "Triggers based on the movement of on-chain prices against specified currencies",
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
            "description": "Gets triggered when ETH rises above 2850$ on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
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
                "value": "0x0000000000000000000000000000000000000000"
              }
            ]
          },
          {
            "name": "ETH < 2100$",
            "description": "Gets triggered when ETH falls below 2100$ on Mode",
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
                "value": "0x0000000000000000000000000000000000000000"
              }
            ]
          },
          {
            "name": "MODE < 0.01$",
            "description": "Gets triggered when MODE falls below 0.01$ on Mode Network",
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
      "description": "Ethena is a synthetic dollar protocol built on Ethereum that provides a crypto-native solution for money not reliant on traditional banking system infrastructure",
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
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n                throw new Error('You need to provide the chainId first');\n\n            const availableLendingTokens = {\n  \"1\": [\n    {\n      \"value\": \"0xf99985822fb361117fcf3768d34a6353e6022f5f\",\n      \"label\": \"stETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ac9b8802-61d9-4c3f-a2de-2da35c87e24b.svg\"\n    },\n    {\n      \"value\": \"0xb253eff1104802b97ac7e3ac9fdd73aece295a2c\",\n      \"label\": \"stETH\",\n      \"expiry\": \"DEC 30, 2027\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f7d6a626-a00e-4150-aadc-e937e34818ca.svg\"\n    },\n    {\n      \"value\": \"0xa6a0c2b9d06b769635f6c85deb6b500f49f672e8\",\n      \"label\": \"apxETH\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/151c9217-2512-4d26-b9d0-755c49299b12.svg\"\n    },\n    {\n      \"value\": \"0xe00bd3df25fb187d6abbb620b3dfd19839947b81\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/56eb1ed3-d1f7-4685-a7b2-5a6e05cb234f.svg\"\n    },\n    {\n      \"value\": \"0x8a47b431a7d947c6a3ed6e42d501803615a97eaa\",\n      \"label\": \"USDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7299bcd0-6ba1-411e-8d54-f7e5b68aa154.svg\"\n    },\n    {\n      \"value\": \"0xb930dd4ea22cd4404c30d68b72e18453adcf93a2\",\n      \"label\": \"rsENA\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/37110810-606f-4d92-8ea8-5ede71d6abdc.svg\"\n    },\n    {\n      \"value\": \"0x76260912b132c6548d9d936996ad1e754d3f53ee\",\n      \"label\": \"rsUSDe\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1d444261-bdf7-483b-8e35-bdb725a702ce.svg\"\n    },\n    {\n      \"value\": \"0xec5a52c685cc3ad79a6a347abace330d69e0b1ed\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/773047f5-3963-4577-93f9-4333f225442c.svg\"\n    },\n    {\n      \"value\": \"0x276dc1714bdb1beb869babc6e84c0b102e75bf32\",\n      \"label\": \"USDS Rewards\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/bdf98058-9191-44bf-b9a7-4a460457f756.svg\"\n    },\n    {\n      \"value\": \"0x8ac5fc4085f6baeabad8f4a6bb1dd7d18a320230\",\n      \"label\": \"sENA\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/34ccfdb6-4acf-4d13-8dc9-080b47dfb8fa.svg\"\n    },\n    {\n      \"value\": \"0xe0e4d07e90508a53ad03155e86ecdd09d24ce98a\",\n      \"label\": \"sENA\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9fa08efc-e32b-4cf7-98da-9d75c9453c35.svg\"\n    },\n    {\n      \"value\": \"0x152b8629fee8105248ba3b7ba6afb94f7a468302\",\n      \"label\": \"sUSDS\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3226daff-03a2-4078-af4e-28a72ef5b252.svg\"\n    },\n    {\n      \"value\": \"0x997ec6bf18a30ef01ed8d9c90718c7726a213527\",\n      \"label\": \"pumpBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/df3270cd-7ee9-4119-8ad8-c81336fad690.svg\"\n    },\n    {\n      \"value\": \"0x44a7876ca99460ef3218bf08b5f52e2dbe199566\",\n      \"label\": \"eBTC (Corn)\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/35a6e08f-82da-49cf-8dc0-c120a4386b0f.svg\"\n    },\n    {\n      \"value\": \"0x5bae9a5d67d1ca5b09b14c91935f635cfbf3b685\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0xd2b9f0587e89a508e5786525c82ae494389f2dda\",\n      \"label\": \"eEIGEN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/33c90ae2-9675-4f9f-80e8-0554dc0dc5b5.svg\"\n    },\n    {\n      \"value\": \"0xf05312a0d01e5a0f9eba87a539c37100fabf9b5e\",\n      \"label\": \"stkGHO\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/05cdb874-4679-4b6a-bedc-9de81e817e79.svg\"\n    },\n    {\n      \"value\": \"0xe08c45f3cfe70f4e03668dc6e84af842bee95a68\",\n      \"label\": \"rsETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/be3e997d-8f3c-46ed-b978-2518668aaa2b.svg\"\n    },\n    {\n      \"value\": \"0xef6122835a2bbf575d0117d394fda24ab7d09d4e\",\n      \"label\": \"eETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/58971e16-6cf3-4ac4-9f3a-df82267fc5c8.svg\"\n    },\n    {\n      \"value\": \"0x8b89d5ea6c9ea52dab5834e9789aa10085c14858\",\n      \"label\": \"eBTC (Zerolend)\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/39b1b707-b537-4c87-811d-110047aa7b9f.svg\"\n    },\n    {\n      \"value\": \"0x6e43f6abce001c14c7115d20908d0c272338eaf1\",\n      \"label\": \"agETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d4f45c90-7317-4d07-ae67-1e8ec9caa9a7.svg\"\n    },\n    {\n      \"value\": \"0x302091967c09323815594ad8db2d8de35c3a1985\",\n      \"label\": \"uniETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/025623d4-1fc4-44db-b981-03d60d93d90a.svg\"\n    },\n    {\n      \"value\": \"0x9cfc9917c171a384c7168d3529fc7e851a2e0d6d\",\n      \"label\": \"pufETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ad53c3bf-7a0c-481e-80cd-0eea4e0e9554.svg\"\n    },\n    {\n      \"value\": \"0xb7de5dfcb74d25c2f21841fbd6230355c50d9308\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8fdd3402-5238-4e90-b4db-12e32ea28e67.svg\"\n    },\n    {\n      \"value\": \"0x003984ecc30bafe364efa8c0112cdd94b8216406\",\n      \"label\": \"rswETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/221673b1-5839-4140-ad82-3f865dc05c4d.png\"\n    },\n    {\n      \"value\": \"0xf696fe29ef85e892b5926313897d178288faa07e\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0x6e96041a7f6a3a974a90016f277fb7457a64ef9b\",\n      \"label\": \"pWBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/f59d005c-a34f-40e3-bdf7-bd84c2094765.svg\"\n    },\n    {\n      \"value\": \"0x1cb3c1c1e0f61770c224a66bb251c59f2c37ab91\",\n      \"label\": \"scrvUSD\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/50bc1fdb-ca50-4c38-9a0c-1669e35896f1.svg\"\n    },\n    {\n      \"value\": \"0xead5939df65f19b866615a7853faa52cf4a1635d\",\n      \"label\": \"OETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/af71269f-d089-47f1-8106-532af44b49e0.svg\"\n    },\n    {\n      \"value\": \"0xd1a1984cc5cacbd36f6a511877d13662c950fd62\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/abdb21c4-7fc2-44f7-bbbb-27416583ac66.svg\"\n    },\n    {\n      \"value\": \"0xd4fa2b2b7a3b2be26ca9349763f55de07e2fbfd0\",\n      \"label\": \"uniBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/04bdd8ee-4a79-48c5-88a0-b2593ebf939d.svg\"\n    },\n    {\n      \"value\": \"0x386ae941d4262b0ee96354499df2ab8442734ec0\",\n      \"label\": \"sUSDe\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ecaa79c6-7223-48e9-a3f0-30e10dbbfbfe.svg\"\n    },\n    {\n      \"value\": \"0x770751e8ad85451754d3c23e71f4afe19ce6afdb\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0xd86f4d98b34108cb4c059d540bd513f09b2ddd30\",\n      \"label\": \"USD0++\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a66178ef-2097-4b72-9d19-75fe6a4b8821.svg\"\n    },\n    {\n      \"value\": \"0xea1180804bdba8ac04e2a4406b11fb7970c474f1\",\n      \"label\": \"aUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/1d127217-c2d1-4e5c-9bf4-70ae1a208d28.svg\"\n    },\n    {\n      \"value\": \"0xf358ffe722a0984e940351462fef4a77dde04c33\",\n      \"label\": \"aUSDT\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/a875dcab-6a6d-449a-b519-dce222d873c9.svg\"\n    },\n    {\n      \"value\": \"0x6704c353b0c2527863e4ef03dca07175b9318cbf\",\n      \"label\": \"fUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9049a93c-6645-4c84-b19f-9ebfa0cce6dd.svg\"\n    },\n    {\n      \"value\": \"0xfd1bb7d74698da38d8b5d871b189549ef4b7d976\",\n      \"label\": \"fUSDT\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/6c349c1b-9671-489c-be2c-8750738da3aa.svg\"\n    },\n    {\n      \"value\": \"0xbf2c0f3689c46a0923de8829bb269ca8f81c8137\",\n      \"label\": \"weETHk\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/9f9ec77b-efe0-4119-a4fc-a733ff5fd04a.svg\"\n    },\n    {\n      \"value\": \"0xa3170a9ee20d9832d933d4355676d09f66909d12\",\n      \"label\": \"weETHs\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2244883b-428a-4f86-ad63-dcaa143b70d6.svg\"\n    },\n    {\n      \"value\": \"0x68a2a15fd9832a4b03a5907e067220773aa71214\",\n      \"label\": \"eBTC\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/685e07f1-e50d-4ff9-bac2-158611f718a6.svg\"\n    },\n    {\n      \"value\": \"0xc653f79de1274ee65674befda54986020d6f8fc1\",\n      \"label\": \"eBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/685e07f1-e50d-4ff9-bac2-158611f718a6.svg\"\n    },\n    {\n      \"value\": \"0x36f4ec0a7c46923c4f6508c404ee1c6fbe175e1c\",\n      \"label\": \"USUALx\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ff146e2f-3e2d-4e71-9a9d-e1a866b75da2.svg\"\n    },\n    {\n      \"value\": \"0xa8c8861b5ccf8cce0ade6811cd2a7a7d3222b0b8\",\n      \"label\": \"wstUSR\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7a8188bd-cae6-492d-b30d-cbd128493f00.svg\"\n    },\n    {\n      \"value\": \"0x6e45845b9019fa598fe829c20c8c9a00647c0a75\",\n      \"label\": \"uniBTC (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/7ce722a1-c74e-4226-a80d-1028861e4b62.svg\"\n    },\n    {\n      \"value\": \"0x29859bb7c30c0e36b69ef1ecb40396ab9b970b60\",\n      \"label\": \"LBTC (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/0b1f24c8-2a29-46bd-b400-5f7043e3c573.svg\"\n    },\n    {\n      \"value\": \"0xcbbfa588285d370571e52db62fa7c5241bd5b7d9\",\n      \"label\": \"SolvBTC.BBN (Corn)\",\n      \"expiry\": \"FEB 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/4b1032d7-94ba-4075-8233-85808d186ebd.svg\"\n    },\n    {\n      \"value\": \"0x856ca0217838e9fefefd6141028c85bd423ec54b\",\n      \"label\": \"pumpBTC\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/df3270cd-7ee9-4119-8ad8-c81336fad690.svg\"\n    },\n    {\n      \"value\": \"0xa2621f9b02549d05289b46700e9d53fcd2ee0b6d\",\n      \"label\": \"liquidBeraBTC\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5506f24b-06b7-4f28-af95-11f5c8b0e085.svg\"\n    },\n    {\n      \"value\": \"0x50bf5c6445b79b79e368856095a70c564d0c6966\",\n      \"label\": \"liquidBeraETH\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5ab37246-4c5b-4a95-a534-e60ec618010b.svg\"\n    },\n    {\n      \"value\": \"0x500f4ac4b1cfae7de51799ecf5bd09649a8b05d3\",\n      \"label\": \"sUSDe (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/aa218d17-62e2-42a4-986b-4f6fcebf9aa4.svg\"\n    },\n    {\n      \"value\": \"0x532486c59cd371ffedb19241186d786a1e8ee111\",\n      \"label\": \"USDe (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/85be79d7-942c-4cc9-b364-5e1c891a242b.svg\"\n    },\n    {\n      \"value\": \"0x40b7b4ab1e95e28df06971581276966fdf95688e\",\n      \"label\": \"beraSTONE\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/378a54dc-779f-40f0-b859-03dbb3b425e8.svg\"\n    },\n    {\n      \"value\": \"0xdfb913b117bc93fde164a4ff8b3176662d4198f3\",\n      \"label\": \"LBTC (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/39e54d77-2c8f-49f2-ba92-b40386a55673.svg\"\n    },\n    {\n      \"value\": \"0x96fe14bf8c1681db311fa95547b254a178ab5527\",\n      \"label\": \"WBTC (Bera Concrete)\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/0a043dbb-827c-4692-9c52-272745db30c3.svg\"\n    },\n    {\n      \"value\": \"0x2beeb2c4809954e5b514a3205afbdc097eb810b4\",\n      \"label\": \"syrupUSDC\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/3bebc608-b228-4b1a-81de-363ee24b999b.svg\"\n    },\n    {\n      \"value\": \"0x74ada3987bcc29e64f5fd3f9229b9d319268c005\",\n      \"label\": \"SolvBTC.BERA\",\n      \"expiry\": \"APR 10, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/b9407b43-e7fe-4b27-a78d-0e1db14b8a4b.svg\"\n    },\n    {\n      \"value\": \"0x4ef516d5f8644d19caadf352e2c97ec346b6b986\",\n      \"label\": \"sUSDa\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ddcbbbc3-af3c-4b35-a2a6-ebd4e0189256.svg\"\n    },\n    {\n      \"value\": \"0x84d17ef6bec165484c320b852eeb294203e191be\",\n      \"label\": \"tETH\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d8db35e6-a493-4879-b0de-a9b3fb40924c.svg\"\n    },\n    {\n      \"value\": \"0xeead826151d25f44418553303f2722893f08478c\",\n      \"label\": \"asdCRV\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/2ad15ff1-e832-4786-9da3-fac560d1a34c.svg\"\n    }\n  ],\n  \"56\": [\n    {\n      \"value\": \"0x04eb6b56ff53f457c8e857ca8d4fbc8d9a531c0c\",\n      \"label\": \"ankrBNB\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c172da67-2428-48cb-8602-58bfc0276af0.svg\"\n    },\n    {\n      \"value\": \"0x541b5eeac7d4434c8f87e2d32019d67611179606\",\n      \"label\": \"SolvBTC.BBN\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/eab31d5d-401e-4720-a5b4-6b90b73611e0.svg\"\n    },\n    {\n      \"value\": \"0x5d1735b8e33bae069708cea245066de1a12cd38d\",\n      \"label\": \"vBNB\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/821bd337-240a-4c03-b4cb-07c7f0d59544.svg\"\n    },\n    {\n      \"value\": \"0xe8f1c9804770e11ab73395be54686ad656601e9e\",\n      \"label\": \"clisBNB\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/609a2f5a-d97e-4015-b1c9-f93893e94620.svg\"\n    }\n  ],\n  \"5000\": [\n    {\n      \"value\": \"0xebf4ff21459fecf96e36cf1dd00db01367254bcd\",\n      \"label\": \"cmETH\",\n      \"expiry\": \"FEB 13, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/16ebbece-2e29-4e7b-acba-d3d23fa8dec0.svg\"\n    }\n  ],\n  \"8453\": [\n    {\n      \"value\": \"0x7ae6d25e8ef05e424ae8c04b48822e8211b3cddc\",\n      \"label\": \"LBTC-29MAY2025\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0xe46c8ba948f8071b425a1f7ba45c0a65cbacea2e\",\n      \"label\": \"cbETH\",\n      \"expiry\": \"DEC 25, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/cec7c095-6d6c-400b-9509-c2b68a1f54f3.svg\"\n    },\n    {\n      \"value\": \"0x5d746848005507da0b1717c137a10c30ad9ee307\",\n      \"label\": \"LBTC\",\n      \"expiry\": \"MAY 29, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/95280b7c-e3a4-43ce-8a73-e544e2600624.svg\"\n    },\n    {\n      \"value\": \"0x2a9e9256e0d1ad0f7f9d7c7248cb7e2f06072deb\",\n      \"label\": \"mUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dd3dd5af-a072-409a-af35-3ac803ede34a.svg\"\n    },\n    {\n      \"value\": \"0x5c6593f57ee95519ff6a8cd16a5e41ff50af239a\",\n      \"label\": \"mcbBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c877240e-a45b-4e8c-b42e-a2b6d96ed332.svg\"\n    },\n    {\n      \"value\": \"0x6e5f3a139acd6c8258472fa08d2133b555d10fb2\",\n      \"label\": \"wsupperOETHb-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0x25d2b7e3b71f4edcc366e79134570704a079923a\",\n      \"label\": \"wsuperOETHb\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ac4127a6-cda2-41ba-8db7-9cda2d2c2e94.svg\"\n    },\n    {\n      \"value\": \"0xc1e4d7ca05045dfbc654b67e11124901148b1266\",\n      \"label\": \"sUSDz\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/296a6c38-c626-42f0-9cf1-456837aa29d4.svg\"\n    },\n    {\n      \"value\": \"0x603e2d1af3d0673f4af756b6e12a2044bfebb714\",\n      \"label\": \"VIRTUAL/cbBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/706e880e-c1ee-4258-827e-5be4e935b0a8.svg\"\n    },\n    {\n      \"value\": \"0xec443e7e0e745348e500084892c89218b3ba4683\",\n      \"label\": \"USR\",\n      \"expiry\": \"APR 24, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ceb019d3-32ce-4dc5-875f-c930a0f2bde8.svg\"\n    }\n  ],\n  \"42161\": [\n    {\n      \"value\": \"0xb7337f35daff97781f5c6d5bea396d2327f70017\",\n      \"label\": \"wstETH-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0xbc242bd3e32209a4d3541d6ca322302acf4b4f47\",\n      \"label\": \"rETH-26JUN2025\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/pendle-assets-staging/images/assets/unknown.svg\"\n    },\n    {\n      \"value\": \"0x1255638efeca62e12e344e0b6b22ea853ec6e2c7\",\n      \"label\": \"wstETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/ae07850a-421b-4fe1-87ec-5ba8fa65da68.svg\"\n    },\n    {\n      \"value\": \"0x685155d3bd593508fe32be39729810a591ed9c87\",\n      \"label\": \"rETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/dca97a36-3121-46db-a22f-154d68e4b466.svg\"\n    },\n    {\n      \"value\": \"0xcef75d0914d183c8eadfafaea9dfef688aaffcf3\",\n      \"label\": \"PENDLE-ETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/c1e597df-fb6b-4475-9d3f-7f8bcd08bbeb.svg\"\n    },\n    {\n      \"value\": \"0x4d5d8375c39dc91a8aca33ff4a4564de92dcd04c\",\n      \"label\": \"gDAI\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d21b47c3-f316-430e-ba22-1bd07e63f0bb.svg\"\n    },\n    {\n      \"value\": \"0x137f793505e7884cb70ee5933c83447e85b1bd17\",\n      \"label\": \"dUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/590ebc0d-ad8a-4574-92c7-364c557a2a13.svg\"\n    },\n    {\n      \"value\": \"0x98510fbe752a97f97abd7d971a1b3290dd62ec4a\",\n      \"label\": \"dWBTC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/b0d49b1b-01ed-4c17-b07c-bd66159b94a2.svg\"\n    },\n    {\n      \"value\": \"0x8db96f2fccf7cdd74a60e8eff5801df043cd11de\",\n      \"label\": \"rsETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/aa206b8c-0a44-4ee3-aeb4-95e9087424d0.svg\"\n    },\n    {\n      \"value\": \"0x0ab24ecb207602983a20cfcf0e3045c08c651778\",\n      \"label\": \"spSILO\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/79b08c9a-ac55-41b9-b767-96c95afb8269.svg\"\n    },\n    {\n      \"value\": \"0xb33808ea0e883138680ba29311a220a7377cdb92\",\n      \"label\": \"eETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/d5b1f12c-7cb3-4572-9bb7-68865c138cd6.svg\"\n    },\n    {\n      \"value\": \"0xb3ebcc844f1eda040a3620267cdaaea6e14518a9\",\n      \"label\": \"uniETH\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/507bfb70-4c6b-4480-8ef8-b7cc250b82e2.svg\"\n    },\n    {\n      \"value\": \"0x9d8eadeb4e7311e340a5ee39dbf62d7694f1aa85\",\n      \"label\": \"MUXLP\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/5a74829d-0611-46cc-9fa5-98fcc13870a8.svg\"\n    },\n    {\n      \"value\": \"0x0b6121b4c00ca4fbbb6516c11eb4bf61722e0f8d\",\n      \"label\": \"gUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/fc507e18-ddcd-48ce-8518-8f3610719a2b.svg\"\n    },\n    {\n      \"value\": \"0x0fc042b32a9a6191834ea12ffa04f2044d0eb302\",\n      \"label\": \"aUSDC\",\n      \"expiry\": \"JUN 26, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/db96e8da-a779-43df-b012-ceeb3d298c8d.svg\"\n    },\n    {\n      \"value\": \"0x4a94091cadd74bdf313b74d58eac908c5fc53704\",\n      \"label\": \"mPENDLE\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/8592b56d-0004-4b30-9604-9f82bb32abac.png\"\n    },\n    {\n      \"value\": \"0x2a18a490ec18b019837f6153269d21a772167292\",\n      \"label\": \"ePENDLE\",\n      \"expiry\": \"MAR 27, 2025\",\n      \"image\": \"https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/e7a078b9-3bb4-4fdf-9319-124e0389b463.svg\"\n    }\n  ]\n};\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }"
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
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/pendle.webp"
      }
    }
  },
  "LENDING": {
    "IONIC": {
      "description": "#1 money market for Yield Bearing Assets on the OP Superchain",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
      "description": "Astaria is an oracle-less, intent-based, fixed-rate lending protocol supporting unlimited loan durations for any asset",
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
      "description": "A leading DeFi protocol enabling secure borrowing, lending, and yield generation across multiple assets.",
      "chains": [
        8453
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
      }
    },
    "MOONWELL": {
      "description": "An advanced lending and borrowing platform focused on scalable, fast blockchain networks for optimal performance.",
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
      "description": "Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications.",
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
      "description": "DeFi needs safe, liquid lending markets and steady stablecoins that drives value to users. We’ve built that foundation and made it Ironclad.",
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
    }
  },
  "DEXES": {
    "ODOS": {
      "description": "Smart Order Routing across multiple blockchain protocols, 700+ Liquidity Sources and thousands of token pairs, delivering ultimate savings to users",
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
          "inputAmount": "uint256",
          "inputToken": "erc20",
          "amountOut": "uint256",
          "outputToken": "erc20",
          "exchangeRate": "float",
          "transactionHash": "string"
        },
        "frontendHelpers": {
          "output": {
            "inputAmount": {
              "erc20Token": {
                "contractAddress": "{{output.inputToken}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amountOut": {
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
            "description": "Gets triggered when someone does a swap on Mode using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              }
            ]
          },
          {
            "name": "Sell ETH",
            "description": "Gets triggered when someone sells ETH on Mode using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
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
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1": {
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
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1In": {
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
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1": {
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
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1In": {
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
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/velodrome.jpg",
      "SWAP_IN_CONCENTRATED_POOL": {
        "name": "Swap in Concentrated Pool",
        "description": "Triggers every time there is a swap in a Velodrome concentrated liquidity pool.",
        "type": 0,
        "output": {
          "sender": "address",
          "recipient": "address",
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
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1": {
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
            "description": "Triggers whenever a swap occurs in a Velodrome concentrated liquidity pool (WETH/MODE 0.3%).",
            "parameters": [
              {
                "key": "chainId",
                "value": 8453
              },
              {
                "key": "contractAddress",
                "value": "0x1E41CDE26b30646bb3DBBea48A63708b00470c1c"
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
              "erc20Token": {
                "contractAddress": "{{parameters.contractAddress}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amount1In": {
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
                "value": 8453
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
        "output": {
          "id": "uint256",
          "owner": "address",
          "expires": "uint256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "abiParams.id",
            "type": "uint256",
            "description": "ID of the name registered",
            "category": 1
          },
          {
            "key": "abiParams.owner",
            "type": "address",
            "description": "Owner address",
            "category": 1
          },
          {
            "key": "abiParams.expires",
            "type": "uint256",
            "description": "Expiration time",
            "category": 1
          },
        ] as Parameter[],
        "examples": [],
        "blockId": 3,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/modens.png"
      }
    },
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
      "description": "X, formerly known as Twitter, is a social media platform that allows users to share short messages, photos, videos, and more.",
      "tags": {},
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/x.webp",
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
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/x.webp"
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
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/blur.jpg"
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
        34443
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
              "erc20Token": {
                "contractAddress": "{{output.tokenIn}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amountOut": {
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
            "type": "uint256",
            "description": "Amount to sell",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
            "description": "Swap 100 USDC to WETH on Mode Network using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "tokenIn",
                "value": "0xd988097fb8612cc24eeC14542bC03424c656005f"
              },
              {
                "key": "tokenOut",
                "value": "0x4200000000000000000000000000000000000006"
              },
              {
                "key": "amount",
                "value": "100000000n"
              },
              {
                "key": "slippage",
                "value": 1
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
        ] as Parameter[],
        "examples": [],
        "blockId": 100015,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/split.png"
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
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/telegram.jpeg"
    }
  },
  "TOKENS": {
    "TRANSFER": {
      "description": "Transfer token",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/Transfer.svg",
      "TRANSFER": {
        "name": "Transfer token",
        "description": "Transfers an ERC20 token",
        "type": 1,
        "method": "function transfer(address to, uint256 value)",
        "output": {
          "transactionHash": "string"
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
            "key": "contractAddress",
            "type": "erc20",
            "description": "The contract address of the ERC20",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.to",
            "type": "address",
            "description": "Address to transfer crypto to",
            "mandatory": true,
            "category": 0
          },
          {
            "key": "abiParams.value",
            "type": "uint256",
            "description": "Amount of crypto to transfer",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "contractAddress": "{{parameters.contractAddress}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{parameters.contractAddress}}",
            "amount": "{{parameters.abi.parameters.value}}"
          }
        ],
        "examples": [
          {
            "name": "Transfer USDC",
            "description": "Transfer 100 USDC to vitalik.eth on Mode",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "abiParams.value",
                "value": "100000000n"
              },
              {
                "key": "abiParams.to",
                "value": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              },
              {
                "key": "contractAddress",
                "value": "0xd988097fb8612cc24eeC14542bC03424c656005f"
              }
            ]
          }
        ],
        "permissions": {
          "chainId": "{{parameters.chainId}}",
          "approvedTargets": [
            "{{parameters.contractAddress}}"
          ],
          "label": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.contractAddress}})}}"
          ],
          "labelNotAuthorized": [
            "Transfer {{otherTokenSymbol({{parameters.chainId}}, {{parameters.contractAddress}})}}"
          ]
        },
        "blockId": 100004,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/Transfer.svg"
      }
    }
  },
  "LENDING": {
    "IONIC": {
      "description": "#1 money market for Yield Bearing Assets on the OP Superchain",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "uint256",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "uint256",
            "description": "Amount of crypto to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "uint256",
            "description": "Amount of crypto to borrow",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4\",\n    \"0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff\",\n    \"0xCc7FF230365bD730eE4B352cC2492CEdAC49383e\",\n    \"0xaB36452DbAC151bE02b16Ca17d8919826072f64a\",\n    \"0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3\",\n    \"0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C\",\n    \"0x7002458B1DF59EccB57387bC79fFc7C29E22e6f7\",\n    \"0x04D5ddf5f3a8939889F11E97f8c4BB48317F1938\",\n    \"0xd95ca61CE9aAF2143E81Ef5462C0c2325172E028\",\n    \"0xe31eE12bDFDD0573D634124611e85338e2cBF0cF\",\n    \"0x9B8Df6E244526ab5F6e6400d331DB28C8fdDdb55\",\n    \"0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "uint256",
            "description": "Amount of crypto to repay",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
      "description": "A leading DeFi protocol enabling secure borrowing, lending, and yield generation across multiple assets.",
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
            "type": "uint256",
            "description": "The amount of the asset to supply",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "type": "uint256",
            "description": "The amount of the asset to withdraw. Use type(uint).max for full balance.",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "10000000n"
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
      "description": "An advanced lending and borrowing platform focused on scalable, fast blockchain networks for optimal performance.",
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
            "type": "uint256",
            "description": "Amount of token to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "type": "uint256",
            "description": "Amount of token to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "type": "uint256",
            "description": "Amount of crypto to borrow",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "type": "uint256",
            "description": "Amount of crypto to repay",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
      "description": "Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications.",
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
            "type": "uint256",
            "description": "Amount of crypto to deposit",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "type": "uint256",
            "description": "Amount of crypto to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
      "description": "DeFi needs safe, liquid lending markets and steady stablecoins that drives value to users. We've built that foundation and made it Ironclad.",
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
            "type": "uint256",
            "description": "The amount of the asset to supply",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "100000000n"
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
            "type": "uint256",
            "description": "The amount of the asset to withdraw. Use type(uint).max for full balance.",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
                "value": "10000000n"
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
              "erc20Token": {
                "contractAddress": "{{output.tokenIn}}",
                "chainId": "{{parameters.chainId}}"
              }
            },
            "amountOut": {
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
            "type": "uint256",
            "description": "Amount to sell",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
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
            "description": "Swap 100 USDC to WETH on Mode Network using Odos",
            "parameters": [
              {
                "key": "chainId",
                "value": 34443
              },
              {
                "key": "tokenIn",
                "value": "0xd988097fb8612cc24eeC14542bC03424c656005f"
              },
              {
                "key": "tokenOut",
                "value": "0x4200000000000000000000000000000000000006"
              },
              {
                "key": "amount",
                "value": "100000000n"
              },
              {
                "key": "slippage",
                "value": 1
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