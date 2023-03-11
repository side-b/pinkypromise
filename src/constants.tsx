import type { ReactNode } from "react";
import type { AppChain, ColorId } from "./types";

export const APP_CHAINS = [
  { chainId: 42161, prefix: "A", name: "arbitrum" },
  { chainId: 8453, prefix: "B", name: "base" },
  { chainId: 5, prefix: "G", name: "goerli" },
  { chainId: 31337, prefix: "L", name: "local" },
  { chainId: 1, prefix: "E", name: "mainnet" },
  { chainId: 10, prefix: "O", name: "optimism" },
  { chainId: 137, prefix: "P", name: "polygon" },
] satisfies AppChain[];

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

export const HOME_INTRO =
  "Onchain accountability from jolly commitments between friends and foes";

export const HOME_STEPS = [
  "Sign a promise with friends (foes work too). It will get stored entirely onchain, using an immutable contract.",
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

export const GH_REPO_URL = "https://github.com/bpierre/pinkypromise";
export const SIDEB_URL = "https://github.com/side-b";

export const FOOTER_LINKS = [
  ["source", GH_REPO_URL],
  ["side-b", GH_REPO_URL],
  ["contract", GH_REPO_URL],
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

export const FAQ_ITEMS = [
  ["What is a Pinky Promise?"],
  [
    "Where are the promises stored?",
    <p>
      Promises are stored entirely onchain and don’t rely on any other storage
      solution. This is to ensure a maximum level of availability now and in the
      future.
    </p>,
  ],
  [
    "What are soulbound tokens?",
    <p>
      Soulbound tokens are non-transferable tokens; once you acquire one, it will
      always be tied to your personal wallet and identity, and cannot be sold or
      given to another person.
    </p>,
  ],
  [
    "What are the fees?",
    <p>
      Pinky Promise doesn’t add any fee other than the gas required to pay for the
      transaction. The transaction fee depends on the gas price and the size of the
      promise.
    </p>,
  ],
  [
    "What networks are supported?",
    <p>
      Pinky Promise has been deployed on the following networks: Ethereum, Goerli,
      Polygon, Arbitrum, and Optimism. This app supports any of these networks and
      you can switch using the dedicated button in the header.
    </p>,
  ],
  [
    "What are the legal implications of a promise?",
    <p>
      There are no legal implications enforced by promises in any way. A promise
      could be used in a legal context like any other document, which all depends on
      how the signees decide to use it in regard to their respective local
      jurisdictions.
    </p>,
  ],
  [
    "Can I see the promise in my wallet?",
    <p>
      Yes, signed promises are minted as soulbound NFTs and can be consulted in any
      wallet that supports NFTs. The image generated by the contract contains the
      full promise.
    </p>,
  ],
  [
    "Is Pinky Promise open source?",
    <p>
      Yes, the codebase is fully open source and available{" "}
      <a
        href={GH_REPO_URL}
        rel="nofollow"
        target="_blank"
      >
        on GitHub
      </a>. It is published under the MIT license.
    </p>,
  ],
  [
    "What happens if this app goes down?",
    <>
      <p>
        Pinky Promise has been made while keeping in mind to make it as decentralized
        as possible. It means that this web app is completely optional to access your
        promises, thanks to the following decisions:
      </p>
      <p>
        First, the entire promise gets rendered as the image of its soulbound NFTs,
        allowing anyone to consult it from an NFT-compatible wallet or website
        without relying on anything else than its contract.
      </p>
      <p>
        Second, we aimed for the contract to be as usable as possible by a human
        (e.g. on Etherscan). This means trying to pick functions and parameters that
        correspond to what a person without knowledge of the implementation details
        should expect.
      </p>
      <p>
        Lastly, the app has been made in a way that self hosting should be
        straightforward. Building the app takes can be done using one command, and a
        single JSON-RPC connection is all the app needs to fetch its data. See{" "}
        <a href={GH_REPO_URL} rel="nofollow" target="_blank">
          the repository
        </a>{" "}
        for more details on how to do this.
      </p>
    </>,
  ],
  [
    "Who is behind Pinky Promise?",
    <p>
      Pinky Promise is a project designed and built by{" "}
      <a href="https://twitter.com/dizzypaty" rel="nofollow" target="_blank">
        Paty Davila
      </a>{" "}
      and{" "}
      <a href="https://twitter.com/bpierre" rel="nofollow" target="_blank">
        Pierre Bertet
      </a>.
    </p>,
  ],
] satisfies Array<[question: string, answer?: ReactNode]>;
