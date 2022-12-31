import { BigNumber } from "ethers";
import { useContractReads } from "wagmi";
import { Link } from "wouter";
import { PinkyPromiseAbi } from "./abis";
import { CONTRACT_ADDRESS } from "./environment";

export function PromiseScreen({ id }: { id: string }) {
  const reads = useContractReads({
    contracts: [{
      address: CONTRACT_ADDRESS,
      abi: PinkyPromiseAbi,
      functionName: "promiseAsSvg",
      args: [BigNumber.from(id)],
    }],
  });

  if (reads.status === "loading") {
    return <div>loading…</div>;
  }

  if (reads.status === "error") {
    return <div>error</div>;
  }

  return (
    <div
      css={{
        display: "grid",
        width: "100%",
        placeItems: "center",
        padding: "40px 0 80px",
      }}
    >
      <h1 css={{ paddingBottom: "40px", fontSize: "40px" }}>Promise #{id}</h1>
      <img
        alt=""
        src={`data:image/svg+xml,${encodeURIComponent(reads.data?.[0] ?? "")}`}
      />
    </div>
  );
}