import type { CSSObject } from "@emotion/react";
import type { ReactNode } from "react";

import { a, useTransition } from "@react-spring/web";
import FocusTrap from "focus-trap-react";
import Link from "next/link";
import { useState } from "react";
import { COLORS } from "../constants";
import { useWindowDimensions } from "../lib/react-utils";
import { DiscButton } from "./DiscButton";
import { IconPlus } from "./IconPlus";
import { IconSquares } from "./IconSquares";

export function HeaderPopupMenu() {
  const [wideMode, setWideMode] = useState(false);
  const [opened, setOpened] = useState(false);

  useWindowDimensions(({ width }) => {
    setWideMode(width < 500);
  });

  const items = [
    ["Create new promise", <IconPlus color={COLORS.white} key="create" />, "/new"],
    ["All promises", <IconSquares color={COLORS.white} key="all" />, "/promises"],
    ["My promises", <IconSquares color={COLORS.white} key="mine" />, "/mine"],
  ] satisfies Array<[string, ReactNode, string | (() => void)]>;

  const transition = useTransition(opened, {
    from: { opacity: 0, transform: "scale3d(0, 0, 1)" },
    enter: { opacity: 1, transform: "scale3d(1, 1, 1)" },
    leave: { opacity: 0 },
    config: {
      mass: 1,
      friction: 140,
      tension: 4000,
    },
  });

  return (
    <div>
      <DiscButton
        title="Menu"
        onClick={() => setOpened(true)}
        color={COLORS.white}
        icon={<ThreeDots />}
      />
      <FocusTrap
        active={opened}
        focusTrapOptions={{
          clickOutsideDeactivates: true,
          onDeactivate() {
            setOpened(false);
          },
        }}
      >
        <div>
          {transition((styles, opened) => (
            opened && (
              <a.div
                style={styles}
                css={{
                  position: "fixed",
                  inset: wideMode ? "20px 24px auto" : "20px 24px auto auto",
                  background: COLORS.grey,
                  borderRadius: 40,
                  transformOrigin: "100% 0",
                  boxShadow: "0 80px 120px rgba(43, 8, 28, 0.20)",
                }}
              >
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: 16,
                  }}
                >
                  {items.map(([label, icon, action]) => (
                    <MenuItem
                      key={label + action}
                      action={action}
                      icon={icon}
                      label={label}
                      onClick={() => setOpened(false)}
                    />
                  ))}
                </div>
              </a.div>
            )
          ))}
        </div>
      </FocusTrap>
    </div>
  );
}

function MenuItem({
  action,
  icon,
  label,
  onClick,
}: {
  action: string | (() => void);
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  const sharedCss = {
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    height: 48,
    paddingLeft: 8,
    textDecoration: "none",
    border: 0,
    borderRadius: 32,
    background: COLORS.white,
    cursor: "pointer",
    "&:focus-visible": {
      outline: `2px solid ${COLORS.pink}`,
      outlineOffset: 3,
    },
    "&:active": {
      transform: "translate(1px, 1px)",
    },
    "& > div:nth-of-type(1)": {
      display: "grid",
      placeItems: "center",
      width: 40,
      height: 40,
      flexGrow: 0,
      flexShrink: 0,
      background: COLORS.pink,
      borderRadius: "50%",
    },
    "& > div:nth-of-type(2)": {
      overflow: "hidden",
      paddingRight: 16,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  } satisfies CSSObject;

  return typeof action === "string"
    ? (
      <Link
        href={action}
        legacyBehavior
        passHref
      >
        <a onClick={onClick} css={sharedCss}>
          <div>{icon}</div>
          <div>{label}</div>
        </a>
      </Link>
    )
    : (
      <button onClick={onClick} css={sharedCss}>
        <div>{icon}</div>
        <div>{label}</div>
      </button>
    );
}

function ThreeDots() {
  return (
    <svg
      fill="none"
      height={28}
      width={28}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke={COLORS.pink}
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M16.101 14.004a2.1 2.1 0 1 0-4.2 0 2.1 2.1 0 0 0 4.2 0ZM16.101 21a2.1 2.1 0 1 0-4.2 0 2.1 2.1 0 0 0 4.2 0ZM16.101 7.004a2.1 2.1 0 1 0-4.2 0 2.1 2.1 0 0 0 4.2 0Z"
      />
    </svg>
  );
}
