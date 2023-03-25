#!/usr/bin/env sh

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

cd $script_dir/..

abi_content=$(cat "./contracts/out/PinkyPromise.sol/PinkyPromise.json" | jq ".abi")

cat <<EOF > ./src/lib/abis.ts
// File generated by scripts/update-abi.sh
export const PinkyPromiseAbi = ${abi_content} as const;
EOF

dprint fmt ./src/abis.ts > /dev/null 2>&1
