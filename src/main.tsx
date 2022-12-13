import { ConnectKitProvider, getDefaultClient } from "connectkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { createClient, WagmiConfig } from "wagmi";
import { hardhat, mainnet, polygon } from "wagmi/chains";

import { App } from "./App";

const wagmiClient = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: "Pinky Swear Pacts",
    chains: [mainnet, polygon, hardhat],
  }),
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider>
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
