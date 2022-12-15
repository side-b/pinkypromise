// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "solmate/utils/LibString.sol";
import "../src/AddressToString.sol";
import "../src/PinkySwearPacts.sol";

bytes4 constant ERC5192ID = 0xb45a3c0e;

// forgefmt: disable-start
string constant text1 = 
    unicode"Pinky, pinky bow-bell,\n"
    unicode"Whoever tells a lie\n"
    unicode"Will sink down to the bad place\n"
    unicode"And never rise up again.";
// forgefmt: disable-end

uint16 constant height1 = 936;

contract PinkySwearPactsTest is Test {
    using LibString for uint256;
    using AddressToString for address;

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
        address[] memory signees = new address[](3);
        signees[0] = address(this);
        signees[1] = makeAddr("alice");
        signees[2] = makeAddr("alice");

        PinkySwearPacts.PactData memory pactData;

        vm.expectRevert("PinkySwearPacts: each signee must be unique");
        pacts.newPact(pactData, signees);
    }

    function test_signeePacts() public {
        address[] memory signees = new address[](2);
        signees[0] = address(this);
        signees[1] = makeAddr("alice");

        PinkySwearPacts.PactData memory pactData;

        // pact1: draft
        pacts.newPact(pactData, signees);

        // pact2: discarded
        uint256 pact2 = pacts.newPact(pactData, signees);
        pacts.discard(pact2);

        // pact3: final
        uint256 pact3 = pacts.newPact(pactData, signees);
        vm.prank(makeAddr("alice"));
        pacts.sign(pact3);

        // pact4: nullified
        uint256 pact4 = pacts.newPact(pactData, signees);
        vm.prank(makeAddr("alice"));
        pacts.sign(pact4);
        vm.prank(makeAddr("alice"));
        pacts.nullify(pact4);
        vm.prank(address(this));
        pacts.nullify(pact4);

        // pact5: only one signee
        delete signees[1];
        pacts.newPact(pactData, signees);

        uint256[] memory thisPacts = pacts.signeePacts(address(this));
        uint256[] memory alicePacts = pacts.signeePacts(makeAddr("alice"));
        uint256[] memory bobPacts = pacts.signeePacts(makeAddr("bob"));

        assertEq(thisPacts.length, 5);
        assertEq(alicePacts.length, 4);
        assertEq(bobPacts.length, 0);

        // emit log("\nthisPacts:");
        // for (uint256 i = 0; i < thisPacts.length; i++) {
        //     emit log(string.concat(i.toString(), ": 0x", thisPacts[i].toString()));
        // }

        // emit log("\nalicePacts:");
        // for (uint256 i = 0; i < alicePacts.length; i++) {
        //     emit log(string.concat(i.toString(), ": 0x", alicePacts[i].toString()));
        // }
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
