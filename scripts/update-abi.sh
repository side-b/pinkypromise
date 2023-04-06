#!/usr/bin/env sh

set -e

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
abi_path=$(realpath "$script_dir/../contracts/out/PinkyPromise.sol/PinkyPromise.json")
abi_ts_path=$(realpath "$script_dir/../src/lib/abis.ts")

abi_content=$(cat "$abi_path" | jq ".abi")

cat <<EOF > "$abi_ts_path"
// File generated by scripts/update-abi.sh
export const PinkyPromiseAbi = ${abi_content} as const;
EOF

dprint fmt "$abi_ts_path" > /dev/null 2>&1

echo "ABI updated in $abi_ts_path"
echo ""
