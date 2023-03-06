import type { ReactNode } from "react";

import { COLORS } from "./constants";
import { SvgDocFingers } from "./SvgDoc";

export function LoadingFingers({
  color = COLORS.blue,
  label = "Loading",
}: {
  color?: string;
  label?: ReactNode;
}) {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        "svg": {
          display: "block",
        },
        "svg path": {
          fill: color,
        },
      }}
    >
      <div
        css={{
          transformOrigin: "50% 50%",
          transform: "scale(1.25)",
        }}
      >
        <SvgDocFingers color={color} />
      </div>
      <div
        css={{
          paddingTop: 24,
          fontSize: 32,
          fontWeight: 500,
          textTransform: "lowercase",
          color,
        }}
      >
        {label}
      </div>
    </div>
  );
}
