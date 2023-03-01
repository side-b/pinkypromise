// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";

uint16 constant signeeHeight = 40;

string constant title1 = "Pinky Promise";
// forgefmt: disable-start
string constant body1 = 
    unicode"Pinky, pinky bow-bell,\n"
    unicode"Whoever tells a lie\n"
    unicode"Will sink down to the bad place\n"
    unicode"And never rise up again.";
// forgefmt: disable-end

string constant title2 = "Pinky Promise Longer";
uint16 constant height2 = 1157;
// forgefmt: disable-start
string constant body2 = 
    unicode"A treaty is a formal, legally binding written agreement between actors in international law. It is usually made by and between sovereign states,[1] but can include international organizations, individuals, business entities, and other legal persons.[2][3] A treaty may also be known as an international agreement, protocol, covenant, convention, pact, or exchange of letters, among other terms. However, only documents that are legally binding on the parties are considered treaties under international law.[4] Treaties vary on the basis of obligations (the extent to which states are bound to the rules), precision (the extent to which the rules are unambiguous), and delegation (the extent to which third parties have authority to interpret, apply and make rules).[1][5]\n\n"
    unicode"Treaties are among the earliest manifestations of international relations, with the first known example being a border agreement between the Sumerian city-states of Lagash and Umma around 3100 BC.[6] International agreements were used in some form by most major civilizations, growing in both sophistication and number during the early modern era.[7] The early 19th century saw developments in diplomacy, foreign policy, and international law reflected by the widespread use of treaties. The 1969 Vienna Convention on the Law of Treaties codified these practices, setting forth guidelines and rules for creating, amending, interpreting, and terminating treaties and for resolving disputes and alleged breaches.[8][9] \n";
// forgefmt: disable-end

string constant title3 = "Pinky Promise Longer 2";
uint16 constant height3 = 1293;
// forgefmt: disable-start
string constant body3 = 
    unicode"## A treaty is a formal\n\n"
    unicode"A treaty is a formal, legally binding written agreement between actors in international law. It is usually made by and between sovereign states,[1] but can include international organizations, individuals, business entities, and other legal persons.[2][3] A treaty may also be known as an international agreement, protocol, covenant, convention, pact, or exchange of letters, among other terms. However, only documents that are legally binding on the parties are considered treaties under international law.[4] Treaties vary on the basis of obligations (the extent to which states are bound to the rules), precision (the extent to which the rules are unambiguous), and delegation (the extent to which third parties have authority to interpret, apply and make rules).[1][5]\n\n"
    unicode"## Treaties are among the earliest manifestations\n\n"
    unicode"Treaties are among the earliest manifestations of international relations, with the first known example being a border agreement between the Sumerian city-states of Lagash and Umma around 3100 BC.[6] International agreements were used in some form by most major civilizations, growing in both sophistication and number during the early modern era.[7] The early 19th century saw developments in diplomacy, foreign policy, and international law reflected by the widespread use of treaties. The 1969 Vienna Convention on the Law of Treaties codified these practices, setting forth guidelines and rules for creating, amending, interpreting, and terminating treaties and for resolving disputes and alleged breaches.[8][9] \n";
// forgefmt: disable-end

contract CreateDemoPromisesScript is Script {
    PinkyPromise pp = PinkyPromise(vm.envAddress("PINKY_PROMISE_ADDRESS"));

    uint256 pk1 = vm.envUint("DEMO_PK1");
    uint256 pk2 = vm.envUint("DEMO_PK2");
    uint256 pk3 = vm.envUint("DEMO_PK3");

    function run() external {
        promise1();
        promise2();
        promise3();
        promise4();
        promise5();
        promise6();
    }

    function promise1() internal {
        PinkyPromise.PromiseData memory data;
        data.title = title1;
        data.body = body1;

        // leave as draft
        vm.startBroadcast(pk1);
        pp.newPromise(data, getSignees());
        vm.stopBroadcast();
    }

    function promise2() internal {
        address[] memory signees = getSignees();

        PinkyPromise.PromiseData memory data;
        data.title = title2;
        data.body = body2;
        data.height = height2 + signeeHeight * uint16(signees.length);
        data.color = PinkyPromise.PromiseColor.Electric;

        uint256 id;

        // sign
        vm.startBroadcast(pk1);
        id = pp.newPromise(data, signees);
        vm.stopBroadcast();
        vm.startBroadcast(pk2);
        pp.sign(id);
        vm.stopBroadcast();
        vm.startBroadcast(pk3);
        pp.sign(id);
        vm.stopBroadcast();
    }

    function promise3() internal {
        address[] memory signees = getSignees();

        PinkyPromise.PromiseData memory data;
        data.title = title1;
        data.body = body1;
        data.color = PinkyPromise.PromiseColor.RedAlert;

        uint256 id;

        // sign
        vm.startBroadcast(pk1);
        id = pp.newPromise(data, signees);
        vm.stopBroadcast();
        vm.startBroadcast(pk2);
        pp.sign(id);
        vm.stopBroadcast();
        vm.startBroadcast(pk3);
        pp.sign(id);
        vm.stopBroadcast();

        // nullify
        vm.startBroadcast(pk3);
        pp.nullify(id);
        vm.stopBroadcast();
        vm.startBroadcast(pk2);
        pp.nullify(id);
        vm.stopBroadcast();
        vm.startBroadcast(pk1);
        pp.nullify(id);
        vm.stopBroadcast();
    }

    function promise4() internal {
        address[] memory signees = new address[](1);
        signees[0] = vm.addr(pk1);

        PinkyPromise.PromiseData memory data;
        data.title = title1;
        data.body = body1;

        // sign
        vm.startBroadcast(pk1);
        pp.newPromise(data, signees);
        vm.stopBroadcast();
    }

    function promise5() internal {
        address[] memory signees = new address[](1);
        signees[0] = vm.addr(pk1);

        PinkyPromise.PromiseData memory data;
        data.body = body3;
        data.height = height3 + signeeHeight * uint16(signees.length);
        data.title = title3;
        data.color = PinkyPromise.PromiseColor.Solemn;

        vm.startBroadcast(pk1);
        pp.newPromise(data, signees);
        vm.stopBroadcast();
    }

    function promise6() internal {
        PinkyPromise.PromiseData memory data;
        data.title = title1;
        data.body = body1;

        // leave as draft, only signed by pk2
        vm.startBroadcast(pk2);
        pp.newPromise(data, getSignees());
        vm.stopBroadcast();
    }

    function getSignees() internal view returns (address[] memory signees) {
        signees = new address[](3);
        signees[0] = vm.addr(pk1);
        signees[1] = vm.addr(pk2);
        signees[2] = vm.addr(pk3);
    }
}
