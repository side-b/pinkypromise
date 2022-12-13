#!/usr/bin/env sh

source ./.env

RPC_URL=""
CHAIN_ID=

if [[ "$1" == "local" ]]; then
    RPC_URL=$RPC_URL_LOCAL
    CHAIN_ID="31337"

# elif [[ "$1" == "goerli" ]]; then
#     RPC_URL=$RPC_URL_GOERLI
#     CHAIN_ID="5"

else
    echo "Must provide a network:" 1>&2
    echo "  " 1>&2
    echo "  ./demo.sh <local>" 1>&2
    echo "  " 1>&2
    exit 1
fi

if [[ -z $DEMO_PK1 ]]; then
    echo "DEMO_PK1 must be provided" 1>&2
    exit 1
fi
if [[ -z $DEMO_PK2 ]]; then
    echo "DEMO_PK2 must be provided" 1>&2
    exit 1
fi
if [[ -z $DEMO_PK3 ]]; then
    echo "DEMO_PK3 must be provided" 1>&2
    exit 1
fi

CONTRACT_ADDRESS=$(cat broadcast/PinkyPromise.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkyPromise" and .transactionType == "CREATE") .contractAddress' --raw-output)

if [[ -z $CONTRACT_ADDRESS ]]; then
    echo "Could not find a deployed contract for this chain ID" 1>&2
    exit 1
fi

PINKY_PROMISE_ADDRESS=$CONTRACT_ADDRESS forge script script/CreateDemoPromises.s.sol:CreateDemoPromisesScript --rpc-url $RPC_URL --broadcast
