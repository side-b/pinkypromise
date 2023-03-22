import type { ReactNode } from "react";

import { a, useSpring } from "@react-spring/web";
import { useInView } from "react-cool-inview";
import { COLORS } from "../constants";

export function Container({
  children,
  color = COLORS.grey,
  contentColor = "inherit",
  drawer,
  maxWidth = 832,
  padding = "80px 80px 24px",
}: {
  children: ReactNode;
  color?: string;
  contentColor?: string;
  drawer?: ReactNode;
  maxWidth?: number;
  padding?: number | string;
}) {
  return (
    <>
      <div
        css={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          placeItems: "center",
          paddingBottom: drawer ? 80 : 0,
        }}
      >
        <div
          css={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth,
            margin: "0 auto",
            padding,
            color: contentColor,
            background: color,
            borderRadius: 64,
            boxShadow: "0 80px 120px rgba(43, 8, 28, 0.20)",
          }}
        >
          {children}
        </div>
      </div>
      {drawer && (
        <div
          css={{
            display: "flex",
            justifyContent: "center",
            maxWidth,
          }}
        >
          <ContainerDrawer>{drawer}</ContainerDrawer>
        </div>
      )}
    </>
  );
}

function ContainerDrawer({ children }: { children: ReactNode }) {
  const { observe, inView } = useInView({
    threshold: 0.1,
    unobserveOnEnter: true,
  });
  const { appear } = useSpring({
    appear: Number(inView),
    config: {
      mass: 1,
      friction: 70,
      tension: 800,
    },
  });
  return (
    <div
      ref={observe}
      css={{
        position: "relative",
        zIndex: 2,
        marginTop: -80,
        width: "100%",
        maxWidth: 752,
      }}
    >
      <div
        css={{
          overflow: "hidden",
          width: "100%",
          paddingTop: 24,
        }}
      >
        <a.div
          style={{
            opacity: appear.to([0, 0.5, 1], [0, 0, 1]),
            transform: appear
              .to([0, 0.5, 1], [-24 - 100, -24 - 100, 0])
              .to((v: number) => `translateY(${v}px)`),
          }}
        >
          {children}
        </a.div>
      </div>
    </div>
  );
}
