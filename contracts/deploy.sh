#!/usr/bin/env sh

source ./.env

CHAIN_ID=
ENS_REGISTRY=
RPC_URL=""
VERIFY=""

if [[ "$1" == "local" ]]; then
    CHAIN_ID="31337"
    ENS_REGISTRY=$ENS_REGISTRY_LOCAL
    RPC_URL=$RPC_URL_LOCAL

elif [[ "$1" == "sepolia" ]]; then
    CHAIN_ID="11155111"
    ENS_REGISTRY=$ENS_REGISTRY_SEPOLIA
    RPC_URL=$RPC_URL_SEPOLIA
    VERIFY="--verify"

elif [[ "$1" == "goerli" ]]; then
    CHAIN_ID="5"
    ENS_REGISTRY=$ENS_REGISTRY_GOERLI
    RPC_URL=$RPC_URL_GOERLI
    VERIFY=""

else
    echo "Must provide a network:" 1>&2
    echo "  " 1>&2
    echo "  ./deploy.sh <local | goerli | sepolia>" 1>&2
    echo "  " 1>&2
    exit 1
fi

export ENS_REGISTRY

forge script script/PinkyPromise.s.sol:PinkyPromiseScript --rpc-url $RPC_URL --broadcast $VERIFY

CONTRACT_ADDRESS=$(cat broadcast/PinkyPromise.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkyPromise" and .transactionType == "CREATE") .contractAddress' --raw-output)

echo ""
echo "    Contract address: ${CONTRACT_ADDRESS}"
echo ""
echo ""
