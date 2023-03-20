import type { AbiParameterToPrimitiveType, ExtractAbiFunction } from "abitype";

import { usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { PinkyPromiseAbi } from "./abis";

export type EnsName = `${string}.eth`;
export type Address = `0x${string}`;

export const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;
export function isAddress(address: string): address is Address {
  return ADDRESS_RE.test(address);
}

export type NetworkPrefix =
  | "A" // Arbitrum
  | "B" // Base
  | "E" // Ethereum
  | "G" // Goerli
  | "L" // Local
  | "O" // Optimism
  | "P"; // Polygon

export type NetworkName =
  | "arbitrum"
  | "base"
  | "mainnet"
  | "goerli"
  | "local"
  | "optimism"
  | "polygon";

export type Networks = {
  [k in NetworkName]?: { contract: Address };
};

export function isNetworkPrefix(prefix: string): prefix is NetworkPrefix {
  return ["A", "B", "E", "G", "L", "O", "P"].indexOf(prefix) !== -1;
}

export function isNetworkName(value: string): value is NetworkName {
  return value === "mainnet"
    || value === "polygon"
    || value === "goerli"
    || value === "local";
}

export type AppChain = {
  prefix: NetworkPrefix;
  name: string;
  chainId: number;
};

export type PromiseId = `${number}`;
export type FullPromiseId = `${NetworkPrefix}-${PromiseId}`; // network prefix + promise identifier

function createIsEnumKeyFn<EnumKey extends number>(max: number) {
  return (value: number): value is EnumKey => (
    value >= 0 && value <= max
  );
}

export type ColorEnumKey = 0 | 1 | 2 | 3;
export const isColorEnumKey = createIsEnumKeyFn<ColorEnumKey>(3);
export type ColorId = "pink" | "blue" | "red" | "black";

export type PromiseStateEnumKey = 0 | 1 | 2 | 3 | 4;
export const isPromiseStateEnumKey = createIsEnumKeyFn<PromiseStateEnumKey>(4);
export type PromiseState = "Draft" | "Signed" | "Nullified" | "Discarded" | "None";

export type SigningStateEnumKey = 0 | 1 | 2 | 3;
export const isSigningStateEnumKey = createIsEnumKeyFn<SigningStateEnumKey>(3);
export type SigningState = "Pending" | "Signed" | "NullRequest" | "None";

export type Log = NonNullable<
  ReturnType<typeof useWaitForTransaction>["data"]
>["logs"][number];

// From abitype https://github.com/wagmi-dev/abitype/blob/ec392957b0a784d1e513f321dc8c856f073931e8/src/examples/types.ts#L96
export type PromiseInfoReturnType = {
  [
    Output in ExtractAbiFunction<
      typeof PinkyPromiseAbi,
      "promiseInfo"
    >["outputs"][number] as Output extends {
      name: infer Name extends string;
    } ? Name extends "" ? never
      : Name
      : never
  ]: AbiParameterToPrimitiveType<Output>;
};

export type TxBag = {
  config: NonNullable<Parameters<typeof usePrepareContractWrite>[0]>;
  onCancel: () => void;
  successAction: (
    data: NonNullable<ReturnType<typeof useWaitForTransaction>["data"]>,
  ) => string | (() => void);
  successLabel: string;
  title: string;
};
