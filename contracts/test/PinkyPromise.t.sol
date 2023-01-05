// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "solmate/utils/LibString.sol";
import "../src/AddressUtils.sol";
import "../src/PinkyPromise.sol";

bytes4 constant ERC5192ID = 0xb45a3c0e;

// forgefmt: disable-start
string constant body1 = 
    unicode"Pinky, pinky bow-bell,\n"
    unicode"Whoever tells a lie\n"
    unicode"Will sink down to the bad place\n"
    unicode"And never rise up again.";
// forgefmt: disable-end

uint16 constant height1 = 936;

abstract contract PPInitialized {
    PinkyPromise pp;

    constructor() {
        pp = new PinkyPromise("Pinky Promise", "PSP");
    }
}

contract PinkyPromiseTest is Test, PPInitialized {
    using LibString for uint256;
    using AddressUtils for address;

    function setUp() public {}

    function test_total() public {
        address[] memory signees_ = new address[](1);
        signees_[0] = address(this);
        PinkyPromise.PromiseData memory promiseData;

        assertEq(pp.total(), 0);
        pp.newPromise(promiseData, signees_);
        assertEq(pp.total(), 1);
    }

    function test_newPromise() public {
        address[] memory signees = new address[](3);
        signees[0] = address(this);
        signees[1] = makeAddr("alice");
        signees[2] = makeAddr("bob");

        PinkyPromise.PromiseData memory promiseData;
        promiseData.height = height1;
        promiseData.title = "Pinky Promise";
        promiseData.body = body1;
        promiseData.color = PinkyPromise.PromiseColor.BubbleGum;

        pp.newPromise(promiseData, signees);
    }

    function test_signPromise() public {
        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkyPromise.PromiseData memory promiseData;
        uint256 promiseId = pp.newPromise(promiseData, signees_);

        PinkyPromise.PromiseState state;

        address[] memory signees;
        PinkyPromise.SigningState[] memory signingStates;

        (signees, signingStates) = pp.signeesStates(promiseId);
        assertEq(signees.length, 3);
        assertEq(signees[0], signees_[0]);
        assertEq(signees[1], signees_[1]);
        assertEq(signees[2], signees_[2]);
        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed)); // auto sign if the creator is a signee
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.Pending));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Pending));

        state = pp.promiseState(promiseId);
        assertEq(uint256(state), uint256(PinkyPromise.PromiseState.Draft));

        vm.prank(makeAddr("bob"));
        pp.sign(promiseId);

        (signees, signingStates) = pp.signeesStates(promiseId);
        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.Pending));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Signed));

        vm.prank(makeAddr("alice"));
        pp.sign(promiseId);

        state = pp.promiseState(promiseId);
        assertEq(uint256(state), uint256(PinkyPromise.PromiseState.Final));

        (signees, signingStates) = pp.signeesStates(promiseId);
        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Signed));
    }

    function test_discard() public {
        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkyPromise.PromiseData memory promiseData;
        uint256 promiseId = pp.newPromise(promiseData, signees_);

        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Draft));

        vm.prank(makeAddr("bob"));
        pp.sign(promiseId);

        vm.prank(makeAddr("alice"));
        pp.discard(promiseId);

        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Discarded));

        vm.prank(makeAddr("alice"));
        vm.expectRevert("PinkyPromise: only non-discarded drafts can receive signatures");
        pp.sign(promiseId);

        vm.prank(makeAddr("alice"));
        vm.expectRevert("PinkyPromise: only drafts can get discarded");
        pp.discard(promiseId);

        vm.prank(makeAddr("bob"));
        vm.expectRevert("PinkyPromise: only drafts can get discarded");
        pp.discard(promiseId);
    }

    function test_nullify() public {
        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkyPromise.PromiseData memory promiseData;

        uint256 promiseId = pp.newPromise(promiseData, signees_);

        PinkyPromise.SigningState[] memory signingStates;

        vm.prank(makeAddr("alice"));
        pp.sign(promiseId);
        vm.prank(makeAddr("bob"));
        pp.sign(promiseId);

        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("alice"));
        pp.nullify(promiseId);

        (, signingStates) = pp.signeesStates(promiseId);

        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("bob"));
        pp.nullify(promiseId);

        (, signingStates) = pp.signeesStates(promiseId);

        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("bob"));
        pp.cancelNullify(promiseId);

        (, signingStates) = pp.signeesStates(promiseId);

        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("bob"));
        pp.nullify(promiseId);
        vm.prank(address(this));
        pp.nullify(promiseId);

        (, signingStates) = pp.signeesStates(promiseId);

        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Nullified));
    }

    // Duplicated signees should trigger a revert
    function test_uniqueSignees() public {
        address[] memory signees = new address[](3);
        signees[0] = address(this);
        signees[1] = makeAddr("alice");
        signees[2] = makeAddr("alice");

        PinkyPromise.PromiseData memory promiseData;

        vm.expectRevert("PinkyPromise: each signee must be unique");
        pp.newPromise(promiseData, signees);
    }

    function test_signeePromises() public {
        address[] memory signees = new address[](2);
        signees[0] = address(this);
        signees[1] = makeAddr("alice");

        PinkyPromise.PromiseData memory promiseData;

        // promise1: draft
        pp.newPromise(promiseData, signees);

        // promise2: discarded
        uint256 promise2 = pp.newPromise(promiseData, signees);
        pp.discard(promise2);

        // promise3: final
        uint256 promise3 = pp.newPromise(promiseData, signees);
        vm.prank(makeAddr("alice"));
        pp.sign(promise3);

        // promise4: nullified
        uint256 promise4 = pp.newPromise(promiseData, signees);
        vm.prank(makeAddr("alice"));
        pp.sign(promise4);
        vm.prank(makeAddr("alice"));
        pp.nullify(promise4);
        vm.prank(address(this));
        pp.nullify(promise4);

        // promise5: only one signee
        delete signees[1];
        pp.newPromise(promiseData, signees);

        uint256[] memory thisPromises = pp.signeePromises(address(this));
        uint256[] memory alicePromises = pp.signeePromises(makeAddr("alice"));
        uint256[] memory bobPromises = pp.signeePromises(makeAddr("bob"));

        assertEq(thisPromises.length, 5);
        assertEq(alicePromises.length, 4);
        assertEq(bobPromises.length, 0);

        // emit log("\nthisPromises:");
        // for (uint256 i = 0; i < thisPromises.length; i++) {
        //     emit log(string.concat(i.toString(), ": 0x", thisPromises[i].toString()));
        // }

        // emit log("\nalicePromises:");
        // for (uint256 i = 0; i < alicePromises.length; i++) {
        //     emit log(string.concat(i.toString(), ": 0x", alicePromises[i].toString()));
        // }
    }

    // NFTs should always be locked (soulbound)
    function test_locked() public {
        address[] memory signees_ = new address[](2);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");

        PinkyPromise.PromiseData memory promiseData;
        uint256 promiseId = pp.newPromise(promiseData, signees_);

        vm.expectRevert("PinkyPromise: tokenId not assigned");
        pp.locked(0x1);

        vm.prank(makeAddr("alice"));
        pp.sign(promiseId);

        assertTrue(pp.locked(0x1));
        assertTrue(pp.locked(0x2));

        vm.expectRevert("PinkyPromise: tokenId not assigned");
        pp.locked(0x3);

        // 0x0 is never assigned
        vm.expectRevert("PinkyPromise: tokenId not assigned");
        pp.locked(0x0);
    }

    function test_erc5192Interface() public {
        assertTrue(pp.supportsInterface(ERC5192ID));
    }
}
