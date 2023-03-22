import blockie from "ethereum-blockies-base64";
import Image from "next/image";
import { useMemo } from "react";
import { isAddress } from "../lib/utils";

type EthIconProps = {
  address: string;
  round?: boolean;
  size?: number;
};

export function EthIcon({
  address,
  round = false,
  size = 32,
}: EthIconProps) {
  if (!isAddress(address)) {
    throw new Error(`Incorrect address: ${address}`);
  }

  const uri = useMemo(() => blockie(address), [address]);

  return (
    <div
      css={{
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
        alt=""
      />
    </div>
  );
}
