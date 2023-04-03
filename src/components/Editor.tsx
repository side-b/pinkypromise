import type { Dnum } from "dnum";
import type { ReactNode } from "react";
import type { ColorId } from "../types";

import { a, useTransition } from "@react-spring/web";
import * as dn from "dnum";
import { useEffect, useState } from "react";
import {
  COLORS,
  EDITOR_CONFIRM_NOTICE,
  PLACEHOLDER_BODY,
  PLACEHOLDER_TITLE,
} from "../constants";
import { useBreakpoint } from "../lib/react-utils";
import { ActionBox } from "./ActionBox";
import { AddressInput } from "./AddressInput";
import { Button } from "./Button";
import { Container } from "./Container";

export type EditorData = {
  body: string;
  color: ColorId;
  signees: [string, string][];
  title: string;
};

export function Editor({
  aboveAction,
  data,
  feeEstimate,
  onChange,
  onSubmit,
  submitEnabled,
}: {
  aboveAction?: ReactNode;
  data: EditorData;
  feeEstimate: Dnum;
  onChange: (data: EditorData) => void;
  submitEnabled?: boolean;
  onSubmit: (data: EditorData) => void;
}) {
  const breakpoint = useBreakpoint();
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

  const small = breakpoint === "small";

  const signeesTransitions = useTransition(data.signees, {
    keys: ([_, id]) => id + small,
    initial: { height: small ? 56 : 72, opacity: 1 },
    from: { height: 0, opacity: 1 },
    enter: { height: small ? 56 : 72, opacity: 1 },
    leave: { height: 0, opacity: 0 },
    config: {
      mass: 1,
      friction: 100,
      tension: 2000,
    },
  });

  return breakpoint && (
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
            borderRadius: small ? 32 : 20,
            border: 0,
            "&:focus-visible": {
              outline: `2px solid ${COLORS.pink}`,
            },
            "&::placeholder": {
              color: "#555",
            },
          },
        }}
      >
        <div css={{ paddingBottom: small ? 40 : 80 }}>
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
                  height: small ? 48 : 64,
                  padding: small ? "10px 16px" : "14px 24px",
                  fontSize: small ? 20 : 24,
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
                  padding: small ? 16 : 24,
                  height: 240,
                  fontSize: small ? 16 : 18,
                  resize: "none",
                }}
              />
            </div>
            <div css={{ marginTop: small ? -8 : -6 }}>
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
                      paddingTop: 6,
                    }}
                  >
                    <AddressInput
                      accentColor={data.color}
                      fontSize={small ? 20 : 18}
                      hPadding={small ? 16 : 24}
                      height={small ? 48 : 64}
                      onChange={(value) => updateFormSignee(id, value)}
                      onRemove={() => removeFormSignee(id)}
                      vPadding={small ? 10 : 14}
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
                padding: small ? "16px 0 24px" : "16px 0 48px",
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
                {dn.gt(feeEstimate, 0) && !small && (
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
            {aboveAction && <div>{aboveAction}</div>}
            <div css={{ margin: small ? 0 : "0 -48px" }}>
              <ActionBox
                compact={small}
                info={EDITOR_CONFIRM_NOTICE}
                infoColor={small ? COLORS.blueGrey : COLORS[data.color]}
                button={
                  <Button
                    color={COLORS[data.color]}
                    disabled={!submitEnabled}
                    label="All good"
                    mode="primary"
                    size="large"
                    type="submit"
                    wide={small}
                    css={{
                      height: small ? 48 : 64,
                      fontSize: small ? 32 : 40,
                    }}
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
