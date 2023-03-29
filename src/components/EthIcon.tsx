import type { Address } from "../types";

import blockie from "ethereum-blockies-base64";
import Image from "next/image";
import { useMemo } from "react";

type EthIconProps = {
  address: Address;
  round?: boolean;
  size?: number;
};

export function EthIcon({
  address,
  round = false,
  size = 32,
}: EthIconProps) {
  const uri = useMemo(() => blockie(address), [address]);

  return (
    <div
      css={{
        flexShrink: 0,
        flexGrow: 0,
        overflow: "hidden",
        display: "flex",
        width: size,
        height: size,
        borderRadius: round ? "50%" : "0",
        "image": {
          display: "block",
          width: size,
          height: size,
          imageRendering: "crisp-edges",
        },
      }}
    >
      <Image
        src={uri}
        width={size}
        height={size}
        alt=""
      />
    </div>
  );
}
