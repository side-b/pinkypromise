import { useInView } from "react-cool-inview";
import { a } from "react-spring";
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
      css={{ background: COLORS.blue }}
    >
      <div
        css={{
          display: "flex",
          gap: 48,
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        {[
          [LinkButton, ["Source", GH_REPO_URL], springs.leftBtn] as const,
          [SideB, ["side-b", SIDEB_URL], springs.sideb] as const,
          [LinkButton, ["Contract", contractExplorerUrl], springs.rightBtn] as const,
        ].map(([Component, [label, url], { progress }]) => (
          <a.div
            key={label + url}
            style={{
              transform: progress.to((v: number) =>
                `translate3d(0, ${(1 - v) * 200}px, 0)`
              ),
            }}
          >
            <Component label={label} url={url} />
          </a.div>
        ))}
      </div>
    </footer>
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
