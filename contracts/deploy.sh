#!/usr/bin/env sh

set -e

source ./.env

CHAIN_ID=
NETWORK_PREFIX=
ENS_REGISTRY=
BPB_DATETIME=
RPC_URL=""
VERIFY=""

if [[ "$1" == "local" ]]; then
    CHAIN_ID="31337"
    NETWORK_PREFIX=$NETWORK_PREFIX_MAINNET
    BPB_DATETIME=$BPB_DATETIME_LOCAL
    ENS_REGISTRY=$ENS_REGISTRY_LOCAL
    RPC_URL=$RPC_URL_LOCAL

elif [[ "$1" == "goerli" ]]; then
    CHAIN_ID="5"
    NETWORK_PREFIX=$NETWORK_PREFIX_GOERLI
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

export NETWORK_PREFIX
export ENS_REGISTRY
export BPB_DATETIME

forge script \
    script/DeployPinkyPromise.s.sol:DeployPinkyPromiseScript \
    --rpc-url $RPC_URL \
    --broadcast \
    $VERIFY \
    -vvvv

CONTRACT_ADDRESS=$(cat broadcast/DeployPinkyPromise.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkyPromise" and .transactionType == "CREATE") .contractAddress' --raw-output)

echo ""
echo "    Contract deployed: 👉 ${CONTRACT_ADDRESS}"
echo ""
echo ""
