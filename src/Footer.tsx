import { ButtonLink } from "./ButtonLink";
import { COLORS } from "./constants";

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
      <ButtonLink
        label="Contact"
        href="https://github.com/bpierre/pinkyswearpacts"
        color={COLORS.white}
      />
      <ButtonLink
        label="side-b"
        href="https://github.com/bpierre/pinkyswearpacts"
        color={COLORS.white}
      />
      <ButtonLink
        color={COLORS.white}
        external={true}
        href="https://github.com/bpierre/pinkyswearpacts"
        label="GitHub"
      />
    </footer>
  );
}
