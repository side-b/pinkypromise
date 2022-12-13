import type { ComponentPropsWithoutRef } from "react";

import { Button } from "./Button";
import { COLORS } from "./constants";

type SingleButtonProps = Partial<ComponentPropsWithoutRef<typeof Button>>;

export function SplitButton({
  first,
  second,
}: {
  first: SingleButtonProps;
  second: SingleButtonProps;
}) {
  return (
    <div css={{ display: "flex", height: 40 }}>
      <Button
        color={COLORS.white}
        label={first.label}
        omitBorder="right"
        {...first}
        css={{
          position: "relative",
          zIndex: 1,
          borderLeft: `2px solid ${first.color ?? COLORS.white}`,
          "&:active + button": {
            background: COLORS.pink,
          },
        }}
      />
      <Button
        color={COLORS.white}
        label={second.label}
        omitBorder="left"
        {...second}
        css={{
          position: "relative",
          zIndex: 1,
          marginLeft: -2,
          borderLeft: `2px solid ${second.color ?? COLORS.white}`,
        }}
      />
    </div>
  );
}
