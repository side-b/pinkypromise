import type { ReactNode } from "react";
import type { ColorId } from "./types";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  a,
  useChain,
  useResize,
  useScroll,
  useSpring,
  useSpringRef,
  useSpringValue,
  useTransition,
} from "@react-spring/web";
import { match } from "ts-pattern";
import { COLORS, PROMISE_COLORS_BY_ID } from "./constants";
import { useFocusVisible } from "./FocusVisible";
import { IconEye } from "./IconEye";

function usePositionSpring() {
  const config = { mass: 1, friction: 80, tension: 1600 };
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

function useButtonsAppear<T>(items: T[], key: (v: T) => string) {
  const ref = useSpringRef();
  const springs = useTransition(items, {
    ref,
    key,
    delay: 200,
    from: { opacity: 0, transform: `scale3d(0.5, 0.5, 1)` },
    enter: { opacity: 1, transform: `scale3d(1, 1, 1)` },
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
    trail: 50,
  });
  return { springs, ref };
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
        .with("pink", () => "Pinky")
        .with("blue", () => "Electric")
        .with("red", () => "Red alert")
        .with("black", () => "Solemn")
        .exhaustive(),
    ]),
    ["preview", "Preview"],
  ], []);

  const barAppearRef = useSpringRef();
  const barAppear = useSpring({
    ref: barAppearRef,
    from: { opacity: 0, transform: `scale3d(1, 0, 1)` },
    to: { opacity: 1, transform: `scale3d(1, 1, 1)` },
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });

  const {
    springs: buttonsAppear,
    ref: buttonsAppearRef,
  } = useButtonsAppear(buttons, ([id]) => id);

  useChain([buttonsAppearRef, barAppearRef], [0, 0.1], 800);

  const topSpring = usePositionSpring();

  return (
    <div css={{ paddingLeft: "64px" }}>
      <a.div
        style={{ top: topSpring, ...barAppear }}
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
          {buttonsAppear((style, _item, _state, index) => {
            const [id, background, label] = buttons[index];
            return (
              <a.div style={style} key={id}>
                {id === "preview"
                  ? (
                    <PreviewButton
                      onClick={() => onPreviewToggle()}
                      preview={preview}
                      title={preview ? "Edit" : "Preview"}
                    />
                  )
                  : (
                    <ColorButton
                      color={background}
                      selected={id === color}
                      onClick={() => {
                        onColor(id);
                      }}
                      title={label}
                    />
                  )}
              </a.div>
            );
          })}
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
      transform: `scale3d(${selected ? 0.9 : 0.5}, ${selected ? 0.9 : 0.5}, 1)`,
    },
    config: {
      mass: 1,
      friction: 100,
      tension: 2000,
    },
  });

  const { tooltip, buttonProps } = useLabelTooltip(color, title);

  return (
    <div css={{ position: "relative" }}>
      <button
        type="button"
        aria-label={title}
        onClick={onClick}
        {...buttonProps}
        css={{
          position: "relative",
          display: "grid",
          placeItems: "center",
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
            outlineOffset: "4px",
          },
        }}
      >
        <div
          css={{
            position: "relative",
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        >
          <svg
            fill="none"
            height="40"
            viewBox="0 0 40 40"
            width="40"
            css={{
              position: "absolute",
              inset: 0,
            }}
          >
            <circle
              cx="20"
              cy="20"
              fill={color}
              r="20"
            />
            <a.circle
              cx="20"
              cy="20"
              r="17"
              stroke={COLORS.grey}
              strokeWidth="4"
              style={selectedSpring}
              css={{ transformOrigin: "50% 50%" }}
            />
          </svg>
        </div>
      </button>
      {tooltip}
    </div>
  );
}

function PreviewButton({
  onClick,
  preview,
  title,
}: {
  onClick: () => void;
  preview: boolean;
  title: string;
}) {
  const { tooltip, buttonProps } = useLabelTooltip(COLORS.pink, title);
  return (
    <div css={{ position: "relative" }}>
      <button
        onClick={onClick}
        aria-label={title}
        {...buttonProps}
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
            outlineOffset: "4px",
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
      {tooltip}
    </div>
  );
}

function useLabelTooltip(color: string, title: string) {
  const focusVisible = useFocusVisible();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!focusVisible) {
      setShow(false);
    }
  }, [focusVisible]);
  return {
    buttonProps: {
      onMouseOver() {
        setShow(true);
      },
      onMouseOut() {
        setShow(false);
      },
      onFocus() {
        if (focusVisible) {
          setShow(true);
        }
      },
      onBlur() {
        if (focusVisible) {
          setShow(false);
        }
      },
    },
    tooltip: (
      <LabelTooltip
        color={color}
        label={title}
        visible={show}
      />
    ),
  };
}

function LabelTooltip({
  color,
  label,
  visible,
}: {
  color: string;
  label: ReactNode;
  visible: boolean;
}) {
  const transition = useTransition({ visible, label }, {
    keys: ({ visible, label }) => `${visible}${label}`,
    from: { opacity: 0, transform: "scale3d(0.3, 0.7, 1)" },
    enter: { opacity: 1, transform: "scale3d(1, 1, 1)" },
    config: {
      mass: 1,
      friction: 80,
      tension: 2000,
    },
  });
  return transition((styles, { visible }) => (
    visible && (
      <a.div
        style={styles}
        css={{
          position: "absolute",
          inset: "0 auto 0 100%",
          display: "flex",
          alignItems: "center",
          transformOrigin: "0 50%",
        }}
      >
        <div
          css={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            height: 40,
            padding: "0 24px",
            whiteSpace: "nowrap",
            textTransform: "lowercase",
            fontWeight: 500,
            color: "#FFF",
            background: color,
            border: "2px solid #FFF",
            borderRadius: 150,
            transform: "translateX(16px)",
          }}
        >
          <div css={{ position: "absolute", inset: "-2px 0 0 -10.5px", height: 40 }}>
            <Arrow color={color} />
          </div>
          {label}
        </div>
      </a.div>
    )
  ));
}

function Arrow({ color }: { color: string }) {
  return (
    <svg
      width="20"
      height="40"
      fill="none"
      css={{
        display: "block",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <path
        fill={color}
        fill-rule="evenodd"
        d="M12 9.46a19.897 19.897 0 0 0-2.186 4.874L0 20l9.814 5.666A19.896 19.896 0 0 0 12 30.541V9.459Z"
        clip-rule="evenodd"
      />
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M12 9.46a19.897 19.897 0 0 0-2.186 4.874L0 20l9.814 5.666A19.896 19.896 0 0 0 12 30.541v-4.608a17.73 17.73 0 0 1-.268-.833l-.226-.766L4 20l7.506-4.334.226-.766c.083-.28.172-.558.268-.833V9.46Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
