import type { ComponentPropsWithoutRef } from "react";

import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./Button";
import { COLORS } from "./constants";
import { shortenAddress } from "./utils";

export function ConnectButton(props: Partial<ComponentPropsWithoutRef<typeof Button>>) {
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
        const connected = mounted && account && chain;

        if (!mounted) return null;

        if (!connected) {
          return (
            <Button
              color={COLORS.white}
              onClick={openConnectModal}
              label="Connect"
              {...props}
            />
          );
        }

        if (chain.unsupported) {
          return (
            <Button
              color={COLORS.white}
              onClick={openChainModal}
              label="Wrong network"
              {...props}
            />
          );
        }

        return (
          <Button
            color={COLORS.white}
            onClick={openAccountModal}
            label={shortenAddress(account.address)}
            {...props}
          />
        );
      }}
    </RKConnectButton.Custom>
  );
}
