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

export const HOME_INTRO =
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

/* eslint-disable react/jsx-key */
export const FAQ_ITEMS = [
  [
    "What is a pinky promise?",
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
    <p>
      Promises are stored entirely onchain and don’t rely on any other hosting
      solution. This is to ensure a maximum level of availability now and in the
      future. You can rest assured knowing they’ll be around for a long, long time.
    </p>,
  ],
  [
    "Can I see the promise in my wallet?",
    <p>
      Yes indeed: signed promises are minted as soulbound NFTs, which means you can
      check them out in any wallet that supports NFTs. The image generated by the
      contract contains the full promise. Sweet, eh?
    </p>,
  ],
  [
    "What are soulbound tokens?",
    <p>
      Soulbound NFTs are non-transferable tokens – like a tattoo on your digital
      self. Once you’ve got one, it’s there for life and it will always be tied to
      the account that signed the promise. You can’t sell it or give it away, it’s
      yours and yours forever.
    </p>,
  ],
  [
    "What are the fees?",
    <p>
      There is no fee other than the gas required to pay for the transaction. This
      transaction fee will depend on the size of your promise and the current gas
      price.
    </p>,
  ],
  [
    "What networks are supported?",
    <>
      <p>
        Pinky Promise is deployed on the following networks: Ethereum, Goerli,
        Polygon, Arbitrum, and Optimism. This app supports creating promises in any
        of these networks and you can switch between them using the button in the
        header.
      </p>
      <p>
        To start, we recommend you to try creating a promise on Goerli since it is
        intented as a testing network.
      </p>
    </>,
  ],
  [
    "What formatting options can I use?",
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
    "How does breaking a promise work?",
    <>
      <p>
        Breaking a promise happens when all signees agree to do it, which marks the
        promise as broken (void). This feature can be used to mark a promise as not
        valid any more in an explicit way (e.g. when signing a new version of a
        contract).
      </p>
      <p>
        Any signee can break the promise while it is still a draft (i.e. before it
        gets fully signed), without requiring the others to do it.
      </p>
    </>,
  ],
  [
    "Are promises legally binding / enforceable?",
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
    <p>
      Of course! The codebase is fully open source and available{" "}
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
    <>
      <p>
        We’ve built Pinky Promise to be as decentralized as possible. This means that
        this web app is completely optional to access your promises, thanks to the
        following decisions:
      </p>
      <p>
        First, the entire promise appears as the image of its soulbound NFTs,
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
/* eslint-enable react/jsx-key */
