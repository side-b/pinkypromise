import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";
import { Link } from "wouter";
import { PinkySwearPactsAbi } from "./abis";
import { CONTRACT_ADDRESS } from "./environment";
import { ADDRESS_NULL, isAddress } from "./utils";

export function Pacts({ address }: { address: string }) {
  const address_ = isAddress(address) ? address : ADDRESS_NULL;
  const account = useAccount();

  const pacts = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: PinkySwearPactsAbi,
    functionName: "signeePacts",
    args: [address_],
    watch: true,
  });

  if (address_ === ADDRESS_NULL) {
    return <div>Invalid address</div>;
  }

  return (
    <div
      css={{
        display: "grid",
        width: "100%",
        placeItems: "center",
      }}
    >
      <div>
        <h1 css={{ padding: "40px 0 0", fontSize: "40px" }}>Pacts</h1>
        <p>for {address_} {address_ === account.address ? " (this u)" : ""}</p>
      </div>
      <div
        css={{
          paddingTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 400px)",
          gap: "20px",
        }}
      >
        {pacts.data?.map(pactId => (
          <PactCard
            key={pactId.toString()}
            pactId={pactId}
          />
        ))}
      </div>
    </div>
  );
}

function PactCard({ pactId }: { pactId: BigNumber }) {
  const pact = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: PinkySwearPactsAbi,
    functionName: "pactURI",
    args: [BigNumber.from(pactId)],
  });

  return (
    <Link href={`/pact/${pactId}`}>
      <div>Pact #{pactId.toString()}</div>
      <div>
        {pact.data && (
          <img
            src={pact.data}
            alt=""
            css={{
              width: "100%",
            }}
          />
        )}
      </div>
    </Link>
  );
}
