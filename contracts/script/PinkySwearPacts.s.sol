// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/PinkySwearPacts.sol";

contract PinkySwearPactsScript is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        new PinkySwearPacts("Pinky Swear Pacts", "PSP");
        vm.stopBroadcast();
    }
}
