import { useWaitForTransaction } from "wagmi";

export type Address = `0x${string}`;
export type EnsName = `${string}.eth`;

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
