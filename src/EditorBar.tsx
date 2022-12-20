import type { ColorId } from "./types";

import { useMemo } from "react";
import { a, to, useResize, useScroll, useSpring } from "react-spring";
import { match } from "ts-pattern";
import { COLORS, PROMISE_COLORS_BY_ID } from "./constants";
import { IconEye } from "./IconEye";

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

  const { scrollY } = useScroll();
  const windowResize = useResize({});

  return (
    <div css={{ paddingLeft: "64px" }}>
      <a.div
        style={{
          top: to(
            [scrollY, windowResize.height],
            (scroll, height) => {
              const height_ = height || window.innerHeight;
              const buttonsHeight = 304;
              const requiredHeight = buttonsHeight + 360 + 20;
              const base = height_ < requiredHeight ? 360 - (requiredHeight - height_) : 360;
              return (scroll > base - 40 ? 40 : base - scroll);
            },
          ),
        }}
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
            gap: "18px",
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
                <button
                  key={id}
                  onClick={() => onPreviewToggle()}
                  css={{
                    width: "40px",
                    height: "40px",
                    background: "transparent",
                    border: "0",
                    borderRadius: "50%",
                    cursor: "pointer",
                    "&:active": {
                      transform: "translate(1px, 1px)",
                    },
                  }}
                >
                  <IconEye opened={preview} />
                </button>
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
  const springStyle = useSpring({
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
    <a.button
      type="button"
      title={title}
      onClick={onClick}
      css={{
        position: "relative",
        background: color,
        width: "40px",
        height: "40px",
        border: "0",
        borderRadius: "50%",
        cursor: "pointer",
        "&:active": {
          transform: "translate(1px, 1px)",
        },
      }}
    >
      <a.div
        style={springStyle}
        css={{
          position: "absolute",
          inset: "0",
          outline: selected ? `6px solid ${COLORS.grey}` : "0",
          outlineOffset: "-8px",
          borderRadius: "50%",
        }}
      />
    </a.button>
  );
}
