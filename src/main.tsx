import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { injectedWallet, metaMaskWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import React from "react";
import ReactDOM from "react-dom/client";
import { match } from "ts-pattern";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { hardhat, mainnet, polygon, sepolia } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { App } from "./App";
import { INFURA_KEY, NETWORKS } from "./environment";

import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider, webSocketProvider } = configureChains(
  NETWORKS.map((name: string) =>
    match(name)
      .with("mainnet", () => mainnet)
      .with("polygon", () => polygon)
      .with("sepolia", () => sepolia)
      .with("local", () => hardhat)
      .otherwise(() => "")
  ).filter(Boolean),
  [
    infuraProvider({ priority: 1, apiKey: INFURA_KEY }),
    publicProvider({ priority: 2 }),
    jsonRpcProvider({
      rpc: (chain) => (
        chain.id === hardhat.id
          ? ({ http: "http://localhost:8545" })
          : null
      ),
    }),
  ],
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      walletConnectWallet({ chains }),
      metaMaskWallet({ chains, shimDisconnect: true }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
