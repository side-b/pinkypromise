import type { ComponentPropsWithoutRef } from "react";

import { COLORS } from "../constants";
import { DiscButton } from "./DiscButton";
import { IconMinus } from "./IconMinus";
import { IconPlus } from "./IconPlus";

export function PlusMinusButton({
  className,
  color = COLORS.pink,
  mode,
  onClick,
  size = 40,
  title,
}: {
  className?: string;
  color?: string;
  mode: "plus" | "minus";
  onClick?: ComponentPropsWithoutRef<typeof DiscButton>["onClick"];
  size?: number;
  title: string;
}) {
  return (
    <DiscButton
      className={className}
      color={color}
      icon={mode === "plus"
        ? <IconPlus color={COLORS.white} size={size} />
        : <IconMinus color={COLORS.white} size={size} />}
      onClick={onClick}
      size={size}
      title={title}
    />
  );
}
