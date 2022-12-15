import { Global } from "@emotion/react";

export function GlobalStyles({ children }: { children: ReactNode }) {
  return (
    <>
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
          },
          "body": {
            font: "18px/1.5 monospace",
            color: "#333",
            background: "#DDD",
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
      {children}
    </>
  );
}
