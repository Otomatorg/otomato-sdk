import { Parameter } from '../models/Parameter';

export const TRIGGERS = {
  ERC20: {
    TRANSFER: {
      id: 1,
      name: "Transfer token",
      description: "Transfer an ERC-20 token",
      parameters: [
        {
          key: "chainid",
          type: "int",
          description: "Chain ID of the ETH blockchain"
        },
        {
          key: "abiParams.value",
          type: "uint256",
          description: "Amount of crypto to transfer"
        },
        {
          key: "abiParams.to",
          type: "address",
          description: "Address to transfer crypto to"
        },
        {
          key: "contractAddress",
          type: "address",
          description: "The address from which to send value"
        }
      ] as Parameter[]
    },
    // todo: APPROVAL
  },
  YIELD: {
    SPLICE_FI: {
      SWAP: {
        id: 2,
        name: "Splice Finance Swap",
        description: "Swap in Splice Finance",
        parameters: [
          {
            key: "abiParams.caller",
            type: "address",
            description: "Caller address"
          },
          {
            key: "abiParams.market",
            type: "address",
            description: "Market address"
          },
          {
            key: "abiParams.receiver",
            type: "address",
            description: "Receiver address"
          },
          {
            key: "abiParams.netPtToAccount",
            type: "int256",
            description: "Net PT to account"
          },
          {
            key: "abiParams.netSyToAccount",
            type: "int256",
            description: "Net SY to account"
          }
        ] as Parameter[]
      },
      LIQUIDITY_REMOVED: {
        id: 6,
        name: "Liquidity Removed",
        description: "Liquidity removed in Splice Finance",
        parameters: [
          {
            key: "abiParams.caller",
            type: "address",
            description: "Caller address"
          },
          {
            key: "abiParams.market",
            type: "address",
            description: "Market address"
          },
          {
            key: "abiParams.receiver",
            type: "address",
            description: "Receiver address"
          },
          {
            key: "abiParams.netLpToRemove",
            type: "uint256",
            description: "Net LP to remove"
          },
          {
            key: "abiParams.netPtOut",
            type: "uint256",
            description: "Net PT out"
          },
          {
            key: "abiParams.netSyOut",
            type: "uint256",
            description: "Net SY out"
          }
        ] as Parameter[]
      },
      MARKET_CREATION: {
        id: 7,
        name: "Market Creation",
        description: "Market creation in Splice Finance",
        parameters: [
          {
            key: "abiParams.market",
            type: "address",
            description: "Market address"
          },
          {
            key: "abiParams.PT",
            type: "address",
            description: "PT address"
          },
          {
            key: "abiParams.scalarRoot",
            type: "int256",
            description: "Scalar root"
          },
          {
            key: "abiParams.initialAnchor",
            type: "int256",
            description: "Initial anchor"
          },
          {
            key: "abiParams.lnFeeRateRoot",
            type: "uint256",
            description: "LN fee rate root"
          }
        ] as Parameter[]
      },
      INTEREST_RATE_UPDATE: {
        id: 9,
        name: "Interest Rate Update",
        description: "Interest rate update in Splice Finance",
        parameters: [
          {
            key: "abiParams.timestamp",
            type: "uint256",
            description: "Timestamp"
          },
          {
            key: "abiParams.lastLnImpliedRate",
            type: "int256",
            description: "Last LN implied rate"
          },
          {
            key: "contractAddress",
            type: "address",
            description: "Contract address to monitor",
            enum: [
              "0xDE95511418EBD8Bd36294B11C86314DdFA50e212", // wrsETH
              "0x34cf9BF641bd5f34197060A3f3478a1f97f78f0a", // ezETH
              "0xb950A73Ea0842B0Cd06D0e369aE974799BB346f1", // MODE
              "0xbF14932e1A7962C77D0b31be80075936bE1A43D4"  // weETH
            ]
          }
        ] as Parameter[]
      }
    }
  },
  LENDING: {
    ASTARIA: {
      LEND_RECALLED: {
        id: 8,
        name: "Lend Recalled",
        description: "Lend recalled in Astaria",
        parameters: [
          {
            key: "abiParams.loanId",
            type: "uint256",
            description: "Loan ID"
          },
          {
            key: "abiParams.recaller",
            type: "address",
            description: "Recaller address"
          },
          {
            key: "abiParams.end",
            type: "uint256",
            description: "End time"
          }
        ] as Parameter[]
      }
    }
  },
  DEXES: {
    ODOS: {
      SWAP: {
        id: 4,
        name: "Odos Swap",
        description: "Swap on Odos",
        parameters: [
          {
            key: "chainid",
            type: "int",
            description: "Chain ID of the ETH blockchain"
          },
          {
            key: "abiParams.sender",
            type: "address",
            description: "Sender address"
          },
          {
            key: "abiParams.inputAmount",
            type: "uint256",
            description: "Input amount"
          },
          {
            key: "abiParams.inputToken",
            type: "address",
            description: "Input token address"
          },
          {
            key: "abiParams.amountOut",
            type: "uint256",
            description: "Output amount"
          },
          {
            key: "abiParams.outputToken",
            type: "address",
            description: "Output token address"
          },
          {
            key: "abiParams.exchangeRate",
            type: "float",
            description: "Exchange rate"
          }
        ] as Parameter[]
      }
    }
  },
  SOCIALS: {
    MODE_NAME_SERVICE: {
      NAME_REGISTERED: {
        id: 3,
        name: "Name Registered",
        description: "Name registered in Mode Name Service",
        parameters: [
          {
            key: "abiParams.id",
            type: "uint256",
            description: "ID of the name registered"
          },
          {
            key: "abiParams.owner",
            type: "address",
            description: "Owner address"
          },
          {
            key: "abiParams.expires",
            type: "uint256",
            description: "Expiration time"
          }
        ] as Parameter[]
      }
    }
  }
};