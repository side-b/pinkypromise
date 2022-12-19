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

        // generated, do not edit directly
        return string.concat(
            '<svg width="1600" height="',
            _height,
            '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ',
            _height,
            '"><svg xmlns="http://www.w3.org/2000/svg" width="800" height="',
            _height,
            '" viewBox="0 0 1440 1024" fill="none"><g clip-path="url(#a)"><path fill="#FFF" d="M0 0h1440v1024H0z"></path><path fill="#000" stroke="#000" stroke-width="12" d="m775.021 1040.67-114.656 337.87s-345.672 112.71-500.414-32.31C-3.166 1193.36-164.535 675.446-164.535 675.446c13.814-14.189 125.935-69.359 143.906-80.53 22.463-13.963 54.29-17.415 79.096-15.418 24.805 1.997 75.017 14.63 119.189 135.582 1.731-4.667 10.845-17.868 33.451-33.33 28.257-19.326 53.175-33.46 94.366-26.401 41.191 7.06 43.619 24.254 66.115 46.255 22.495 22.001 39.83 93.968 58.57 221.649 1.707 30.473 11.423 96.937 36.636 118.997 39.006-53.975 122.552-181.652 144.694-260.581 46.932-136.59 29.874-102.533 84.007-246.44 2.643-27.055 24.923-85.074 16.514-135.091-10.512-62.52-13.635-211.746 1.085-250.6 14.72-38.854 55.388-48.197 69.269-45.901 13.88 2.297 58.087 21.698 73.509 97.21 19.068 85.077 50.749 302.099 19.873 496.726L775.021 1040.67Z"></path><path fill="#FFF" stroke="#000" stroke-width="12" d="M809.899 249.058c-17.609-16.327-31.339-15.574-35.404-145.754 0 0 36.84-4.058 60.867 31.522 24.027 35.581 31.541 127.627 31.541 127.627-13.857 3.709-41.664.829-57.004-13.395Z"></path><path stroke="#000" stroke-width="12" d="M175.731 766.426s1.405 92.101-.919 163.803c-2.864 88.371-13.277 226.021-13.277 226.021"></path><path fill="#FFF" stroke="#000" stroke-width="12" d="M837.584 1231.05c25.951 89.47 33.439 126.24 38.978 134.95 312.358-88.03 547.398-189.5 695.048-475.147l-142.65-59.325-59.15-70.302c-13.82-21.364-50.85-71.377-88.39-100.518-37.55-29.142-107.29-5.774-137.47 9.553-12.81 5.024-44.37 28.881-68.16 84.111-29.73 69.039-17.12 73.123-34.7 104.11-17.58 30.987-27.91 24.263-51.547 3.582-23.637-20.681-52.131-75.751-111.284-146.054-47.322-56.242-65.205-86.418-68.232-94.476-28.093-49.31-64.035-127.586-83.759-215.868-16.15-72.283-5.314-111.96-12.744-183.376-5.943-57.133-19.579-101.858-23.141-111.161-14.691-38.356-30.158-56.823-58.225-61.382-62.592-10.167-122.206 87.245-126.442 163.821-.913 30.67-29.009 218.804 43.81 386.382 91.024 209.472 121.082 216.065 166.706 304.671 61.897 109.799 88.912 214.579 121.352 326.429Z"></path><path fill="#FFF" d="M1268.41 653.23s13.4-128.323 73.76-163.253c43.1-24.945 77.29-7.261 126.82-11.914-3.77-54.307 29.62-70.684 46.79-72.084 14.89 62.762 17.22 98.244 16.8 161.922-.86 137.162-16.85 206.748-64.57 321.983l-53.95-75.315-53.22-64.823-92.43-96.516Z"></path><path stroke="#000" stroke-width="12" d="M1468.99 478.063c-49.53 4.653-83.72-13.031-126.82 11.914-60.36 34.93-73.76 163.253-73.76 163.253l92.43 96.516 53.22 64.823 53.95 75.315c47.72-115.235 63.71-184.821 64.57-321.983m-63.59-89.838c24.84 35.084 38.76 54.754 63.59 89.838m-63.59-89.838c-3.77-54.307 29.62-70.684 46.79-72.084 14.89 62.762 17.22 98.244 16.8 161.922M1136.92 878.529s44.39 59.523 86 101.341m95.84 90.21s-60.34-54.54-95.84-90.21m0 0c-74.06 25.89-111.61 14.852-173.49-44.906"></path><path fill="#FFF" stroke="#000" stroke-width="12" d="M595.061 170.175c27.83-36.667 24.411-94.661 19.223-119.075-4.118-2.83-48.31 11.403-78.633 60.242-22.92 36.915-28.605 99.121-28.605 99.121 3.207-.959 53.228 5.546 88.015-40.288Z"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h1440v1024H0z"></path></clipPath></defs></svg><foreignObject x="0" y="0" width="800" height="',
            _height,
            '"><div class="root" xmlns="http://www.w3.org/1999/xhtml"><style>svg *{box-sizing:border-box}svg .root{height:',
            _height,
            'px;padding:0 4px 4px 0}svg .main{height:9995px;color:#333;background:#fff;padding:10px 40px 30px;font:18px/28px Courier New,monospace;position:relative;box-shadow:4px 4px #333}svg .content,svg .signees{overflow:hidden}svg p{margin:24px 0}svg h1{margin:32px 0;padding-bottom:5px;font-size:24px;font-weight:400;line-height:36px;position:relative}svg h1:after{content:"";height:2px;background:#333;position:absolute;inset:auto 0 0}svg h2{margin:24px 0;font-size:22px;font-weight:400;line-height:32px}</style><div class="main"><div class="content">',
            contentHtml,
            "</div>",
            signersHtml,
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
