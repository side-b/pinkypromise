import type { ColorId } from "./types";

export const PROMISE_SYNONYMS = [
  "Pacts",
  "Treaties",
  "Agreements",
  "Covenants",
  "Accords",
  "Guarantees",
  "Pledges",
  "Certificates",
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

export const PROMISE_COLORS_BY_ID = Object.entries(PROMISE_COLORS) as Array<[
  ColorId,
  string,
]>;

export const HOME_STEPS = [
  "Sign a promise with friends (foes work too). It will get stored entirely on-chain, using an immutable contract.",
  "Each participant receives a soulbound NFT, allowing to consult, or get haunted by, the promise from their wallets.",
  "You can break a promise at any time, like in real life − except here, all participants need to do it. Less grudge overall.",
];

export const DOC_WIDTH = 800;

export const PLACEHOLDER_TITLE = "Pinky Promise";
export const PLACEHOLDER_BODY = `Pinky, pinky bow-bell,
Whoever tells a lie
Will sink down to the bad place
And never rise up again.`;

export const EDITOR_CONFIRM_NOTICE = `
  The title and content are required. Add as many signees addresses as you want.
`.trim();

export const PROMISE_NOTICE_DISCARDED = [
  `
  This broken promise is still on chain but it can’t get signed anymore.
  `.trim(),
];

export const PROMISE_NOTICE_DRAFT_UNSIGNED = [
  `
  You can share the link to this promise with the other signees for them to sign
  it, or break this promise to discard it.
  `.trim(),
  "Sign",
];

export const PROMISE_NOTICE_DRAFT_SIGNED = [
  `
  You can share the link to this promise with the other signees for them to sign
  it, or break this promise to discard it.
`.trim(),
  "Break", // discard()
];

export const PROMISE_NOTICE_NULLREQUEST = [
  `
  You have requested to break this promise. If all the other signees break it,
  the soulbound NFTs will be destroyed.
`.trim(),
  "Unbreak", // cancelNullify()
];

export const PROMISE_NOTICE_SIGNED = [
  `
  All signees have signed and this promise is now minted
  as soulbound NFTs that can be seen in each signee wallet. If
  all signees break it, the NFTs will be burnt.
`.trim(),
  "Break", // nullify()
];

export const FOOTER_LINKS = [
  ["side-b", "https://github.com/bpierre/pinkypromise"],
  ["faq", "https://github.com/bpierre/pinkypromise"],
  ["source", "https://github.com/bpierre/pinkypromise"],
];

function TxLink({ label, url }: { label: string; url?: string }) {
  return url
    ? <a href={url} rel="nofollow" target="_blank">{label}</a>
    : <>{label}</>;
}

export const TxSteps = {
  AskChangeNetwork: () => <>Please switch to a supported network.</>,
  AskConnect: () => <>Please connect your wallet.</>,
  Preparing: () => <>Preparing transaction…</>,
  PreparingError: () => <>Error preparing the transaction.</>,
  BeforeSign: () => (
    <>
      Let’s sign this transaction. Get your wallet ready, then press the button −
      softly but firmly.
    </>
  ),
  Sign: () => <>Now is your time: sign the transaction in your wallet.</>,
  SignError: () => <>Error signing the transaction.</>,
  ConfirmWait: () => <>Perfect! Now waiting for the transaction to be confirmed…</>,
  ConfirmError: ({ txUrl }: { txUrl?: string }) => (
    <>
      Error confirming <TxLink url={txUrl} label="the transaction" />.
    </>
  ),
  ConfirmSuccess: () => (
    <>
      And we’re done! The transaction has been confirmed.
    </>
  ),
};
