import type { ReactNode } from "react";
import type { NetworkName } from "../types";

import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { match } from "ts-pattern";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, goerli, hardhat, mainnet, optimism, polygon } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { INFURA_KEY, NETWORKS } from "../lib/environment";
import { isNetworkName } from "../types";

import "@rainbow-me/rainbowkit/styles.css";

const hostname = typeof document === "undefined"
  ? "localhost"
  : document.location.hostname;

const { chains, provider, webSocketProvider } = configureChains(
  Object.keys(NETWORKS)
    .filter(isNetworkName)
    .map((name: NetworkName) => (
      match(name)
        .with("arbitrum", () => arbitrum)
        .with("optimism", () => optimism)
        .with("mainnet", () => mainnet)
        .with("polygon", () => polygon)
        .with("goerli", () => goerli)
        .with("local", () => hardhat)
        .otherwise(() => {
          throw new Error(`Unsupported network: ${name}`);
        })
    )),
  [
    infuraProvider({ priority: 1, apiKey: INFURA_KEY }),
    publicProvider({ priority: 2 }),
    jsonRpcProvider({
      rpc: (chain) => (
        chain.id === hardhat.id
          ? ({ http: `http://${hostname}:8545` })
          : null
      ),
    }),
  ],
);

const connectors = connectorsForWallets([{
  groupName: "Wallets",
  wallets: [
    injectedWallet({ chains, shimDisconnect: true }),
    metaMaskWallet({ chains, shimDisconnect: true }),
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
