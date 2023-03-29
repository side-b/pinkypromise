import { COLORS } from "../constants";

export function IconWallet({
  color = COLORS.white,
}: {
  color?: string;
}) {
  return (
    <svg width={24} height={24} fill="none">
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.5 6.6v11.2a1.4 1.4 0 0 0 1.4 1.4h14a.7.7 0 0 0 .7-.7V8.7a.7.7 0 0 0-.7-.7h-14a1.4 1.4 0 0 1-1.4-1.4Zm0 0a1.4 1.4 0 0 1 1.4-1.4h11.9"
      />
      <path
        fill={color}
        d="M16.75 14.65a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1Z"
      />
    </svg>
  );
}
