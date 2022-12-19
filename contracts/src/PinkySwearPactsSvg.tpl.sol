// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {StrSlice, toSlice} from "dk1a-stringutils/StrSlice.sol";
import "solmate/utils/LibString.sol";
import "./AddressToString.sol";
import "./PinkySwearPacts.sol";

library PinkySwearPactsSvg {
    using LibString for uint16;
    using AddressToString for address;

    function pactSvgWrapper(uint16 height, string calldata contentHtml, string calldata signersHtml)
        public
        pure
        returns (string memory)
    {
        string memory _height = height.toString();
        return "<SVG_WRAPPER>";
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

    function pactTextToHtml(string memory text) public view returns (string memory) {
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

    function pactSignersToHtml(address[] calldata signees, PinkySwearPacts.SigningState[] calldata signingStates)
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
                string.concat(
                    " (", signingStates[i] == PinkySwearPacts.SigningState.Signed ? "Signed" : "Not signed", ")"
                ),
                "</div>"
            );
        }

        return html;
    }
}
