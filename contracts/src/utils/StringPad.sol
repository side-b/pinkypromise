// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

library StringPad {
    function padStart(string memory value, uint256 targetLength, string memory padString)
        internal
        pure
        returns (string memory paddedValue)
    {
        uint256 diff = targetLength - bytes(value).length;
        if (diff < 1) {
            return value;
        }

        paddedValue = value;
        for (; diff > 0; diff--) {
            paddedValue = string.concat(padString, paddedValue);
        }
        return paddedValue;
    }
}
