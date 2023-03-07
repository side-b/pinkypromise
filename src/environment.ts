import type { Networks } from "./types";

import { isAddress, isNetworkName } from "./types";

export const INFURA_KEY = import.meta.env.VITE_INFURA_KEY ?? "";
export const REACT_STRICT =
  (import.meta.env.VITE_REACT_STRICT ?? "true").trim() !== "false";

export const NETWORK_DEFAULT = (
  import.meta.env.VITE_NETWORK_DEFAULT ?? "local"
).trim();

export const NETWORKS = parseNetworks(
  (import.meta.env.VITE_NETWORKS ?? "").trim(),
);

function parseNetworks(value: string): Networks {
  return value.split(",").reduce<Networks>((networks, pair) => {
    const [network, contract] = pair.split(":");
    return isNetworkName(network) && isAddress(contract)
      ? ({ ...networks, [network]: { contract } })
      : networks;
  }, {});
}
