import type { Networks } from "../types";

import { isAddress, isNetworkName } from "../types";

export const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY ?? "";
export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "";

export const NETWORK_DEFAULT = (
  process.env.NEXT_PUBLIC_NETWORK_DEFAULT ?? "local"
).trim();

export const NETWORKS = parseNetworks(
  (process.env.NEXT_PUBLIC_NETWORKS ?? "").trim(),
);

function parseNetworks(value: string): Networks {
  return value.split(",").reduce<Networks>((networks, pair) => {
    const [network, contract] = pair.split(":");
    return isNetworkName(network) && isAddress(contract)
      ? ({ ...networks, [network]: { contract } })
      : networks;
  }, {});
}
