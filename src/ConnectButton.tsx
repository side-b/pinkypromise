import type { ComponentPropsWithoutRef } from "react";

import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./Button";
import { COLORS } from "./constants";
import { SplitButton } from "./SplitButton";
import { shortenAddress, shortNetworkName } from "./utils";

export function ConnectButton(
  props: Partial<ComponentPropsWithoutRef<typeof Button>>,
) {
  return (
    <RKConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        if (!mounted) return null;

        if (!(account && chain)) {
          return (
            <Button
              color={COLORS.white}
              onClick={openConnectModal}
              label="Connect"
              {...props}
            />
          );
        }

        return (
          <SplitButton
            first={{
              gap: 8,
              label: (
                <div
                  css={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    css={{
                      width: 10,
                      height: 10,
                      background: chain.unsupported ? COLORS.red : "#7DFF00",
                      border: `2px solid ${COLORS.white}`,
                      borderRadius: "100%",
                      transform: "translateY(1px)",
                    }}
                  />
                  {chain.unsupported
                    ? "wrong network"
                    : shortNetworkName(chain.id)}
                </div>
              ),
              onClick: openChainModal,
              title: `Connected to ${chain.name}`,
            }}
            second={{
              label: shortenAddress(account.address),
              onClick: openAccountModal,
            }}
          />
        );
      }}
    </RKConnectButton.Custom>
  );
}
