import type { FormEventHandler } from "react";
import type { Address } from "./types";

import { ConnectKitButton } from "connectkit";
import { useCallback, useMemo, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { PinkySwearPactsAbi } from "./abis";
import { placeholder } from "./placeholder";
import { SvgDoc } from "./SvgDoc";
import { SvgDocImg } from "./SvgDocImg";
import { blocksToHtml, isAddress, textToBlocks } from "./utils";

const placeholderData = placeholder();

export function App() {
  const [newPactData, setNewPactData] = useState<
    null | {
      text: string;
      signees: Address[];
      docHeight: number;
    }
  >(null);

  const txPrepare = usePrepareContractWrite({
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    abi: PinkySwearPactsAbi,
    functionName: "newPact",
    args: [
      newPactData?.signees ?? [],
      newPactData?.text ?? "",
      newPactData?.docHeight ?? 0,
    ],
    enabled: Boolean(newPactData),
  });

  const txWrite = useContractWrite(txPrepare.config);

  const txResult = useWaitForTransaction({
    hash: txWrite.data?.hash,
    enabled: txWrite.status === "success",
  });

  return (
    <div>
      <div
        css={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "20px 20px 0 0",
        }}
      >
        <ConnectKitButton theme="midnight" />
      </div>
      {txPrepare.status === "success"
        ? <div css={{ paddingTop: "40px", textAlign: "center" }}>
          <button type="button" onClick={() => txWrite.write?.()}>
            write tx
          </button>
          {txWrite.status !== "idle" && (
            <p>
              {txWrite.status === "success"
                ? `Confirming… ${txResult.status}`
                : `Signing… ${txWrite.status}`}
            </p>
          )}
        </div>
        : <PinkySwearPactForm
          onCreate={(newPactData) => {
            setNewPactData(newPactData);
          }}
        />}
    </div>
  );
}

function PinkySwearPactForm({
  onCreate,
}: {
  onCreate: (
    { text, signees, docHeight }: {
      text: string;
      signees: Address[];
      docHeight: number;
    },
  ) => void;
}) {
  const [docHeight, setDocHeight] = useState(0);
  const [text, setText] = useState<string>(placeholderData.text);
  const [signees, setSignees] = useState<[string, boolean][]>(
    placeholderData.signees.map(account => [account, false]),
  );

  const validSignees = useMemo<Address[]>(
    () => (
      signees
        .map(([address]) => (isAddress(address) ? address : null))
        .filter(Boolean) as Address[]
    ),
    [signees],
  );

  const handleSubmit: FormEventHandler = useCallback((event) => {
    event.preventDefault();
    onCreate({
      docHeight,
      signees: validSignees,
      text,
    });
  }, [docHeight, signees, text, validSignees]);

  const html = useMemo(() => blocksToHtml(textToBlocks(text)), [text]);

  return (
    <form onSubmit={handleSubmit}>
      <div
        css={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(0, 1fr)",
          alignItems: "start",
          gap: "40px",
          // width: "1640px",
          width: "1200px",
          margin: "0 auto",
          padding: "40px 0",

          "button": {
            display: "block",
            height: "40px",
            padding: "0 20px",
            font: "18px monospace",
            background: "#FFF",
            color: "#333",
            textTransform: "lowercase",
            border: "2px solid #333",
            cursor: "pointer",
          },
        }}
      >
        <div
          css={{
            "input:focus, textarea:focus, button:focus": {
              outline: "2px solid orange",
              outlineOffset: "0",
            },
          }}
        >
          <textarea
            onChange={(event) => {
              setText(event.target.value);
            }}
            value={text}
            css={{
              flexGrow: "1",
              display: "block",
              width: "100%",
              height: "380px",
              margin: "0",
              padding: "20px",
              font: "13.5px/1.5 monospace",
              resize: "vertical",
              border: "2px solid #333",
            }}
          />
          {signees.map((signee, index) => (
            <div
              key={index}
              css={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                paddingTop: "20px",
                "input": {
                  display: "block",
                  width: "100%",
                  height: "44px",
                  padding: "0 20px",
                  font: "13.5px/1.5 monospace",
                  border: "2px solid #333",
                },
                "button": {
                  flexShrink: "0",
                  width: "44px",
                  height: "44px",
                  padding: "0",
                  textAlign: "center",
                },
              }}
            >
              <input
                type="text"
                value={signee[0]}
                onChange={(event) => {
                  setSignees(
                    signees.map((value, _index) => (
                      index === _index
                        ? [event.target.value, true]
                        : value
                    )),
                  );
                }}
              />
              {signees.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSignees(
                      [...signees.filter((_, _index) => _index !== index)],
                    );
                  }}
                >
                  -
                </button>
              )}
            </div>
          ))}
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              height: "44px",
              marginTop: "20px",
              "button": {
                flexShrink: "0",
                width: "44px",
                height: "44px",
                padding: "0",
                textAlign: "center",
              },
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSignees(
                  [...signees, ["", true]],
                );
              }}
            >
              +
            </button>
          </div>
        </div>
        <div css={{ position: "relative" }}>
          <div css={{ position: "relative", overflow: "hidden" }}>
            <div
              css={{
                position: "absolute",
                top: "0",
                left: "0",
                visibility: "hidden",
              }}
            >
              <SvgDoc
                height={docHeight}
                html={html}
                onHeight={setDocHeight}
                signees={signees}
              />
            </div>
          </div>
          <SvgDocImg
            alt={text}
            height={docHeight}
            html={html}
            signees={signees}
          />
          <div
            css={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "20px",
            }}
          >
            <button type="submit">
              go
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
