import type { ColorEnumKey, ColorId, Log } from "./types";

import { utils as ethersUtils } from "ethers";
import { match } from "ts-pattern";
import { Address, useContractRead, useContractReads, useNetwork } from "wagmi";
import { PinkyPromiseAbi } from "./abis";
import { NETWORKS } from "./environment";
import { isNetworkName } from "./types";

export function promiseIdFromTxLogs(logs: Log[]): string | null {
  const PinkyPromiseInterface = new ethersUtils.Interface(PinkyPromiseAbi);
  const draftUpdateEvent = logs
    .map((log: Log) => PinkyPromiseInterface.parseLog(log))
    .find(event => event.name === "PromiseUpdate" && event.args.state === 1);

  return draftUpdateEvent?.args.promiseId?.toString() ?? null;
}

export function colorEnumKey(color: ColorId): ColorEnumKey {
  return match<ColorId, ColorEnumKey>(color)
    .with("pink", () => 0)
    .with("blue", () => 1)
    .with("red", () => 2)
    .with("black", () => 3)
    .exhaustive();
}

export function usePinkyPromiseContractAddress() {
  const { chain } = useNetwork();
  let network = chain?.network;
  if (network === "hardhat") network = "local";
  return typeof network === "string" && isNetworkName(network)
    ? NETWORKS[network]?.contract
    : undefined;
}
