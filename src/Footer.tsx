import { Button } from "./Button";
import { COLORS, FOOTER_LINKS } from "./constants";

import sideb from "./side-b.png";

export function Footer() {
  return (
    <footer
      css={{
        display: "flex",
        gap: 48,
        justifyContent: "center",
        alignItems: "center",
        height: 200,
        background: COLORS.blue,
      }}
    >
      {FOOTER_LINKS.map(([label, href]) => (
        label === "side-b"
          ? (
            <a
              key={label + href}
              draggable="false"
              href={href}
              rel="nofollow"
              target="_blank"
              css={{
                userSelect: "none",
                borderRadius: 8,
                "&:focus-visible": {
                  outline: `2px solid ${COLORS.pink}`,
                  outlineOffset: "3px",
                },
              }}
            >
              <img
                draggable="false"
                alt={label}
                width={80}
                height={80}
                src={sideb}
                css={{ display: "block" }}
              />
            </a>
          )
          : (
            <Button
              key={label + href}
              color={COLORS.pink}
              external={true}
              href={href}
              label={label}
              size="large"
            />
          )
      ))}
    </footer>
  );
}
