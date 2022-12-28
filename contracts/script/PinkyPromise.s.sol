// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/PinkyPromise.sol";

contract PinkyPromiseScript is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        new PinkyPromise("Pinky Promise", "PSP");
        vm.stopBroadcast();
    }
}
