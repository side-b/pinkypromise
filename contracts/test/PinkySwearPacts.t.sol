// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/PinkySwearPacts.sol";

bytes4 constant ERC5192ID = 0xb45a3c0e;

string constant text1 = unicode"# Pact of the Norsemen\n\n"
    unicode"The Norsemen entering the pact of foster brotherhood (Icelandic: Fóstbræðralag)\n\n"
    unicode"## Article 1\n\n"
    unicode"involved a rite in which they let their blood flow while they ducked underneath an arch formed by a strip of turf propped up by a spear or spears. An example is described in Gísla saga.[1][2] In Fóstbræðra saga, the bond of Thorgeir Havarsson (Þorgeir Hávarsson) and Thormod Bersason (Þormóð Bersason) is sealed by such ritual as well, the ritual being called a leikr.[3]\n\n"
    unicode"## Article 2\n\n"
    unicode"Örvar-Oddr's saga contains another notable account of blood brotherhood. Örvar-Oddr, after fighting the renowned Swedish warrior Hjalmar to a draw, entered a foster brotherhood with him by the turf-raising ritual. Afterwards, the strand of turf was put back during oaths and incantations.[citation needed]\n\n"
    unicode"## Article 3\n\n"
    unicode"In the mythology of Northern Europe, Gunther and Högni became the blood brothers of Sigurd when he married their sister Gudrun. In Wagner's opera Götterdämmerung, the concluding part of his Ring Cycle, the same occurs between Gunther and Wagner's version of Sigurd, Siegfried, which is marked by the \"Blood Brotherhood Leitmotiv\". Additionally, it is briefly stated in Lokasenna that Odin and Loki are blood brothers.\n\n";

uint16 constant height1 = 936;

contract PinkySwearPactsTest is Test {
    PinkySwearPacts private pacts = new PinkySwearPacts("Pinky Swear Pacts", "PSP");

    uint256 private pact1Id;

    function setUp() public {}

    function test_newPact() public {
        address[] memory signers = new address[](6);
        signers[0] = address(this);
        signers[1] = makeAddr("alice");
        signers[2] = makeAddr("bob");
        signers[3] = makeAddr("carol");
        signers[4] = makeAddr("dave");
        signers[5] = makeAddr("erin");

        pacts.newPact(signers, text1, height1);
    }

    function test_signPact() public {
        address[] memory _signers = new address[](3);
        _signers[0] = address(this);
        _signers[1] = makeAddr("alice");
        _signers[2] = makeAddr("bob");

        uint256 pactId = pacts.newPact(_signers, text1, height1);

        vm.prank(makeAddr("bob"));
        pacts.sign(pactId);

        vm.prank(makeAddr("alice"));
        pacts.sign(pactId);

        (address[] memory signers, PinkySwearPacts.SigningState[] memory signed) = pacts.signeesStates(pactId);

        for (uint256 i = 0; i < signers.length; i++) {
            emit log_address(signers[i]);
            emit log(signed[i] == PinkySwearPacts.SigningState.Signed ? "yes" : "no");
        }
    }

    // function test_pactAsSvg() public {
    //     emit log(string.concat("\n", pacts.pactAsSvg(0x1)));
    //     // emit log(pacts.tokenURI(0x2));
    // }

    // function test_tokenURI() public {
    //     emit log(pacts.tokenURI(0x1));
    //     // emit log(pacts.tokenURI(0x2));
    // }

    // function test_locked() public {
    //     // assertTrue(pacts.locked(pact1Id));
    // }

    // function testFail_locked() public view {
    //     pacts.locked(0x0);
    // }

    // function test_erc5192Interface() public {
    //     assertTrue(pacts.supportsInterface(ERC5192ID));
    // }
}
