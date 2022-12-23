import { useAccount } from "wagmi";
import { Link } from "wouter";

export function Home() {
  const account = useAccount();
  return (
    <div
      css={{
        position: "fixed",
        inset: "0",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        css={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <h1>Pinky Promise</h1>
        {account.address && <Link href={`/pacts/${account.address}`}>ur pacts</Link>}
        <Link href="/new">COOL COOL</Link>
      </div>
    </div>
  );
}
