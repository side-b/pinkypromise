import type { ReactNode } from "react";

import { COLORS } from "../constants";

export function DiscButton({
  className,
  color = COLORS.pink,
  icon,
  onClick,
  title,
}: {
  className?: string;
  color?: string;
  icon: ReactNode;
  onClick?: () => void;
  title: string;
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
        width: 40,
        height: 40,
        color: COLORS.white,
        background: color,
        border: 0,
        borderRadius: "50%",
        cursor: "pointer",
        "&:focus-visible": {
          outline: `2px solid ${color}`,
          outlineOffset: 3,
        },
        "&:active": {
          transform: "translate(1px, 1px)",
        },
      }}
    >
      {icon}
    </button>
  );
}