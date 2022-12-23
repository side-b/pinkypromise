import type { Address, EnsName } from "./types";

import { match } from "ts-pattern";

export const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
export function isAddress(value: string): value is Address {
  return ADDRESS_RE.test(value);
}

export function isEnsName(value: string): value is EnsName {
  return value.endsWith(".eth") && value.length > 4;
}

export const ADDRESS_NULL = "0x0000000000000000000000000000000000000000" as const;

type HtmlBlock = {
  type: "p";
  content: string;
} | {
  type: "h1";
  content: string;
} | {
  type: "h2";
  content: string;
};

export function blocksToHtml(blocks: HtmlBlock[]): string {
  return blocks.map(block =>
    match(block)
      .with(
        { type: "p" },
        ({ content }) => `<p>${lineBreaksToHtml(content)}</p>`,
      )
      .with(
        { type: "h1" },
        ({ content }) => `<h1>${lineBreaksToHtml(content)}</h1>`,
      )
      .with(
        { type: "h2" },
        ({ content }) => `<h2>${lineBreaksToHtml(content)}</h2>`,
      )
      .otherwise(() => "")
  ).join("\n");
}

export function lineBreaksToHtml(text: string) {
  return text.replace(/\n/g, "<br />");
}

export function textToBlocks(text: string): HtmlBlock[] {
  return text
    .trim()
    .replace(/\n{3,}/g, "\n\n")
    .split("\n\n")
    .map((line) =>
      match(line.trim())
        .when(
          (line) => line.startsWith("## "),
          (line) => ({ type: "h2" as const, content: line.slice(3) }),
        )
        .when(
          (line) => line.startsWith("# "),
          (line) => ({ type: "h1" as const, content: line.slice(2) }),
        )
        .otherwise((line) => ({ type: "p", content: line }))
    );
}

export function shortenAddress(address: string, charsLength = 4): string {
  const prefixLength = 2; // "0x"
  if (!address) {
    return "";
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address.toLowerCase();
  }
  return (
    address.slice(0, charsLength + prefixLength)
    + "…"
    + address.slice(-charsLength)
  ).toLowerCase();
}

export function uid(prefix = "uid"): string {
  return `${prefix}-${Math.round(Math.random() * 10 ** 8)}`;
}
