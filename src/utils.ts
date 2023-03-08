import type {
  Address,
  ColorId,
  EnsName,
  NetworkPrefix,
  PromiseState,
} from "./types";

import { match } from "ts-pattern";
import { APP_CHAINS, COLORS } from "./constants";
import { isNetworkPrefix } from "./types";

export const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
export function isAddress(value: string): value is Address {
  return ADDRESS_RE.test(value);
}

export function addressesEqual(addr1: Address, addr2: Address) {
  return addr1.toLowerCase() === addr2.toLowerCase();
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

export function blocksToHtml(blocks: HtmlBlock[]): string {
  return blocks.map((block) =>
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

export function blocksToText(blocks: HtmlBlock[]): string {
  return blocks.map((block) => block.content).join("\n");
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

export function lerp(value: number, low: number, high: number): number {
  return (high - low) * value + low;
}

export function formatDate(value: Date = new Date()) {
  return [
    String(value.getDay() + 1).padStart(2, "0"),
    String(value.getMonth() + 1).padStart(2, "0"),
    value.getFullYear(),
  ].join(".");
}

export function promiseColors(color: ColorId) {
  return match(color)
    .with("pink", () => ({ color: COLORS.pink, contentColor: COLORS.white }))
    .with("blue", () => ({ color: COLORS.blue, contentColor: COLORS.white }))
    .with("red", () => ({ color: COLORS.grey, contentColor: COLORS.red }))
    .with("black", () => ({ color: COLORS.grey, contentColor: COLORS.black }))
    .exhaustive();
}

export function formatPromiseState(state: PromiseState) {
  if (state === "Signed") return "Signed";
  if (state === "Draft") return "Draft";
  return "Broken";
}

export function shortNetworkName(id: number) {
  return match(id)
    .with(31337, () => "lcl")
    .with(1, () => "eth")
    .with(5, () => "grl")
    .with(137, () => "plg")
    .with(42161, () => "abt")
    .with(42161, () => "opt")
    .otherwise(() => "???");
}

export function appChainFromPrefix(prefix: NetworkPrefix) {
  return APP_CHAINS.find((chain) => chain.prefix === prefix);
}

export function appChainFromId(chainId: number) {
  return APP_CHAINS.find((chain) => chain.chainId === chainId);
}

export function appChainFromName(name: string) {
  return APP_CHAINS.find((chain) => chain.name === name);
}

export function parseFullPromiseId(
  fullPromiseId: string,
): undefined | [prefix: NetworkPrefix, id: number] {
  let parts = fullPromiseId.split("-");
  const id = parseInt(parts[1], 10);
  return (isNetworkPrefix(parts[0]) && !isNaN(id))
    ? [parts[0], id]
    : undefined;
}

export async function sleep(duration: number) {
  return new Promise((r) => setTimeout(r, duration));
}
