import type { ReactNode } from "react";

import { a } from "@react-spring/web";
import Image from "next/image";
import { useInView } from "react-cool-inview";
import { Button } from "../components/Button";
import { COLORS, GH_REPO_URL, SIDEB_URL } from "../constants";
import {
  useCurrentOrDefaultChainId,
  usePinkyPromiseContractAddress,
} from "../lib/contract-utils";
import {
  useBreakpoint,
  useChainedProgress,
  useExplorerBaseUrl,
} from "../lib/react-utils";
import { lerp } from "../lib/utils";

import sideb from "../assets/side-b.png";

export function Footer() {
  const chainId = useCurrentOrDefaultChainId();
  const address = usePinkyPromiseContractAddress(chainId);
  const explorerUrl = useExplorerBaseUrl(chainId);

  const contractExplorerUrl = address && explorerUrl
    && `${explorerUrl}/address/${address}`;

  const breakpoint = useBreakpoint();
  const small = breakpoint === "small";

  const { observe, inView } = useInView({
    threshold: 0.8,
    unobserveOnEnter: true,
  });

  const springs = useChainedProgress([
    [0, "sideb"],
    [0.5, "rightBtn"],
    [1, "leftBtn"],
  ], {
    enabled: inView,
    duration: 100,
    props: {
      config: { mass: 2, friction: 70, tension: 1200 },
    },
  });

  return breakpoint && (
    <footer
      ref={observe}
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: COLORS.blue,
      }}
    >
      <div
        css={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: small ? 12 : 48,
          justifyContent: "center",
          alignItems: "center",
          height: small ? "auto" : 200,
          padding: small ? "40px 0" : 0,
        }}
      >
        <Appear spring={springs.sideb} small={small}>
          <SideB label="Contract" url={SIDEB_URL} small={small} />
        </Appear>
        <div
          css={{
            position: small ? "static" : "absolute",
            inset: "0 auto 0 0",
            paddingTop: small ? 40 - 12 : 0,
          }}
        >
          <div
            css={{
              position: small ? "static" : "absolute",
              inset: "0 48px 0 auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Appear spring={springs.leftBtn} small={small}>
              <LinkButton
                label="Source"
                url={GH_REPO_URL}
                small={small}
              />
            </Appear>
          </div>
        </div>
        <div
          css={{
            position: small ? "static" : "absolute",
            inset: "0 0 0 auto",
          }}
        >
          <div
            css={{
              position: small ? "static" : "absolute",
              inset: "0 auto 0 48px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Appear spring={springs.rightBtn} small={small}>
              <LinkButton
                label="Contract"
                url={contractExplorerUrl}
                small={small}
              />
            </Appear>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Appear({
  children,
  small,
  spring,
}: {
  children: ReactNode;
  small?: boolean;
  spring: ReturnType<typeof useChainedProgress>[string];
}) {
  return (
    <a.div
      style={{
        opacity: spring.progress,
        transform: spring.progress.to((v: number) =>
          small
            ? `scale3d(${lerp(v, 0.5, 1)}, ${lerp(v, 0.5, 1)}, 1)`
            : `translate3d(0, ${(1 - v) * 200}px, 0)`
        ),
      }}
    >
      {children}
    </a.div>
  );
}

function LinkButton({
  label,
  small,
  url,
}: {
  label: string;
  small?: boolean;
  url?: string;
}) {
  return (
    <Button
      color={COLORS.pink}
      href={url}
      label={label}
      size={small ? "regular" : "large"}
      disabled={!url}
    />
  );
}

function SideB({
  label,
  url,
  small,
}: {
  label: string;
  url?: string;
  small?: boolean;
}) {
  return (
    <a
      draggable="false"
      href={url}
      rel="nofollow"
      target="_blank"
      css={{
        userSelect: "none",
        borderRadius: 8,
        "&:focus-visible": {
          outline: `2px solid ${COLORS.pink}`,
          outlineOffset: "3px",
        },
        img: {
          display: "block",
        },
      }}
    >
      <Image
        draggable="false"
        alt={label}
        width={small ? 64 : 80}
        height={small ? 64 : 80}
        src={sideb.src}
      />
    </a>
  );
}
