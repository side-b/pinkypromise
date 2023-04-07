#!/usr/bin/env sh

set -e

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
tsconfig_path=$(realpath "$script_dir/../tsconfig.tsx.json")
codegen_script_path=$(realpath "$script_dir/codegen-PinkyPromiseSvg.sol.tsx")
solidity_file_path=$(realpath "$script_dir/../contracts/src/PinkyPromiseSvg.sol")

tsx --tsconfig "$tsconfig_path" "$codegen_script_path" > "$solidity_file_path"
forge fmt "$solidity_file_path"

echo "Updated $solidity_file_path"
echo ""
