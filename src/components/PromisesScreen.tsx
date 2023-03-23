import type { PromiseInfoReturnType, PromiseState } from "../types";

import { a, useTransition } from "@react-spring/web";
import { BigNumber } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useMemo } from "react";
import { match, P } from "ts-pattern";
import { useContractRead, useContractReads } from "wagmi";
import { Appear } from "../components/Appear";
import { Button } from "../components/Button";
import { LoadingFingers } from "../components/LoadingFingers";
import { Pagination } from "../components/Pagination";
import { SvgDocFingers, SvgDocTape } from "../components/SvgDoc";
import { COLORS } from "../constants";
import { PinkyPromiseAbi } from "../lib/abis";
import {
  enumKeyToColor,
  isColorEnumKey,
  promiseStateFromEnumKey,
  useCurrentOrDefaultChainId,
  usePinkyPromiseContractAddress,
} from "../lib/contract-utils";
import { useAccount } from "../lib/eth-utils";
import {
  appChainFromId,
  blocksToText,
  formatDate,
  formatPromiseState,
  promiseColors,
  textToBlocks,
} from "../lib/utils";
import { isPromiseStateEnumKey } from "../types";

const PROMISES_PER_PAGE = 9;

type PromiseCardData = {
  bodyText: string;
  colors: ReturnType<typeof promiseColors>;
  signedOn: string;
  signeesCount: number;
  state: PromiseState;
  title: string;
};

const WIDTH = 400 * 3 + 40 * 2;

export const PromisesScreen = memo(function PromisesScreen({
  mineOnly = false,
  page,
}: {
  mineOnly?: boolean;
  page: number;
}) {
  const chainId = useCurrentOrDefaultChainId();
  const contractAddress = usePinkyPromiseContractAddress(chainId);
  const router = useRouter();
  const { address } = useAccount();

  const promisesIds = usePromisesIds(mineOnly ? "account" : "all");

  const promisesIdsForPage = promisesIds.data?.slice(
    (page - 1) * PROMISES_PER_PAGE,
    (page - 1) * PROMISES_PER_PAGE + PROMISES_PER_PAGE,
  );

  const hasNextPage = page < Math.ceil(
    (promisesIds.data?.length ?? 0) / PROMISES_PER_PAGE,
  );

  const promises = useContractReads({
    contracts: promisesIdsForPage?.map((id) => ({
      abi: PinkyPromiseAbi,
      address: contractAddress,
      args: [BigNumber.from(id)],
      chainId,
      functionName: "promiseInfo",
    })),
    enabled: Boolean(contractAddress) && promisesIdsForPage !== null,
    select: (data) => (
      (data as PromiseInfoReturnType[])?.map((info): PromiseCardData => {
        const colorEnumKey = info?.data.color ?? 0;
        const signedOnTimestamp = Number((info?.signedOn ?? 0).toString());
        return {
          bodyText: blocksToText(textToBlocks(info?.data.body ?? "")),
          colors: promiseColors(
            enumKeyToColor(isColorEnumKey(colorEnumKey) ? colorEnumKey ?? 0 : 0),
          ),
          signedOn: signedOnTimestamp === 0
            ? "−"
            : formatDate(new Date(signedOnTimestamp * 1000)),
          signeesCount: (info?.signees ?? []).length,
          state: promiseStateFromEnumKey(
            isPromiseStateEnumKey(info?.state) ? info?.state : 0,
          ),
          title: info?.data.title ?? "",
        };
      })
    ),
  });

  const cards = useMemo(() => {
    const { data } = promises;
    return promisesIdsForPage && data
      ? (data && promisesIdsForPage)?.map((id, index) => ({
        key: `${id}-${page}-${mineOnly}`,
        promise: { id, data: data[index] },
      } as const))
      : [];
  }, [page, promisesIdsForPage, promises, mineOnly]);

  const status = (
    promisesIds.fetchStatus === "fetching"
      ? "loading"
      : promisesIds.status === "success"
      ? promises.status
      : promisesIds.status
  );

  const refetch = promisesIds.refetch;

  const loadingTransition = useTransition({
    cards,
    connectPlease: mineOnly && !address,
    hasNextPage,
    promises,
    status,
  }, {
    keys: ({ connectPlease, status }) => (
      `${status}-${connectPlease}-${mineOnly}-${page}`
    ),
    from: { opacity: 0, transform: "scale3d(0.9, 0.9, 1)" },
    enter: { opacity: 1, transform: "scale3d(1, 1, 1)" },
    leave: { opacity: 0, immediate: true },
    config: { mass: 1, friction: 80, tension: 1800 },
  });

  return (
    <div
      css={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: WIDTH,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {loadingTransition((style, {
        cards,
        connectPlease,
        hasNextPage,
        status,
      }) => (
        match(connectPlease ? "connect-please" as const : status)
          .with("connect-please", () => (
            <Appear appear={style}>
              <div css={{ color: COLORS.white }}>
                Connect your account to see your promises
              </div>
            </Appear>
          ))
          .with(P.union("loading", "idle"), () => (
            <Appear appear={style}>
              <div css={{ paddingTop: 80 }}>
                <LoadingFingers />
              </div>
            </Appear>
          ))
          .with("error", () => (
            <Appear appear={style}>
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                  color: COLORS.white,
                }}
              >
                <LoadingFingers
                  color={COLORS.red}
                  label="Error loading promises"
                />
                <Button
                  label="Retry"
                  color={COLORS.red}
                  onClick={refetch}
                  size="large"
                />
              </div>
            </Appear>
          ))
          .with("success", () => (
            cards.length > 0
              ? (
                <Appear appear={style}>
                  <div
                    css={{
                      paddingTop: 24,
                      paddingBottom: 80,
                    }}
                  >
                    <PromisesGrid
                      cards={cards}
                      onNextPage={hasNextPage && (() => {
                        router.push(
                          `/${mineOnly ? "mine" : "promises"}/${page + 1}`,
                        );
                      })}
                      onPrevPage={page > 1 && (() => {
                        router.push(
                          `/${mineOnly ? "mine" : "promises"}/${page - 1}`,
                        );
                      })}
                      page={page}
                    />
                  </div>
                </Appear>
              )
              : (
                <Appear appear={style}>
                  <div
                    css={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 18,
                      color: COLORS.white,
                    }}
                  >
                    <LoadingFingers
                      color={COLORS.white}
                      label="No promises"
                    />
                    <Button
                      label="New"
                      color={COLORS.white}
                      onClick={() => {
                        router.push("/new");
                      }}
                      size="large"
                    />
                  </div>
                </Appear>
              )
          ))
          .exhaustive()
      ))}
    </div>
  );
});

const PromiseCard = memo(function PromiseCard({
  promiseData,
  promiseId,
}: {
  promiseData: PromiseCardData;
  promiseId: string;
}) {
  return (
    <Link href={`/promise/${promiseId}`} legacyBehavior passHref>
      <a
        draggable="false"
        css={{
          contain: "content",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          textDecoration: "none",
          color: promiseData.colors.contentColor,
          background: promiseData.colors.color,
          borderRadius: 64,
          boxShadow: "0 40px 40px rgba(43, 8, 28, 0.10)",
          userSelect: "none",
          "&:focus-visible": {
            outline: `2px solid ${COLORS.white}`,
            outlineOffset: "3px",
          },
          "&:active": {
            transform: "translate(1px, 1px)",
          },
        }}
      >
        <section
          css={{
            display: "flex",
            flexDirection: "column",
            height: 400,
            padding: "32px 32px 24px",
          }}
        >
          <div
            className="header"
            css={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: 24,
              fontSize: 18,
              textTransform: "uppercase",
              "&:after": {
                content: "''",
                position: "absolute",
                inset: "auto 0 0",
                height: 2,
                background: promiseData.colors.contentColor,
              },
              "& > div + div": {
                textAlign: "right",
              },
            }}
          >
            <div>
              <div css={{ fontSize: 14 }}>Pinky Promise</div>
              <div>
                <strong>{promiseId}</strong>
              </div>
            </div>
            <div>
              <div>{promiseData.signedOn}</div>
              <div css={{ fontSize: 14 }}>
                <strong>{formatPromiseState(promiseData.state)}</strong>
              </div>
            </div>
          </div>
          <h1
            css={{
              overflow: "hidden",
              padding: "24px 0 8px",
              fontSize: 32,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            {promiseData.title}
          </h1>
          <div
            css={{
              overflow: "hidden",
              display: "-webkit-box",
              height: 3 * 28,
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              lineHeight: "28px",
              wordBreak: "break-word",
            }}
          >
            {promiseData.bodyText}
          </div>
          <div
            css={{
              flexGrow: 1,
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
            }}
          >
            <div
              css={{
                width: 64,
                height: 64,
                "svg": {
                  transform: "scale(0.8) translateY(-8px)",
                  transformOrigin: "0 0",
                  fill: promiseData.colors.contentColor,
                },
              }}
            >
              <SvgDocFingers color={promiseData.colors.contentColor} />
            </div>
          </div>
        </section>
        {(promiseData.state === "Nullified"
          || promiseData.state === "Discarded")
          && (
            <SvgDocTape
              width={400}
              height={400}
              {...promiseData.colors}
            />
          )}
      </a>
    </Link>
  );
});

function PromisesGrid({
  cards,
  onNextPage,
  onPrevPage,
  page,
}: {
  cards: Array<{
    key: string;
    promise: { id: string; data: PromiseCardData };
  }>;
  onNextPage?: false | (() => void);
  onPrevPage?: false | (() => void);
  page: number;
}) {
  const chainId = useCurrentOrDefaultChainId();
  const networkPrefix = appChainFromId(chainId)?.prefix ?? "";

  const transitions = useTransition(cards, {
    keys: (card) => card.key,
    from: {
      opacity: 0,
      transform: "scale3d(0.7, 0.7, 1)",
    },
    enter: {
      opacity: 1,
      transform: "scale3d(1, 1, 1)",
    },
    config: {
      mass: 1,
      friction: 100,
      tension: 1200,
    },
  });

  return (
    <div
      css={{
        display: "grid",
        placeItems: "center",
        height: "100%",
      }}
    >
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 400px)",
          gap: 40,
        }}
      >
        {transitions((style, card) => (
          <div
            css={{
              position: "relative",
              height: 400,
            }}
          >
            <a.div
              style={style}
              css={{
                position: "absolute",
                inset: 0,
                transformOrigin: "50% 50%",
                contain: "size layout style",
              }}
            >
              <PromiseCard
                promiseId={`${networkPrefix}-${card.promise.id}`}
                promiseData={card.promise.data}
              />
            </a.div>
          </div>
        ))}
      </div>
      <Pagination
        onNext={onNextPage || undefined}
        onPrev={onPrevPage || undefined}
        page={page}
      />
    </div>
  );
}

function usePromisesIds(
  mode: "account" | "all",
): {
  data: string[] | null;
  fetchStatus: ReturnType<typeof useContractRead>["fetchStatus"];
  refetch: ReturnType<typeof useContractRead>["refetch"];
  status: ReturnType<typeof useContractRead>["status"];
} {
  const chainId = useCurrentOrDefaultChainId();
  const contractAddress = usePinkyPromiseContractAddress(chainId);

  // Get the total amount of promises
  const promisesCount = useContractRead({
    abi: PinkyPromiseAbi,
    address: contractAddress,
    chainId,
    enabled: mode === "all",
    functionName: "total",
  });

  // Get a list of promise IDs for the connected account
  const { address } = useAccount();
  const currentAccountIds = useContractRead({
    abi: PinkyPromiseAbi,
    address: contractAddress,
    args: address ? [address] : undefined,
    chainId,
    enabled: mode === "account" && Boolean(address),
    functionName: "signeePromises",
  });

  const ids = useMemo(() => {
    if (mode === "account") {
      return currentAccountIds.data?.map(String).reverse() ?? null;
    }
    const count = promisesCount.data?.toNumber() ?? null;
    return count === null ? null : Array
      .from({ length: count })
      .map((_, index) => `${count - index}`);
  }, [promisesCount, currentAccountIds, mode]);

  const { fetchStatus, refetch, status } = (
    mode === "account"
      ? currentAccountIds
      : promisesCount
  );

  return {
    data: ids,
    fetchStatus,
    refetch,
    status,
  };
}
