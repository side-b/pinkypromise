import fs from "fs";
import * as css from "lightningcss";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SvgDoc, SvgDocSignee } from "../src/SvgDoc";

const SOURCE_PATH = new URL(
  "../contracts/PinkyPromiseSvg.tpl.sol",
  import.meta.url,
).pathname;

const PROMISE_SVG_MARKER = /"<PROMISE_SVG>"/;
const SIGNEE_LINE_MARKER = /"<SIGNEE_LINE_HTML>"/;

function getPromiseSvgCode() {
  const svg = renderToStaticMarkup(
    createElement(SvgDoc, {
      bodyHtml: "_BODY_",
      height: 9999,
      signees: "_SIGNEES_",
      title: "_TITLE_",
      color: "_COLOR_",
    }),
  ).replace(/&quot;/g, "\"");

  // compress css
  const styleStart = svg.indexOf("<style>");
  const styleEnd = svg.indexOf("</style>");
  const styles = css.transform({
    filename: "style.css",
    code: Buffer.from(svg.slice(styleStart + "<style>".length, styleEnd)),
    minify: true,
  }).code;

  return `string.concat('` + (
    svg.slice(0, styleStart + "<style>".length)
    + styles
    + svg.slice(styleEnd)
  )
    .replace(/_BODY_/g, "', values.body ,'")
    .replace(/9999/g, "', values.height ,'")
    .replace(/_SIGNEES_/g, "', values.signees ,'")
    .replace(/_TITLE_/g, "', values.title ,'")
    .replace(/_COLOR_/g, "', values.color ,'")
    + "')";
}

function getSigneeLineHtmlCode() {
  const svg = renderToStaticMarkup(
    createElement(SvgDocSignee, {
      address: "_ADDRESS_",
    }),
  );
  return `string.concat('`
    + svg.replace(/_ADDRESS_/g, "', addressHtml ,'")
    + "')";
}

function insertCode(source: string, marker: RegExp, code: string) {
  const lines = source.split("\n");
  const lineIndex = lines.findIndex(line => marker.test(line));
  if (lineIndex === -1) {
    throw new Error(`Couldn’t find the marker: ${marker}`);
  }
  return (
    lines.slice(0, lineIndex).join("\n") + "\n"
    + lines[lineIndex].replace(marker, code) + "\n"
    + lines.slice(lineIndex + 1).join("\n")
  ).trim();
}

function updateTemplate(source: string) {
  source = insertCode(source, PROMISE_SVG_MARKER, getPromiseSvgCode());
  source = insertCode(source, SIGNEE_LINE_MARKER, getSigneeLineHtmlCode());
  source = "// FILE GENERATED, DO NOT EDIT DIRECTLY\n\n" + source;
  return source;
}

console.log(
  updateTemplate(
    fs.readFileSync(SOURCE_PATH, "utf8"),
  ),
);
