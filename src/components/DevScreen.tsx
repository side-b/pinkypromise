import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import Image from "next/image";
import { useContractRead } from "wagmi";
import { PinkyPromiseAbi } from "../lib/abis";
import { usePinkyPromiseContractAddress } from "../lib/contract-utils";
// import { SvgDoc } from "./SvgDoc";

const id = 1;
const chainId = 5;

export function DevScreen() {
  const contractAddress = usePinkyPromiseContractAddress(chainId);
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
      {image.data && (
        <Image
          alt=""
          width={800}
          src={image.data}
        />
      )}
      {
        /*<SvgDoc
        bodyHtml={"test"}
        classPrefix={"abc"}
        color={"tomato"}
        contentColor={"white"}
        height={800}
        htmlMode={false}
        padding={[40, 40, 32]}
        promiseId={"1"}
        restrict={false}
        signedOn="-"
        signees={[]}
        status="abc"
        title="Test"
      />*/
      }
    </div>
  );
}
