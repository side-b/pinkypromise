import type { Attributes, ComponentPropsWithoutRef, ReactNode } from "react";

import Link from "next/link";
import { useMemo } from "react";
import { match } from "ts-pattern";
import { COLORS } from "../constants";

export function Button({
  className,
  color,
  disabled,
  focusColor,
  gap,
  href,
  icon,
  iconAfter,
  label,
  labelColor,
  mode = "secondary",
  omitBorder,
  onClick,
  size = "regular",
  title,
  type,
}: {
  className?: string;
  color?: string;
  disabled?: boolean;
  focusColor?: string;
  gap?: number;
  href?: string;
  icon?: ReactNode;
  iconAfter?: boolean;
  label: ReactNode;
  labelColor?: string;
  mode?: "secondary" | "primary";
  omitBorder?: "left" | "right";
  onClick?: () => void;
  size?: "regular" | "large" | "giant";
  title?: string;
  type?: ComponentPropsWithoutRef<"button">["type"];
}) {
  gap ??= icon ? 12 : 0;

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

  const css: Attributes["css"] = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap,
    height: match(size)
      .with("regular", () => "40px")
      .with("large", () => "64px")
      .with("giant", () => "136px")
      .exhaustive(),
    padding: size === "giant" ? "0 48px" : "0 24px",
    textTransform: "lowercase" as const,
    textDecoration: "none" as const,
    fontWeight: 500,
    fontSize: match(size)
      .with("regular", () => 18)
      .with("large", () => 40)
      .with("giant", () => 88)
      .exhaustive(),
    whiteSpace: "nowrap" as const,
    borderWidth: match(size)
      .with("giant", () => 10)
      .with("large", () => 5)
      .otherwise(() => 2),
    borderRadius: size === "giant" ? "136px" : "40px",
    borderStyle: "solid",
    cursor: "pointer",
    userSelect: "none",
    "&:focus-visible": {
      outline: `2px solid ${focusColor ?? color ?? COLORS.pink}`,
      outlineOffset: "3px",
    },
    "&:active:not(:disabled,.disabled)": {
      transform: "translate3d(1px, 1px, 0)",
    },
    "&:disabled, &.disabled": {
      opacity: 0.3,
    },
    "> div": {
      transform: match(size)
        .with("large", () => "translateY(-3px)")
        .with("giant", () => "translateY(-6px)")
        .otherwise(() => "translateY(0)"),
    },
    ...modeStyles,
  };

  if (omitBorder === "left") {
    css.borderLeft = 0;
    css.borderTopLeftRadius = 0;
    css.borderBottomLeftRadius = 0;
  }

  if (omitBorder === "right") {
    css.borderRight = 0;
    css.borderTopRightRadius = 0;
    css.borderBottomRightRadius = 0;
  }

  icon = icon && (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        marginRight: iconAfter ? -8 : 0,
        marginLeft: iconAfter ? 0 : -8,
        transform: `translateX(${iconAfter ? 16 : -16}px) scale(0.8)`,
      }}
    >
      {icon}
    </div>
  );

  const external = href && !href.startsWith("/");

  const button = href && !disabled
    ? (
      <Link href={href} passHref legacyBehavior>
        <a
          className={className}
          draggable="false"
          onClick={onClick}
          rel={external ? "nofollow" : undefined}
          target={external ? "_blank" : undefined}
          title={title}
          css={css}
        >
          {!iconAfter && icon}
          <div>
            {label}
          </div>
          {iconAfter && icon}
        </a>
      </Link>
    )
    : (
      <button
        className={className}
        disabled={disabled}
        onClick={onClick}
        title={title}
        type={type ?? "button"}
        css={css}
      >
        {!iconAfter && icon}
        <div>
          {label}
        </div>
        {iconAfter && icon}
      </button>
    );

  return button;
}
