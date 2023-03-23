import { COLORS } from "../constants";
import { Button } from "./Button";
import { IconEye } from "./IconEye";

export function ViewButton({
  active,
  disabled,
  label,
  onToggle,
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onToggle: (active: boolean) => void;
}) {
  return (
    <Button
      key={label}
      color={COLORS.white}
      disabled={disabled}
      labelColor={active ? COLORS.pink : COLORS.white}
      icon={
        <IconEye
          opened={active}
          color={active ? COLORS.pink : COLORS.white}
        />
      }
      label={label}
      mode={active ? "primary" : "secondary"}
      onClick={() => onToggle(!active)}
    />
  );
}
