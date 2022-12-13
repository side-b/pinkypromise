#!/usr/bin/env sh

source ./.env

CHAIN_ID=
ENS_REGISTRY=
BPB_DATETIME=
RPC_URL=""
VERIFY=""

if [[ "$1" == "local" ]]; then
    CHAIN_ID="31337"
    BPB_DATETIME=$BPB_DATETIME_LOCAL
    ENS_REGISTRY=$ENS_REGISTRY_LOCAL
    RPC_URL=$RPC_URL_LOCAL

elif [[ "$1" == "goerli" ]]; then
    CHAIN_ID="5"
    BPB_DATETIME=$BPB_DATETIME_GOERLI
    ENS_REGISTRY=$ENS_REGISTRY_GOERLI
    RPC_URL=$RPC_URL_GOERLI
    VERIFY="--verify"

else
    echo "Must provide a network:" 1>&2
    echo "  " 1>&2
    echo "  ./deploy.sh <local | goerli>" 1>&2
    echo "  " 1>&2
    exit 1
fi

export ENS_REGISTRY
export BPB_DATETIME

forge script script/PinkyPromise.s.sol:PinkyPromiseScript --rpc-url $RPC_URL --broadcast $VERIFY

CONTRACT_ADDRESS=$(cat broadcast/PinkyPromise.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkyPromise" and .transactionType == "CREATE") .contractAddress' --raw-output)

echo ""
echo "    Contract address: ${CONTRACT_ADDRESS}"
echo ""
echo ""
