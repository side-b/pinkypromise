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
        color={COLORS.white}
        href="https://github.com/bpierre/pinkypromise"
        label="Contact"
      />
      <Button
        color={COLORS.white}
        href="https://github.com/bpierre/pinkypromise"
        label="side-b"
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
