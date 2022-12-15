import { Link } from "wouter";

export function Home() {
  return (
    <div
      css={{
        position: "fixed",
        zIndex: "-1",
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
        <Link href="/new">COOL COOL</Link>
      </div>
    </div>
  );
}
