import type { Dnum } from "dnum";
import type { ColorId } from "./types";

import * as dn from "dnum";
import { useEffect, useState } from "react";
import { a, useTransition } from "@react-spring/web";
import { ActionBox } from "./ActionBox";
import { AddressInput } from "./AddressInput";
import { Button } from "./Button";
import {
  COLORS,
  EDITOR_CONFIRM_NOTICE,
  PLACEHOLDER_BODY,
  PLACEHOLDER_TITLE,
} from "./constants";
import { Container } from "./Container";

export type EditorData = {
  body: string;
  color: ColorId;
  signees: [string, string][];
  title: string;
};

export function Editor({
  data,
  feeEstimate,
  onChange,
  onSubmit,
  submitEnabled,
}: {
  data: EditorData;
  feeEstimate: Dnum;
  onChange: (data: EditorData) => void;
  submitEnabled?: boolean;
  onSubmit: (data: EditorData) => void;
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

    const lastInput = document.querySelectorAll("input.signee").item(
      signeeFocusRequest,
    );
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
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (submitEnabled) {
          onSubmit(data);
        }
      }}
    >
      <div
        css={{
          "input, textarea": {
            display: "block",
            width: "100%",
            fontWeight: 400,
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
                    <AddressInput
                      accentColor={data.color}
                      onChange={(value) => {
                        updateFormSignee(id, value);
                      }}
                      onRemove={() => {
                        removeFormSignee(id);
                      }}
                      value={address}
                    />
                  </div>
                </a.div>
              ))}
            </div>
            <div
              css={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0 48px",
              }}
            >
              <Button
                color={COLORS[data.color]}
                label="Add signee"
                size="regular"
                onClick={() => {
                  addFormSignee();
                }}
              />
              <div
                css={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: COLORS[data.color],
                }}
              >
                {dn.gt(feeEstimate, 0)
                  && (
                    <span
                      title={`Estimated transaction fee: ${
                        dn.format(feeEstimate, 4)
                      } ETH`}
                    >
                      <span>tx fee</span> ~{dn.format(feeEstimate, 4)} ETH
                    </span>
                  )}
              </div>
            </div>
            <div css={{ margin: "0 -48px" }}>
              <ActionBox
                info={EDITOR_CONFIRM_NOTICE}
                infoColor={COLORS[data.color]}
                button={
                  <Button
                    color={COLORS[data.color]}
                    disabled={!submitEnabled}
                    label="All good"
                    mode="primary"
                    size="large"
                    type="submit"
                  />
                }
              />
            </div>
          </Container>
        </div>
      </div>
    </form>
  );
}
