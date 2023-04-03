import type { ReactNode } from "react";

import { COLORS } from "../constants";

export function ActionBox({
  button,
  compact = false,
  info,
  infoColor = COLORS.pink,
}: {
  button: ReactNode;
  compact?: boolean;
  info: ReactNode;
  infoColor: string;
}) {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: compact ? "column" : "row",
        alignItems: compact ? "stretch" : "center",
        gap: compact ? 16 : 24,
        padding: compact ? 24 : "32px 40px",
        background: COLORS.white,
        borderRadius: compact ? 32 : 64,
      }}
    >
      <div css={{ color: infoColor }}>{info}</div>
      <div>{button}</div>
    </div>
  );
}
