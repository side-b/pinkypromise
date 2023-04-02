import type { ReactNode } from "react";
import type { Address, TxBag } from "../types";

import { match, P } from "ts-pattern";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { COLORS, GH_REPO_URL, TxSteps } from "../constants";
import { useAccount } from "../lib/eth-utils";
import {
  useBreakpoint,
  useChainedProgress,
  useContractUrl,
  useTxUrl,
} from "../lib/react-utils";
import { isAddress, shortenAddress } from "../lib/utils";
import { AnimatableFingers } from "./AnimatableFingers";
import { Button } from "./Button";
import { ConnectButton } from "./ConnectButton";
import { Container } from "./Container";
import { SplitButton } from "./SplitButton";

export function Transaction({
  config,
  onCancel,
  successAction,
  successLabel,
  title,
}: TxBag) {
  const breakpoint = useBreakpoint();
  const small = breakpoint === "small";

  const { chain } = useNetwork();
  const account = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const txPrepare = usePrepareContractWrite({
    abi: config.abi,
    address: config.address,
    args: config.args,
    chainId: config.chainId,
    functionName: config.functionName,
  });
  const txWrite = useContractWrite(txPrepare.config);
  const txResult = useWaitForTransaction({
    chainId: config.chainId,
    enabled: txWrite.status === "success",
    hash: txWrite.data?.hash,
  });

  const txUrl = useTxUrl();

  const contractCode = [
    config.address,
    `${GH_REPO_URL}/tree/main/contracts/src/PinkyPromise.sol`,
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
    <div css={{ padding: "0 8px 80px" }}>
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
            maxWidth: 600 - 48 * 2,
            height: small ? "auto" : 600 - 48,
          }}
        >
          <div
            css={{
              position: "relative",
              overflow: "hidden",
              display: "grid",
              justifyContent: "center",
              width: "100%",
              paddingTop: small ? 8 : 28,
              paddingBottom: small ? 32 : 40,
            }}
          >
            <div
              css={{
                position: "relative",
                width: small ? 152 : 200,
                height: small ? 152 : 200,
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
                  size={small ? 152 : 200}
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
                fontSize: small ? 20 : 40,
                fontWeight: 500,
              }}
            >
              {title}
            </h1>
            {match({
              wrongChain: chain?.unsupported || (
                chain && (chain.id !== config.chainId)
              ),
              connected: Boolean(account.address),
              prepare: txPrepare.status,
              write: txWrite.status,
              result: txResult.status,
            })
              .with({ wrongChain: true }, () => (
                <TxControls
                  main="switch-network"
                  onMain={() => {
                    switchNetwork?.(config.chainId);
                  }}
                  message={<TxSteps.AskChangeNetwork />}
                  onSecondary={onCancel}
                  secondary="cancel"
                  contractCode={contractCode}
                />
              ))
              .with({ connected: false }, () => (
                <TxControls
                  main="connect"
                  message={<TxSteps.AskConnect />}
                  onSecondary={onCancel}
                  secondary="cancel"
                  contractCode={contractCode}
                />
              ))
              .with({ prepare: P.union("idle", "loading") }, () => (
                <TxControls
                  main="sign"
                  message={<TxSteps.Preparing />}
                  onSecondary={onCancel}
                  secondary="cancel"
                  contractCode={contractCode}
                />
              ))
              .with({ prepare: "error" }, () => (
                <TxControls
                  main="retry"
                  message={<TxSteps.PreparingError />}
                  onMain={txPrepare.refetch}
                  onSecondary={onCancel}
                  secondary="cancel"
                  contractCode={contractCode}
                />
              ))
              .with({ write: "idle" }, () => (
                <TxControls
                  main="sign"
                  message={<TxSteps.BeforeSign />}
                  onMain={txWrite.write}
                  onSecondary={onCancel}
                  secondary="cancel"
                  contractCode={contractCode}
                />
              ))
              .with({ write: "loading" }, () => (
                <TxControls
                  main="sign"
                  message={<TxSteps.Sign />}
                  onMain={txWrite.write}
                  onSecondary={onCancel}
                  secondary="cancel"
                  contractCode={contractCode}
                />
              ))
              .with({ write: "error" }, () => (
                <TxControls
                  main="retry"
                  message={<TxSteps.SignError />}
                  onMain={txWrite.reset}
                  onSecondary={onCancel}
                  secondary="cancel"
                  contractCode={contractCode}
                />
              ))
              .with({ result: P.union("loading", "idle") }, () => (
                <TxControls
                  main={successLabel}
                  message={<TxSteps.ConfirmWait />}
                  onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                  secondary="tx"
                  contractCode={contractCode}
                />
              ))
              .with({ result: "error" }, () => (
                <TxControls
                  main="retry"
                  message={
                    <TxSteps.ConfirmError
                      txUrl={txUrl(txWrite.data?.hash ?? "") ?? ""}
                    />
                  }
                  onMain={txWrite.reset}
                  onSecondary={txUrl(txWrite.data?.hash ?? "") ?? undefined}
                  secondary="tx"
                  contractCode={contractCode}
                />
              ))
              .with({ result: "success" }, () => (
                <TxControls
                  main={successLabel}
                  message={<TxSteps.ConfirmSuccess />}
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
    </div>
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
  message: ReactNode;
  onMain?: string | (() => void);
  onSecondary?: string | (() => void);
  secondary: "cancel" | "tx";
  contractCode: readonly [
    contractAddress: Address | undefined,
    githubUrl: string,
  ];
}) {
  const breakpoint = useBreakpoint();
  const small = breakpoint === "small";

  const contractUrl = useContractUrl();
  const contractCodeExplorerUrl = (
    contractCode[0] && contractUrl(contractCode[0], 20)
  ) || "";

  return (
    <>
      <p
        css={{
          overflow: "hidden",
          height: small ? "auto" : 60,
          fontSize: small ? 16 : 20,
          a: {
            color: COLORS.white,
          },
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
          }}
          second={{
            color: COLORS.blue,
            href: contractCodeExplorerUrl,
            label: contractCode[0] && isAddress(contractCode[0] || "")
              ? shortenAddress(contractCode[0])
              : "−",
            labelColor: COLORS.blue,
            mode: "secondary",
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
          label={secondary === "tx" ? "Open Tx" : "Abandon"}
          title={secondary === "tx" ? "Open Transaction" : undefined}
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
              title={main === "sign" ? "Sign transaction" : undefined}
              label={match(main)
                .with("sign", () => "Sign Tx")
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
