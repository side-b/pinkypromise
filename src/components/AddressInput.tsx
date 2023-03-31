import type { ChangeEvent } from "react";
import type { ColorId, EnsName } from "../types";

import { a, useTransition } from "@react-spring/web";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useProvider } from "wagmi";
import { COLORS } from "../constants";
import { isEnsName } from "../lib/utils";
import { Loader } from "./Loader";
import { PlusMinusButton } from "./PlusMinusButton";

export function AddressInput({
  accentColor,
  fontSize = 18,
  height = 64,
  onChange,
  onRemove,
  vPadding = 14,
  hPadding = 24,
  value,
}: {
  accentColor?: ColorId;
  fontSize?: number;
  height?: number;
  onChange: (value: string) => void;
  onRemove: () => void;
  hPadding?: number;
  vPadding?: number;
  value: string;
}) {
  const buttonSize = height - vPadding * 2 + 4;
  const buttonXY = height / 2 - buttonSize / 2;
  const inputPaddingRight = buttonXY * 2 + buttonSize;

  const resolveAddress = useResolveAddress(value, onChange);
  const loadingTransition = useTransition(resolveAddress.isLoading, {
    from: {
      opacity: "0",
      transform: "scale(0.5)",
    },
    enter: {
      opacity: "1",
      transform: "scale(1)",
    },
    leave: {
      opacity: "0",
      immediate: true,
    },
    config: {
      mass: 1,
      friction: 80,
      tension: 2000,
    },
  });
  return (
    <div css={{ position: "relative", height }}>
      <input
        name="ethereum-account"
        className="signee"
        type="text"
        placeholder="0x…"
        spellCheck={false}
        {...resolveAddress.bind}
        css={{
          height,
          padding: `
            ${vPadding}px
            ${inputPaddingRight}px
            ${vPadding}px
            ${hPadding}px
          `,
          fontSize,
        }}
      />
      {loadingTransition((styles, isLoading) =>
        isLoading
          ? (
            <a.div
              style={styles}
              css={{
                position: "absolute",
                inset: `${buttonXY}px ${buttonXY}px auto auto`,
              }}
            >
              <Loader size={buttonSize} />
            </a.div>
          )
          : (
            <a.div
              style={styles}
              css={{
                position: "absolute",
                inset: `${buttonXY}px ${buttonXY}px auto auto`,
              }}
            >
              <PlusMinusButton
                color={COLORS[accentColor ?? "pink"]}
                mode="minus"
                onClick={() => onRemove()}
                size={buttonSize}
                title="Remove"
              />
            </a.div>
          )
      )}
    </div>
  );
}

function useResolveAddress(value: string, onChange: (value: string) => void) {
  const [nameToResolve, setNameToResolve] = useState<null | EnsName>(null);

  // To replace with wagmi’s useEnsAddress() eventually (it currently has too many reliability issues when doing quick query updates)
  const provider = useProvider();
  const resolvedAddress = useQuery({
    enabled: Boolean(nameToResolve),
    onSettled() {
      setNameToResolve(null);
    },
    onSuccess(address) {
      if (address && nameToResolve === value) {
        onChange(address);
      }
    },
    queryKey: ["resolve-ens", nameToResolve],
    queryFn: () => {
      return nameToResolve
        ? provider.resolveName(nameToResolve ?? "")
        : null;
    },
  });

  const isLoading = Boolean(nameToResolve);

  return {
    isLoading,
    bind: {
      onChange(event: ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value);
        setNameToResolve(null);
      },
      onFocus() {
        setNameToResolve(null);
      },
      onBlur() {
        const valueTrimmed = value.trim();
        onChange(valueTrimmed);
        if (isEnsName(valueTrimmed)) {
          resolvedAddress.remove();
          setNameToResolve(valueTrimmed);
        }
      },
      value: isLoading ? `resolving ${nameToResolve}…` : value,
    },
  };
}
