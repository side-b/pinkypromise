import { BigNumber } from "ethers";
import { useContractReads } from "wagmi";
import { Link } from "wouter";
import { PinkySwearPactsAbi } from "./abis";
import { CONTRACT_ADDRESS } from "./environment";

export function Pact({ pactId }: { pactId: string }) {
  const reads = useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESS,
        abi: PinkySwearPactsAbi,
        functionName: "pactAsSvg",
        args: [BigNumber.from(pactId)],
      },
    ],
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
      }}
    >
      <h1 css={{ padding: "40px 0", fontSize: "40px" }}>Pact #{pactId}</h1>
      <img
        alt=""
        src={`data:image/svg+xml,${encodeURIComponent(reads.data?.[0] ?? "")}`}
      />

      <Link href="/">home</Link>
    </div>
  );
}
