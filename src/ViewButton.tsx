import { Button } from "./Button";
import { COLORS } from "./constants";
import { IconEye } from "./IconEye";

export function ViewButton({
  active,
  label,
  onToggle,
}: {
  active: boolean;
  label: string;
  onToggle: (active: boolean) => void;
}) {
  return (
    <Button
      key={label}
      color={COLORS.white}
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
