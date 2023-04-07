import fs from "fs";
import * as css from "lightningcss";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SvgDoc,
  SvgDocFingers,
  SvgDocSignature,
  SvgDocSignee,
} from "../src/components/SvgDoc";

const SOURCE_PATH = new URL(
  "../contracts/PinkyPromiseSvg.tpl.sol",
  import.meta.url,
).pathname;

const PROMISE_SVG_CONTENT_MARKER = /"<PROMISE_SVG_CONTENT>"/;
const PROMISE_SVG_FINGERS_MARKER = /"<PROMISE_SVG_FINGERS>"/;
const PROMISE_SVG_WRAPPER_MARKER = /"<PROMISE_SVG_WRAPPER>"/;
const SIGNATURE_MARKER = /"<SIGNATURE_HTML>"/;
const SIGNEE_MARKER = /"<SIGNEE_HTML>"/;

function getPromiseSvgWrapperCode() {
  const wrapper = renderToStaticMarkup(
    createElement(SvgDoc, {
      bodyHtml: "_BODY_",
      color: "_COLOR_",
      contentColor: "_CONTENT_COLOR_",
      fingersMarker: "_FINGERS_",
      height: "_HEIGHT_",
      mode: "svg-wrapper",
      promiseId: "_PROMISE_ID_",
      signedOn: "_SIGNED_ON_",
      signees: "_SIGNEES_",
      status: "_STATUS_",
      title: "_TITLE_",
    }),
  )
    .replace(/&quot;/g, "\"")
    .replace(/&gt;/g, ">");

  // compress css
  const styleStart = wrapper.indexOf("<style>");
  const styleEnd = wrapper.indexOf("</style>");
  const styles = css.transform({
    filename: "style.css",
    code: Buffer.from(wrapper.slice(styleStart + "<style>".length, styleEnd)),
    minify: true,
  }).code;

  return `string.concat('` + (
    wrapper.slice(0, styleStart + "<style>".length)
    + styles
    + wrapper.slice(styleEnd)
  )
    .replace(/_CONTENT_COLOR_/g, "', contentColor ,'")
    .replace(/_COLOR_/g, "', color ,'")
    .replace(/_HEIGHT_/g, "', height ,'")
    .replace(/_MAIN_/g, "', content ,'")
    .replace(/_FINGERS_Y_/g, "', fingersY ,'")
    .replace(/_FINGERS_/g, "', fingers ,'")
    + "')";
}

function getPromiseSvgCodeContent() {
  const content = renderToStaticMarkup(
    createElement(SvgDoc, {
      bodyHtml: "_BODY_",
      color: "_COLOR_",
      contentColor: "_CONTENT_COLOR_",
      height: "_HEIGHT_",
      mode: "svg-main",
      promiseId: "_PROMISE_ID_",
      signedOn: "_SIGNED_ON_",
      signees: "_SIGNEES_",
      status: "_STATUS_",
      title: "_TITLE_",
    }),
  );

  return "string.concat('" + content
    .replace(/_BODY_/g, "', body ,'")
    .replace(/_PROMISE_ID_/g, "', id ,'")
    .replace(/_SIGNED_ON_/g, "', signedOn ,'")
    .replace(/_SIGNEES_/g, "', signees ,'")
    .replace(/_STATUS_/g, "', status ,'")
    .replace(/_TITLE_/g, "', title ,'")
    + "')";
}

function getSigneeHtmlCode() {
  const svg = renderToStaticMarkup(
    createElement(SvgDocSignee, {
      address: "_ADDRESS_",
      signature: "_SIGNATURE_",
    }),
  );
  return `string.concat('`
    + svg
      .replace(/_ADDRESS_/g, "', addressHtml ,'")
      .replace(/_SIGNATURE_/g, "', signature ,'")
    + "')";
}

function getSignatureHtmlCode() {
  const svg = renderToStaticMarkup(createElement(SvgDocSignature));
  return `'${svg}'`;
}

function getFingersCode() {
  const fingers = renderToStaticMarkup(createElement(SvgDocFingers, {
    color: "_COLOR_",
    x: "360",
    y: "_FINGERS_Y_",
  }));
  return `string.concat('` + fingers
    .replace(/_COLOR_/g, "', color ,'")
    .replace(/_FINGERS_Y_/g, "', fingersY ,'")
    + "')";
}

function insertCode(source: string, marker: RegExp, code: string) {
  const lines = source.split("\n");
  const lineIndex = lines.findIndex((line) => marker.test(line));
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
  source = insertCode(
    source,
    PROMISE_SVG_WRAPPER_MARKER,
    getPromiseSvgWrapperCode(),
  );
  source = insertCode(
    source,
    PROMISE_SVG_CONTENT_MARKER,
    getPromiseSvgCodeContent(),
  );
  source = insertCode(source, SIGNEE_MARKER, getSigneeHtmlCode());
  source = insertCode(source, SIGNATURE_MARKER, getSignatureHtmlCode());
  source = insertCode(source, PROMISE_SVG_FINGERS_MARKER, getFingersCode());
  source = "// FILE GENERATED, DO NOT EDIT DIRECTLY\n\n" + source;
  return source;
}

console.log(
  updateTemplate(
    fs.readFileSync(SOURCE_PATH, "utf8"),
  ),
);
