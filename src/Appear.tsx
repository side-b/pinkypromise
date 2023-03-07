import type { ReactNode } from "react";
import type { SpringValues } from "react-spring";

import { a } from "react-spring";

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
      <a.div style={appear}>
        {children}
      </a.div>
    </div>
  );
}
