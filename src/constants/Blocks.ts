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