import { colord } from "colord";
import { BigNumber } from "ethers";
import { Masonry } from "masonic";
import { useMemo, useState } from "react";
import { match, P } from "ts-pattern";
import { useContractRead, useContractReads } from "wagmi";
import { Link } from "wouter";
import { PinkyPromiseAbi } from "./abis";
import { COLORS } from "./constants";
import { CONTRACT_ADDRESS } from "./environment";
import { blocksToHtml, textToBlocks } from "./utils";
import { ViewButton } from "./ViewButton";

const EMPTY_CARDS_HEIGHTS = [400, 568, 400, 680, 400, 680];

export function PromisesScreen() {
  const width = 400 * 3 + 40 * 2;

  const totalRead = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: PinkyPromiseAbi,
    functionName: "total",
  });

  const total = totalRead.data?.toNumber() ?? 0;

  const gridItems = useMemo(() => (
    Array
      .from({ length: Math.max(6, total) })
      .map((_, index) => ({
        empty: (index + 1) > total ? EMPTY_CARDS_HEIGHTS[index] : null,
        promiseId: total - index,
      }))
  ), [total]);

  const [showDrafts, setShowDrafts] = useState(false);
  const [showNullified, setShowNullified] = useState(false);
  const [onlyYours, setOnlyYours] = useState(false);

  return (
    <div css={{ width, margin: "0 auto" }}>
      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "32px",
        }}
      >
        <div css={{ display: "flex", gap: "16px" }}>
          <ViewButton
            active={showDrafts}
            label="Drafts"
            onToggle={setShowDrafts}
          />
          <ViewButton
            active={showNullified}
            label="Nulled"
            onToggle={setShowNullified}
          />
        </div>
        <ViewButton
          active={onlyYours}
          label="Only yours"
          onToggle={setOnlyYours}
        />
      </div>
      <div>
        {match(totalRead.status)
          .with("success", () => (
            <Masonry
              columnGutter={40}
              columnWidth={400}
              itemHeightEstimate={400}
              items={gridItems}
              render={PromiseOrEmptyCard}
              tabIndex={-1}
            />
          ))
          .with(P.union("loading", "idle"), () => <div>Loading…</div>)
          .with("error", () => <div>Error loading the promises.</div>)
          .exhaustive()}
      </div>
    </div>
  );
}

function PromiseOrEmptyCard({
  data,
  width,
}: {
  data: {
    empty: number | null;
    promiseId: number;
  };
  width: number;
}) {
  return data.empty === null
    ? (
      <PromiseCard
        promiseId={data.promiseId}
        width={width}
      />
    )
    : (
      <EmptyCard
        height={data.empty}
        width={width}
      />
    );
}

function PromiseCard({
  promiseId,
  width,
}: {
  promiseId: number;
  width: number;
}) {
  const reads = useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESS,
        abi: PinkyPromiseAbi,
        functionName: "promiseInfo",
        args: [BigNumber.from(promiseId)],
      },
      {
        address: CONTRACT_ADDRESS,
        abi: PinkyPromiseAbi,
        functionName: "tokenURI",
        args: [BigNumber.from(promiseId)],
      },
    ],
  });

  const body = reads.data?.[0].data.body ?? "";
  const bodyHtml = useMemo(() => blocksToHtml(textToBlocks(body)), [body]);

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        width,
        minHeight: 400,
        padding: 40,
        background: COLORS.grey,
        borderRadius: 64,
      }}
    >
      <h1 css={{ fontSize: 14 }}>{reads.data?.[0].data.title}</h1>
      <div
        css={{
          "p, h1, h2, h3": {
            margin: "24px 0",
            fontSize: 10,
          },
          "h1": {
            fontSize: 14,
          },
          "h2": {
            fontSize: 12,
          },
          "h3": {
            fontSize: 10,
          },
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>
    </div>
  );
}

function EmptyCard({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  return (
    <Link href="/new">
      <a
        css={{
          display: "grid",
          placeItems: "center",
          width,
          height,
          background: colord(COLORS.grey).alpha(0.4).toHex(),
          borderRadius: "64px",
        }}
      >
        <div
          css={{
            display: "grid",
            placeItems: "center",
            width: "40px",
            height: "40px",
            color: COLORS.white,
            background: COLORS.pink,
            border: "0",
            borderRadius: "50%",
            "&:focus-visible": {
              outline: `2px solid ${COLORS.pink}`,
              outlineOffset: "3px",
            },
            "&:active": {
              transform: "translate(1px, 1px)",
            },
          }}
        >
          <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
            <path
              d="M9 20h22M20 31V9"
              stroke={COLORS.white}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </a>
    </Link>
  );
}
