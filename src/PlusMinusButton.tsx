import { COLORS } from "./constants";

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
  title?: string;
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      title={title}
      type="button"
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        color: COLORS.white,
        background: color,
        border: "0",
        borderRadius: "50%",
        cursor: "pointer",
        "&:focus-visible": {
          outline: `2px solid ${color}`,
          outlineOffset: "3px",
        },
        "&:active": {
          transform: "translate(1px, 1px)",
        },
      }}
    >
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
        {mode === "plus"
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
