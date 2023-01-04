import { useWaitForTransaction } from "wagmi";

export type EnsName = `${string}.eth`;
export type Address = `0x${string}`;

export const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
export function isAddress(address: string): address is Address {
  return ADDRESS_RE.test(address);
}

export type NetworkName = "mainnet" | "polygon" | "sepolia" | "goerli" | "local";
export type Networks = {
  [k in NetworkName]?: { contract: Address };
};

export function isNetworkName(value: string): value is NetworkName {
  return value === "mainnet"
    || value === "polygon"
    || value === "sepolia"
    || value === "goerli"
    || value === "local";
}

export type ColorId =
  | "pink"
  | "blue"
  | "red"
  | "black";

export type ColorEnumKey = 0 | 1 | 2 | 3;

// from ethers https://github.com/ethers-io/ethers.js/blob/c80fcddf50a9023486e9f9acb1848aba4c19f7b6/packages/abstract-provider/lib.esm/index.d.ts#L54-L64
// export interface Log {
//   blockNumber: number;
//   blockHash: string;
//   transactionIndex: number;
//   removed: boolean;
//   address: string;
//   data: string;
//   topics: Array<string>;
//   transactionHash: string;
//   logIndex: number;
// }

export type Log = NonNullable<ReturnType<typeof useWaitForTransaction>["data"]>["logs"][number];
