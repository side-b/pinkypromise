// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/PinkySwearPacts.sol";

// forgefmt: disable-start
string constant text1 = 
    unicode"Pinky, pinky bow-bell,\n"
    unicode"Whoever tells a lie\n"
    unicode"Will sink down to the bad place\n"
    unicode"And never rise up again.";
// forgefmt: disable-end

contract CreateDemoPactsScript is Script {
    function run() external {
        uint256 pk1 = vm.envUint("SIGNEE1_PK");
        uint256 pk2 = vm.envUint("SIGNEE2_PK");
        uint256 pk3 = vm.envUint("SIGNEE3_PK");
        address pspAddr = vm.envAddress("PINKY_SWEAR_PACTS_ADDRESS");

        PinkySwearPacts psp = PinkySwearPacts(pspAddr);

        PinkySwearPacts.PactData memory pactData;
        pactData.height = 900;
        pactData.color = PinkySwearPacts.PactColor.BubbleGum;
        pactData.text = text1;

        address[] memory signees = new address[](2);
        signees[0] = vm.addr(pk1);
        signees[1] = vm.addr(pk2);

        vm.startBroadcast(pk1);
        psp.newPact(pactData, signees);
        vm.stopBroadcast();
    }
}
