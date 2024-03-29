import type { ReactNode } from "react";
import type { AppChain, ColorId } from "./types";

export const APP_CHAINS = [
  { chainId: 42161, prefix: "A", name: "arbitrum", shortName: "abt" },
  { chainId: 8453, prefix: "B", name: "base", shortName: "bse" },
  { chainId: 5, prefix: "G", name: "goerli", shortName: "grl" },
  { chainId: 31337, prefix: "L", name: "local", shortName: "lcl" },
  { chainId: 1, prefix: "E", name: "mainnet", shortName: "eth" },
  { chainId: 10, prefix: "O", name: "optimism", shortName: "opt" },
  { chainId: 137, prefix: "P", name: "polygon", shortName: "plg" },
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
  green: "#7DFF00",
  blueGrey: "#7B7298",
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

export const HOME_BUTTON = "Very well";

export const TAGLINE =
  "Onchain accountability from jolly commitments between friends and foes";

export const HOME_STEPS = [
  "Effortless and cutest way of co-signing messages onchain",
  "As long as the ethereum network exists, your promise will be up",
  "Get a soulbound NFT as a memento readable in full from a wallet",
].map((s) => s.trim());

export const PLACEHOLDER_TITLE = "Collab agreement";
export const PLACEHOLDER_BODY =
  "We wish to associate as co-creators and partners in a prospective business adventure and will share all/any profits equally, realised from the sale of any products and/or services provided by this partnership.";

export const EDITOR_CONFIRM_NOTICE = `
  The title and content are required. Add as many signees addresses as you want.
`.trim();

export const PROMISE_NOTICE_DISCARDED = [
  `
  This broken promise is still on chain but it has been discarded and can not get signed anymore.
  `.trim(),
];

export const PROMISE_NOTICE_DRAFT_UNSIGNED = [
  `
  Share the address of this promise with the other signees for them to sign it.
  `.trim(),
  "Sign", // sign()
];

export const PROMISE_NOTICE_DRAFT_SIGNED = [
  `
  Share the address of this promise with the other signees for them to sign it, or discard it.
`.trim(),
  "Discard", // discard()
];

export const PROMISE_NOTICE_SIGNED = [
  `
  This promise has been minted as soulbound tokens that can be seen in each signee’s wallet.
`.trim(),
];

export const GH_REPO_URL = "https://github.com/side-b/pinkypromise";
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

/* eslint-disable react/jsx-key */
export const FAQ_ITEMS = [
  [
    "What is a pinky promise?",
    null,
    <p>
      A pinky promise is a commitment to act in a certain way, a public declaration
      of intentions, a socio-technical contract on the blockchain. It’s the simplest
      (and cutest) way of co-signing messages between friends that live entirely
      onchain. These promises act as a framework for cooperation in human-machine
      systems that are based on trust.
    </p>,
  ],
  [
    "Where are the promises stored?",
    "Where are they stored?",
    <p>
      Promises are stored entirely onchain and don’t rely on any other hosting
      solution. This is to ensure a maximum level of availability now and in the
      future. You can rest assured knowing they’ll be around for a long, long time.
    </p>,
  ],
  [
    "Can I see the promise in my wallet?",
    "Do they show in wallets?",
    <p>
      Yes indeed: signed promises are minted as soulbound token, which means you can
      check them out in any wallet that supports NFTs. The image generated by the
      contract contains the full promise. Sweet, eh?
    </p>,
  ],
  [
    "What are soulbound tokens?",
    "Soulbound tokens?",
    <p>
      Soulbound tokens are non-transferable NFTs – like a tattoo on your digital
      self. Once you’ve got one, it’s there for life and it will always be tied to
      the account that signed the promise. You can’t sell it or give it away, it’s
      yours and yours forever.
    </p>,
  ],
  [
    "What are the fees?",
    null,
    <p>
      There is no fee other than the gas required to pay for the transaction. This
      transaction fee will depend on the size of your promise and the current gas
      price.
    </p>,
  ],
  [
    "What chains are supported?",
    "What chain is it on?",
    <>
      <p>
        Pinky Promise is deployed Ethereum, Goerli and Polygon. This app supports
        creating promises in any of these networks and you can switch between them
        using the button in the header.
      </p>
      <p>
        To start, we recommend you to try creating a promise on Goerli since it is
        intented as a testing network.
      </p>
    </>,
  ],
  [
    "What formatting options can I use?",
    "Any formatting options?",
    <>
      <p>
        Pinky Promise supports a limited set of text formatting features based on the
        markdown syntax, which includes:
      </p>
      <p>
        - Line breaks: one for new lines, two for paragraphs.<br />
        - Level 1 heading, use <code>{"# heading"}</code>.<br />
        - Level 2 heading, use <code>{"## heading"}</code>.<br />
      </p>
      <p>
        You can preview these features in the promise editor.
      </p>
    </>,
  ],
  [
    "Are promises legally binding / enforceable?",
    "Is it legally binding?",
    <p>
      We’re not lawyers, but we can safely say that a pinky promise doesn’t have
      legal enforceability per se. Yet it could be used in a legal context as proof
      of intent, like any other document or verbal agreement, if it satisfies all of
      the elements of a contract. It all depends on how you and your co-signees
      decide to use it in your local jurisdictions.
    </p>,
  ],
  [
    "Is Pinky Promise open source?",
    "Is it open source?",
    <p>
      Of course, the codebase is fully open source and available{" "}
      <a
        href={GH_REPO_URL}
        rel="nofollow"
        target="_blank"
      >
        on GitHub
      </a>{" "}
      under the MIT license.
    </p>,
  ],
  [
    "What happens if this app goes down?",
    "What if it goes down?",
    <>
      <p>
        We’ve built Pinky Promise to be as decentralized as possible. This means that
        this web app is completely optional to access your promises, thanks to the
        following decisions:
      </p>
      <p>
        First, the entire promise appears as the image of its soulbound token,
        allowing anyone to consult it from an NFT-compatible wallet or website,
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
        single JSON-RPC connection is all it needs to work. See{" "}
        <a href={GH_REPO_URL} rel="nofollow" target="_blank">
          the repository documentation
        </a>{" "}
        for more details on how to do this.
      </p>
    </>,
  ],
  [
    "Who is behind Pinky Promise?",
    "Who is behind this?",
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
] satisfies Array<
  [question: string, questionShort: string | null, answer: ReactNode]
>;
/* eslint-enable react/jsx-key */
