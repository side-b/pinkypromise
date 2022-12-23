import type { ColorId } from "./types";

import { COLORS } from "./constants";

export function RemoveButton({
  accentColor,
  onClick,
}: {
  accentColor?: ColorId;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title="Remove"
      type="button"
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        color: COLORS.white,
        background: COLORS[accentColor ?? "pink"],
        border: "0",
        borderRadius: "50%",
        cursor: "pointer",
        "&:focus-visible": {
          outline: `2px solid ${COLORS.pink}`,
          outlineOffset: "3px",
        },
        "&:active": {
          transform: "translate(1px, 1px)",
        },
      }}
    >
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
        <path
          stroke={COLORS.white}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 20 h22"
        />
      </svg>
    </button>
  );
}
