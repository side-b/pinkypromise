import { a } from "@react-spring/web";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { COLORS } from "../constants";
import { useAccount } from "../lib/eth-utils";
import { useBreakpoint, useChainedProgress } from "../lib/react-utils";
import { Button } from "./Button";
import { ConnectButton } from "./ConnectButton";
import { useBackground } from "./GlobalStyles";
import { HeaderPopupMenu } from "./HeaderPopupMenu";
import { SplitButton } from "./SplitButton";

export function Header() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { color } = useBackground();

  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const small = useBreakpoint() === "small";

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

  const isPromises = router.pathname.startsWith("/promises");
  const isMine = router.pathname.startsWith("/mine");

  return (
    <div
      css={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: small ? 80 : 120,
        padding: small ? "0 24px" : "0 60px",
        userSelect: "none",
      }}
    >
      {(!small || (small && router.pathname !== "/")) && (
        <div
          css={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <a.div
            style={{
              opacity: springs.logo.progress,
              transform: springs.logo.progress.to((v: number) => (
                `translate3d(0, ${(1 - v) * -120}px, 0)`
              )),
            }}
            css={{ display: "flex" }}
          >
            <Link href="/" passHref legacyBehavior>
              <a
                css={{
                  display: "flex",
                  textTransform: "lowercase",
                  color: COLORS.white,
                  textDecoration: "none",
                  borderRadius: 8,
                  "&:focus-visible": {
                    outline: `2px solid ${COLORS.white}`,
                    outlineOffset: 8,
                  },
                  "&:active": {
                    transform: "translate(1px, 1px)",
                  },
                }}
              >
                <h1
                  css={{
                    fontSize: small ? 24 : 32,
                    whiteSpace: "nowrap",
                  }}
                >
                  Pinky Promise
                </h1>
              </a>
            </Link>
          </a.div>
          {!small && (
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
          )}
        </div>
      )}
      {small
        ? (
          <div
            css={{
              position: "absolute",
              inset: "20px 24px auto auto",
              display: "flex",
              gap: 12,
            }}
          >
            <ConnectButton
              mode="disc"
              onClick={() => {}}
            />
            <HeaderPopupMenu />
          </div>
        )
        : (
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
                  disabled: ready ? !isConnected : false,
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
        )}
    </div>
  );
}
