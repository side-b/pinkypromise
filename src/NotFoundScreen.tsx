import { Button } from "./Button";
import { COLORS } from "./constants";
import { LoadingFingers } from "./LoadingFingers";

export function NotFoundScreen() {
  return (
    <div
      css={{
        position: "absolute",
        zIndex: 2,
        inset: "0",
        display: "grid",
        placeItems: "center",
        color: COLORS.white,
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <LoadingFingers
          color={COLORS.red}
          label="URL not found"
        />
        <Button
          label="Back"
          color={COLORS.red}
          href="/"
          size="large"
        />
      </div>
    </div>
  );
}