import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./Button";
import { shortenAddress } from "./utils";

export function ConnectButton() {
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
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) return null;

        if (!connected) {
          return (
            <Button
              accentColor="white"
              onClick={openConnectModal}
              label="Connect"
            />
          );
        }

        if (chain.unsupported) {
          return (
            <Button
              accentColor="white"
              onClick={openChainModal}
              label="Wrong network"
            />
          );
        }

        return (
          <Button
            accentColor="white"
            onClick={openAccountModal}
            label={shortenAddress(account.address)}
          />
        );
      }}
    </RKConnectButton.Custom>
  );
}
