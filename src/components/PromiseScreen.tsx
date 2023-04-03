import type { ReactNode } from "react";
import type {
  Address,
  Dimensions,
  NetworkPrefix,
  SigningStateEnumKey,
  TxBag,
} from "../types";

import { useTransition } from "@react-spring/web";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { match, P } from "ts-pattern";
import { useContractRead } from "wagmi";
import {
  COLORS,
  PROMISE_NOTICE_DISCARDED,
  PROMISE_NOTICE_DRAFT_SIGNED,
  PROMISE_NOTICE_DRAFT_UNSIGNED,
  PROMISE_NOTICE_NULLREQUEST,
  PROMISE_NOTICE_SIGNED,
} from "../constants";
import { PinkyPromiseAbi } from "../lib/abis";
import {
  enumKeyToColor,
  isColorEnumKey,
  promiseStateFromEnumKey,
  signingStateFromEnumKey,
  usePinkyPromiseContractAddress,
} from "../lib/contract-utils";
import { useAccount } from "../lib/eth-utils";
import {
  useBreakpoint,
  useChainedProgress,
  useReady,
  useResetScroll,
  useWindowDimensions,
} from "../lib/react-utils";
import {
  addressesEqual,
  appChainFromPrefix,
  blocksToHtml,
  formatDate,
  formatPromiseState,
  promiseColors,
  textToBlocks,
} from "../lib/utils";
import { isPromiseStateEnumKey, isSigningStateEnumKey } from "../types";
import { ActionBox } from "./ActionBox";
import { AnimatableFingers } from "./AnimatableFingers";
import { Appear } from "./Appear";
import { Button } from "./Button";
import { Container } from "./Container";
import { useBackground } from "./GlobalStyles";
import { LoadingFingers } from "./LoadingFingers";
import { SvgDoc, SvgDocSignees, SvgDocTape } from "./SvgDoc";
import { Transaction } from "./Transaction";

export function PromiseScreen({
  action,
  fullPromiseId,
  networkPrefix,
  promiseId,
}: {
  action: string;
  fullPromiseId: string;
  networkPrefix: NetworkPrefix;
  promiseId: number;
}) {
  const breakpoint = useBreakpoint();
  const small = breakpoint === "small";

  const router = useRouter();

  const chainId = (
    networkPrefix && appChainFromPrefix(networkPrefix)?.chainId
  ) ?? -1;

  const contractAddress = usePinkyPromiseContractAddress(chainId);

  const { status, refetch, data: promiseData } = usePromiseData(
    String(promiseId),
    chainId,
    contractAddress,
  );

  const { color, contentColor } = promiseData.colors;
  const { colorEnumKey } = promiseData;

  const [txBag, setTxBag] = useState<null | TxBag>(null);

  const background = useBackground();
  useEffect(() => {
    background.set(enumKeyToColor(
      isColorEnumKey(colorEnumKey) ? colorEnumKey ?? 0 : 0,
    ));
  }, [background, colorEnumKey]);

  useEffect(() => {
    if (txBag === null) {
      refetch();
    }
    background.set(
      txBag
        ? "pink"
        : enumKeyToColor(isColorEnumKey(colorEnumKey) ? colorEnumKey ?? 0 : 0),
    );
  }, [background, txBag, colorEnumKey, refetch]);

  useEffect(() => {
    match([action, promiseData] as const)
      .with(
        ["break", {
          connectedSigningState: "Signed",
          state: P.union("Draft", "Signed"),
        }],
        ([_, { state }]) => {
          setTxBag({
            config: {
              chainId,
              address: contractAddress,
              abi: PinkyPromiseAbi,
              functionName: state === "Signed" ? "nullify" : "discard",
              args: [promiseId],
            },
            title: `Break promise ${fullPromiseId}`,
            successLabel: "View promise",
            successAction: () => `/promise/${fullPromiseId}`,
            onCancel: () => {
              router.push(`/promise/${fullPromiseId}`);
            },
          });
        },
      )
      .with(
        ["unbreak", {
          connectedSigningState: "NullRequest",
          state: "Signed",
        }],
        () => {
          setTxBag({
            config: {
              address: contractAddress,
              abi: PinkyPromiseAbi,
              functionName: "cancelNullify",
              args: [promiseId],
            },
            title: "Unbreak pinky promise",
            successLabel: "View promise",
            successAction: () => `/promise/${fullPromiseId}`,
            onCancel: () => {
              router.push(`/promise/${fullPromiseId}`);
            },
          });
        },
      )
      .with(
        ["sign", {
          connectedSigningState: "Pending",
          state: "Draft",
        }],
        () => {
          setTxBag({
            config: {
              address: contractAddress,
              abi: PinkyPromiseAbi,
              functionName: "sign",
              args: [promiseId],
            },
            title: "Sign pinky promise",
            successLabel: "View promise",
            successAction: () => `/promise/${fullPromiseId}`,
            onCancel: () => {
              router.push(`/promise/${fullPromiseId}`);
            },
          });
        },
      )
      .with([P.union("break", "unbreak", "sign"), P.any], () => {
        router.push(`/promise/${fullPromiseId}`);
      })
      .otherwise(() => {
        setTxBag(null);
      });
  }, [
    action,
    chainId,
    promiseData,
    promiseId,
    fullPromiseId,
    contractAddress,
    router,
  ]);

  const loadingTransition = useTransition({ status, txBag }, {
    keys: ({ status, txBag }) => `${status}${Boolean(txBag)}`,
    from: { opacity: 0, transform: "scale3d(0.8, 0.8, 1)" },
    enter: {
      opacity: 1,
      transform: "scale3d(1, 1, 1)",
      delay: status === "loading" ? 100 : 0,
    },
    leave: { opacity: 0, immediate: true },
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });

  useResetScroll([status, txBag]);

  const buttonColor = useMemo(() => {
    if (color === COLORS.pink) return color;
    if (color === COLORS.blue) return color;
    return contentColor;
  }, [color, contentColor]);

  return (
    <>
      <div
        css={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {loadingTransition((style, data) => (
          match(data)
            .with(
              { txBag: P.when(Boolean) },
              ({ txBag }) => (
                txBag && (
                  <Appear appear={style}>
                    <div css={{ paddingTop: 40 }}>
                      <Transaction {...txBag} />
                    </div>
                  </Appear>
                )
              ),
            )
            .with(
              { status: P.union("loading", "idle") },
              () => (
                <Appear appear={style}>
                  <div css={{ paddingTop: 80 }}>
                    <LoadingFingers />
                  </div>
                </Appear>
              ),
            )
            .with(
              { status: "success" },
              () => (
                <Appear appear={style}>
                  <div
                    css={{
                      padding: small
                        ? "12px 8px 80px"
                        : "40px 8px 80px",
                    }}
                  >
                    <Container
                      color={color}
                      maxWidth={small ? 600 : undefined}
                      padding={small ? "16px 16px 24px" : "56px 56px 56px"}
                      secondary={match([
                        promiseData.connectedSigningState,
                        promiseData.state,
                      ])
                        .with([P.any, "Discarded"], () => (
                          <Action
                            color={buttonColor}
                            info={PROMISE_NOTICE_DISCARDED[0]}
                          />
                        ))
                        // The connected user has not signed yet
                        .with(["Pending", "Draft"], () => (
                          <Action
                            buttonLabel={PROMISE_NOTICE_DRAFT_UNSIGNED[1]}
                            color={buttonColor}
                            info={PROMISE_NOTICE_DRAFT_UNSIGNED[0]}
                            onButtonClick={() => {
                              router.push(`/promise/${fullPromiseId}/sign`);
                            }}
                          />
                        ))
                        // The connected user has signed but other signatures are missing
                        .with(["Signed", "Draft"], () => (
                          <Action
                            buttonLabel={PROMISE_NOTICE_DRAFT_SIGNED[1]}
                            color={buttonColor}
                            info={PROMISE_NOTICE_DRAFT_SIGNED[0]}
                            onButtonClick={() => {
                              router.push(`/promise/${fullPromiseId}/break`);
                            }}
                          />
                        ))
                        // The connected user requested to nullify and the contract is fully signed
                        .with(
                          ["NullRequest", "Signed"],
                          () => (
                            <Action
                              buttonLabel={PROMISE_NOTICE_NULLREQUEST[1]}
                              color={buttonColor}
                              info={PROMISE_NOTICE_NULLREQUEST[0]}
                              onButtonClick={() => {
                                router.push(`/promise/${fullPromiseId}/unbreak`);
                              }}
                            />
                          ),
                        )
                        // The connected user is a signee and the contract is fully signed
                        .with(
                          ["Signed", "Signed"],
                          () => (
                            <Action
                              buttonLabel={PROMISE_NOTICE_SIGNED[1]}
                              color={buttonColor}
                              info={PROMISE_NOTICE_SIGNED[0]}
                              onButtonClick={() => {
                                router.push(`/promise/${fullPromiseId}/break`);
                              }}
                            />
                          ),
                        )
                        .otherwise(() => null)}
                    >
                      <SvgDoc
                        bodyHtml={promiseData.bodyHtml}
                        classPrefix="svg-preview"
                        height={promiseData.height}
                        mode={small ? "html-compact" : "html"}
                        padding={small ? [8, 8, 0] : [0, 0, 0]}
                        promiseId={fullPromiseId}
                        signedOn={promiseData.signedOn}
                        signees={
                          <SvgDocSignees
                            chainId={chainId}
                            signees={promiseData.signeesWithStates}
                          />
                        }
                        status={formatPromiseState(promiseData.state)}
                        title={promiseData.title}
                        {...promiseData.colors}
                      />
                      {(promiseData.state === "Nullified"
                        || promiseData.state === "Discarded") && (
                        <SvgDocTape
                          width={832}
                          height={promiseData.height}
                          {...promiseData.colors}
                        />
                      )}
                    </Container>
                  </div>
                </Appear>
              ),
            )
            .with({ status: "error" }, () => (
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
                    label="Error loading promise"
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
            .exhaustive()
        ))}
      </div>
      {null && <BackgroundFingers />}
    </>
  );
}

function usePromiseData(
  promiseId: string,
  chainId: number,
  contractAddress?: Address,
) {
  const ready = useReady();
  const { address: accountAddress } = useAccount();

  const promiseInfoRead = useContractRead({
    abi: PinkyPromiseAbi,
    address: contractAddress,
    args: [BigNumber.from(promiseId)],
    chainId,
    enabled: Boolean(ready && contractAddress),
    functionName: "promiseInfo",
    watch: true,
  });

  const promiseInfoData = ready ? promiseInfoRead.data : undefined;
  const status = ready ? promiseInfoRead.status : ("idle" as const);

  const promiseData = useMemo(() => {
    const colorEnumKey = promiseInfoData?.data.color ?? 0;

    const signees = promiseInfoData?.signees ?? [];
    const signingStates = promiseInfoData?.signingStates.every(isSigningStateEnumKey)
      ? promiseInfoData.signingStates
      : [];

    const promiseState = promiseStateFromEnumKey(
      promiseInfoData?.state && isPromiseStateEnumKey(promiseInfoData?.state)
        ? promiseInfoData?.state
        : 0,
    );

    const signedOn = Number((promiseInfoData?.signedOn ?? 0).toString()) * 1000;

    return {
      bodyHtml: blocksToHtml(textToBlocks(promiseInfoData?.data.body ?? "")),
      colorEnumKey: promiseInfoData?.data.color ?? 0,
      colors: promiseColors(
        enumKeyToColor(isColorEnumKey(colorEnumKey) ? colorEnumKey ?? 0 : 0),
      ),
      connectedSigningState: getConnectedSigneeState(
        accountAddress,
        signees,
        signingStates,
      ),
      height: promiseInfoData?.data.height ?? 800,
      signedOn: signedOn > 0 ? formatDate(new Date(signedOn)) : "",
      signees,
      signingStates,
      signeesWithStates: signees.map((signee, index) => ([
        signee,
        match(signingStateFromEnumKey(signingStates[index]))
          .with("None", () => "")
          .with("Signed", () => true)
          .with("Pending", () => "awaiting")
          .with(
            "NullRequest",
            () =>
              signee === accountAddress && promiseState === "Signed"
                ? "break request"
                : true,
          )
          .exhaustive(),
      ] as const)),
      state: promiseState,
      title: promiseInfoData?.data.title ?? "",
    };
  }, [accountAddress, promiseInfoData]);

  return {
    status,
    refetch: promiseInfoRead.refetch,
    data: promiseData,
  };
}

function getConnectedSigneeState(
  accountAddress: Address | undefined,
  signees: readonly Address[],
  signingStates: readonly SigningStateEnumKey[],
) {
  const connectedSigneeIndex = signees.findIndex((signee) => (
    accountAddress && addressesEqual(signee, accountAddress)
  ));
  if (connectedSigneeIndex === -1) {
    return "None";
  }

  const signingStateEnumKey = signingStates[connectedSigneeIndex];
  return signingStateFromEnumKey(
    isSigningStateEnumKey(signingStateEnumKey) ? signingStateEnumKey : 0,
  );
}

function Action({
  info,
  color,
  buttonLabel,
  onButtonClick,
}: {
  info: ReactNode;
  color: string;
  buttonLabel?: ReactNode;
  onButtonClick?: () => void;
}) {
  const small = useBreakpoint() === "small";
  return (
    <ActionBox
      compact={small}
      info={info}
      infoColor={COLORS.blueGrey}
      button={buttonLabel && (
        <Button
          color={color}
          label={buttonLabel}
          mode="primary"
          onClick={onButtonClick}
          size="large"
          type="submit"
          wide={small}
          css={{
            height: small ? 48 : 64,
            fontSize: small ? 32 : 40,
          }}
        />
      )}
    />
  );
}

function BackgroundFingers() {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  useWindowDimensions(setDimensions);

  const springs = useChainedProgress([
    [0, "leftFinger"],
    [0.3, "rightFinger"],
    [1, "closeFingers"],
  ], {
    duration: 600,
    props: { config: { mass: 2, friction: 70, tension: 1200 } },
  });

  return (
    <div
      css={{
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translateY(-300px) translateX(-50%)",
      }}
    >
      <AnimatableFingers
        springValues={{
          closeFingers: springs.closeFingers.progress,
          leftFingerAppear: springs.leftFinger.progress,
          rightFingerAppear: springs.rightFinger.progress,
        }}
        openDistance={dimensions.width / 3}
        size={dimensions.height * 2}
      />
    </div>
  );
}
