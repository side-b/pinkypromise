import type { Address, TxBag } from "./types";

import { useChainModal } from "@rainbow-me/rainbowkit";
import { match, P } from "ts-pattern";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { AnimatableFingers } from "./AnimatableFingers";
import { Button } from "./Button";
import { ConnectButton } from "./ConnectButton";
import { COLORS, TX_STEPS } from "./constants";
import { Container } from "./Container";
import { useChainedProgress, useContractUrl, useTxUrl } from "./react-utils";
import { SplitButton } from "./SplitButton";
import { isAddress, shortenAddress } from "./utils";

export function Transaction({
  config,
  onCancel,
  successAction,
  successLabel,
  title,
}: TxBag) {
  const { chain } = useNetwork();
  const account = useAccount();
  const { openChainModal } = useChainModal();
  const txPrepare = usePrepareContractWrite({
    address: config.address,
    abi: config.abi,
    functionName: config.functionName,
    args: config.args,
  });
  const txWrite = useContractWrite(txPrepare.config);
  const txResult = useWaitForTransaction({
    hash: txWrite.data?.hash,
    enabled: txWrite.status === "success",
  });

  const txUrl = useTxUrl();

  const contractCode = [
    config.address,
    "https://github.com/side-b/pinky-promise/contracts/PinkyPromise.sol",
  ] as const;

  const fingersSprings = useChainedProgress([
    [0, "leftFinger"],
    [0.5, "rightFinger"],
    [1, "closeFingers"],
  ], {
    duration: 500,
    props: { config: { mass: 2, friction: 70, tension: 1200 } },
  });

  return (
    <Container
      color={COLORS.pink}
      contentColor={COLORS.white}
      maxWidth={600}
      padding="0 48px 48px"
    >
      <section
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 600 - 48 * 2,
          height: 600 - 48,
        }}
      >
        <div
          css={{
            position: "relative",
            overflow: "hidden",
            display: "grid",
            justifyContent: "center",
            width: "100%",
            paddingTop: 28,
            paddingBottom: 40,
          }}
        >
          <div
            css={{
              position: "relative",
              width: 200,
              height: 200,
            }}
          >
            <div
              css={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <AnimatableFingers
                springValues={{
                  closeFingers: fingersSprings.closeFingers.progress,
                  leftFingerAppear: fingersSprings.leftFinger.progress,
                  rightFingerAppear: fingersSprings.rightFinger.progress,
                }}
                openDistance={600}
                size={200}
              />
            </div>
          </div>
        </div>
        <div
          css={{
            flexGrow: "1",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h1
            css={{
              paddingBottom: 16,
              fontSize: "40px",
            }}
          >
            {title}
          </h1>
          {match({
            unsupported: chain?.unsupported,
            connected: Boolean(account.address),
            prepare: txPrepare.status,
            write: txWrite.status,
            result: txResult.status,
          })
            .with({ unsupported: true }, () => (
              <TxControls
                main="switch-network"
                onMain={openChainModal}
                message={TX_STEPS.ASK_CHANGE_NETWORK}
                onSecondary={onCancel}
                secondary="cancel"
                contractCode={contractCode}
              />
            ))
            .with({ connected: false }, () => (
              <TxControls
                main="connect"
                message={TX_STEPS.ASK_CONNECT}
                onSecondary={onCancel}
                secondary="cancel"
                contractCode={contractCode}
              />
            ))
            .with({ prepare: P.union("idle", "loading") }, () => (
              <TxControls
                main="sign"
                message={TX_STEPS.PREPARING}
                onSecondary={onCancel}
                secondary="cancel"
                contractCode={contractCode}
              />
            ))
            .with({ prepare: "error" }, () => (
              <TxControls
                main="retry"
                message={TX_STEPS.PREPARING_ERROR}
                onMain={txPrepare.refetch}
                onSecondary={onCancel}
                secondary="cancel"
                contractCode={contractCode}
              />
            ))
            .with({ write: "idle" }, () => (
              <TxControls
                main="sign"
                message={TX_STEPS.BEFORE_SIGN}
                onMain={txWrite.write}
                onSecondary={onCancel}
                secondary="cancel"
                contractCode={contractCode}
              />
            ))
            .with({ write: "loading" }, () => (
              <TxControls
                main="sign"
                message={TX_STEPS.SIGN}
                onMain={txWrite.write}
                onSecondary={onCancel}
                secondary="cancel"
                contractCode={contractCode}
              />
            ))
            .with({ write: "error" }, () => (
              <TxControls
                main="retry"
                message={TX_STEPS.SIGN_ERROR}
                onMain={txWrite.reset}
                onSecondary={onCancel}
                secondary="cancel"
                contractCode={contractCode}
              />
            ))
            .with({ result: P.union("loading", "idle") }, () => (
              <TxControls
                main={successLabel}
                message={TX_STEPS.CONFIRM_WAIT}
                onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                secondary="tx"
                contractCode={contractCode}
              />
            ))
            .with({ result: "error" }, () => (
              <TxControls
                main="retry"
                message={TX_STEPS.CONFIRM_ERROR}
                onMain={txWrite.reset}
                onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                secondary="tx"
                contractCode={contractCode}
              />
            ))
            .with({ result: "success" }, () => (
              <TxControls
                main={successLabel}
                message={TX_STEPS.CONFIRM_SUCCESS}
                onMain={txResult.data ? successAction(txResult.data) : undefined}
                onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                secondary="tx"
                contractCode={contractCode}
              />
            ))
            .exhaustive()}
        </div>
      </section>
    </Container>
  );
}

function TxControls({
  main,
  message,
  onMain,
  onSecondary,
  secondary,
  contractCode,
}: {
  main: "switch-network" | "connect" | "sign" | "retry" | string;
  message: string;
  onMain?: string | (() => void);
  onSecondary?: string | (() => void);
  secondary: "cancel" | "tx";
  contractCode: readonly [
    contractAddress: Address | undefined,
    githubUrl: string,
  ];
}) {
  const contractUrl = useContractUrl();
  const contractCodeExplorerUrl = (
    contractCode[0] && contractUrl(contractCode[0], 20)
  ) || "";

  return (
    <>
      <p
        css={{
          overflow: "hidden",
          height: 60,
          fontSize: 20,
        }}
      >
        {message}
      </p>
      <div
        css={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 24,
        }}
      >
        <SplitButton
          first={{
            color: COLORS.blue,
            href: contractCode[1],
            label: "Contract",
            labelColor: COLORS.blue,
            mode: "secondary",
            external: true,
          }}
          second={{
            color: COLORS.blue,
            href: contractCodeExplorerUrl,
            label: contractCode[0] && isAddress(contractCode[0] || "")
              ? shortenAddress(contractCode[0])
              : "−",
            labelColor: COLORS.blue,
            mode: "secondary",
            external: true,
          }}
        />
      </div>
      <div
        css={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 16,
          paddingTop: 32,
        }}
      >
        <Button
          color={COLORS.white}
          disabled={!onSecondary}
          href={typeof onSecondary === "string" ? onSecondary : undefined}
          external={typeof onSecondary === "string"}
          label={secondary === "tx" ? "Etherscan" : "Abandon"}
          onClick={typeof onSecondary !== "string" ? onSecondary : undefined}
        />
        {main === "connect"
          ? (
            <ConnectButton
              color={COLORS.white}
              labelColor={COLORS.pink}
              mode="primary"
            />
          )
          : (
            <Button
              color={COLORS.white}
              disabled={!onMain}
              href={typeof onMain === "string" ? onMain : undefined}
              label={match(main)
                .with("sign", () => "Sign")
                .with("retry", () => "Retry")
                .with("switch-network", () => "Switch network")
                .otherwise(() => main ?? "OK")}
              labelColor={COLORS.pink}
              mode="primary"
              onClick={typeof onMain !== "string" ? onMain : undefined}
            />
          )}
      </div>
    </>
  );
}
