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
        return string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg"',
            string.concat(' width="800" height="', _height, '"'),
            string.concat(' viewBox="0 0 800 ', _height, '"'),
            ">\n",
            string.concat(
                string.concat(
                    string.concat('<foreignObject x="0" y="0" width="800" height="', _height, '">\n'),
                    string.concat(
                        '<div xmlns="http://www.w3.org/1999/xhtml" class="root">\n',
                        // forgefmt: disable-start
                        "<style>"
                            "svg .root {"
                            "  padding: 0 4px 4px 0; "
                            "}"
                            "svg .main { "
                            "  overflow: hidden;"
                            "  padding: 10px 40px;"
                            "  font: 18px/28px 'Courier New', monospace;"
                            "  color: #333;"
                            "  background: #FFF;"
                            "  border: 2px solid #333;"
                            "  box-shadow: 4px 4px #333;"
                            "}"
                            "svg p {"
                            "  margin: 24px 0;"
                            "}"
                            "svg h1 {"
                            "  font-size: 24px;"
                            "  line-height: 36px;"
                            "  font-weight: normal;"
                            "  margin-bottom: 30px;"
                            "  padding-bottom: 5px;"
                            "  border-bottom: 2px solid #333;"
                            "}"
                            "svg h2 {"
                            "  font-size: 22px;"
                            "  line-height: 32px;"
                            "  font-weight: normal;"
                            "}"
                            "svg .signees {"
                            "  padding-bottom: 20px;"
                            "}"
                        "</style>",
                        // forgefmt: disable-end
                        string.concat(
                            '\n<div class="main">',
                            string.concat("\n\n<div>", contentHtml, "</div>"),
                            string.concat('\n\n<div class="signees">\n<h2>Signees</h2>', signersHtml, "\n</div>"),
                            "\n\n</div>"
                        ),
                        "\n</div>"
                    ),
                    "\n</foreignObject>"
                )
            ),
            "\n</svg>"
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
