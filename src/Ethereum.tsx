import type { ReactNode } from "react";
import type { NetworkName } from "./types";

import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { match } from "ts-pattern";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, hardhat, mainnet, polygon } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { INFURA_KEY, NETWORKS } from "./environment";
import { isNetworkName } from "./types";

import "@rainbow-me/rainbowkit/styles.css";

const { chains, provider, webSocketProvider } = configureChains(
  Object.keys(NETWORKS)
    .filter(isNetworkName)
    .map((name: NetworkName) => (
      match(name)
        .with("mainnet", () => mainnet)
        .with("polygon", () => polygon)
        .with("goerli", () => goerli)
        .with("local", () => hardhat)
        .exhaustive()
    )),
  [
    infuraProvider({ priority: 1, apiKey: INFURA_KEY }),
    publicProvider({ priority: 2 }),
    jsonRpcProvider({
      rpc: (chain) => (
        chain.id === hardhat.id
          ? ({ http: `http://${document.location.hostname}:8545` })
          : null
      ),
    }),
  ],
);

const connectors = connectorsForWallets([{
  groupName: "Wallets",
  wallets: [
    injectedWallet({ chains }),
    metaMaskWallet({ chains }),
    walletConnectWallet({ chains }),
  ],
}]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export function Ethereum({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
