import { COLORS } from "../constants";
import { DiscButton } from "./DiscButton";
import { IconMinus } from "./IconMinus";
import { IconPlus } from "./IconPlus";

export function PlusMinusButton({
  className,
  color = COLORS.pink,
  mode,
  onClick,
  title,
}: {
  className?: string;
  color?: string;
  mode: "plus" | "minus";
  onClick?: () => void;
  title: string;
}) {
  return (
    <DiscButton
      className={className}
      color={color}
      icon={mode === "plus"
        ? <IconPlus color={COLORS.white} />
        : <IconMinus color={COLORS.white} />}
      onClick={onClick}
      title={title}
    />
  );
}
