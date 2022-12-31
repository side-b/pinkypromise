import type { ColorId } from "./types";

export const PROMISE_SYNONYMS = [
  "Pacts",
  "Treaties",
  "Agreements",
  "Covenants",
  "Accords",
  "Guarantees",
  "Pledges",
];

export const COLORS = {
  black: "#1E1E1E",
  blue: "#0007B0",
  pink: "#ED9AC9",
  red: "#FF5262",
  white: "#FFFFFF",
  grey: "#F6F6F6",
} as const;

export const PROMISE_COLORS: Record<ColorId, string> = {
  // declaration order is important (for PROMISE_COLORS_BY_ID)
  pink: COLORS.pink,
  blue: COLORS.blue,
  red: COLORS.red,
  black: COLORS.black,
};

export const PROMISE_COLORS_BY_ID = Object.entries(PROMISE_COLORS) as [ColorId, string][];

export const DOC_WIDTH = 800;

export const PLACEHOLDER_TITLE = "Pinky Promise";
export const PLACEHOLDER_BODY = `Pinky, pinky bow-bell,
Whoever tells a lie
Will sink down to the bad place
And never rise up again.`;

export const EDITOR_CONFIRM_NOTICE = `
  Non-fungible tokens (NFTs) are unique crypto assets that are stored on a blockchain.
  Creating an NFT allows users to upload digital media.
`.trim();
