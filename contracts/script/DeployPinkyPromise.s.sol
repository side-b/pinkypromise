// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Script.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";

contract DeployPinkyPromiseScript is Script {
    function run() external {
        if (vm.envBytes("DEPLOYER").length == 20) {
            vm.startBroadcast(vm.envAddress("DEPLOYER"));
        } else {
            vm.startBroadcast(vm.envUint("DEPLOYER"));
        }

        new PinkyPromise(
            vm.envString("NETWORK_PREFIX"),
            vm.envAddress("ENS_REGISTRY"),
            vm.envAddress("BPB_DATETIME")
        );

        vm.stopBroadcast();
    }
}
