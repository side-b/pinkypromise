import { useAccount } from "wagmi";
import { Link } from "wouter";
import { ConnectButton } from "./ConnectButton";

export function Header() {
  const account = useAccount();
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "20px 20px 0 0",
        gap: "20px",
      }}
    >
      {account.address && <Link href={`/pacts/${account.address}`}>ur pacts</Link>}
      <ConnectButton />
    </div>
  );
}
