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
    PinkySwearPacts pacts = new PinkySwearPacts("Pinky Swear Pacts", "PSP");

    function setUp() public {}

    function test_newPact() public {
        address[] memory signees = new address[](3);
        signees[0] = address(this);
        signees[1] = makeAddr("alice");
        signees[2] = makeAddr("bob");

        PinkySwearPacts.PactData memory pactData;
        pactData.height = height1;
        pactData.text = text1;
        pactData.color = PinkySwearPacts.PactColor.BubbleGum;

        pacts.newPact(pactData, signees);
    }

    function test_signPact() public {
        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkySwearPacts.PactData memory pactData;
        uint256 pactId = pacts.newPact(pactData, signees_);

        PinkySwearPacts.PactState state;

        address[] memory signees;
        PinkySwearPacts.SigningState[] memory signingStates;

        (signees, signingStates) = pacts.signeesStates(pactId);
        assertEq(signees.length, 3);
        assertEq(signees[0], signees_[0]);
        assertEq(signees[1], signees_[1]);
        assertEq(signees[2], signees_[2]);
        assertEq(uint256(signingStates[0]), uint256(PinkySwearPacts.SigningState.Signed)); // auto sign if the creator is a signee
        assertEq(uint256(signingStates[1]), uint256(PinkySwearPacts.SigningState.Pending));
        assertEq(uint256(signingStates[2]), uint256(PinkySwearPacts.SigningState.Pending));

        state = pacts.pactState(pactId);
        assertEq(uint256(state), uint256(PinkySwearPacts.PactState.Draft));

        vm.prank(makeAddr("bob"));
        pacts.sign(pactId);

        (signees, signingStates) = pacts.signeesStates(pactId);
        assertEq(uint256(signingStates[0]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkySwearPacts.SigningState.Pending));
        assertEq(uint256(signingStates[2]), uint256(PinkySwearPacts.SigningState.Signed));

        vm.prank(makeAddr("alice"));
        pacts.sign(pactId);

        state = pacts.pactState(pactId);
        assertEq(uint256(state), uint256(PinkySwearPacts.PactState.Final));

        (signees, signingStates) = pacts.signeesStates(pactId);
        assertEq(uint256(signingStates[0]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(signingStates[2]), uint256(PinkySwearPacts.SigningState.Signed));
    }

    function test_discard() public {
        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkySwearPacts.PactData memory pactData;
        uint256 pactId = pacts.newPact(pactData, signees_);

        assertEq(uint256(pacts.pactState(pactId)), uint256(PinkySwearPacts.PactState.Draft));

        vm.prank(makeAddr("bob"));
        pacts.sign(pactId);

        vm.prank(makeAddr("alice"));
        pacts.discard(pactId);

        assertEq(uint256(pacts.pactState(pactId)), uint256(PinkySwearPacts.PactState.Discarded));

        vm.prank(makeAddr("alice"));
        vm.expectRevert("PinkySwearPacts: only non-discarded drafts can receive signatures");
        pacts.sign(pactId);

        vm.prank(makeAddr("alice"));
        vm.expectRevert("PinkySwearPacts: only drafts can get discarded");
        pacts.discard(pactId);

        vm.prank(makeAddr("bob"));
        vm.expectRevert("PinkySwearPacts: only drafts can get discarded");
        pacts.discard(pactId);
    }

    function test_nullify() public {
        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkySwearPacts.PactData memory pactData;

        uint256 pactId = pacts.newPact(pactData, signees_);

        PinkySwearPacts.SigningState[] memory signingStates;

        vm.prank(makeAddr("alice"));
        pacts.sign(pactId);
        vm.prank(makeAddr("bob"));
        pacts.sign(pactId);

        assertEq(uint256(pacts.pactState(pactId)), uint256(PinkySwearPacts.PactState.Final));

        vm.prank(makeAddr("alice"));
        pacts.nullify(pactId);

        (, signingStates) = pacts.signeesStates(pactId);

        assertEq(uint256(signingStates[0]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkySwearPacts.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(pacts.pactState(pactId)), uint256(PinkySwearPacts.PactState.Final));

        vm.prank(makeAddr("bob"));
        pacts.nullify(pactId);

        (, signingStates) = pacts.signeesStates(pactId);

        assertEq(uint256(signingStates[0]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkySwearPacts.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkySwearPacts.SigningState.NullRequest));
        assertEq(uint256(pacts.pactState(pactId)), uint256(PinkySwearPacts.PactState.Final));

        vm.prank(makeAddr("bob"));
        pacts.cancelNullify(pactId);

        (, signingStates) = pacts.signeesStates(pactId);

        assertEq(uint256(signingStates[0]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkySwearPacts.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkySwearPacts.SigningState.Signed));
        assertEq(uint256(pacts.pactState(pactId)), uint256(PinkySwearPacts.PactState.Final));

        vm.prank(makeAddr("bob"));
        pacts.nullify(pactId);
        vm.prank(address(this));
        pacts.nullify(pactId);

        (, signingStates) = pacts.signeesStates(pactId);

        assertEq(uint256(signingStates[0]), uint256(PinkySwearPacts.SigningState.NullRequest));
        assertEq(uint256(signingStates[1]), uint256(PinkySwearPacts.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkySwearPacts.SigningState.NullRequest));
        assertEq(uint256(pacts.pactState(pactId)), uint256(PinkySwearPacts.PactState.Nullified));
    }

    // Duplicated signees should trigger a revert
    function test_uniqueSignees() public {
        address[] memory signees = new address[](6);
        signees[0] = address(this);
        signees[1] = makeAddr("alice");
        signees[2] = makeAddr("alice");

        PinkySwearPacts.PactData memory pactData;

        vm.expectRevert("PinkySwearPacts: each signee must be unique");
        pacts.newPact(pactData, signees);
    }

    // NFTs should always be locked (soulbound)
    function test_locked() public {
        address[] memory signees_ = new address[](2);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");

        PinkySwearPacts.PactData memory pactData;
        uint256 pactId = pacts.newPact(pactData, signees_);

        vm.expectRevert("PinkySwearPacts: tokenId not assigned");
        pacts.locked(0x1);

        vm.prank(makeAddr("alice"));
        pacts.sign(pactId);

        assertTrue(pacts.locked(0x1));
        assertTrue(pacts.locked(0x2));

        vm.expectRevert("PinkySwearPacts: tokenId not assigned");
        pacts.locked(0x3);

        // 0x0 is never assigned
        vm.expectRevert("PinkySwearPacts: tokenId not assigned");
        pacts.locked(0x0);
    }

    function test_erc5192Interface() public {
        assertTrue(pacts.supportsInterface(ERC5192ID));
    }
}
