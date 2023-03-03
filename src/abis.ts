// File generated by scripts/update-abi.sh
export const PinkyPromiseAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "networkPrefix_",
        "type": "string",
      },
      {
        "internalType": "address",
        "name": "ensRegistry_",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "bpbDateTime_",
        "type": "address",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "signer",
        "type": "address",
      },
    ],
    "name": "AddSignature",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256",
      },
    ],
    "name": "Approval",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address",
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool",
      },
    ],
    "name": "ApprovalForAll",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "signer",
        "type": "address",
      },
    ],
    "name": "CancelNullifyRequest",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      },
    ],
    "name": "Locked",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "signer",
        "type": "address",
      },
    ],
    "name": "NullifyRequest",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address",
      },
    ],
    "name": "OwnershipTransferred",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "enum PinkyPromise.PromiseState",
        "name": "state",
        "type": "uint8",
      },
    ],
    "name": "PromiseUpdate",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address",
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256",
      },
    ],
    "name": "Transfer",
    "type": "event",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      },
    ],
    "name": "Unlocked",
    "type": "event",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256",
      },
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "bpbDateTime",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "cancelNullify",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "discard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "ensRegistry",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "latestPromiseId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "latestTokenId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      },
    ],
    "name": "locked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "enum PinkyPromise.PromiseColor",
            "name": "color",
            "type": "uint8",
          },
          {
            "internalType": "uint16",
            "name": "height",
            "type": "uint16",
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string",
          },
          {
            "internalType": "string",
            "name": "body",
            "type": "string",
          },
        ],
        "internalType": "struct PinkyPromise.PromiseData",
        "name": "promiseData",
        "type": "tuple",
      },
      {
        "internalType": "address[]",
        "name": "signees",
        "type": "address[]",
      },
    ],
    "name": "newPromise",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "nullify",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256",
      },
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "promiseAsSvg",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "promiseIdsBySignee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "promiseIdsByTokenId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "promiseImageURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "promiseInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum PinkyPromise.PromiseColor",
            "name": "color",
            "type": "uint8",
          },
          {
            "internalType": "uint16",
            "name": "height",
            "type": "uint16",
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string",
          },
          {
            "internalType": "string",
            "name": "body",
            "type": "string",
          },
        ],
        "internalType": "struct PinkyPromise.PromiseData",
        "name": "data",
        "type": "tuple",
      },
      {
        "internalType": "enum PinkyPromise.PromiseState",
        "name": "state",
        "type": "uint8",
      },
      {
        "internalType": "address[]",
        "name": "signees",
        "type": "address[]",
      },
      {
        "internalType": "enum PinkyPromise.SigningState[]",
        "name": "signingStates",
        "type": "uint8[]",
      },
      {
        "internalType": "uint256",
        "name": "signedOn",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "promiseMetadataURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "promiseSignees",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "signees",
        "type": "address[]",
      },
      {
        "internalType": "enum PinkyPromise.SigningState[]",
        "name": "signingStates",
        "type": "uint8[]",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "promiseState",
    "outputs": [
      {
        "internalType": "enum PinkyPromise.PromiseState",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "promises",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum PinkyPromise.PromiseColor",
            "name": "color",
            "type": "uint8",
          },
          {
            "internalType": "uint16",
            "name": "height",
            "type": "uint16",
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string",
          },
          {
            "internalType": "string",
            "name": "body",
            "type": "string",
          },
        ],
        "internalType": "struct PinkyPromise.PromiseData",
        "name": "data",
        "type": "tuple",
      },
      {
        "internalType": "uint256",
        "name": "signedOn",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "state",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes",
      },
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address",
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool",
      },
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bpbDateTime_",
        "type": "address",
      },
    ],
    "name": "setBpbDateTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ensRegistry_",
        "type": "address",
      },
    ],
    "name": "setEnsRegistry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "promiseId",
        "type": "uint256",
      },
    ],
    "name": "sign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "signee",
        "type": "address",
      },
    ],
    "name": "signeePromises",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "promiseIds",
        "type": "uint256[]",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
    ],
    "name": "signingStatesByPromise",
    "outputs": [
      {
        "internalType": "enum PinkyPromise.SigningState",
        "name": "",
        "type": "uint8",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "stop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "stopped",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4",
      },
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256",
      },
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "total",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "pure",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address",
      },
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
] as const;
