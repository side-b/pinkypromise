// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./EnsUtils.sol";
import {StrSlice, toSlice} from "dk1a-stringutils/StrSlice.sol";
import "solmate/utils/LibString.sol";
import "./AddressUtils.sol";
import "./PinkyPromise.sol";

library PinkyPromiseSvg {
    using LibString for uint16;
    using AddressUtils for address;

    // avoid the 16 vars limit in promiseAsSvg()
    struct SvgValues {
        string height;
        string title;
        string body;
        string color;
        string signees;
    }

    function promiseAsSvg(address ensRegistry, PinkyPromise.PromiseData storage data, address[] calldata signees)
        public
        view
        returns (string memory)
    {
        SvgValues memory values;
        values.height = data.height.toString();
        values.title = data.title;
        values.body = promiseTextToHtml(data.body);
        values.color = promiseColor(data.color);
        values.signees = signeesAsHtml(ensRegistry, signees);

        string memory html;
        {
            html = "<PROMISE_SVG>";
        }
        return html;
    }

    function signeesAsHtml(address ensRegistry, address[] calldata signees) public view returns (string memory) {
        string memory html = "";
        for (uint256 i = 0; i < signees.length; i++) {
            html = string.concat(html, signeeAsHtml(ensRegistry, signees[i]));
        }
        return html;
    }

    function signeeAsHtml(address ensRegistry, address signee) public view returns (string memory) {
        string memory addressHtml = EnsUtils.nameOrAddress(ensRegistry, signee);
        return "<SIGNEE_LINE_HTML>";
    }

    function promiseColor(PinkyPromise.PromiseColor color) public pure returns (string memory) {
        if (color == PinkyPromise.PromiseColor.BubbleGum) {
            return "#ED9AC9";
        }
        if (color == PinkyPromise.PromiseColor.BlueberryCake) {
            return "#0007B0";
        }
        if (color == PinkyPromise.PromiseColor.TomatoSauce) {
            return "#FF5262";
        }
        if (color == PinkyPromise.PromiseColor.BurntToast) {
            return "#1E1E1E";
        }
        revert("PromiseColor value missing from promiseColor()");
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
}
