import { Button } from "./Button";
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
      <Button
        label="Contact"
        href="https://github.com/bpierre/pinkypromise"
        color={COLORS.white}
      />
      <Button
        label="side-b"
        href="https://github.com/bpierre/pinkypromise"
        color={COLORS.white}
      />
      <Button
        color={COLORS.white}
        external={true}
        href="https://github.com/bpierre/pinkypromise"
        label="GitHub"
      />
    </footer>
  );
}
