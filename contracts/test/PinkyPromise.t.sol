// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "solmate/utils/LibString.sol";
import {AddressUtils} from "src/lib/AddressUtils.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";

bytes4 constant ERC5192ID = 0xb45a3c0e;

// forgefmt: disable-start
string constant body1 = 
    unicode"Pinky, pinky bow-bell,\n"
    unicode"Whoever tells a lie\n"
    unicode"Will sink down to the bad place\n"
    unicode"And never rise up again.";
// forgefmt: disable-end

uint16 constant height1 = 936;

contract PinkyPromiseTest is Test {
    using LibString for uint256;
    using AddressUtils for address;

    PinkyPromise pp;

    function setUp() public {
        pp = new PinkyPromise(
            "Pinky Promise", 
            "PP", 
            vm.envAddress("ENS_REGISTRY_MAINNET"),
            vm.envAddress("BPB_DATETIME_MAINNET")
        );
    }

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

        pp.newPromise(promiseData, signees);
    }

    function test_signPromise() public {
        Vm.Log[] memory entries;

        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkyPromise.PromiseData memory promiseData;
        promiseData.title = "My Promise";
        promiseData.body = body1;
        promiseData.height = height1;

        uint256 promiseId = pp.newPromise(promiseData, signees_);

        PinkyPromise.PromiseState state;

        address[] memory signees;
        PinkyPromise.SigningState[] memory signingStates;

        (signees, signingStates) = pp.promiseSignees(promiseId);
        assertEq(signees.length, 3);
        assertEq(signees[0], signees_[0]);
        assertEq(signees[1], signees_[1]);
        assertEq(signees[2], signees_[2]);
        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed)); // auto sign if the creator is a signee
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.Pending));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Pending));

        state = pp.promiseState(promiseId);
        assertEq(uint256(state), uint256(PinkyPromise.PromiseState.Draft));

        vm.prank(signees_[2]);
        pp.sign(promiseId);

        (signees, signingStates) = pp.promiseSignees(promiseId);
        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.Pending));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Signed));

        vm.expectRevert();
        pp.tokenURI(1);

        vm.recordLogs();
        vm.prank(signees_[1]);
        pp.sign(promiseId);
        entries = vm.getRecordedLogs();

        assertEq(entries.length, 2 + 2 * signees.length);
        assertEq(entries[0].topics[0], keccak256("AddSignature(uint256,address)"));
        for (uint256 i = 0; i < signees.length; i++) {
            assertEq(entries[1 + i * 2].topics[0], keccak256("Transfer(address,address,uint256)"));
            assertEq(address(uint160(uint256(entries[1 + i * 2].topics[1]))), address(uint160(0)));
            assertEq(address(uint160(uint256(entries[1 + i * 2].topics[2]))), signees[i]);
            assertEq(uint256(entries[1 + i * 2].topics[3]), i + 1);

            assertEq(entries[2 + i * 2].topics[0], keccak256("Locked(uint256)"));
            assertEq(uint256(entries[2 + i * 2].topics[1]), i + 1);
        }
        assertEq(entries[1 + signees.length * 2].topics[0], keccak256("PromiseUpdate(uint256,uint8)"));

        // no revert
        pp.tokenURI(1);

        state = pp.promiseState(promiseId);
        assertEq(uint256(state), uint256(PinkyPromise.PromiseState.Final));

        (signees, signingStates) = pp.promiseSignees(promiseId);
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

        vm.prank(signees_[2]);
        pp.sign(promiseId);

        vm.prank(signees_[1]);
        pp.discard(promiseId);

        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Discarded));

        vm.prank(signees_[1]);
        vm.expectRevert("PinkyPromise: only non-discarded drafts can receive signatures");
        pp.sign(promiseId);

        vm.prank(signees_[1]);
        vm.expectRevert("PinkyPromise: only drafts can get discarded");
        pp.discard(promiseId);

        vm.prank(signees_[2]);
        vm.expectRevert("PinkyPromise: only drafts can get discarded");
        pp.discard(promiseId);
    }

    function test_nullify() public {
        Vm.Log[] memory entries;

        address[] memory signees_ = new address[](3);
        signees_[0] = address(this);
        signees_[1] = makeAddr("alice");
        signees_[2] = makeAddr("bob");

        PinkyPromise.PromiseData memory promiseData;

        uint256 promiseId = pp.newPromise(promiseData, signees_);

        PinkyPromise.SigningState[] memory signingStates;

        // sign: alice
        vm.prank(makeAddr("alice"));
        pp.sign(promiseId);

        // sign: bob
        vm.recordLogs();
        vm.prank(makeAddr("bob"));
        pp.sign(promiseId);

        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("alice"));
        pp.nullify(promiseId);

        (, signingStates) = pp.promiseSignees(promiseId);

        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("bob"));
        pp.nullify(promiseId);

        (, signingStates) = pp.promiseSignees(promiseId);

        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("bob"));
        pp.cancelNullify(promiseId);

        (, signingStates) = pp.promiseSignees(promiseId);

        assertEq(uint256(signingStates[0]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(signingStates[1]), uint256(PinkyPromise.SigningState.NullRequest));
        assertEq(uint256(signingStates[2]), uint256(PinkyPromise.SigningState.Signed));
        assertEq(uint256(pp.promiseState(promiseId)), uint256(PinkyPromise.PromiseState.Final));

        vm.prank(makeAddr("bob"));
        pp.nullify(promiseId);

        // no revert expected
        pp.tokenURI(1);

        vm.recordLogs();
        vm.prank(address(this));

        // last nullify request
        pp.nullify(promiseId);

        // revert expected
        vm.expectRevert();
        pp.tokenURI(1);

        entries = vm.getRecordedLogs();

        assertEq(entries.length, 2 + signees_.length);
        assertEq(entries[0].topics[0], keccak256("NullifyRequest(uint256,address)"));
        for (uint256 i = 0; i < signees_.length; i++) {
            assertEq(entries[1 + i].topics[0], keccak256("Transfer(address,address,uint256)"));
            assertEq(uint256(entries[1 + i].topics[3]), i + 1);
        }
        assertEq(entries[1 + signees_.length].topics[0], keccak256("PromiseUpdate(uint256,uint8)"));

        (, signingStates) = pp.promiseSignees(promiseId);

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

    function test_stopped() public {
        address[] memory signees_ = new address[](1);
        signees_[0] = address(this);

        PinkyPromise.PromiseData memory promiseData;
        pp.newPromise(promiseData, signees_);
        assertTrue(!pp.stopped());

        pp.stop();
        assertTrue(pp.stopped());
        vm.expectRevert("PinkyPromise: the contract has been stopped and promises cannot be created anymore");
        pp.newPromise(promiseData, signees_);
    }

    function test_erc5192Interface() public {
        assertTrue(pp.supportsInterface(ERC5192ID));
    }
}
