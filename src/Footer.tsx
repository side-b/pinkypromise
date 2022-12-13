import { Button } from "./Button";
import { COLORS, FOOTER_LINKS } from "./constants";

export function Footer() {
  return (
    <footer
      css={{
        display: "flex",
        gap: "24px",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {FOOTER_LINKS.map(([label, href]) => (
        <Button
          key={label + href}
          color={COLORS.white}
          external={true}
          href={href}
          label={label}
        />
      ))}
    </footer>
  );
}
