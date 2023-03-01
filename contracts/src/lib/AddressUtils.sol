// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {HexStrings} from "src/lib/HexStrings.sol";

library AddressUtils {
    using HexStrings for uint160;

    function toString(address value) internal pure returns (string memory) {
        return uint160(value).toHexString(20);
    }

    function toStringNoPrefix(address value) internal pure returns (string memory) {
        return uint160(value).toHexStringNoPrefix(20);
    }
}