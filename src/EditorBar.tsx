import type { SpringConfig } from "react-spring";
import type { ColorId } from "./types";

import { useCallback, useMemo, useRef } from "react";
import { a, useResize, useScroll, useSpring, useSpringValue } from "react-spring";
import { match } from "ts-pattern";
import { COLORS, PROMISE_COLORS_BY_ID } from "./constants";
import { IconEye } from "./IconEye";

function useBarTopSpring(config?: SpringConfig) {
  const scrollY = useRef(0);
  const winHeight = useRef(window.innerHeight);
  const topSpring = useSpringValue(360, { config });

  const getBarTop = useCallback(() => {
    return Math.max(
      120 - Math.min(scrollY.current, 120) + 16, // prevent overlaping the header + 16px
      360 // desired top
        - scrollY.current
        + Math.min( // prevent going lower than viewport
          0,
          winHeight.current - (
            360 // desired top
            + 304 // buttons height
            + 24 // extra spacing
          ),
        ),
    );
  }, []);

  useScroll({
    onChange({ value }) {
      scrollY.current = value.scrollY;
      topSpring.start(getBarTop());
    },
    config,
  });

  useResize({
    onChange({ value }) {
      winHeight.current = value.height;
      topSpring.start(getBarTop());
    },
    config,
  });

  return topSpring;
}

export function EditorBar({
  color,
  onColor,
  onPreviewToggle,
  preview,
}: {
  color: ColorId;
  onColor: (id: ColorId) => void;
  onPreviewToggle: () => void;
  preview: boolean;
}) {
  const buttons = useMemo<
    Array<
      | ["preview", string]
      | [ColorId, string, string]
    >
  >(() => [
    ...PROMISE_COLORS_BY_ID.map(([id, color]): [ColorId, string, string] => [
      id,
      color,
      match(id)
        .with("pink", () => "Set color to pink")
        .with("blue", () => "Set color to blue")
        .with("red", () => "Set color to red")
        .with("black", () => "Set color to black")
        .exhaustive(),
    ]),
    ["preview", "Preview promise"],
  ], []);

  const topSpring = useBarTopSpring({
    mass: 1,
    friction: 80,
    tension: 1600,
  });

  return (
    <div css={{ paddingLeft: "64px" }}>
      <a.div
        style={{ top: topSpring }}
        css={{
          position: "fixed",
          left: "64px",
          height: "304px",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "64px",
            padding: "16px 0",
            background: COLORS.grey,
            borderRadius: "64px",
          }}
        >
          {buttons.map(([id, background, label]) => (
            id === "preview"
              ? (
                <PreviewButton
                  key={id}
                  onClick={() => onPreviewToggle()}
                  preview={preview}
                />
              )
              : (
                <ColorButton
                  key={id}
                  color={background}
                  selected={id === color}
                  onClick={() => {
                    onColor(id);
                  }}
                  title={label}
                />
              )
          ))}
        </div>
      </a.div>
    </div>
  );
}

function ColorButton({
  color,
  onClick,
  selected,
  title,
}: {
  color: string;
  onClick: () => void;
  selected: boolean;
  title: string;
}) {
  const selectedSpring = useSpring({
    to: {
      opacity: Number(selected),
      transform: `scale(${selected ? 1 : 0.5})`,
    },
    config: {
      mass: 1,
      friction: 100,
      tension: 2000,
    },
  });

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      css={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "64px",
        height: "56px",
        padding: "0",
        border: "0",
        background: "none",
        cursor: "pointer",
        "&:active > div": {
          transform: "translate(1px, 1px)",
        },
        "&:focus-visible": {
          outline: "0",
        },
        "&:focus-visible > div": {
          outline: `2px solid ${COLORS.pink}`,
          outlineOffset: "3px",
        },
      }}
    >
      <div
        css={{
          position: "relative",
          width: "40px",
          height: "40px",
          background: color,
          borderRadius: "50%",
        }}
      >
        <a.div
          style={selectedSpring}
          css={{
            position: "absolute",
            inset: "0",
            outline: selected ? `6px solid ${COLORS.grey}` : "0",
            outlineOffset: "-8px",
            borderRadius: "50%",
          }}
        />
      </div>
    </button>
  );
}

function PreviewButton({
  onClick,
  preview,
}: {
  onClick: () => void;
  preview: boolean;
}) {
  return (
    <button
      onClick={onClick}
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "64px",
        height: "56px",
        padding: "0",
        background: "transparent",
        border: "0",
        borderRadius: "50%",
        cursor: "pointer",
        "&:active > div": {
          transform: "translate(1px, 1px)",
        },
        "&:focus-visible": {
          outline: "0",
        },
        "&:focus-visible > div": {
          outline: `2px solid ${COLORS.pink}`,
          outlineOffset: "3px",
        },
      }}
    >
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
        }}
      >
        <IconEye opened={preview} />
      </div>
    </button>
  );
}
