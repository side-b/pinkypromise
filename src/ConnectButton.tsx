import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";

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

        if (!ready) { return null; }

        if (!connected) {
          return <button onClick={openConnectModal}>Connect</button>;
        }

        if (chain.unsupported) {
          return <button onClick={openChainModal}>Wrong network</button>;
        }

        return (
          <button onClick={openAccountModal} type="button">
            {account.displayName}
          </button>
        );
      }}
    </RKConnectButton.Custom>
  );
}
