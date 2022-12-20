import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { COLORS } from "./constants";
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
          return <button onClick={openConnectModal}>Connect</button>;
        }

        if (chain.unsupported) {
          return <button onClick={openChainModal}>Wrong network</button>;
        }

        return (
          <button
            onClick={openAccountModal}
            type="button"
            css={{
              height: "40px",
              padding: "0 32px",
              color: COLORS.white,
              background: "transparent",
              border: `2px solid ${COLORS.white}`,
              borderRadius: "20px",
              cursor: "pointer",
              "&:active": {
                transform: "translate(1px, 1px)",
              },
            }}
          >
            {shortenAddress(account.address)}
          </button>
        );
      }}
    </RKConnectButton.Custom>
  );
}
