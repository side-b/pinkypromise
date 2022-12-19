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
else
    echo "Must provide a network:" 1>&2
    echo "  " 1>&2
    echo "  ./deploy.sh <local | sepolia>" 1>&2
    echo "  " 1>&2
    exit 1
fi

forge script script/PinkySwearPacts.s.sol:PinkySwearPactsScript --rpc-url $RPC_URL --broadcast $VERIFY

CONTRACT_ADDRESS=$(cat broadcast/PinkySwearPacts.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkySwearPacts" and .transactionType == "CREATE") .contractAddress' --raw-output)

echo ""
echo "    Contract address: ${CONTRACT_ADDRESS}"
echo ""
echo ""
