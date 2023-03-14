import type { ReactNode } from "react";

import { useInView } from "react-cool-inview";
import { a } from "@react-spring/web";
import { Button } from "./Button";
import { COLORS, GH_REPO_URL, SIDEB_URL } from "./constants";
import {
  useCurrentOrDefaultChainId,
  usePinkyPromiseContractAddress,
} from "./contract-utils";
import { useChainedProgress, useExplorerBaseUrl } from "./react-utils";

import sideb from "./side-b.png";

export function Footer() {
  const chainId = useCurrentOrDefaultChainId();
  const address = usePinkyPromiseContractAddress(chainId);
  const explorerUrl = useExplorerBaseUrl(chainId);

  const contractExplorerUrl = address && explorerUrl
    && `${explorerUrl}/address/${address}`;

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

  return (
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
          gap: 48,
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <div css={{ position: "absolute", inset: "0 auto 0 0" }}>
          <div
            css={{
              position: "absolute",
              inset: "0 48px 0 auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Appear spring={springs.leftBtn}>
              <LinkButton label="Source" url={GH_REPO_URL} />
            </Appear>
          </div>
        </div>
        <Appear spring={springs.sideb}>
          <SideB label="Contract" url={SIDEB_URL} />
        </Appear>
        <div css={{ position: "absolute", inset: "0 0 0 auto" }}>
          <div
            css={{
              position: "absolute",
              inset: "0 auto 0 48px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Appear spring={springs.rightBtn}>
              <LinkButton label="Contract" url={contractExplorerUrl} />
            </Appear>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Appear({
  children,
  spring,
}: {
  children: ReactNode;
  spring: ReturnType<typeof useChainedProgress>[string];
}) {
  return (
    <a.div
      style={{
        transform: spring.progress.to((v: number) =>
          `translate3d(0, ${(1 - v) * 200}px, 0)`
        ),
      }}
    >
      {children}
    </a.div>
  );
}

function LinkButton({
  label,
  url,
}: {
  label: string;
  url?: string;
}) {
  return (
    <Button
      color={COLORS.pink}
      external={true}
      href={url}
      label={label}
      size="large"
      disabled={!url}
    />
  );
}

function SideB({
  label,
  url,
}: {
  label: string;
  url?: string;
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
      }}
    >
      <img
        draggable="false"
        alt={label}
        width={80}
        height={80}
        src={sideb}
        css={{ display: "block" }}
      />
    </a>
  );
}
