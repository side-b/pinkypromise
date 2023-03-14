// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {StrSlice, toSlice} from "dk1a-stringutils/StrSlice.sol";

library StringReplace {
    function replace(string memory text, string memory pattern, string memory replacement)
        public
        view
        returns (string memory result)
    {
        StrSlice remaining = toSlice(text);
        StrSlice patternSeparator = toSlice(pattern);

        while (remaining.contains(patternSeparator)) {
            (, StrSlice part, StrSlice _remaining) = remaining.splitOnce(patternSeparator);
            remaining = _remaining;
            result = string.concat(result, part.toString(), replacement);
        }

        result = string.concat(result, remaining.toString());
    }
}
