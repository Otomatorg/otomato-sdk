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
            "category": 0
          },
        ] as Parameter[],
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
        "output": {
          "caller": "address",
          "market": "address",
          "receiver": "address",
          "netPtToAccount": "int256",
          "netSyToAccount": "int256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "abiParams.caller",
            "type": "address",
            "description": "Caller address",
            "category": 1
          },
          {
            "key": "abiParams.market",
            "type": "address",
            "description": "Market address",
            "category": 1
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "Receiver address",
            "category": 1
          },
          {
            "key": "abiParams.netPtToAccount",
            "type": "int256",
            "description": "Net PT to account",
            "category": 1
          },
          {
            "key": "abiParams.netSyToAccount",
            "type": "int256",
            "description": "Net SY to account",
            "category": 1
          },
        ] as Parameter[],
        "examples": [],
        "blockId": 2,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
      },
      "LIQUIDITY_REMOVED": {
        "name": "Liquidity Removed",
        "description": "Liquidity removed in Splice Finance",
        "type": 0,
        "contractAddress": "0x7A3a94AE0fC1421A3eac23eA6371036ac8d8f448",
        "output": {
          "caller": "address",
          "market": "address",
          "receiver": "address",
          "netLpToRemove": "uint256",
          "netPtOut": "uint256",
          "netSyOut": "uint256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "abiParams.caller",
            "type": "address",
            "description": "Caller address",
            "category": 1
          },
          {
            "key": "abiParams.market",
            "type": "address",
            "description": "Market address",
            "category": 1
          },
          {
            "key": "abiParams.receiver",
            "type": "address",
            "description": "Receiver address",
            "category": 1
          },
          {
            "key": "abiParams.netLpToRemove",
            "type": "uint256",
            "description": "Net LP to remove",
            "category": 1
          },
          {
            "key": "abiParams.netPtOut",
            "type": "uint256",
            "description": "Net PT out",
            "category": 1
          },
          {
            "key": "abiParams.netSyOut",
            "type": "uint256",
            "description": "Net SY out",
            "category": 1
          },
        ] as Parameter[],
        "examples": [],
        "blockId": 6,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
      },
      "MARKET_CREATION": {
        "name": "Market Creation",
        "description": "Market creation in Splice Finance",
        "type": 0,
        "contractAddress": "0x7A3a94AE0fC1421A3eac23eA6371036ac8d8f448",
        "output": {
          "market": "address",
          "PT": "erc20",
          "scalarRoot": "int256",
          "initialAnchor": "int256",
          "lnFeeRateRoot": "uint256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "abiParams.market",
            "type": "address",
            "description": "Market address",
            "category": 1
          },
          {
            "key": "abiParams.PT",
            "type": "address",
            "description": "PT address",
            "category": 1
          },
          {
            "key": "abiParams.scalarRoot",
            "type": "int256",
            "description": "Scalar root",
            "category": 1
          },
          {
            "key": "abiParams.initialAnchor",
            "type": "int256",
            "description": "Initial anchor",
            "category": 1
          },
          {
            "key": "abiParams.lnFeeRateRoot",
            "type": "uint256",
            "description": "LN fee rate root",
            "category": 1
          },
        ] as Parameter[],
        "examples": [],
        "blockId": 7,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
      },
      "INTEREST_RATE_UPDATE": {
        "name": "Interest Rate Update",
        "description": "Interest rate update in Splice Finance",
        "type": 0,
        "contractAddress": "0x7A3a94AE0fC1421A3eac23eA6371036ac8d8f448",
        "output": {
          "timestamp": "uint256",
          "lastLnImpliedRate": "int256",
          "transactionHash": "string"
        },
        "parameters": [
          {
            "key": "abiParams.timestamp",
            "type": "uint256",
            "description": "Timestamp",
            "category": 1
          },
          {
            "key": "abiParams.lastLnImpliedRate",
            "type": "int256",
            "description": "Last LN implied rate",
            "category": 1
          },
          {
            "key": "contractAddress",
            "type": "erc20",
            "description": "Token to monitor",
            "mandatory": true,
            "enum": [
              "0xDE95511418EBD8Bd36294B11C86314DdFA50e212",
              "0x34cf9BF641bd5f34197060A3f3478a1f97f78f0a",
              "0xb950A73Ea0842B0Cd06D0e369aE974799BB346f1",
              "0xbF14932e1A7962C77D0b31be80075936bE1A43D4"
            ],
            "category": 0
          },
        ] as Parameter[],
        "examples": [],
        "blockId": 9,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/splicefi.png"
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
      "description": "Aave",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.jpg",
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
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
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
        "blockId": 19,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.jpg"
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
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
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
        "blockId": 20,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.jpg"
      }
    },
    "MOONWELL": {
      "description": "#1 money market for Yield Bearing Assets on the OP Superchain",
      "chains": [
        34443,
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg",
      "LENDING_RATE": {
        "name": "Lending rate",
        "description": "Get the lending rate of any asset on Moonwell",
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
            "key": "lendingRateToken",
            "type": "erc20",
            "description": "The token you want to fetch the yield",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.token",
            "type": "erc20",
            "description": "The token you want to fetch the yield",
            "mandatory": true,
            "hideInUI": true,
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
        "blockId": 21,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg"
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
            "key": "borrowingRateToken",
            "type": "erc20",
            "description": "The token you want to fetch the borrow rate for",
            "mandatory": true,
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.token",
            "type": "erc20",
            "description": "The token you want to fetch the borrow rate for",
            "mandatory": true,
            "hideInUI": true,
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
        "blockId": 22,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg"
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
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.png",
      "SWAP": {
        "name": "Odos Swap",
        "description": "Swap on Odos",
        "type": 0,
        "contractAddress": "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874",
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
      "description": "The NFT marketplace for pro traders",
      "chains": [
        1
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/blur.jpg"
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
        "contractAddress": "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874",
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenIn}}",
            "amount": "{{parameters.amount}}",
            "to": "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874"
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
          "transactionHash": "string"
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
          "approvedTargets": [
            "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874",
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
      "description": "Split a branch in multiple ones",
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/split.png",
      "SPLIT": {
        "name": "Split",
        "type": 4,
        "description": "Split a branch in multiples ones",
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
          {}
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
        "name": "Lend asset",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
            "type": 1,
            "conditions": [],
            "parameters": {
              "chainId": "{{parameters.chainId}}",
              "abi": {
                "parameters": {
                  "tokens": [
                    "{{parameters.tokenToDeposit}}"
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
        "name": "Withdraw asset",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "uint256",
            "description": "Amount of crypto to withdraw",
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
          }
        ],
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
        "checks": [
          {
            "type": 0,
            "chainId": "{{parameters.chainId}}",
            "contractAddress": "{{before.contractAddress}}",
            "amount": "{{parameters.abi.parameters.amount}}"
          }
        ],
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\"\n  ],\n  \"34443\": [\n    \"0xf0F161fDA2712DB8b566946122a5af183995e2eD\",\n    \"0xd988097fb8612cc24eeC14542bC03424c656005f\",\n    \"0x2416092f143378750bb29b79eD961ab195CcEea5\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF\",\n    \"0x80137510979822322193FC997d400D5A6C747bf7\",\n    \"0xe7903B1F75C534Dd8159b313d92cDCfbC62cB3Cd\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x59889b7021243dB5B1e065385F918316cD90D46c\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
          "approvedTargets": [
            "{{before.contractAddress}}"
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
        "contractAddress": "0xFB3323E24743Caf4ADD0fDCCFB268565c0685556",
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
          "approvedTargets": [
            "0xFB3323E24743Caf4ADD0fDCCFB268565c0685556"
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
    "ETHER_FI": {
      "description": "Liquid restaking on Ethereum",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/etherfi.jpg"
    },
    "RENZO": {
      "description": "Liquid restaking on Ethereum",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/renzo.jpg"
    },
    "AAVE": {
      "description": "Decentralized lending protocol",
      "chains": [
        8453,
        534352
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png",
      "SUPPLY": {
        "name": "Supply Asset to Aave",
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
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
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
            "mandatory": true,
            "hideInUI": true,
            "category": 1,
            "value": "{{user.smartAccountAddress}}"
          },
          {
            "key": "abiParams.referralCode",
            "type": "uint16",
            "description": "Referral code (use 0, as inactive)",
            "mandatory": true,
            "hideInUI": true,
            "category": 1,
            "value": 0
          },
        ] as Parameter[],
        "requiredApprovals": [
          {
            "address": "{{parameters.abi.parameters.asset}}",
            "amount": "{{parameters.abi.parameters.amount}}",
            "to": "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5"
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
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
          "approvedTargets": [
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
            "enum": "\n        (env) => {\n            if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n\n            return availableLendingTokens[env.parameters.chainId] || [];\n    }",
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
            "mandatory": true,
            "category": 0,
            "hideInUI": true,
            "default": "{{user.smartAccountAddress}}"
          },
        ] as Parameter[],
        "output": {
          "transactionHash": "string",
          "amountWithdrawn": "uint256"
        },
        "permissions": {
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Withdraw {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}} from Aave"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.abi.parameters.asset}})}}"
          ]
        },
        "blockId": 100021,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/aave.png"
      }
    },
    "MOONWELL": {
      "description": "Put your digital assets to work. Lend or borrow to handle whatever life throws your way. Pay it back on your own schedule, with no monthly payments or additional fees.",
      "chains": [
        8453
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg",
      "DEPOSIT": {
        "name": "Lend asset",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
            "id": 100012,
            "type": 1,
            "conditions": [],
            "parameters": {
              "chainId": "{{parameters.chainId}}",
              "abi": {
                "parameters": {
                  "tokens": [
                    "{{parameters.tokenToDeposit}}"
                  ]
                }
              }
            }
          }
        ],
        "blockId": 100022,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg"
      },
      "WITHDRAW": {
        "name": "Withdraw asset",
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
            "category": 0
          },
          {
            "key": "abiParams.amount",
            "type": "uint256",
            "description": "Amount of crypto to withdraw",
            "mandatory": true,
            "category": 0,
            "erc20FormattedAmount": {
              "contractAddress": "{{parameters.tokenToWithdraw}}",
              "chain": "{{parameters.chainId}}"
            }
          },
        ] as Parameter[],
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
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
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg"
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
        "requiredApprovals": [],
        "output": {
          "transactionHash": "string"
        },
        "permissions": {
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
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg"
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
            "enum": "\n    (env) => {\n        if (!env.parameters.chainId)\n            throw new Error('You need to provide the chainId first');\n        \n        const availableTokens = {\n  \"8453\": [\n    \"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\",\n    \"0x4200000000000000000000000000000000000006\",\n    \"0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22\",\n    \"0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452\",\n    \"0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A\",\n    \"0x940181a94a35a4569e4529a3cdfb74e38fd98631\",\n    \"0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf\",\n    \"0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42\"\n  ]\n};\n        const chainId = env.parameters.chainId;\n        return availableTokens[chainId] || [];\n    }",
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
          "approvedTargets": [
            "{{before.contractAddress}}"
          ],
          "label": [
            "Repay {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToRepay}})}} on MOONWELL"
          ],
          "labelNotAuthorized": [
            "Transfer {{tokenSymbol({{parameters.chainId}}, {{parameters.tokenToRepay}})}}"
          ]
        },
        "blockId": 100025,
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg"
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
        "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/moonwell.jpg"
      }
    }
  },
  "SWAP": {
    "ODOS": {
      "description": "Smart Order Routing across multiple blockchain protocols, 700+ Liquidity Sources and thousands of token pairs, delivering ultimate savings to users",
      "chains": [
        34443
      ],
      "image": "https://otomato-sdk-images.s3.eu-west-1.amazonaws.com/odos.png",
      "SWAP": {
        "name": "Odos swap",
        "description": "Swap on Odos to get the best market rates accross multiple pools",
        "type": 1,
        "contractAddress": "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874",
        "requiredApprovals": [
          {
            "address": "{{parameters.tokenIn}}",
            "amount": "{{parameters.amount}}",
            "to": "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874"
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
          "transactionHash": "string"
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
          "approvedTargets": [
            "0x7E15EB462cdc67Cf92Af1f7102465a8F8c784874",
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