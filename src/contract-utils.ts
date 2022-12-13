import type {
  ColorEnumKey,
  ColorId,
  Log,
  PromiseState,
  PromiseStateEnumKey,
  SigningState,
  SigningStateEnumKey,
} from "./types";

import { utils as ethersUtils } from "ethers";
import { match } from "ts-pattern";
import { useNetwork } from "wagmi";
import { PinkyPromiseAbi } from "./abis";
import { NETWORKS } from "./environment";
import { isNetworkName } from "./types";

export function promiseIdFromTxLogs(logs: Log[]): string | null {
  const PinkyPromiseInterface = new ethersUtils.Interface(PinkyPromiseAbi);
  const draftUpdateEvent = logs
    .map((log: Log) => PinkyPromiseInterface.parseLog(log))
    .find((event) => event.name === "PromiseUpdate" && event.args.state === 1);

  return draftUpdateEvent?.args.promiseId?.toString() ?? null;
}

export function colorEnumKey(color: ColorId) {
  return match<ColorId, ColorEnumKey>(color)
    .with("pink", () => 0)
    .with("blue", () => 1)
    .with("red", () => 2)
    .with("black", () => 3)
    .exhaustive();
}

export function enumKeyToColor(key: ColorEnumKey) {
  return match<ColorEnumKey, ColorId>(key)
    .with(0, () => "pink")
    .with(1, () => "blue")
    .with(2, () => "red")
    .with(3, () => "black")
    .exhaustive();
}

export function isColorEnumKey(key: number): key is ColorEnumKey {
  return key === 0
    || key === 1
    || key === 2
    || key === 3;
}

export function usePinkyPromiseContractAddress() {
  const { chain } = useNetwork();
  let network = chain?.network;
  if (network === "hardhat") network = "local";
  return typeof network === "string" && isNetworkName(network)
    ? NETWORKS[network]?.contract
    // if the connected network is unknown,
    // we return the first one found in the env
    : Object.values(NETWORKS)[0]?.contract;
}

export function promiseStateFromEnumKey(state: PromiseStateEnumKey): PromiseState {
  if (state === 1) return "Draft";
  if (state === 2) return "Signed";
  if (state === 3) return "Nullified";
  if (state === 4) return "Discarded";
  return "None";
}

export function signingStateFromEnumKey(key: SigningStateEnumKey): SigningState {
  if (key === 1) return "Pending";
  if (key === 2) return "Signed";
  if (key === 3) return "NullRequest";
  return "None";
}
