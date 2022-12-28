// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {StrSlice, toSlice} from "dk1a-stringutils/StrSlice.sol";
import "solmate/utils/LibString.sol";
import "./AddressToString.sol";
import "./PinkyPromise.sol";

library PinkyPromiseSvg {
    using LibString for uint16;
    using AddressToString for address;

    function promiseSvgWrapper(uint16 height, string calldata contentHtml, string calldata signeesHtml)
        public
        pure
        returns (string memory)
    {
        string memory _height = height.toString();

        // generated, do not edit directly
        return string.concat(
            '<svg width="800" height="',
            _height,
            '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ',
            _height,
            '"><foreignObject x="0" y="0" width="800" height="',
            _height,
            '"><div class="root" xmlns="http://www.w3.org/1999/xhtml"><style>svg *{box-sizing:border-box}svg .root{height:',
            _height,
            'px;padding:0 4px 4px 0}svg .main{height:9995px;color:#333;background:#fff;padding:10px 40px 30px;font:18px/28px Courier New,monospace;position:relative;box-shadow:4px 4px #333}svg .content,svg .signees{overflow:hidden}svg p{margin:24px 0}svg h1{margin:32px 0;padding-bottom:5px;font-size:26px;font-weight:400;line-height:36px;position:relative}svg h2{margin:24px 0;font-size:22px;font-weight:400;line-height:32px}</style><div class="main"><div class="content">',
            contentHtml,
            "</div>",
            signeesHtml,
            "</div></div></foreignObject></svg>"
        );
    }

    function textBlockToHtml(StrSlice textBlock) public view returns (string memory) {
        StrSlice h1Tag = toSlice("# ");
        StrSlice h2Tag = toSlice("## ");

        if (textBlock.startsWith(h1Tag)) {
            // stripPrefix
            return string.concat("<h1>", textBlock.getSubslice(1, textBlock.len()).toString(), "</h1>");
        }

        if (textBlock.startsWith(h2Tag)) {
            return string.concat("<h2>", textBlock.getSubslice(1, textBlock.len()).toString(), "</h2>");
        }

        return string.concat("<p>", textBlock.toString(), "</p>");
    }

    function promiseTextToHtml(string memory text) public view returns (string memory) {
        string memory html;
        // StrSlice textBlock;
        StrSlice remaining = toSlice(text);
        StrSlice blockSeparator = toSlice("\n\n");

        while (remaining.contains(blockSeparator)) {
            (, StrSlice textBlock, StrSlice _remaining) = remaining.splitOnce(blockSeparator);
            remaining = _remaining;
            html = string.concat(html, "\n\n", textBlockToHtml(textBlock));
        }

        return string.concat(html, remaining.toString());
    }

    function promiseSigneesToHtml(address[] calldata signees, PinkyPromise.SigningState[] calldata signingStates)
        public
        pure
        returns (string memory)
    {
        string memory html = "";

        for (uint256 i = 0; i < signees.length; i++) {
            html = string.concat(
                html,
                "\n<div>",
                signees[i].toString(),
                string.concat(" (", signingStates[i] == PinkyPromise.SigningState.Signed ? "Signed" : "Not signed", ")"),
                "</div>"
            );
        }

        return html;
    }
}
