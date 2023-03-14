// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import {PinkyPromiseSvg} from "src/PinkyPromiseSvg.sol";

contract PinkyPromiseSvgTest is Test {
    function test_textBlockContentToHtml() public {
        string memory body = "1\n2\n3<p>&4";
        assertEq(PinkyPromiseSvg.textBlockContentToHtml(body), "1<br/>2<br/>3&lt;p&gt;&amp;4");
    }
}
