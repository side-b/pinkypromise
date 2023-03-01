// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";

contract PinkyPromiseScript is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        PinkyPromise pp = new PinkyPromise("Pinky Promise", "PSP");
        pp.setEnsRegistry(vm.envAddress("ENS_REGISTRY"));
        pp.setBpbDateTime(vm.envAddress("BPB_DATETIME"));

        vm.stopBroadcast();
    }
}
