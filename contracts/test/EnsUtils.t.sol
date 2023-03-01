// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import {EnsUtils} from "src/lib/EnsUtils.sol";
import {AddressUtils} from "src/lib/AddressUtils.sol";

address constant ENS_REGISTRY = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
address constant NULL_ADDRESS = 0x0000000000000000000000000000000000000000;
address constant ADDR_1 = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;
string constant NAME_1 = "vitalik.eth";

contract EnsUtilsTest is Test {
    using AddressUtils for address;

    function test_ensNameOrAddress() public {
        // ADDR_1 exists on ENS_REGISTRY
        assertEq(EnsUtils.nameOrAddress(ENS_REGISTRY, ADDR_1), NAME_1);
        // ADDR_1 does not exist on the registry NULL_ADDRESS
        assertEq(EnsUtils.nameOrAddress(NULL_ADDRESS, ADDR_1), ADDR_1.toString());
        // NULL_ADDRESS does not exist on ENS_REGISTRY
        assertEq(EnsUtils.nameOrAddress(ENS_REGISTRY, NULL_ADDRESS), NULL_ADDRESS.toString());
    }
}
