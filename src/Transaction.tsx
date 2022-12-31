import { useChainModal } from "@rainbow-me/rainbowkit";
import { match, P } from "ts-pattern";
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { AnimatableFingers } from "./AnimatableFingers";
import { Button } from "./Button";
import { ConnectButton } from "./ConnectButton";
import { COLORS } from "./constants";
import { Container } from "./Container";
import { useChainedProgress, useTxUrl } from "./react-utils";

export function Transaction({
  config,
  onCancel,
  successAction,
  successLabel,
  title,
}: {
  config: NonNullable<Parameters<typeof usePrepareContractWrite>[0]>;
  onCancel: () => void;
  successAction: (data: NonNullable<ReturnType<typeof useWaitForTransaction>["data"]>) => string | (() => void);
  successLabel: string;
  title: string;
}) {
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

  const fingersSprings = useChainedProgress([
    [0, "leftFinger"],
    [0.5, "rightFinger"],
    [1, "closeFingers"],
  ], {
    duration: 500,
    props: { config: { mass: 2, friction: 70, tension: 1200 } },
  });

  return (
    <Container color={COLORS.pink} contentColor={COLORS.white}>
      <section
        css={{
          display: "flex",
          flexDirection: "column",
          height: "640px",
          paddingBottom: "40px",
        }}
      >
        <div
          css={{
            overflow: "hidden",
            position: "relative",
            width: "100%",
            flexGrow: "1",
          }}
        >
          <div
            css={{
              position: "absolute",
              top: "0",
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
              size={380}
            />
          </div>
        </div>
        <div css={{ flexGrow: "0", textAlign: "center" }}>
          <h1 css={{ fontSize: "40px" }}>{title}</h1>
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
                message="Please switch to a supported network."
                onSecondary={onCancel}
                secondary="cancel"
              />
            ))
            .with({ connected: false }, () => (
              <TxControls
                main="connect"
                message="Please connect your wallet."
                onSecondary={onCancel}
                secondary="cancel"
              />
            ))
            .with({ prepare: P.union("idle", "loading") }, () => (
              <TxControls
                main="sign"
                message="Preparing transaction…"
                onSecondary={onCancel}
                secondary="cancel"
              />
            ))
            .with({ prepare: "error" }, () => (
              <TxControls
                main="retry"
                message="Error preparing the transaction."
                onMain={txPrepare.refetch}
                onSecondary={onCancel}
                secondary="cancel"
              />
            ))
            .with({ write: "idle" }, () => (
              <TxControls
                main="sign"
                message="You will be asked to sign a transaction in your wallet"
                onMain={txWrite.write}
                onSecondary={onCancel}
                secondary="cancel"
              />
            ))
            .with({ write: "loading" }, () => (
              <TxControls
                main="sign"
                message="Please sign the transaction in your wallet"
                onMain={txWrite.write}
                onSecondary={onCancel}
                secondary="cancel"
              />
            ))
            .with({ write: "error" }, () => (
              <TxControls
                main="retry"
                message="Error signing the transaction."
                onMain={txWrite.reset}
                onSecondary={onCancel}
                secondary="cancel"
              />
            ))
            .with({ result: P.union("loading", "idle") }, () => (
              <TxControls
                main={successLabel}
                message="Waiting for transaction confirmation…"
                onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                secondary="tx"
              />
            ))
            .with({ result: "error" }, () => (
              <TxControls
                main="retry"
                message="Error confirming the transaction."
                onMain={txWrite.reset}
                onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                secondary="tx"
              />
            ))
            .with({ result: "success" }, () => (
              <TxControls
                main={successLabel}
                message="Transaction confirmed."
                onMain={txResult.data ? successAction(txResult.data) : undefined}
                onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                secondary="tx"
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
}: {
  main: "switch-network" | "connect" | "sign" | "retry" | string;
  message: string;
  onMain?: string | (() => void);
  onSecondary?: string | (() => void);
  secondary: "cancel" | "tx";
}) {
  return (
    <>
      <p css={{ fontSize: "24px" }}>{message}</p>
      <div
        css={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          paddingTop: "32px",
        }}
      >
        <Button
          color={COLORS.white}
          disabled={!onSecondary}
          href={typeof onSecondary === "string" ? onSecondary : undefined}
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
