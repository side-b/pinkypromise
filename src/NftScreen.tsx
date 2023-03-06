import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import { PinkyPromiseAbi } from "./abis";
import { usePinkyPromiseContractAddress } from "./contract-utils";

export function NftScreen({ id }: { id: string }) {
  const contractAddress = usePinkyPromiseContractAddress();
  const tokenURI = useContractRead({
    address: contractAddress,
    abi: PinkyPromiseAbi,
    functionName: "tokenURI",
    args: [BigNumber.from(id)],
    enabled: Boolean(contractAddress),
  });

  const image = useQuery({
    enabled: Boolean(tokenURI.data),
    queryKey: ["fetch-metadata", id],
    queryFn: async () => {
      if (!tokenURI.data) return "";
      const metadataResponse = await fetch(tokenURI.data);
      const metadata = await metadataResponse.json();
      return metadata.image;
    },
  });

  return (
    <div>
      {image.data && <img src={image.data} />}
    </div>
  );
}
