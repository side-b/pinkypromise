// FILE GENERATED, DO NOT EDIT DIRECTLY

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
        return string.concat(
            '<svg height="',
            height,
            '" viewBox="0 0 800 ',
            height,
            '" width="800" xmlns="http://www.w3.org/2000/svg"><foreignObject x="0" y="0" width="800" height="100%"><div class="root" xmlns="http://www.w3.org/1999/xhtml"><style>svg{--color:',
            color,
            ";--contentColor:",
            contentColor,
            ";contain:layout}svg *{box-sizing:border-box;word-break:break-word}svg .root{height:",
            height,
            "px;color:var(--contentColor);background:var(--color);padding:40px 40px 32px;font:400 19px/28px Courier New,monospace}svg a{color:var(--contentColor);text-decoration:none}svg .main{width:720px;height:100%;flex-direction:column;display:flex;overflow:hidden}svg .header{width:100%;height:70px;text-transform:uppercase;border-bottom:2px solid var(--contentColor);flex-grow:0;flex-shrink:0;justify-content:space-between;padding-bottom:16px;font-size:18px;display:flex}svg .header>div+div{text-align:right}svg .content{width:100%;height:100%;flex-direction:column;flex-grow:1;display:flex}svg .title{flex-grow:0;flex-shrink:0;padding-top:40px;font-size:32px;font-weight:400;line-height:38px}svg .body{flex-grow:1;flex-shrink:0;padding-top:24px;overflow:hidden}svg .body p{margin:24px 0}svg .body p:first-child{margin-top:0}svg .body h1{margin:32px 0;padding-bottom:5px;font-size:26px;font-weight:400;line-height:36px;position:relative}svg .body h2{margin:24px 0;font-size:22px;font-weight:400;line-height:32px}svg .signees{flex-direction:column;flex-grow:0;flex-shrink:0;padding-top:0;display:flex;overflow:hidden}svg .signee{height:40px;justify-content:space-between;align-items:center;gap:12px;display:flex}svg .signee a{text-decoration:none}svg .signee>div:first-child{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}svg .signature{color:var(--contentColor);white-space:nowrap;flex-shrink:0;justify-content:flex-end;align-items:center;gap:12px;font-weight:500;display:flex}svg .signature>div:first-child{width:50px;height:28px;background:var(--contentColor);border-radius:64px;justify-content:center;align-items:center;display:flex}svg .signature svg path{fill:var(--color)}svg .signature b{color:var(--contentColor)}svg .fingers{flex-grow:0;flex-shrink:0;justify-content:center;padding-top:32px;display:flex}svg .fingers svg{display:block}svg .fingers svg path{fill:var(--contentColor)}</style>",
            content,
            "</div></foreignObject></svg>"
        );
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

        return string.concat(
            '<div class="main"><div class="header"><div><div>Pinky Promise</div><div><strong>',
            id,
            "</strong></div></div><div><div>",
            signedOn,
            "</div><div><strong>",
            status,
            '</strong></div></div></div><div class="content"><div class="title">',
            title,
            '</div><div class="body">',
            body,
            '</div><div class="signees">',
            signees,
            '</div><div class="fingers"><svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" fill-rule="evenodd" d="M44.356 79.302c-.333.036-.667.069-1.002.097-.068-.325-.14-.664-.218-1.019l-.358-1.673c-.55-2.578-1.086-5.083-1.77-7.584l-4.304 10.28c-11.142-.919-20.973-6.458-27.575-14.696l.025.032c.29-2.179.6-4.648.804-6.65.196-1.92.36-4.113.476-5.823a275.543 275.543 0 0 0 .17-2.727l.013-.219-.5-.028-.499-.027-.012.218-.036.608c-.03.52-.076 1.254-.134 2.107-.115 1.707-.279 3.887-.473 5.789a217.926 217.926 0 0 1-.67 5.638 39.357 39.357 0 0 1-7.83-23.204c1.295-.495 2.845-.514 4.04-.334.737.111 1.833.412 2.99 1.574 1.036 1.043 2.095 2.752 3.006 5.573a8.152 8.152 0 0 1 1.45-1.056c.794-.466 1.586-.894 2.472-1.128.9-.238 1.873-.27 3.038.014 1.163.283 1.815.69 2.32 1.228.234.248.43.517.618.777l.016.022c.197.272.399.548.66.842.343.385.62.936.857 1.614.24.684.449 1.533.637 2.544.375 2.023.673 4.743.937 8.193l.002.022v.023c-.011.791.05 2.064.267 3.287.108.611.253 1.198.442 1.7.1.264.207.496.322.692a88.67 88.67 0 0 0 4.222-5.644c1.701-2.482 3.272-5.098 3.986-7.1l.005-.013.006-.013c.219-.517.416-.987.595-1.417-.895-1.94-1.943-4.495-3.24-8.157-2.919-8.236-1.542-17.05-1.064-20.105.064-.416.113-.725.131-.912l.002-.013c.268-2.138 1.324-4.49 2.742-6.214 1.397-1.699 3.288-2.947 5.23-2.491.845.198 1.504.604 2.032 1.263.514.641.886 1.5 1.214 2.572.071.235.215.816.364 1.644a4.292 4.292 0 0 1 2.044-1.744c.83-.347 1.674-.417 2.17-.299.944.225 3.374 1.6 3.944 5.88.708 4.651 1.6 16.426-.79 26.789l-.007.031-.14.377.054.074.076.105c1.464 2.008 2.528 3.78 3.369 5.19l.023.038c.845 1.416 1.428 2.392 1.96 2.929.3.3.533.526.737.683.206.16.33.207.402.216.046.005.12.003.257-.104.153-.118.347-.338.6-.72.438-.66.544-1.046.71-1.653l.016-.055.033-.12c.206-.742.514-1.735 1.453-3.556 1.503-2.915 3.347-4.192 4.223-4.48a13.233 13.233 0 0 1 3.734-.93c.919-.08 1.904-.043 2.785.251a23.343 23.343 0 0 1 .914-3.083c.366-.974.846-2.017 1.458-2.929.61-.908 1.373-1.719 2.32-2.182 1.313-.643 2.457-.665 3.58-.547.353.038.693.086 1.033.135.587.084 1.172.167 1.82.191V40c0 .3-.004.597-.01.895-.737-.027-1.418-.124-2.04-.212-.318-.046-.621-.089-.907-.12-1.02-.107-1.955-.079-3.036.451-.73.357-1.373 1.013-1.93 1.842-.555.826-1.002 1.792-1.353 2.724a22.354 22.354 0 0 0-.935 3.237l-.012.056 4.44 5.33 1.966 2.767c-.163.342-.33.682-.503 1.018l-.915-1.286-.931-1.277-.015-.028-.07-.125-.326-.458-4.507-5.412c-.751-.352-1.714-.437-2.738-.346a12.228 12.228 0 0 0-3.453.863l-.022.01-.023.006c-.539.17-2.224 1.21-3.658 3.992-.905 1.756-1.19 2.684-1.379 3.366l-.017.062-.03.111c-.172.629-.313 1.144-.841 1.94-.274.414-.54.74-.82.958-.295.228-.625.35-.99.306-.34-.041-.637-.218-.895-.418a9.212 9.212 0 0 1-.833-.77c-.622-.625-1.258-1.691-2.036-2.995l-.098-.164c-.839-1.407-1.883-3.145-3.317-5.112-1.167-1.6-1.967-2.828-2.494-3.716-.494-.834-.765-1.396-.862-1.694-1.331-2.773-2.97-7.12-3.701-11.95-.305-2.01-.27-3.548-.178-5.056.017-.294.037-.585.057-.877.083-1.211.168-2.445.115-3.967-.104-3.032-.66-5.428-.802-5.895-.314-1.03-.642-1.745-1.038-2.238a2.503 2.503 0 0 0-1.39-.893c.044.684.03 1.572-.118 2.5-.195 1.222-.632 2.567-1.53 3.593-1.109 1.268-2.43 1.755-3.486 1.927a6.986 6.986 0 0 1-1.328.085c-.167-.005-.305-.014-.402-.02h-.008c-.027.195-.065.443-.11.737-.485 3.143-1.796 11.631 1.022 19.583 2.036 5.744 3.442 8.717 4.597 10.86a81.3 81.3 0 0 0 1.009 1.803c.731 1.28 1.415 2.477 2.152 4.19 2.655 5.585 3.777 10.843 4.943 16.307.119.557.238 1.117.36 1.679.086.396.166.774.242 1.133Zm-21.371-3.601c-.315-.15-.626-.304-.936-.462.409-2.361 1.142-5.996 2.02-8.649l.95.315c-.894 2.698-1.642 6.478-2.034 8.796Zm22.161-51.474c-.227-.863-.349-2.415-.248-5.545.142.026.308.068.486.132.55.196 1.229.606 1.735 1.48.25.433.456 1.057.62 1.782.162.719.274 1.503.353 2.234a32.714 32.714 0 0 1 .157 2.206 3.682 3.682 0 0 1-.851-.124c-.505-.134-.969-.367-1.266-.683-.086-.093-.175-.18-.253-.257l-.003-.003-.077-.076a3.028 3.028 0 0 1-.257-.282c-.142-.183-.28-.427-.396-.864Z"></path><path d="M65.97 69.815c.252-.22.5-.441.746-.667a79.868 79.868 0 0 1-1.318-1.477c-1.017-1.176-2.06-2.593-2.853-3.722a72.259 72.259 0 0 1-1.228-1.808l-.07-.11-.018-.027-.006-.009-.841.541.007.01.019.03.035.054.037.058.275.415c.235.353.57.85.972 1.42.667.952 1.52 2.12 2.395 3.185-1.588.36-2.775.362-3.854-.006-1.258-.429-2.45-1.387-3.977-3.081l-.742.669c1.556 1.727 2.889 2.844 4.397 3.358 1.444.493 2.978.408 4.901-.087.346.395.73.822 1.124 1.254Z"></path></svg></div></div></div>'
        );
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
            signature =
                '<div class="signature"><div><svg width="38" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m.516 9.758-.118-1.05L0 6.592l.317-1.057.459-.302-.023-.314.201.197.224-.147 1.115.126.725.66.77 1.138L4.8 8.631l.594-1.26.697-1.308.538-.855.6-.799.667-.673.848-.551.843-.223.627.045.486.15.557.35.444.432.406.57.455.842.733 1.932.637 2.071 1.65-2.232 1.357-1.631.823-.781.892-.692.825-.485 1.017-.422.792-.204.797-.082 1.056.058.72.18.922.457.45.375.136-.183.957-1.182.527-.573.784-.68.754-.525.774-.379 1.071-.296.85-.077.689.047.808.169.76.257.702.357.762.532.577.487.555.622.841.062.757.669.237 1.004-.374.978-1.011.603-.38.18-.987-.038-.804-.74-.126-.528-.118-.341-.213-.334-.293-.338-.373-.302-.404-.262-.426-.193-.705-.2-.384-.044-.677.07-.65.204-.543.315-.574.478-.505.564-.553.772-.675 1.171-.716 1.52-.852.487-.903-.065-.726-.643-.194-.819.08-.576-.007-.017-.158-.224-.212-.156-.506-.196-.42-.046-.64.048-.69.19-.527.225-.636.378-.498.393-.657.62-.6.7-.717.944-2.322 3.489-.493.476-.756.385-.919-.138-.61-.558-.233-.448-1.077-3.74-.39-1.123-.315-.769-.478-.825-.067-.075-.115.041-.24.177L9 6.32l-.556.8-.42.757-.476.989-.965 2.266-.476.687-.768.502-1.017-.088-.71-.628-.18-.286-.068.2-.861.567-1-.074-.77-.681-.18-.766-.037-.807Z"></path></svg></div><span>signed</span></div>';
        }
        return string.concat(
            '<div class="signee"><div><a href="https://etherscan.io/address/',
            addressHtml,
            '" rel="nofollow" target="_blank">',
            addressHtml,
            "</a></div>",
            signature,
            "</div>"
        );
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
