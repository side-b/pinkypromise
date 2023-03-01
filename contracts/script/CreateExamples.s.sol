// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";
import {HexStrings} from "src/lib/HexStrings.sol";

uint16 constant signeeHeight = 40;

contract CreateExamplesScript is Script {
    PinkyPromise pp = PinkyPromise(vm.envAddress("PINKY_PROMISE_ADDRESS"));

    uint256 pk1 = vm.envUint("DEMO_PK1");
    uint256 pk2 = vm.envUint("DEMO_PK2");
    uint256 pk3 = vm.envUint("DEMO_PK3");

    function run() external {
        ex1();
        ex2();
        ex3();
        ex4();
        ex5();
        ex6();
        ex7();
    }

    function broadcastPromise(uint256 as_, PinkyPromise.PromiseData memory data, address[] memory addresses)
        public
        returns (uint256 id)
    {
        vm.startBroadcast(as_);
        id = pp.newPromise(data, addresses);
        vm.stopBroadcast();
    }

    function broadcastSign(uint256 as_, uint256 id) public {
        vm.startBroadcast(as_);
        pp.sign(id);
        vm.stopBroadcast();
    }

    function ex1() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"This year, no more:";
        // forgefmt: disable-start
        data.body =
            unicode"People-pleasing,\n"
            unicode"toxic relationships,\n"
            unicode"fake friendships,\n"
            unicode"self-doubts and excuses.";
        // forgefmt: disable-end
        data.color = PinkyPromise.PromiseColor.Pinky;

        address[] memory addrs = new address[](1);
        addrs[0] = vm.addr(pk1);

        broadcastPromise(pk1, data, addrs);
    }

    function ex2() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"I don’t call them new year’s resolutions";
        data.body =
            unicode"I prefer the term “casual promises to myself that I am under no legal obligation to fulfil”.";
        data.color = PinkyPromise.PromiseColor.Electric;

        address[] memory addrs = new address[](1);
        addrs[0] = vm.addr(pk1);

        broadcastPromise(pk1, data, addrs);
    }

    function ex3() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"dc9992d1aae1dfc29d2dd302442171218099e656882ef8b78907b1af8912678b";
        data.body = unicode"c77b82d3672086147b5f4d67b2d6fde924e55475919247d13802abe8fb7e373e";
        data.color = PinkyPromise.PromiseColor.Electric;

        address[] memory addrs = new address[](3);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);
        addrs[2] = vm.addr(pk3);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
        broadcastSign(pk3, id);
    }

    function ex4() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"kenkouDAO x LongLifeLabs – a natural symbiosis";
        data.body =
            unicode"kenkouDAO and LongLifeLabs are driven by a shared goal to enable progress in the life sciences and biotechnology by breaking down the barriers that slow experimentation.\n\n"
            unicode"This partnership brings LongLifeLabs’s extensive CRO network and expertise in experimental outsourcing into the kenkouDAO community. Together, kenkouDAO and LongLifeLabs will continue to build on the mission to accelerate the transformation of ideas into biological insight.";
        data.color = PinkyPromise.PromiseColor.Pinky;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }

    function ex5() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"Dave x Omni Brew #1";
        // forgefmt: disable-start
        data.body=
            unicode"Dave will brew 6000 liters of his “Pretty Pale Dave Ale” for Omni Brew by September 2023, delivered in 30L kegs.* Omni Brew will pay Dave 4000 DAI for every 1000 liters delivered.\n\n"
            unicode"*Kegs to be returned or bought (50 DAI / keg).";
    // forgefmt: disable-end
        data.color = PinkyPromise.PromiseColor.RedAlert;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }

    function ex6() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"BFFL";
        data.body = unicode"You and me\npromise\nwe’ll be best friends\nfor life 👩‍❤️‍👩";
        data.color = PinkyPromise.PromiseColor.Pinky;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }

    function ex7() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"Co-creators partnership agreement";
        data.body =
            unicode"This pact is created between the following parties: 0x4675C7e5BaAFBFFbca748158bEcBA61ef3b0a263 (Creator 1) and 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 (Creator 2), collectively referred to as “the parties”.\n\n"
            unicode"Whereas, the parties wish to associate themselves as co-creators or partners in a business enterprise and will share the profits equally, realised from the sale of any products and/or services provided by this partnership.";
        data.color = PinkyPromise.PromiseColor.Solemn;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }
}
