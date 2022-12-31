import type { ComponentPropsWithoutRef } from "react";

import { useMemo } from "react";
import { match } from "ts-pattern";
import { Link } from "wouter";
import { COLORS } from "./constants";

export function Button({
  className,
  color,
  disabled,
  external,
  href,
  label,
  labelColor,
  mode = "secondary",
  onClick,
  size = "regular",
  type,
}: {
  className?: string;
  color?: string;
  disabled?: boolean;
  external?: boolean;
  label: string;
  labelColor?: string;
  mode?: "secondary" | "primary";
  onClick?: () => void;
  href?: string;
  size?: "regular" | "large" | "giant";
  type?: ComponentPropsWithoutRef<"button">["type"];
}) {
  const modeStyles = useMemo(() => {
    if (mode === "primary") {
      return {
        color: labelColor ?? COLORS.white,
        background: color ?? COLORS.pink,
        borderColor: color ?? COLORS.pink,
      };
    }
    // secondary
    return {
      color: labelColor ?? color ?? COLORS.pink,
      background: "transparent",
      borderColor: color ?? COLORS.pink,
    };
  }, [mode, labelColor, color]);

  const css = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: match(size)
      .with("regular", () => "40px")
      .with("large", () => "64px")
      .with("giant", () => "136px")
      .exhaustive(),
    padding: size === "giant" ? "0 48px" : "0 24px",
    textTransform: "lowercase" as const,
    textDecoration: "none" as const,
    fontSize: match(size)
      .with("regular", () => "18px")
      .with("large", () => "26px")
      .with("giant", () => "88px")
      .exhaustive(),
    whiteSpace: "nowrap" as const,
    borderWidth: size === "giant" ? "10px" : "2px",
    borderRadius: size === "giant" ? "136px" : "40px",
    borderStyle: "solid",
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
  };

  const button = href
    ? (
      <a
        className={className}
        css={css}
        href={href}
        onClick={onClick}
        rel={external ? "nofollow" : undefined}
        target={external ? "_blank" : undefined}
      >
        {label}
      </a>
    )
    : (
      <button
        className={className}
        disabled={disabled}
        onClick={onClick}
        type={type ?? "button"}
        css={css}
      >
        {label}
      </button>
    );

  return href && href.startsWith("/") ? <Link href={href}>{button}</Link> : button;
}
