import type { ChangeEvent } from "react";
import type { ColorId, EnsName } from "./types";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { a, useTransition } from "react-spring";
import { useProvider } from "wagmi";
import { Loader } from "./Loader";
import { RemoveButton } from "./RemoveButton";
import { isEnsName } from "./utils";

export function AddressInput({
  accentColor,
  onChange,
  onRemove,
  value,
}: {
  accentColor?: ColorId;
  onChange: (value: string) => void;
  onRemove: () => void;
  value: string;
}) {
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
    <div css={{ position: "relative", height: "64px" }}>
      <input
        className="signee"
        type="text"
        placeholder="0x…"
        {...resolveAddress.bind}
        css={{
          height: "64px",
          padding: "14px 24px",
        }}
      />
      {loadingTransition((styles, isLoading) =>
        isLoading
          ? (
            <a.div
              style={styles}
              css={{
                position: "absolute",
                inset: "12px 12px auto auto",
              }}
            >
              <Loader size={40} />
            </a.div>
          )
          : (
            <a.div
              style={styles}
              css={{
                position: "absolute",
                inset: "12px 12px auto auto",
              }}
            >
              <RemoveButton
                accentColor={accentColor}
                onClick={() => onRemove()}
              />
            </a.div>
          )
      )}
    </div>
  );
}

function useResolveAddress(value: string, onChange: (value: string) => void) {
  const [nameToResolve, setNameToResolve] = useState<null | EnsName>(null);

  // To replace with wagmi’s useEnsAddress() one day (it currently has too many reliability issues when doing quick query updates)
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
        if (isEnsName(value)) {
          resolvedAddress.remove();
          setNameToResolve(value);
        }
      },
      value: isLoading ? `resolving ${nameToResolve}…` : value,
    },
  };
}