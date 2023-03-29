import { COLORS } from "../constants";

export function IconMinus({
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
        d="M9 20 h22"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
