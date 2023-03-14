#!/usr/bin/env sh

set -e

source ./.env

forge test -vv --fork-url ${RPC_URL_MAINNET} --fork-block-number 16342041
