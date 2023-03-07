import type { Dnum } from "dnum";
import type { EditorData } from "./Editor";
import type { Address, ColorEnumKey } from "./types";

import * as dn from "dnum";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { a, useTransition } from "react-spring";
import { match } from "ts-pattern";
import { useAccount, useFeeData, usePrepareContractWrite } from "wagmi";
import { PinkyPromiseAbi } from "./abis";
import { ActionBox } from "./ActionBox";
import { Button } from "./Button";
import { COLORS, PLACEHOLDER_BODY, PLACEHOLDER_TITLE } from "./constants";
import { Container } from "./Container";
import {
  colorEnumKey,
  promiseIdFromTxLogs,
  useCurrentChainId,
  usePinkyPromiseContractAddress,
} from "./contract-utils";
import { Editor } from "./Editor";
import { EditorBar } from "./EditorBar";
import { useBackground } from "./GlobalStyles";
import { useResetScroll } from "./react-utils";
import { SvgDoc, SvgDocSignees } from "./SvgDoc";
import { Transaction } from "./Transaction";
import {
  appChainFromId,
  blocksToHtml,
  formatDate,
  isAddress,
  promiseColors,
  textToBlocks,
} from "./utils";

type PromiseData = {
  body: string;
  color: ColorEnumKey;
  height: number;
  signees: Address[];
  title: string;
};

export function CreatePromiseScreen() {
  const account = useAccount();
  const [mode, setMode] = useState<"editor" | "preview" | "transaction">("editor");
  const [svgHeight, setSvgHeight] = useState(0);

  // Not necessarily valid, only to be used with the editor
  const [editorData, setEditorData] = useState<EditorData>({
    body: "",
    color: "pink",
    signees: [["", ""]],
    title: "",
  });

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
    signees: editorData.signees.map((signee) => signee[0]).filter(isAddress),
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
  const chainPrefix = appChainFromId(chainId)?.prefix;
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
    from: { progress: 0, opacity: 0, transform: "scale3d(0.85, 0.85, 1)" },
    enter: { progress: 1, opacity: 1, transform: "scale3d(1, 1, 1)" },
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });

  useResetScroll([mode]);

  return (
    <div
      css={{
        flexGrow: 1,
        display: "grid",
        overflow: "hidden",
        paddingTop: 16,
      }}
    >
      {modeTransitions((styles, { mode }) =>
        match(mode)
          .with("preview", () => (
            <a.div
              style={styles}
              css={{
                display: "grid",
                placeItems: "center",
                transformOrigin: "50% 50%",
                position: "relative",
              }}
            >
              <Container
                color={svgDocColors.color}
                drawer={
                  <ActionBox
                    info={"Review your promise before initiating a transaction that will create the promise and sign it on chain."}
                    infoColor="#7B7298"
                    button={
                      <Button
                        color={COLORS[editorData.color]}
                        disabled={!submitEnabled}
                        label="All good"
                        mode="primary"
                        size="large"
                        type="submit"
                        onClick={() => setMode("transaction")}
                      />
                    }
                  />
                }
                padding="56px 56px 56px"
              >
                <SvgDoc
                  bodyHtml={previewBodyHtml}
                  classPrefix="svg-preview"
                  htmlMode={true}
                  padding={[0, 0, 0]}
                  promiseId="001"
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
            </a.div>
          ))
          .with("editor", () => (
            <a.div
              style={styles}
              css={{ transformOrigin: "50% 50%" }}
            >
              <Editor
                data={editorData}
                onChange={setEditorData}
                submitEnabled={submitEnabled}
                onSubmit={() => setMode("transaction")}
                feeEstimate={feeEstimate}
              />
            </a.div>
          ))
          .with(
            "transaction",
            () => (
              <a.div
                style={styles}
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
              </a.div>
            ),
          )
          .exhaustive()
      )}
      {mode !== "transaction" && (
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
