import { a } from "react-spring";
import { useAccount } from "wagmi";
import { Link, useLocation } from "wouter";
import { Button } from "./Button";
import { ConnectButton } from "./ConnectButton";
import { COLORS } from "./constants";
import { useBackground } from "./GlobalStyles";
import { useChainedProgress } from "./react-utils";
import { SplitButton } from "./SplitButton";

export function Header() {
  const [location] = useLocation();
  const { isConnected } = useAccount();
  const { color } = useBackground();

  const springs = useChainedProgress([
    [0.3, "logo"],
    [0.5, "account"],
    [0.7, "promises"],
    [1, "new"],
  ], {
    duration: 500,
    props: {
      config: { mass: 2, friction: 70, tension: 1200 },
    },
  });

  const isPromises = location.startsWith("/promises");
  const isMine = location.startsWith("/mine");

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
      <div
        css={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link href="/">
          <a.a
            style={{
              opacity: springs.logo.progress,
              transform: springs.logo.progress.to((v: number) => (
                `translate3d(0, ${(1 - v) * -120}px, 0)`
              )),
            }}
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
          </a.a>
        </Link>
        <a.div
          style={{
            opacity: springs.new.progress,
            transform: springs.new.progress.to((v: number) => (
              `translate3d(0, ${(1 - v) * -120}px, 0)`
            )),
          }}
        >
          <Button
            href="/new"
            label="new"
            color={COLORS.white}
            labelColor={COLORS[color]}
            mode="primary"
          />
        </a.div>
      </div>
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "20px",
          gap: "20px",
        }}
      >
        <a.div
          style={{
            opacity: springs.promises.progress,
            transform: springs.promises.progress.to((v: number) => (
              `translate3d(0, ${(1 - v) * -120}px, 0)`
            )),
          }}
        >
          <SplitButton
            first={{
              color: COLORS.white,
              href: "/promises",
              label: "All",
              labelColor: isPromises ? COLORS.pink : undefined,
              mode: isPromises ? "primary" : "secondary",
            }}
            second={{
              color: COLORS.white,
              disabled: !isConnected,
              href: "/mine",
              label: "Mine",
              labelColor: isMine ? COLORS.pink : undefined,
              mode: isMine ? "primary" : "secondary",
            }}
          />
        </a.div>
        <a.div
          style={{
            opacity: springs.account.progress,
            transform: springs.account.progress.to((v: number) => (
              `translate3d(0, ${(1 - v) * -120}px, 0)`
            )),
          }}
        >
          <ConnectButton />
        </a.div>
      </div>
    </div>
  );
}
