// FILE GENERATED, DO NOT EDIT DIRECTLY

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {StrSlice, toSlice} from "dk1a-stringutils/StrSlice.sol";
import "solmate/utils/LibString.sol";
import "./AddressToString.sol";
import "./PinkyPromise.sol";

library PinkyPromiseSvg {
    using LibString for uint16;
    using AddressToString for address;

    // avoid the 16 vars limit in promiseAsSvg()
    struct SvgValues {
        string height;
        string title;
        string body;
        string color;
        string signees;
    }

    function promiseAsSvg(PinkyPromise.PromiseData storage data, address[] calldata signees)
        public
        view
        returns (string memory)
    {
        SvgValues memory values;
        values.height = data.height.toString();
        values.title = data.title;
        values.body = promiseTextToHtml(data.body);
        values.color = promiseColor(data.color);
        values.signees = signeesAsHtml(signees);

        string memory html;
        {
            html = string.concat(
                '<svg width="800" height="',
                values.height,
                '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ',
                values.height,
                '"><foreignObject x="0" y="0" width="800" height="100%"><div class="root" xmlns="http://www.w3.org/1999/xhtml"><style>:root{--color:',
                values.color,
                '}svg *{box-sizing:border-box}svg .root{height:100%;background:var(--color);padding:24px;font:400 16px/1.5 Courier New,monospace}svg .main{height:100%;color:#333;background:#f6f6f6;border-radius:64px;padding:80px 80px 24px;position:relative;overflow:hidden}svg .content{width:100%;height:100%;flex-direction:column;display:flex}svg .title{flex-grow:0;flex-shrink:0;font-size:26px}svg .body{flex-grow:1;flex-shrink:0;padding-top:46px;overflow:hidden}svg .body p{margin:24px 0}svg .body p:first-child{margin-top:0}svg .body h1{margin:32px 0;padding-bottom:5px;font-size:26px;font-weight:400;line-height:36px;position:relative}svg .body h2{margin:24px 0;font-size:22px;font-weight:400;line-height:32px}svg .signees{flex-direction:column;flex-grow:0;flex-shrink:0;gap:8px;padding-top:0;display:flex;overflow:hidden}svg .signee{height:64px;border:2px solid var(--color);border-radius:20px;justify-content:space-between;align-items:center;gap:12px;padding:0 16px;display:flex}svg .signee:before{content:"";width:40px;height:40px;background:var(--color);border-radius:50%}svg .signee .signature{width:80px;height:40px;color:#fff;background:var(--color);border-radius:64px;flex-shrink:0;justify-content:center;align-items:center;display:flex}svg .not-a-logo{flex-grow:0;flex-shrink:0;justify-content:center;padding:40px 0;display:flex}</style><div class="main"><div class="content"><h1 class="title">',
                values.title,
                '</h1><div class="body">',
                values.body,
                '</div><div class="signees">',
                values.signees,
                '</div><div class="not-a-logo"><img alt="" height="64" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2265%22%20height%3D%2264%22%20fill%3D%22none%22%3E%3Cstyle%3E%3Aroot%20%7B--color%3A%20',
                values.color,
                '%3B%7D%3C%2Fstyle%3E%3Cmask%20id%3D%22a%22%20width%3D%2264%22%20height%3D%2264%22%20x%3D%221%22%20y%3D%220%22%20maskUnits%3D%22userSpaceOnUse%22%20style%3D%22mask-type%3Aalpha%22%3E%3Ccircle%20cx%3D%2232.899%22%20cy%3D%2232%22%20r%3D%2231.631%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23a)%22%3E%3Ccircle%20cx%3D%2232.898%22%20cy%3D%2231.999%22%20r%3D%2232%22%20fill%3D%22%23F6F6F6%22%2F%3E%3Cpath%20style%3D%22fill%3Avar(--color)%3Bstroke%3Avar(--color)%3Bstroke-width%3A1.5%22%20d%3D%22m33.69%2054.298-5.902%2014.097S13.205%2064.664%207.024%2058.008C.508%2050.99-1.883%2035.114-1.883%2035.114c.633-.565%202.098-1.802%202.899-2.226%201.001-.53%202.371-.582%203.425-.424%201.054.16%203.162.848%204.69%206.148.088-.195.517-.732%201.529-1.325%201.265-.742%202.371-1.272%204.11-.848%201.74.424%201.792%201.166%202.688%202.173.896%201.007%201.423%204.133%201.845%209.645-.018%201.307.2%204.176%201.212%205.193%201.827-2.19%205.776-7.398%206.956-10.705%202.412-5.697%201.581-4.292%204.322-10.28.193-1.149%201.317-3.562%201.107-5.724-.264-2.703.046-9.088.79-10.705.745-1.616%202.51-1.895%203.096-1.756.587.14%202.418%201.1%202.853%204.373.562%203.692%201.271%2013.059-.626%2021.284L33.69%2054.298Z%22%2F%3E%3Cpath%20fill%3D%22%23F6F6F6%22%20style%3D%22stroke%3Avar(--color)%3Bstroke-width%3A1.5%22%20d%3D%22M37.513%2020.84c-.704-.75-1.293-.758-1.08-6.333%200%200%201.586-.064%202.507%201.528s.969%205.547.969%205.547c-.603.117-1.783-.088-2.396-.742Z%22%2F%3E%3Cpath%20stroke%3D%22%23F6F6F6%22%20stroke-width%3D%221.5%22%20d%3D%22M8.993%2039.434s-.214%203.94-.526%206.996c-.385%203.768-1.238%209.619-1.238%209.619M20.534%2053.398c-.864%202.607-1.555%206.438-1.792%208.028%22%2F%3E%3Cpath%20fill%3D%22%23F6F6F6%22%20style%3D%22stroke%3Avar(--color)%3Bstroke-width%3A1.5%22%20d%3D%22M35.798%2062.619c.843%203.9%201.054%205.494%201.265%205.882%2013.608-2.834%2019.51-6.78%2026.666-18.548l-1.475-2.65-2.319-3.179c-.527-.954-1.96-3.2-3.478-4.558-1.518-1.356-4.568-.565-5.903%200-.562.177-1.981%201.103-3.162%203.392-1.475%202.862-.948%203.074-1.792%204.346-.843%201.271-1.264.953-2.213%200-.949-.954-2.003-3.392-4.321-6.572-1.855-2.543-2.53-3.886-2.635-4.24-1.054-2.19-2.358-5.641-2.938-9.472-.476-3.137.105-4.8%200-7.873-.085-2.46-.535-4.411-.66-4.82-.513-1.682-1.12-2.517-2.305-2.795-2.644-.62-5.48%203.365-5.89%206.625-.13%201.308-1.889%209.263.725%2016.64%203.268%209.221%204.533%209.592%206.22%2013.514%202.318%204.875%203.161%209.432%204.215%2014.308Z%22%2F%3E%3Cpath%20fill%3D%22%23F6F6F6%22%20d%3D%22M55.924%2039.208s.953-5.443%203.636-6.756c1.916-.938%203.325-.081%205.455-.133%200-2.332%201.475-2.932%202.213-2.941.45%202.726.444%204.249.237%206.969-.444%205.858-1.334%208.784-3.715%2013.566l-2.082-3.378-2.081-2.928-3.663-4.399Z%22%2F%3E%3Cpath%20style%3D%22stroke%3Avar(--color)%3Bstroke-width%3A1.5%22%20d%3D%22M65.015%2032.32c-2.13.05-3.54-.806-5.455.132-2.683%201.313-3.636%206.756-3.636%206.756l3.663%204.399%202.081%202.928%202.082%203.378c2.381-4.782%203.27-7.708%203.715-13.566m-2.45-4.028%202.45%204.028m-2.45-4.028c0-2.332%201.475-2.932%202.213-2.941.45%202.726.444%204.249.237%206.969M49.54%2049.813s1.72%202.675%203.374%204.585m3.827%204.14s-2.416-2.51-3.827-4.14m0%200c-3.242.887-4.814.304-7.28-2.434%22%2F%3E%3Cpath%20fill%3D%22%23F6F6F6%22%20style%3D%22stroke%3Avar(--color)%3Bstroke-width%3A1.5%22%20d%3D%22M28.889%2016.55c1.298-1.483%201.324-3.972%201.175-5.03-.168-.133-2.098.344-3.539%202.34-1.089%201.51-1.63%204.143-1.63%204.143.14-.031%202.371.403%203.994-1.452Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E" width="64"/></div></div></div></div></foreignObject></svg>'
            );
        }
        return html;
    }

    function signeesAsHtml(address[] calldata signees) public pure returns (string memory) {
        string memory html = "";
        for (uint256 i = 0; i < signees.length; i++) {
            html = string.concat(html, signeeAsHtml(signees[i]));
        }
        return html;
    }

    function signeeAsHtml(address signee) public pure returns (string memory) {
        string memory addressHtml = signee.toString();
        return string.concat(
            '<div class="signee"><div>',
            addressHtml,
            '</div><div class="signature"><svg width="60" height="19" fill="none"><path fill="#fff" stroke="#fff" stroke-linecap="round" d="m58.433 5.1-.426-.357-.544-.038-.645.333-.416-.56-1.081-1.149-.78-.625-1.072-.71-.926-.446-1.027-.33-1.104-.219-.882-.057-1.11.095-1.45.381-1.01.469-1.043.69-1.125.925-.749.773-1.478 1.732-1.426 1.82-.152-.347-.729-.902-.661-.524-1.164-.546-.854-.204-1.432-.073-1.049.101-1.056.258-1.434.565-1.145.638-1.288.949-1.194 1.074-2.08 2.374-3.856 4.95-.385.43-.112.085-.137-.229-.324-.79-1.52-4.681-1.112-2.785-.625-1.097-.504-.671-.483-.446-.579-.344-.423-.125-.586-.04-.878.22-1.014.626-.874.837-.853 1.078-.795 1.197-1.067 1.903-1.656 3.33-.51.695-.122-.044-.507-.594-2.453-3.998-1.09-1.53-.644-.556-.762-.082-.443.276-.216.686.571 2.88.202 1.71.053 1.125.13.517.448.376.584.041.5-.313.241-.666.02-.402-.133-.533-.453-.38-.152-.011-.056-.18-.427-1.938-.078-1.038.383.355 1.134 1.34 2.377 3.583.576.484.619.051.54-.334.49-.672 1.493-3.327.8-1.574.734-1.257.996-1.36.823-.858.686-.48.756-.257.363.004.31.094.448.267.382.407.906 1.485.566 1.31.654 1.788 1.688 5.563.16.29.411.357.541.077.58-.28.499-.457 3.647-5.198 1.206-1.507 1.046-1.157 1.16-1.04.932-.698 1.19-.67 1.027-.419 1.342-.349 1.306-.093 1.002.105 1.182.435.718.499.518.696.169.396.06.399-.119.813.112.449.377.316.483.034.54-.293.959-1.93 1.153-1.902.983-1.3.942-.999 1.107-.874 1.125-.62 1.343-.4 1.392-.135.894.095 1.357.366.89.384.813.499.774.594.64.702.514.761.282.777.101.403.493.43.66.025.212-.096 1.089-.616.21-.52-.134-.54Z"></path></svg></div></div>'
        );
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
