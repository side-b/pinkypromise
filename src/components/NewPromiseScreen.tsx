import type { Dnum } from "dnum";
import type { Address, ColorEnumKey } from "../types";
import type { EditorData } from "./Editor";

import { useTransition } from "@react-spring/web";
import * as dn from "dnum";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { match } from "ts-pattern";
import { useFeeData, usePrepareContractWrite } from "wagmi";
import { COLORS, PLACEHOLDER_BODY, PLACEHOLDER_TITLE } from "../constants";
import { PinkyPromiseAbi } from "../lib/abis";
import {
  colorEnumKey,
  promiseIdFromTxLogs,
  useCurrentChainId,
  usePinkyPromiseContractAddress,
} from "../lib/contract-utils";
import { useAccount } from "../lib/eth-utils";
import { useBreakpoint, useResetScroll } from "../lib/react-utils";
import {
  appChainFromId,
  blocksToHtml,
  formatDate,
  isAddress,
  promiseColors,
  textToBlocks,
  uniqueAddresses,
} from "../lib/utils";
import { ActionBox } from "./ActionBox";
import { Appear } from "./Appear";
import { Button } from "./Button";
import { Container } from "./Container";
import { Editor } from "./Editor";
import { EditorBar } from "./EditorBar";
import { useBackground } from "./GlobalStyles";
import { SvgDoc, SvgDocSignees } from "./SvgDoc";
import { Transaction } from "./Transaction";

type PromiseData = {
  body: string;
  color: ColorEnumKey;
  height: number;
  signees: Address[];
  title: string;
};

export function NewPromiseScreen() {
  const account = useAccount();
  const breakpoint = useBreakpoint();
  const [mode, setMode] = useState<"editor" | "preview" | "transaction">("editor");
  const [svgHeight, setSvgHeight] = useState(0);

  // Not necessarily valid, only to be used with the editor
  const [editorData, setEditorData] = useState<EditorData>({
    body: "",
    color: "pink",
    signees: [["", ""]],
    title: "",
  });

  const small = breakpoint === "small";

  // Fill the signees with the account on connect or account change
  useEffect(() => {
    if (account.address) {
      setEditorData((data) => (
        (data.signees.length === 1 && data.signees[0][0] === "")
          ? { ...data, signees: [[account.address ?? "", ""]] }
          : data
      ));
    }
  }, [account.address]);

  // Valid version of the data to be used in the tx
  const newPromiseData = useMemo<PromiseData>(() => ({
    body: editorData.body.trim(),
    color: colorEnumKey(editorData.color),
    signees: uniqueAddresses(
      editorData.signees.map((signee) => signee[0]).filter(isAddress),
    ),
    title: editorData.title.trim(),
    height: svgHeight,
  }), [editorData, svgHeight]);

  const feeEstimate = useTxFeeEstimate(newPromiseData);

  const bodyHtml = useMemo(() => (
    blocksToHtml(textToBlocks(newPromiseData.body))
  ), [newPromiseData.body]);

  const [previewBodyHtml, previewTitle] = useMemo(() => [
    blocksToHtml(textToBlocks(newPromiseData.body || PLACEHOLDER_BODY)),
    newPromiseData.title || PLACEHOLDER_TITLE,
  ], [newPromiseData]);

  const chainId = useCurrentChainId();
  const chainPrefix = appChainFromId(chainId ?? -1)?.prefix;
  const contractAddress = usePinkyPromiseContractAddress(chainId);
  const svgDocColors = useMemo(() => promiseColors(editorData.color), [
    editorData.color,
  ]);
  const signedOn = formatDate(new Date());

  const submitEnabled = Boolean(
    newPromiseData.title.length > 0
      && newPromiseData.body.length > 0
      && newPromiseData.signees.length > 0,
  );

  const background = useBackground();
  useEffect(() => {
    background.set(mode === "transaction" ? "pink" : editorData.color);
  }, [background, editorData.color, mode]);

  const modeTransitions = useTransition({ mode, editorColor: editorData.color }, {
    keys: ({ mode, editorColor }) => String(mode + editorColor),
    from: { opacity: 0, transform: "scale3d(0.9, 0.9, 1)" },
    enter: { opacity: 1, transform: "scale3d(1, 1, 1)" },
    leave: { opacity: 0, immediate: true },
    immediate: small || breakpoint === null,
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });

  useResetScroll([mode]);

  return breakpoint && (
    <div
      css={{
        flexGrow: 1,
        display: "grid",
        overflow: "hidden",
        paddingTop: small ? 12 : 16,
      }}
    >
      {modeTransitions((style, { mode }) =>
        match(mode)
          .with("editor", () => (
            <Appear appear={style}>
              <div
                css={{
                  display: "grid",
                  transformOrigin: "50% 50%",
                  width: "100%",
                  padding: small ? "12px 8px 0" : "16px 8px 0",
                }}
              >
                <Editor
                  data={editorData}
                  onChange={setEditorData}
                  submitEnabled={submitEnabled}
                  onSubmit={() => setMode("transaction")}
                  feeEstimate={feeEstimate}
                  aboveAction={small && (
                    <div css={{ paddingBottom: 8 }}>
                      <EditorBar
                        color={editorData.color}
                        inline={true}
                        onColor={(color) => {
                          setEditorData((data) => ({ ...data, color }));
                        }}
                        onPreviewToggle={() => {
                          setMode((mode) =>
                            mode === "preview" ? "editor" : "preview"
                          );
                        }}
                        preview={mode === "preview"}
                      />
                    </div>
                  )}
                />
              </div>
            </Appear>
          ))
          .with("preview", () => (
            <Appear appear={style}>
              <div
                css={{
                  display: "grid",
                  placeItems: "center",
                  transformOrigin: "50% 50%",
                  position: "relative",
                  padding: "16px 8px 80px",
                }}
              >
                <Container
                  color={svgDocColors.color}
                  secondary={
                    <>
                      {small && (
                        <div
                          css={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: 24,
                            paddingBottom: 16,
                          }}
                        >
                          <EditorBar
                            color={editorData.color}
                            inline={true}
                            onColor={(color) => {
                              setEditorData((data) => ({ ...data, color }));
                            }}
                            onPreviewToggle={() => {
                              setMode((mode) =>
                                mode === "preview" ? "editor" : "preview"
                              );
                            }}
                            preview={mode === "preview"}
                          />
                        </div>
                      )}
                      <ActionBox
                        compact={small}
                        info={"Review your promise before initiating a transaction that will create the promise and sign it on chain."}
                        infoColor={COLORS.blueGrey}
                        button={
                          <Button
                            color={COLORS[editorData.color]}
                            disabled={!submitEnabled}
                            label="All good"
                            mode="primary"
                            size="large"
                            type="submit"
                            onClick={() => setMode("transaction")}
                            wide={small}
                          />
                        }
                      />
                    </>
                  }
                  secondaryMode={small ? "inside" : "drawer"}
                  padding={small ? 16 : "56px 56px 56px"}
                >
                  <SvgDoc
                    bodyHtml={previewBodyHtml}
                    classPrefix="svg-preview"
                    htmlMode={true}
                    padding={small ? [8, 8, 0] : [0, 0, 0]}
                    promiseId={`${chainPrefix}-1`}
                    signedOn={signedOn}
                    signees={
                      <SvgDocSignees
                        signees={newPromiseData.signees.map((s) => [s, true])}
                      />
                    }
                    status="draft"
                    title={previewTitle}
                    {...svgDocColors}
                  />
                </Container>
              </div>
            </Appear>
          ))
          .with(
            "transaction",
            () => (
              <Appear appear={style}>
                <div
                  css={{
                    display: "grid",
                    height: "100%",
                    transformOrigin: "50% 50%",
                  }}
                >
                  <Transaction
                    config={{
                      abi: PinkyPromiseAbi,
                      address: contractAddress,
                      chainId,
                      functionName: "newPromise",
                      args: [{
                        body: newPromiseData.body,
                        color: newPromiseData.color,
                        height: newPromiseData.height,
                        title: newPromiseData.title,
                      }, newPromiseData.signees],
                    }}
                    title="Creating pinky promise"
                    successLabel="View Promise"
                    successAction={({ logs }) => (
                      `/promise/${chainPrefix}-${promiseIdFromTxLogs(logs)}`
                    )}
                    onCancel={() => {
                      setMode("editor");
                    }}
                  />
                </div>
              </Appear>
            ),
          )
          .exhaustive()
      )}
      {mode !== "transaction" && !small && (
        <div
          css={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            width: 128,
          }}
        >
          <EditorBar
            color={editorData.color}
            onColor={(color) => {
              setEditorData((data) => ({ ...data, color }));
            }}
            onPreviewToggle={() => {
              setMode((mode) => mode === "preview" ? "editor" : "preview");
            }}
            preview={mode === "preview"}
          />
        </div>
      )}
      <SvgDoc
        bodyHtml={bodyHtml}
        classPrefix="svg-height-nft"
        onHeight={setSvgHeight}
        promiseId="001"
        signedOn={signedOn}
        signees={
          <SvgDocSignees
            signees={newPromiseData.signees.map((s) => [s, true])}
          />
        }
        status="draft"
        title={newPromiseData.title}
        {...svgDocColors}
      />
    </div>
  );
}

function useTxFeeEstimate(data: PromiseData): Dnum {
  const chainId = useCurrentChainId();
  const contractAddress = usePinkyPromiseContractAddress(chainId);
  const feeData = useFeeData();
  const txPrepare = usePrepareContractWrite({
    abi: PinkyPromiseAbi,
    address: contractAddress,
    chainId,
    functionName: "newPromise",
    args: [{
      body: data.body,
      color: data.color,
      height: data.height,
      title: data.title,
    }, data.signees],
  });
  const gasLimit = txPrepare.data?.request.gasLimit.toBigInt() ?? 0n;
  const gasPrice = [feeData.data?.gasPrice?.toBigInt() ?? 0n, 18] as const;
  return dn.multiply(gasLimit, gasPrice);
}
