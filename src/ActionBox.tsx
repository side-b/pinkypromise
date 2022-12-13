import type { ReactNode } from "react";

import { COLORS } from "./constants";

export function ActionBox({
  button,
  info,
  infoColor = COLORS.pink,
}: {
  button: ReactNode;
  info: ReactNode;
  infoColor: string;
}) {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "32px 40px",
        background: COLORS.white,
        borderRadius: "64px",
      }}
    >
      <div css={{ color: infoColor }}>{info}</div>
      <div>{button}</div>
    </div>
  );
}
