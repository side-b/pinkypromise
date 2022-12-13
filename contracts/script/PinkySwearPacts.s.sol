// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/PinkySwearPacts.sol";

contract PinkySwearPactsScript is Script {
    function setUp() public {}

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        PinkySwearPacts psp = new PinkySwearPacts("Pinky Swear Pacts", "PSP");

        vm.stopBroadcast();
    }
}
