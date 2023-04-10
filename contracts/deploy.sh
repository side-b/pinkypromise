#!/usr/bin/env sh

set -e

source ./.env

CHAIN_ID=
NETWORK_PREFIX=
ENS_REGISTRY=
BPB_DATETIME=
RPC_URL=""
VERIFY=""
LEDGER=""
ETHERSCAN_API_KEY=""
VERIFIER_URL=""

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
    ETHERSCAN_API_KEY=$ETHERSCAN_API_KEY_GOERLI

elif [[ "$1" == "polygon" ]]; then
    CHAIN_ID="137"
    NETWORK_PREFIX=$NETWORK_PREFIX_POLYGON
    BPB_DATETIME=$BPB_DATETIME_POLYGON
    ENS_REGISTRY=$ENS_REGISTRY_POLYGON
    RPC_URL=$RPC_URL_POLYGON
    ETHERSCAN_API_KEY=$ETHERSCAN_API_KEY_POLYGON
    VERIFIER_URL="--verifier-url https://api.polygonscan.com/api/"

elif [[ "$1" == "mainnet" ]]; then
    CHAIN_ID="1"
    NETWORK_PREFIX=$NETWORK_PREFIX_MAINNET
    BPB_DATETIME=$BPB_DATETIME_MAINNET
    ENS_REGISTRY=$ENS_REGISTRY_MAINNET
    RPC_URL=$RPC_URL_MAINNET
    ETHERSCAN_API_KEY=$ETHERSCAN_API_KEY_MAINNET

else
    echo "Must provide a network:" 1>&2
    echo "  " 1>&2
    echo "  ./deploy.sh <local | goerli | polygon mainnet>" 1>&2
    echo "  " 1>&2
    exit 1
fi

# If DEPLOYER is an address, sign with a ledger
if [[ $(echo -n $DEPLOYER | wc -c) == 42 ]]; then
    echo "Using --ledger"
    if [[ -n "$DEPLOYER_PATH" ]]; then
        LEDGER="--ledger $DEPLOYER --sender $DEPLOYER --hd-paths $DEPLOYER_PATH"
    else
        LEDGER="--ledger $DEPLOYER --sender $DEPLOYER"
    fi
fi

if [[ -n "$ETHERSCAN_API_KEY" ]]; then
    echo "Using --verify"
    VERIFY="--verify $VERIFIER_URL --etherscan-api-key $ETHERSCAN_API_KEY"
fi

export NETWORK_PREFIX
export ENS_REGISTRY
export BPB_DATETIME

forge script \
    script/DeployPinkyPromise.s.sol:DeployPinkyPromiseScript \
    --chain-id $CHAIN_ID \
    --rpc-url $RPC_URL \
    --broadcast \
    $LEDGER \
    $VERIFY \
    -vvvv

CONTRACT_ADDRESS=$(cat broadcast/DeployPinkyPromise.s.sol/$CHAIN_ID/run-latest.json | jq '.transactions[] | select(.contractName == "PinkyPromise" and .transactionType == "CREATE") .contractAddress' --raw-output)

echo ""
echo "  Contracts deployed."
echo ""
echo "  ChainID: $CHAIN_ID"
echo "  PinkyPromise Contract: $CONTRACT_ADDRESS"
echo "  ENS registry Contract: $ENS_REGISTRY"
echo "  BPB DateTime Contract: $BPB_DATETIME"
echo "  Network prefix: $NETWORK_PREFIX"
echo ""
