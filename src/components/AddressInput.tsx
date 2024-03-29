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
  errored,
  fontSize = 18,
  hPadding = 24,
  height = 64,
  onChange,
  onRemove,
  vPadding = 14,
  value,
}: {
  accentColor?: ColorId;
  errored?: boolean;
  fontSize?: number;
  hPadding?: number;
  height?: number;
  onChange: (value: string) => void;
  onRemove: () => void;
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
        className={"signee" + (errored && !resolveAddress.isLoading ? " error" : "")}
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

  // useProvider() should get replaced by wagmi’s useEnsAddress() eventually.
  // (useEnsAddress() was too unreliable with quick query updates when this hook was added.)
  const provider = useProvider({
    // ENS team recommends to only resolve names on mainnet
    // See https://makoto-inoue.medium.com/how-to-support-ens-for-multi-chain-dapps-b0a7ff043d77
    chainId: 1,
  });
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
