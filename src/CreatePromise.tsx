import type { FormEventHandler } from "react";
import type { Address, Log } from "./types";

import { utils as ethersUtils } from "ethers";
import { useEffect } from "react";
import { useCallback, useMemo, useState } from "react";
import { match } from "ts-pattern";
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { Link } from "wouter";
import { PinkySwearPactsAbi } from "./abis";
import { CONTRACT_ADDRESS } from "./environment";
import { placeholder } from "./placeholder";
import { SvgDoc } from "./SvgDoc";
import { SvgDocImg } from "./SvgDocImg";
import { blocksToHtml, isAddress, textToBlocks } from "./utils";

const placeholderData = placeholder();

const PinkySwearPactsInterface = new ethersUtils.Interface(PinkySwearPactsAbi);

function parsePinkySwearPactsLog(log: Log) {
  return PinkySwearPactsInterface.parseLog(log);
}

export function CreatePromise() {
  const [newPactData, setNewPactData] = useState<
    null | {
      text: string;
      signees: Address[];
      docHeight: number;
    }
  >(null);

  const { chain } = useNetwork();

  const txMode = Boolean(newPactData);

  const txPrepare = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: PinkySwearPactsAbi,
    functionName: "newPact",
    args: [
      {
        color: 1,
        height: newPactData?.docHeight ?? 0,
        text: newPactData?.text ?? "",
      },
      newPactData?.signees ?? [],
    ],
    enabled: txMode,
  });

  const txWrite = useContractWrite(txPrepare.config);

  const txResult = useWaitForTransaction({
    hash: txWrite.data?.hash,
    enabled: txWrite.status === "success",
  });

  const resetScroll = useCallback(() => {
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    txWrite.reset();
    resetScroll();
  }, [resetScroll, txMode]);

  return txMode
    ? (
      <div css={{ paddingTop: "40px", textAlign: "center" }}>
        <div css={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => {
              setNewPactData(null);
            }}
          >
            cancel
          </button>
          <button
            type="button"
            onClick={() => txWrite.write?.()}
            disabled={txPrepare.status !== "success"}
          >
            sign
          </button>
        </div>
        <div
          css={{
            margin: "0 auto",
            paddingTop: "10px",
            whiteSpace: "nowrap",
            maxWidth: "600px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {match({ write: txWrite.status, result: txResult.status })
            .with({ write: "idle" }, () => "sign 👆")
            .with({ write: "error" }, () => `error: ${txWrite.error?.message}`)
            .with({ write: "loading" }, () => "confirm in wallet pls")
            .with({ write: "success", result: "success" }, () => {
              const draftUpdateEvent = txResult.data?.logs
                .map(parsePinkySwearPactsLog)
                .find(event => event.name === "PactUpdate" && event.args.state === 1);

              const pactId = draftUpdateEvent?.args.pactId?.toString();

              if (!pactId) {
                return "error: pactId missing";
              }

              return (
                <span>
                  <Link href={`/pact/${pactId}`}>pact #{pactId}</Link> created 🤌 (
                  <a
                    href={`${(
                      chain?.blockExplorers?.default.url
                    )}/tx/${txWrite.data?.hash}`}
                    target="_blank"
                  >
                    tx
                  </a>
                  )
                </span>
              );
            })
            .with({ write: "success" }, () => (
              <span>
                <a
                  href={`${(
                    chain?.blockExplorers?.default.url
                  )}/tx/${txWrite.data?.hash}`}
                  target="_blank"
                >
                  tx
                </a>{" "}
                signed, wait pls…
              </span>
            ))
            .otherwise(() => txWrite.status)}
        </div>
        {newPactData && (
          <div
            css={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 0",
              "img": {
                display: "block",
                width: "600px",
              },
            }}
          >
            <SvgDocImg
              alt={newPactData?.text}
              height={newPactData?.docHeight}
              html={newPactData?.text}
              signees={newPactData?.signees}
            />
          </div>
        )}
      </div>
    )
    : (
      <PromiseForm
        onCreate={(newPactData) => {
          setNewPactData(newPactData);
        }}
      />
    );
}

function PromiseForm({
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
  const [signees, setSignees] = useState<string[]>(placeholderData.signees);

  const validSignees = useMemo<Address[]>(() => (
    signees.filter(isAddress)
  ), [signees]);

  const handleSubmit: FormEventHandler = useCallback((event) => {
    event.preventDefault();
    onCreate({
      docHeight,
      signees: validSignees,
      text,
    });
  }, [docHeight, text, validSignees]);

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
                value={signee}
                onChange={(event) => {
                  setSignees(
                    signees.map((value, _index) => (
                      index === _index ? event.target.value : value
                    )),
                  );
                }}
              />
              {signees.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSignees([
                      ...signees.filter((_, _index) => _index !== index),
                    ]);
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
                  [...signees, ""],
                );
              }}
            >
              +
            </button>
          </div>
        </div>
        <div css={{ position: "relative" }}>
          <SvgDoc
            height={docHeight}
            html={html}
            onHeight={setDocHeight}
            signees={validSignees}
          />
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
                signees={validSignees}
              />
            </div>
          </div>
          <SvgDocImg
            alt={text}
            height={docHeight}
            html={html}
            signees={validSignees}
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
