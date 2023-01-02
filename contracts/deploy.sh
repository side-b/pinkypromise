#!/usr/bin/env sh

source ./.env

RPC_URL=""
VERIFY=""
CHAIN_ID=

if [[ "$1" == "local" ]]; then
    RPC_URL=$RPC_URL_LOCAL
    CHAIN_ID="31337"

elif [[ "$1" == "sepolia" ]]; then
    RPC_URL=$RPC_URL_SEPOLIA
    VERIFY="--verify"
    CHAIN_ID="11155111"

elif [[ "$1" == "goerli" ]]; then
    RPC_URL=$RPC_URL_GOERLI
    VERIFY=""
    CHAIN_ID="5"

else
    echo "Must provide a network:" 1>&2
    echo "  " 1>&2
    echo "  ./deploy.sh <local | goerli | sepolia>" 1>&2
    echo "  " 1>&2
    exit 1
fi

forge script script/PinkyPromise.s.sol:PinkyPromiseScript --rpc-url $RPC_URL --broadcast $VERIFY

CONTRACT_ADDRESS=$(cat broadcast/PinkyPromise.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkyPromise" and .transactionType == "CREATE") .contractAddress' --raw-output)

echo ""
echo "    Contract address: ${CONTRACT_ADDRESS}"
echo ""
echo ""
