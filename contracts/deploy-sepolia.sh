#!/usr/bin/env sh

source ./.env

forge script script/PinkySwearPacts.s.sol:PinkySwearPactsScript --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
