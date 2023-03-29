import { COLORS } from "../constants";

export function IconPlus({
  color = COLORS.white,
}: {
  color?: string;
}) {
  return (
    <svg
      fill="none"
      height={40}
      viewBox="0 0 40 40"
      width={40}
    >
      <path
        d="M9 20h22M20 31V9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
