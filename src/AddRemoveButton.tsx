import type { ColorId } from "./types";

import { COLORS } from "./constants";

export function AddRemoveButton({
  color,
  mode,
  onClick,
}: {
  color?: ColorId;
  mode: "add" | "remove";
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
        background: COLORS[color ?? "pink"],
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
        {mode === "add"
          ? (
            <path
              d="M9 20h22M20 31V9"
              stroke={COLORS.white}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          )
          : (
            <path
              d="M9 20 h22"
              stroke={COLORS.white}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          )}
      </svg>
    </button>
  );
}
