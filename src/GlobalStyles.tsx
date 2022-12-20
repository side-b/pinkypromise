import type { ReactNode } from "react";
import type { ColorId } from "./types";

import { Global } from "@emotion/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { a, useTransition } from "react-spring";
import { COLORS } from "./constants";

const DEFAULT_COLOR = "pink";

const BackgroundContext = createContext<{ set: (color: ColorId) => void; reset: () => void; color: ColorId }>({
  set: () => {},
  reset: () => {},
  color: DEFAULT_COLOR,
});

export function GlobalStyles({ children }: { children: ReactNode }) {
  const [colorId, setColorId] = useState<ColorId>(DEFAULT_COLOR);

  const contextValue = useMemo(() => ({
    set(color: ColorId) {
      setColorId(color);
    },
    reset() {
      setColorId("pink");
    },
    color: colorId,
  }), [colorId]);

  const transition = useTransition(colorId, {
    from: { transform: "scale(0.5)", borderRadius: "100vw", opacity: 0 },
    enter: { transform: "scale(1)", borderRadius: "0vw", opacity: 1 },
    leave: { transform: "scale(1)", borderRadius: "0vw", opacity: 1 },
    config: { mass: 1, friction: 120, tension: 1800 },
  });

  return (
    <BackgroundContext.Provider value={contextValue}>
      <Global
        styles={{
          ":root": {
            colorScheme: "light",
          },
          "*, *:before, *:after": {
            boxSizing: "border-box",
          },
          "body, html, h1, h2, pre, p, ul": {
            margin: "0",
          },
          "html": {
            scrollBehavior: "smooth",
            overflowX: "hidden",
          },
          "body": {
            font: "500 18px/1.5 monospace",
            fontFamily: "\"Space Grotesk\", sans-serif",
            background: COLORS.pink,
          },
          "body, a, input, button": {
            color: COLORS.black,
          },
          "h1, h2, pre, button, svg, input, textarea": {
            font: "inherit",
          },
          "a, button": {
            // removes the 300ms delay
            touchAction: "manipulation",
          },
        }}
      />
      {transition((style, colorId) => (
        <a.div
          style={style}
          css={{
            position: "fixed",
            zIndex: 1,
            inset: "0",
            background: COLORS[colorId],
          }}
        />
      ))}
      <div css={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  useEffect(() => {
    return () => {
      context.reset();
    };
  }, []);
  return context;
}
