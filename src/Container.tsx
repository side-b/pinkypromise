import type { ReactNode } from "react";

import { COLORS } from "./constants";

export function Container({
  children,
  color = COLORS.grey,
  contentColor = "inherit",
}: {
  children: ReactNode;
  color?: string;
  contentColor?: string;
}) {
  return (
    <div
      css={{
        paddingBottom: "80px",
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "80px 80px 24px",
          color: contentColor,
          background: color,
          borderRadius: "64px",
          boxShadow: "0 80px 120px rgba(43, 8, 28, 0.20)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
