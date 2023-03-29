import { COLORS } from "../constants";

export function IconSquares({
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
        d="M10.6 5.001H5v5.6h5.6v-5.6ZM19 5.001h-5.6v5.6H19v-5.6ZM10.6 13.4H5V19h5.6v-5.6ZM19 13.4h-5.6V19H19v-5.6Z"
      />
    </svg>
  );
}
