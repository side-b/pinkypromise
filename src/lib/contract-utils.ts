import type {
  Address,
  ColorEnumKey,
  ColorId,
  Log,
  PromiseState,
  PromiseStateEnumKey,
  SigningState,
  SigningStateEnumKey,
} from "../types";

import { utils as ethersUtils } from "ethers";
import { match } from "ts-pattern";
import { useNetwork } from "wagmi";
import { isNetworkName } from "../types";
import { PinkyPromiseAbi } from "./abis";
import { NETWORK_DEFAULT, NETWORKS } from "./environment";
import { useReady } from "./react-utils";
import { appChainFromId, appChainFromName } from "./utils";

export function promiseIdFromTxLogs(logs: Log[]): string | null {
  const PinkyPromiseInterface = new ethersUtils.Interface(PinkyPromiseAbi);
  const draftUpdateEvent = logs
    .map((log: Log) => {
      try {
        return PinkyPromiseInterface.parseLog(log);
      } catch (err) {
        return null;
      }
    })
    .find((event) => event?.name === "PromiseUpdate" && event.args.state === 1);

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

export function useCurrentChainId() {
  const ready = useReady();
  const { chain } = useNetwork();
  return ready ? chain?.id : undefined;
}

export function useCurrentOrDefaultChainId() {
  const chainId = useCurrentChainId() ?? -1;
  return isChainIdSupported(chainId)
    ? chainId
    : appChainFromName(NETWORK_DEFAULT)?.chainId ?? -1;
}

export function isChainIdSupported(id: number) {
  return Object.keys(NETWORKS).some((name) => (
    appChainFromName(name)?.chainId === id
  ));
}

export function usePinkyPromiseContractAddress(
  chainId?: number,
): Address | undefined {
  const ready = useReady();
  const network = useNetwork();

  if (ready) {
    chainId ??= network.chain?.id;
  }

  const chain = appChainFromId(chainId ?? -1);

  if (!chain) {
    return undefined;
  }

  return (
    isNetworkName(chain.name)
      ? NETWORKS[chain.name]?.contract
      : Object.values(NETWORKS)[0]?.contract
  ) ?? undefined;
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
