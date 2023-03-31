import type { SpringValues } from "@react-spring/web";
import type { ReactNode } from "react";

import { a } from "@react-spring/web";

export function Appear({ appear, children }: {
  appear: SpringValues<{ opacity: number; transform: string }>;
  children: ReactNode;
}) {
  return (
    <div
      css={{
        position: "absolute",
        zIndex: 1,
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <a.div style={appear} css={{ width: "100%" }}>
        {children}
      </a.div>
    </div>
  );
}
