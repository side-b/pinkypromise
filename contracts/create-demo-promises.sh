#!/usr/bin/env sh

source ./.env

RPC_URL=""
CHAIN_ID=

if [[ "$1" == "local" ]]; then
    RPC_URL=$RPC_URL_LOCAL
    CHAIN_ID="31337"

elif [[ "$1" == "sepolia" ]]; then
    RPC_URL=$RPC_URL_SEPOLIA
    CHAIN_ID="11155111"
else
    echo "Must provide a network:" 1>&2
    echo "  " 1>&2
    echo "  ./create-demo-promises.sh <local | sepolia>" 1>&2
    echo "  " 1>&2
    exit 1
fi

if [[ -z $SIGNEE1_PK ]]; then
    echo "SIGNEE1_PK must be provided" 1>&2
    exit 1
fi
if [[ -z $SIGNEE2_PK ]]; then
    echo "SIGNEE2_PK must be provided" 1>&2
    exit 1
fi
if [[ -z $SIGNEE3_PK ]]; then
    echo "SIGNEE3_PK must be provided" 1>&2
    exit 1
fi

CONTRACT_ADDRESS=$(cat broadcast/PinkyPromise.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkyPromise" and .transactionType == "CREATE") .contractAddress' --raw-output)

if [[ -z $CONTRACT_ADDRESS ]]; then
    echo "Could not find the latest deployment address" 1>&2
    exit 1
fi

PINKY_PROMISE_ADDRESS=$CONTRACT_ADDRESS forge script script/CreateDemoPromises.s.sol:CreateDemoPromisesScript --rpc-url $RPC_URL --broadcast -vvvv
