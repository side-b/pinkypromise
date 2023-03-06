import type { ReactNode } from "react";
import type { Address, SigningStateEnumKey, TxBag } from "./types";

import { BigNumber } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { a, useTransition } from "react-spring";
import { match, P } from "ts-pattern";
import { useAccount, useContractRead } from "wagmi";
import { useLocation } from "wouter";
import { PinkyPromiseAbi } from "./abis";
import { ActionBox } from "./ActionBox";
import { AnimatableFingers } from "./AnimatableFingers";
import { Button } from "./Button";
import {
  COLORS,
  PROMISE_NOTICE_DISCARDED,
  PROMISE_NOTICE_DRAFT_SIGNED,
  PROMISE_NOTICE_DRAFT_UNSIGNED,
  PROMISE_NOTICE_NULLREQUEST,
  PROMISE_NOTICE_SIGNED,
} from "./constants";
import { Container } from "./Container";
import {
  enumKeyToColor,
  isColorEnumKey,
  promiseStateFromEnumKey,
  signingStateFromEnumKey,
  usePinkyPromiseContractAddress,
} from "./contract-utils";
import { useBackground } from "./GlobalStyles";
import { LoadingFingers } from "./LoadingFingers";
import {
  useChainedProgress,
  useResetScroll,
  useWindowDimensions,
} from "./react-utils";
import { SvgDoc, SvgDocSignees, SvgDocTape } from "./SvgDoc";
import { Transaction } from "./Transaction";
import { isPromiseStateEnumKey, isSigningStateEnumKey } from "./types";
import {
  addressesEqual,
  blocksToHtml,
  formatDate,
  formatPromiseState,
  promiseColors,
  textToBlocks,
} from "./utils";

export function PromiseScreen({ action, id }: { action: string; id: string }) {
  const [_, setLocation] = useLocation();
  const contractAddress = usePinkyPromiseContractAddress();
  const [{ status, refetch }, promiseData] = usePromiseData(id, contractAddress);
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
  }, [background, txBag, colorEnumKey]);

  useEffect(() => {
    match([action, promiseData] as const)
      .with(["break", {
        connectedSigningState: "Signed",
        state: P.union("Draft", "Signed"),
      }], ([_, { state }]) => {
        setTxBag({
          config: {
            address: contractAddress,
            abi: PinkyPromiseAbi,
            functionName: state === "Signed" ? "nullify" : "discard",
            args: [id],
          },
          title: `Break promise ${id}`,
          successLabel: "View promise",
          successAction: () => `/promise/${id}`,
          onCancel: () => {
            setLocation(`/promise/${id}`);
          },
        });
      })
      .with(["unbreak", {
        connectedSigningState: "NullRequest",
        state: "Signed",
      }], () => {
        setTxBag({
          config: {
            address: contractAddress,
            abi: PinkyPromiseAbi,
            functionName: "cancelNullify",
            args: [id],
          },
          title: "Unbreak pinky promise",
          successLabel: "View promise",
          successAction: () => `/promise/${id}`,
          onCancel: () => {
            setLocation(`/promise/${id}`);
          },
        });
      })
      .with(["sign", {
        connectedSigningState: "Pending",
        state: "Draft",
      }], () => {
        setTxBag({
          config: {
            address: contractAddress,
            abi: PinkyPromiseAbi,
            functionName: "sign",
            args: [id],
          },
          title: "Sign pinky promise",
          successLabel: "View promise",
          successAction: () => `/promise/${id}`,
          onCancel: () => setLocation(`/promise/${id}`),
        });
      })
      .with([P.union("break", "unbreak", "sign"), P.any], () => {
        setLocation(`/promise/${id}`);
      })
      .otherwise(() => {
        setTxBag(null);
      });
  }, [promiseData, action]);

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
        {loadingTransition((style, data) =>
          match(data)
            .with({ txBag: P.when(Boolean) }, ({ txBag }) =>
              txBag && (
                <a.div
                  style={style}
                  css={{
                    position: "absolute",
                    zIndex: 1,
                    inset: "0 0 auto",
                    paddingTop: 40,
                  }}
                >
                  <Transaction {...txBag} />
                </a.div>
              ))
            .with({ status: P.union("loading", "idle") }, () => (
              <a.div
                style={style}
                css={{
                  position: "absolute",
                  zIndex: 1,
                  inset: "0 0 auto",
                  display: "grid",
                  placeItems: "center",
                  paddingTop: 80,
                }}
              >
                <LoadingFingers />
              </a.div>
            ))
            .with({ status: "success" }, () => (
              <a.div
                style={style}
                css={{
                  position: "absolute",
                  zIndex: 2,
                  inset: "0 0 auto",
                  display: "grid",
                  width: "100%",
                  placeItems: "center",
                  padding: "40px 0 80px",
                }}
              >
                <Container
                  color={color}
                  drawer={match([
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
                          setLocation(`/promise/${id}/sign`);
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
                          setLocation(`/promise/${id}/break`);
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
                            setLocation(`/promise/${id}/unbreak`);
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
                            setLocation(`/promise/${id}/break`);
                          }}
                        />
                      ),
                    )
                    .otherwise(() => null)}
                  padding="56px 56px 56px"
                >
                  <SvgDoc
                    bodyHtml={promiseData.bodyHtml}
                    classPrefix="svg-preview"
                    height={promiseData.height}
                    htmlMode={true}
                    padding={[0, 0, 0]}
                    promiseId={id}
                    signedOn={promiseData.signedOn}
                    signees={
                      <SvgDocSignees
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
              </a.div>
            ))
            .with({ status: "error" }, () => (
              <a.div
                style={style}
                css={{
                  position: "absolute",
                  zIndex: 2,
                  inset: "0",
                  display: "grid",
                  placeItems: "center",
                  color: COLORS.white,
                }}
              >
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
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
              </a.div>
            ))
            .exhaustive()
        )}
      </div>
      {null && <BackgroundFingers />}
    </>
  );
}

function usePromiseData(id: string, contractAddress?: Address) {
  const { address: accountAddress } = useAccount();

  const promiseInfoRead = useContractRead({
    address: contractAddress,
    abi: PinkyPromiseAbi,
    functionName: "promiseInfo",
    args: [BigNumber.from(id)],
    enabled: Boolean(contractAddress),
    watch: true,
  });

  const promiseData = useMemo(() => {
    const info = promiseInfoRead.data;
    const colorEnumKey = info?.data.color ?? 0;

    const signees = info?.signees ?? [];
    const signingStates = info?.signingStates.every(isSigningStateEnumKey)
      ? info.signingStates
      : [];

    const signedOn = Number((info?.signedOn ?? 0).toString()) * 1000;

    return {
      bodyHtml: blocksToHtml(textToBlocks(info?.data.body ?? "")),
      colorEnumKey: info?.data.color ?? 0,
      colors: promiseColors(
        enumKeyToColor(isColorEnumKey(colorEnumKey) ? colorEnumKey ?? 0 : 0),
      ),
      connectedSigningState: getConnectedSigneeState(
        accountAddress,
        signees,
        signingStates,
      ),
      height: info?.data.height ?? 800,
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
            () => signee === accountAddress ? "break request" : true,
          )
          .exhaustive(),
      ] as const)),
      state: promiseStateFromEnumKey(
        info?.state && isPromiseStateEnumKey(info?.state) ? info?.state : 0,
      ),
      title: info?.data.title ?? "",
    };
  }, [accountAddress, promiseInfoRead.data]);

  return [
    promiseInfoRead,
    promiseData,
  ] as const;
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
  return (
    <ActionBox
      info={info}
      infoColor="#7B7298"
      button={buttonLabel && (
        <Button
          color={color}
          label={buttonLabel}
          mode="primary"
          onClick={onButtonClick}
          size="large"
          type="submit"
        />
      )}
    />
  );
}

function BackgroundFingers() {
  const dimensions = useWindowDimensions();
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
