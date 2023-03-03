// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "solmate/utils/LibString.sol";
import {StrSlice, toSlice} from "dk1a-stringutils/StrSlice.sol";
import {DateUtils} from "src/lib/DateUtils.sol";
import {EnsUtils} from "src/lib/EnsUtils.sol";
import {AddressUtils} from "src/lib/AddressUtils.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";

library PinkyPromiseSvg {
    using LibString for uint16;
    using LibString for uint256;
    using AddressUtils for address;

    struct Contracts {
        address ensRegistry;
        address bpbDateTime;
    }

    struct PinkyPromiseSvgData {
        PinkyPromise.PromiseData promiseData;
        PinkyPromise.PromiseState promiseState;
        address[] signees;
        uint256 promiseId;
        uint256 signedOn;
        string networkPrefix;
    }

    function promiseAsSvg(
        Contracts calldata contracts,
        PinkyPromiseSvgData calldata svgData,
        PinkyPromise.SigningState[] calldata signingStates
    ) public view returns (string memory) {
        return promiseSvgWrapper(svgData.promiseData, promiseSvgContent(contracts, svgData, signingStates));
    }

    function promiseSvgWrapper(PinkyPromise.PromiseData calldata promiseData, string memory content)
        public
        pure
        returns (string memory)
    {
        string memory color = string.concat("#", promiseColor(promiseData.color));
        string memory contentColor = string.concat("#", promiseContentColor(promiseData.color));
        string memory height = promiseData.height.toString();
        return "<PROMISE_SVG_WRAPPER>";
    }

    function promiseSvgContent(
        Contracts calldata contracts,
        PinkyPromiseSvgData calldata svgData,
        PinkyPromise.SigningState[] calldata signingStates
    ) public view returns (string memory) {
        string memory body = promiseTextToHtml(svgData.promiseData.body);
        string memory id = string.concat(svgData.networkPrefix, "-", svgData.promiseId.toString());
        string memory signees = signeesAsHtml(contracts.ensRegistry, svgData.signees, signingStates);
        string memory status = promiseStatusLabel(svgData.promiseState);
        string memory title = svgData.promiseData.title;

        string memory signedOn = unicode"−";
        if (svgData.signedOn > 0) {
            signedOn = DateUtils.formatDate(contracts.bpbDateTime, svgData.signedOn);
        }

        return "<PROMISE_SVG_CONTENT>";
    }

    function signeesAsHtml(
        address ensRegistry,
        address[] calldata signees,
        PinkyPromise.SigningState[] calldata signingStates
    ) public view returns (string memory) {
        string memory html = "";
        for (uint256 i = 0; i < signees.length; i++) {
            html = string.concat(
                html,
                signeeAsHtml(
                    ensRegistry,
                    signees[i],
                    signingStates[i] == PinkyPromise.SigningState.Signed
                        || signingStates[i] == PinkyPromise.SigningState.NullRequest
                )
            );
        }
        return html;
    }

    function signeeAsHtml(address ensRegistry, address signee, bool signed) public view returns (string memory) {
        string memory addressHtml = EnsUtils.nameOrAddress(ensRegistry, signee);
        string memory signature = "";
        if (signed) {
            signature = "<SIGNATURE_HTML>";
        }
        return "<SIGNEE_HTML>";
    }

    function promiseColor(PinkyPromise.PromiseColor color) public pure returns (string memory) {
        if (color == PinkyPromise.PromiseColor.Pinky) {
            return "ED9AC9";
        }
        if (color == PinkyPromise.PromiseColor.Electric) {
            return "0007B0";
        }
        if (color == PinkyPromise.PromiseColor.RedAlert) {
            return "F6F6F6";
        }
        if (color == PinkyPromise.PromiseColor.Solemn) {
            return "F6F6F6";
        }
        revert("Incorrect PromiseColor value in promiseColor()");
    }

    function promiseContentColor(PinkyPromise.PromiseColor color) public pure returns (string memory) {
        if (color == PinkyPromise.PromiseColor.Pinky) {
            return "FFFFFF";
        }
        if (color == PinkyPromise.PromiseColor.Electric) {
            return "FFFFFF";
        }
        if (color == PinkyPromise.PromiseColor.RedAlert) {
            return "FF5262";
        }
        if (color == PinkyPromise.PromiseColor.Solemn) {
            return "1E1E1E";
        }
        revert("Incorrect PromiseColor value in promiseContentColor()");
    }

    function promiseColorName(PinkyPromise.PromiseColor color) public pure returns (string memory) {
        if (color == PinkyPromise.PromiseColor.Pinky) {
            return "Pinky";
        }
        if (color == PinkyPromise.PromiseColor.Electric) {
            return "Electric";
        }
        if (color == PinkyPromise.PromiseColor.RedAlert) {
            return "Red Alert";
        }
        if (color == PinkyPromise.PromiseColor.Solemn) {
            return "Solemn";
        }
        revert("Incorrect PromiseColor value in promiseColorName()");
    }

    function promiseStatusLabel(PinkyPromise.PromiseState state) public pure returns (string memory) {
        if (state == PinkyPromise.PromiseState.None) {
            return "N/A";
        }
        if (state == PinkyPromise.PromiseState.Draft) {
            return "Draft";
        }
        if (state == PinkyPromise.PromiseState.Final) {
            return "Signed";
        }
        if (state == PinkyPromise.PromiseState.Nullified) {
            return "Nullified";
        }
        if (state == PinkyPromise.PromiseState.Discarded) {
            return "Discarded";
        }
        revert("PromiseState value missing from promiseStatusLabel()");
    }

    function textBlockToHtml(StrSlice textBlock) public view returns (string memory) {
        StrSlice h1Tag = toSlice("# ");
        StrSlice h2Tag = toSlice("## ");

        if (textBlock.startsWith(h1Tag)) {
            // stripPrefix
            return
                string.concat("<h1>", lineBreaksToHtml(textBlock.getSubslice(2, textBlock.len()).toString()), "</h1>");
        }

        if (textBlock.startsWith(h2Tag)) {
            return
                string.concat("<h2>", lineBreaksToHtml(textBlock.getSubslice(3, textBlock.len()).toString()), "</h2>");
        }

        return string.concat("<p>", lineBreaksToHtml(textBlock.toString()), "</p>");
    }

    function lineBreaksToHtml(string memory text) public view returns (string memory) {
        string memory html;
        StrSlice remaining = toSlice(text);
        StrSlice brSeparator = toSlice("\n");

        while (remaining.contains(brSeparator)) {
            (, StrSlice part, StrSlice _remaining) = remaining.splitOnce(brSeparator);
            remaining = _remaining;
            html = string.concat(html, part.toString(), "<br/>");
        }

        return string.concat(html, remaining.toString());
    }

    function promiseTextToHtml(string memory text) public view returns (string memory) {
        string memory html;
        StrSlice remaining = toSlice(text);
        StrSlice blockSeparator = toSlice("\n\n");

        while (remaining.contains(blockSeparator)) {
            (, StrSlice textBlock, StrSlice _remaining) = remaining.splitOnce(blockSeparator);
            remaining = _remaining;
            html = string.concat(html, "\n\n", textBlockToHtml(textBlock));
        }

        return string.concat(html, textBlockToHtml(remaining));
    }
}
