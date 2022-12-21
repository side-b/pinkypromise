import { useMemo } from "react";
import { COLORS } from "./constants";

export function Button({
  disabled,
  label,
  mode = "secondary",
  onClick,
  size = "regular",
}: {
  disabled?: boolean;
  label: string;
  mode?: "secondary" | "primary";
  onClick?: () => void;
  size: "regular" | "large";
}) {
  const modeStyles = useMemo(() => {
    if (mode === "primary") {
      return {
        color: COLORS.white,
        background: COLORS.pink,
        borderColor: COLORS.pink,
      };
    }
    // secondary
    return {
      color: COLORS.pink,
      background: "transparent",
      borderColor: COLORS.pink,
    };
  }, [mode]);

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "64px",
        padding: "0 24px",
        textTransform: "lowercase",
        fontSize: size === "large" ? "26px" : "18px",
        whiteSpace: "nowrap",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "32px",
        cursor: "pointer",
        "&:focus-visible": {
          outline: `2px solid ${COLORS.pink}`,
          outlineOffset: "3px",
        },
        "&:active:not(:disabled)": {
          transform: "translate3d(1px, 1px, 0)",
        },
        "&:disabled": {
          opacity: 0.5,
        },
        ...modeStyles,
      }}
    >
      {label}
    </button>
  );
}
