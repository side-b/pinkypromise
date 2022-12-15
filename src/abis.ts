export const PinkySwearPactsAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string",
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "constructor",
  },
  {
    "inputs": [],
    "name": "InvalidPactState",
    "type": "error",
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pactId",
        "type": "uint256",
      },
      {
        "indexed": false,
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
        "indexed": false,
        "internalType": "uint256",
        "name": "pactId",
        "type": "uint256",
      },
      {
        "indexed": false,
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
        "indexed": false,
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
        "indexed": false,
        "internalType": "uint256",
        "name": "pactId",
        "type": "uint256",
      },
      {
        "indexed": false,
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
        "indexed": false,
        "internalType": "uint256",
        "name": "pactId",
        "type": "uint256",
      },
      {
        "indexed": false,
        "internalType": "enum PinkySwearPacts.PactState",
        "name": "state",
        "type": "uint8",
      },
    ],
    "name": "PactUpdate",
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
        "indexed": false,
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pactId",
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
        "name": "pactId",
        "type": "uint256",
      },
    ],
    "name": "discard",
    "outputs": [],
    "stateMutability": "nonpayable",
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
            "internalType": "enum PinkySwearPacts.PactColor",
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
            "name": "text",
            "type": "string",
          },
        ],
        "internalType": "struct PinkySwearPacts.PactData",
        "name": "pactData",
        "type": "tuple",
      },
      {
        "internalType": "address[]",
        "name": "signees",
        "type": "address[]",
      },
    ],
    "name": "newPact",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "pactId",
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
        "name": "pactId",
        "type": "uint256",
      },
    ],
    "name": "nullify",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "name": "pactId",
        "type": "uint256",
      },
    ],
    "name": "pactAsSvg",
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
        "name": "pactId",
        "type": "uint256",
      },
    ],
    "name": "pactInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum PinkySwearPacts.PactColor",
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
            "name": "text",
            "type": "string",
          },
        ],
        "internalType": "struct PinkySwearPacts.PactData",
        "name": "data",
        "type": "tuple",
      },
      {
        "internalType": "enum PinkySwearPacts.PactState",
        "name": "state",
        "type": "uint8",
      },
      {
        "internalType": "address[]",
        "name": "signees",
        "type": "address[]",
      },
      {
        "internalType": "enum PinkySwearPacts.SigningState[]",
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
        "name": "pactId",
        "type": "uint256",
      },
    ],
    "name": "pactState",
    "outputs": [
      {
        "internalType": "enum PinkySwearPacts.PactState",
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
        "internalType": "address",
        "name": "from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256",
      },
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256",
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes",
      },
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "internalType": "uint256",
        "name": "pactId",
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
        "internalType": "uint256",
        "name": "pactId",
        "type": "uint256",
      },
    ],
    "name": "signeesStates",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "signees",
        "type": "address[]",
      },
      {
        "internalType": "enum PinkySwearPacts.SigningState[]",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256",
      },
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
] as const;
