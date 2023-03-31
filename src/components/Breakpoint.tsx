import type { ReactNode } from "react";

import { createContext, useContext, useEffect, useState } from "react";

export const BREAKPOINTS = {
  small: 0,
  medium: 1140,
};

export type BreakpointName = keyof typeof BREAKPOINTS;

const BreakPointContext = createContext<{ breakpointName: BreakpointName }>({
  breakpointName: "medium",
});

export function isBreakpointName(bp: string): bp is BreakpointName {
  return Object.keys(BREAKPOINTS).includes(bp);
}

export function useBreakpoint(): BreakpointName {
  const { breakpointName } = useContext(BreakPointContext);
  console.log("useBreakpoint", breakpointName);
  return breakpointName;
}

function getBreakpointName(): BreakpointName {
  if (typeof window === "undefined") return "small";
  if (window.innerWidth >= BREAKPOINTS.medium) return "medium";
  return "small";
}

export function Breakpoint({ children }: { children: ReactNode }) {
  const [breakpointName, setBreakpointName] = useState<BreakpointName>(
    "medium",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      const bp = getBreakpointName();
      if (bp !== breakpointName) {
        console.log("SET", bp);
        setBreakpointName(bp);
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpointName]);

  return (
    <BreakPointContext.Provider value={{ breakpointName }}>
      {children}
    </BreakPointContext.Provider>
  );
}
