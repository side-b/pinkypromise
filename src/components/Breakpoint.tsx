import type { ReactNode } from "react";

import { createContext, useContext, useEffect, useState } from "react";

export const BREAKPOINTS = {
  small: 0,
  medium: 1140,
};

export type BreakpointName = keyof typeof BREAKPOINTS | null;

const BreakPointContext = createContext<{
  breakpointName: BreakpointName;
}>({
  breakpointName: null,
});

export function useBreakpoint(): BreakpointName | null {
  const { breakpointName } = useContext(BreakPointContext);
  return breakpointName;
}

function getBreakpointName(): BreakpointName {
  if (typeof window === "undefined") return null;
  if (window.innerWidth >= BREAKPOINTS.medium) return "medium";
  return "small";
}

export function Breakpoint({ children }: { children: ReactNode }) {
  const [breakpointName, setBreakpointName] = useState<BreakpointName>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      const bp = getBreakpointName();
      if (bp !== breakpointName) {
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
