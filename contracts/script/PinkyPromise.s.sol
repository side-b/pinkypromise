// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Script.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";

contract PinkyPromiseScript is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        new PinkyPromise(
            "Pinky Promise", 
            "PP", 
            vm.envAddress("ENS_REGISTRY"),
            vm.envAddress("BPB_DATETIME")
        );

        vm.stopBroadcast();
    }
}
