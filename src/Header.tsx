import { Link } from "wouter";
import { ConnectButton } from "./ConnectButton";
import { COLORS } from "./constants";

export function Header() {
  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "120px",
        padding: "0 60px",
      }}
    >
      <Link href="/">
        <a
          css={{
            display: "flex",
            textTransform: "lowercase",
            color: COLORS.white,
            textDecoration: "none",
            borderRadius: "8px",
            "&:focus-visible": {
              outline: `2px solid ${COLORS.white}`,
              outlineOffset: "8px",
            },
            "&:active": {
              transform: "translate(1px, 1px)",
            },
          }}
        >
          <h1 css={{ fontSize: "32px" }}>
            Pinky Promise
          </h1>
        </a>
      </Link>
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "20px 20px 0 0",
          gap: "20px",
        }}
      >
        <ConnectButton />
      </div>
    </div>
  );
}
