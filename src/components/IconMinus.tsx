import { COLORS } from "../constants";

export function IconMinus({
  color = COLORS.white,
  size = 40,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 40 40"
      width={size}
    >
      <path
        d="M9 20 h22"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
