import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { COLORS } from "./constants";

export function ButtonLink({
  color = COLORS.pink,
  external = false,
  label,
  size = "regular",
  ...props
}: ComponentPropsWithoutRef<"a"> & {
  color?: string;
  label: ReactNode;
  size?: "regular" | "big";
  external?: boolean;
}) {
  return (
    <a
      rel={external ? "nofollow" : props.rel}
      target={external ? "_blank" : props.target}
      {...props}
      css={{
        display: "flex",
        alignItems: "center",
        height: size === "big" ? "136px" : "40px",
        padding: size === "big" ? "0 48px" : "0 32px",
        fontSize: size === "big" ? "88px" : "18px",
        fontWeight: "500",
        textTransform: "lowercase",
        textDecoration: "none",
        color,
        border: `${size === "big" ? 10 : 2}px solid ${color}`,
        borderRadius: size === "big" ? "136px" : "40px",
        "&:active": {
          transform: "translate(1px, 1px)",
        },
        "&:focus-visible": {
          outline: `2px solid ${COLORS.white}`,
          outlineOffset: "3px",
        },
      }}
    >
      {label}
    </a>
  );
}
