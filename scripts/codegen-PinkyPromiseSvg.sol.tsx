import fs from "fs";
import * as css from "lightningcss";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SvgDoc } from "../src/SvgDoc";

const SOURCE_PATH = new URL("../contracts/PinkyPromiseSvg.tpl.sol", import.meta.url).pathname;
const SOURCE_REPLACER_MARK = /<SVG_WRAPPER>/;

function getPactSvgInnerCode() {
  const svg = renderToStaticMarkup(
    createElement(SvgDoc, {
      height: 9999,
      html: "CONTENT_HTML",
      signees: "SIGNEES_HTML",
    }),
  ).replace(/&quot;/g, "\"");

  const styleStart = svg.indexOf("<style>");
  const styleEnd = svg.indexOf("</style>");
  const styles = css.transform({
    filename: "style.css",
    code: Buffer.from(svg.slice(styleStart + "<style>".length, styleEnd)),
    minify: true,
  }).code;

  return `
        // generated, do not edit directly
        return string.concat('` + (
    svg.slice(0, styleStart + "<style>".length)
    + styles
    + svg.slice(styleEnd)
  )
    .replace(/'/g, "'")
    .replace(/9999/g, "', _height ,'")
    .replace(/CONTENT_HTML/g, "', contentHtml ,'")
    .replace(/SIGNEES_HTML/g, "', signeesHtml ,'")
    + "');";
}

function addPactSvgWrapperCode(code: string) {
  const source = fs.readFileSync(SOURCE_PATH, "utf8");
  const lines = source.split("\n");
  const markerLine = lines.findIndex(line => SOURCE_REPLACER_MARK.test(line));
  return `${lines.slice(0, markerLine).join("\n")}\n${code}\n${lines.slice(markerLine + 1).join("\n")}`.trim();
}

console.log(
  addPactSvgWrapperCode(getPactSvgInnerCode()),
);
