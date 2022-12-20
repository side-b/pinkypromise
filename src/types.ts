export type Address = `0x${string}`;

export type ColorId =
  | "black"
  | "blue"
  | "pink"
  | "red";

// from ethers https://github.com/ethers-io/ethers.js/blob/c80fcddf50a9023486e9f9acb1848aba4c19f7b6/packages/abstract-provider/lib.esm/index.d.ts#L54-L64
export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: Array<string>;
  transactionHash: string;
  logIndex: number;
}
