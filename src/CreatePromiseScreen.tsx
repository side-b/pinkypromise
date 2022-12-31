import type { EditorData } from "./Editor";
import type { Address, ColorId } from "./types";

import { useEffect } from "react";
import { useMemo, useState } from "react";
import { a, useTransition } from "react-spring";
import { match } from "ts-pattern";
import { useAccount } from "wagmi";
import { PinkyPromiseAbi } from "./abis";
import { COLORS } from "./constants";
import { promiseIdFromTxLogs } from "./contract-utils";
import { Editor } from "./Editor";
import { EditorBar } from "./EditorBar";
import { CONTRACT_ADDRESS } from "./environment";
import { useBackground } from "./GlobalStyles";
import { PinkyPromise } from "./PinkyPromise";
import { SvgDoc } from "./SvgDoc";
import { Transaction } from "./Transaction";
import { blocksToHtml, isAddress, textToBlocks } from "./utils";

export function CreatePromiseScreen() {
  const account = useAccount();
  const [mode, setMode] = useState<"editor" | "preview" | "transaction">("editor");
  const [svgHeight, setSvgHeight] = useState(0);

  // Not necessarily valid, only to be used with the editor
  const [editorData, setEditorData] = useState<EditorData>({
    body: "",
    color: "pink",
    signees: [[account.address ?? "", ""]],
    title: "",
  });

  // Valid version of the data to be used in the tx
  const newPromiseData = useMemo<{
    body: string;
    color: ColorId;
    signees: Address[];
    title: string;
  }>(() => ({
    body: editorData.body.trim(),
    color: editorData.color,
    signees: editorData.signees.map(signee => signee[0]).filter(isAddress),
    title: editorData.title.trim(),
  }), [editorData]);

  const bodyHtml = useMemo(() => (
    blocksToHtml(textToBlocks(newPromiseData.body))
  ), [newPromiseData.body]);

  const submitEnabled = Boolean(
    newPromiseData.title.length > 0
      && newPromiseData.body.length > 0
      && newPromiseData.signees.length > 0,
  );

  const editorColor = editorData.color;
  const background = useBackground();
  useEffect(() => {
    background.set(editorColor);
  }, [background, editorColor]);

  const modeTransitions = useTransition({ mode, editorColor }, {
    keys: ({ mode, editorColor }) => String(mode + editorColor),
    from: { transform: "scale(0.85) translateY(0)" },
    enter: { transform: "scale(1) translateY(0)" },
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });

  return (
    <div
      css={{
        overflowX: "hidden",
        padding: "16px 0 0",
      }}
    >
      {modeTransitions((styles, { mode }) =>
        match(mode)
          .with("preview", () => (
            <a.div
              style={styles}
              css={{ transformOrigin: "50% 50%" }}
            >
              <PinkyPromise
                body={editorData.body}
                color={editorData.color}
                signees={editorData.signees
                  .map(([address]) => address)
                  .filter(isAddress)}
                title={editorData.title || "Pinky Promise"}
              />
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
                onSubmit={() => {
                  setMode("transaction");
                }}
              />
            </a.div>
          ))
          .with(
            "transaction",
            () => (
              <Transaction
                config={{
                  address: CONTRACT_ADDRESS,
                  abi: PinkyPromiseAbi,
                  functionName: "newPromise",
                  args: [
                    {
                      color: 1,
                      height: svgHeight ?? 0,
                      title: newPromiseData.title,
                      body: newPromiseData.body,
                    },
                    newPromiseData?.signees ?? [],
                  ],
                }}
                title="Creating pinky promise"
                successLabel="View NFT"
                successAction={({ logs }) => `/promise/${promiseIdFromTxLogs(logs)}`}
                onCancel={() => {
                  setMode("editor");
                }}
              />
            ),
          ).exhaustive()
      )}
      {mode !== "transaction" && (
        <EditorBar
          color={editorData.color}
          onColor={(color) => {
            setEditorData((data) => ({ ...data, color }));
          }}
          onPreviewToggle={() => {
            setMode(mode => mode === "preview" ? "editor" : "preview");
          }}
          preview={mode === "preview"}
        />
      )}
      <div
        css={{
          position: "fixed",
          zIndex: 2,
          top: "180px",
          left: "100vw",
          opacity: "0",
          userSelect: "none",
        }}
      >
        <SvgDoc
          bodyHtml={bodyHtml}
          color={COLORS[newPromiseData.color]}
          height={svgHeight}
          onHeight={setSvgHeight}
          signees={newPromiseData.signees}
          title={newPromiseData.title}
        />
      </div>
    </div>
  );
}