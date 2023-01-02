import { Link, useLocation } from "wouter";
import { Button } from "./Button";
import { ConnectButton } from "./ConnectButton";
import { COLORS } from "./constants";

export function Header() {
  const [location] = useLocation();
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
            borderRadius: "48px",
            "&:focus-visible": {
              outline: `2px solid ${COLORS.white}`,
              outlineOffset: "16px",
            },
            "&:active": {
              transform: "translate(1px, 1px)",
            },
          }}
        >
          <h1
            css={{
              fontSize: "32px",
              whiteSpace: "nowrap",
            }}
          >
            Pinky Promise
          </h1>
        </a>
      </Link>
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "20px",
          gap: "20px",
        }}
      >
        <Button
          href="/promises"
          label="Promises"
          color={COLORS.white}
          labelColor={location.startsWith("/promises") ? COLORS.pink : undefined}
          mode={location.startsWith("/promises") ? "primary" : "secondary"}
        />
        <ConnectButton />
      </div>
    </div>
  );
}
