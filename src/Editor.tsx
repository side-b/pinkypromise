import type { ColorId } from "./types";

import { useEffect, useState } from "react";
import { a, useTransition } from "react-spring";
import { Button } from "./Button";
import { COLORS, PLACEHOLDER_BODY, PLACEHOLDER_TITLE } from "./constants";
import { Container } from "./Container";

const CONFIRM_MESSAGE = `Non-fungible tokens (NFTs) are unique crypto assets that are stored on a blockchain.
Creating an NFT allows users to upload digital media.`;

export type EditorData = {
  body: string;
  color: ColorId;
  signees: [string, string][];
  title: string;
};

export function Editor({
  data,
  onChange,
}: {
  data: EditorData;
  onChange: (data: EditorData) => void;
}) {
  const [signeeFocusRequest, setSigneeFocusRequest] = useState<number>(-1);

  const addFormSignee = () => {
    setSigneeFocusRequest(data.signees.length);
    onChange({
      ...data,
      signees: [...data.signees, ["", String(Date.now())]],
    });
  };

  const removeFormSignee = (id: string) => {
    if (data.signees.length === 1) {
      setSigneeFocusRequest(0);
    }
    const filtered = [...data.signees].filter(([_, id_]) => id_ !== id);
    onChange({
      ...data,
      signees: filtered.length === 0 ? [["", data.signees[0][1] ?? ""]] : filtered,
    });
  };

  const updateFormSignee = (id: string, value: string) => {
    onChange({
      ...data,
      signees: data.signees.map((signee) => signee[1] === id ? [value, id] : signee),
    });
  };

  useEffect(() => {
    if (signeeFocusRequest === -1) {
      return;
    }
    setSigneeFocusRequest(-1);

    const lastInput = document.querySelectorAll("input.signee").item(signeeFocusRequest);
    if (lastInput) {
      (lastInput as HTMLInputElement).focus();
    }
  }, [signeeFocusRequest]);

  const signeesTransitions = useTransition(data.signees, {
    keys: ([_, id]) => id,
    initial: { height: "72px", opacity: 1 },
    from: { height: "0", opacity: 1 },
    enter: { height: "72px", opacity: 1 },
    leave: { height: "0", opacity: 0 },
    config: {
      mass: 1,
      friction: 100,
      tension: 2000,
    },
  });

  return (
    <div
      css={{
        "input, textarea": {
          display: "block",
          width: "100%",
          fontWeight: "300",
          background: COLORS.white,
          borderRadius: "20px",
          border: 0,
          "&:focus-visible": {
            outline: `2px solid ${COLORS.pink}`,
          },
        },
      }}
    >
      <div css={{ paddingBottom: "80px" }}>
        <Container>
          <div>
            <input
              type="text"
              onChange={(event) => {
                onChange({ ...data, title: event.target.value });
              }}
              placeholder={PLACEHOLDER_TITLE}
              value={data.title}
              css={{
                height: "64px",
                padding: "14px 24px",
                fontSize: "24px",
              }}
            />
          </div>
          <div>
            <textarea
              onChange={(event) => {
                onChange({ ...data, body: event.target.value });
              }}
              placeholder={PLACEHOLDER_BODY}
              value={data.body}
              css={{
                padding: "24px",
                height: "240px",
                resize: "none",
              }}
            />
          </div>
          <div css={{ marginTop: "-6px" }}>
            {signeesTransitions((style, [address, id]) => (
              <a.div
                key={id}
                style={style}
                css={{
                  position: "relative",
                  overflow: "hidden",
                  margin: "0 -4px",
                  padding: "0 4px",
                }}
              >
                <div
                  css={{
                    position: "absolute",
                    inset: "auto 4px 2px 4px",
                    paddingTop: "6px",
                  }}
                >
                  <input
                    className="signee"
                    type="text"
                    onChange={(event) => {
                      updateFormSignee(id, event.target.value);
                    }}
                    value={address}
                    placeholder="0x…"
                    css={{
                      height: "64px",
                      padding: "14px 24px",
                    }}
                  />
                  <Remove
                    css={{
                      position: "absolute",
                      inset: "20px 12px auto auto",
                    }}
                    onClick={() => {
                      removeFormSignee(id);
                    }}
                  />
                </div>
              </a.div>
            ))}
          </div>
          <div css={{ padding: "16px 0 48px" }}>
            <Button
              label="Add signee"
              size="large"
              onClick={() => {
                addFormSignee();
              }}
            />
          </div>
          <div
            css={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              margin: "0 -48px",
              padding: "32px 40px",
              background: COLORS.white,
              borderRadius: "64px",
            }}
          >
            <div css={{ color: COLORS.pink }}>
              {CONFIRM_MESSAGE}
            </div>
            <div>
              <Button
                mode="primary"
                label="Good to go"
                size="large"
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

function Remove({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      title="Remove"
      type="button"
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        color: COLORS.white,
        background: COLORS.pink,
        border: "0",
        borderRadius: "50%",
        cursor: "pointer",
        "&:focus-visible": {
          outline: `2px solid ${COLORS.pink}`,
          outlineOffset: "3px",
        },
        "&:active": {
          transform: "translate(1px, 1px)",
        },
      }}
    >
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
        <path
          stroke={COLORS.white}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 20 h22"
        />
      </svg>
    </button>
  );
}
