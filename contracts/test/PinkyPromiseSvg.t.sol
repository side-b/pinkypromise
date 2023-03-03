// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {PinkyPromiseSvg} from "src/PinkyPromiseSvg.sol";

contract PinkyPromiseSvgTest is Test {
    function test_lineBreaksToHtml() public {
        string memory body = "1\n2\n3";
        assertEq(PinkyPromiseSvg.lineBreaksToHtml(body), "1<br/>2<br/>3");
    }
}
