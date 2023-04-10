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
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { ALCHEMY_KEY, INFURA_KEY, NETWORKS } from "../lib/environment";
import { isNetworkName } from "../types";

import "@rainbow-me/rainbowkit/styles.css";

const hostname = typeof document === "undefined"
  ? "localhost"
  : document.location.hostname;

const NETWORKS_KEYS = Object.keys(NETWORKS).filter(isNetworkName);

const { chains, provider, webSocketProvider } = configureChains(
  [
    // mainnet is always defined for ENS queries
    mainnet,
    ...NETWORKS_KEYS
      .filter((name) => name !== "mainnet")
      .map((name: NetworkName) => (
        match(name)
          .with("arbitrum", () => arbitrum)
          .with("optimism", () => optimism)
          .with("polygon", () => polygon)
          .with("goerli", () => goerli)
          .with("local", () => hardhat)
          .otherwise(() => {
            throw new Error(`Unsupported network: ${name}`);
          })
      )),
  ],
  [
    alchemyProvider({ priority: 1, apiKey: ALCHEMY_KEY }),
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

const rainbowChains = NETWORKS_KEYS.includes("mainnet")
  ? chains
  : chains.filter((chain) => chain.id !== 1);

export function Ethereum({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={rainbowChains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
