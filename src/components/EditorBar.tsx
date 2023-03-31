import type { ReactNode } from "react";
import type { ColorId } from "../types";

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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { match } from "ts-pattern";
import { COLORS, PROMISE_COLORS_BY_ID } from "../constants";
import { useFocusVisible } from "./FocusVisible";
import { IconEye } from "./IconEye";

export function EditorBar({
  color,
  onColor,
  onPreviewToggle,
  inline = false,
  preview,
}: {
  color: ColorId;
  onColor: (id: ColorId) => void;
  onPreviewToggle: () => void;
  inline?: boolean;
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
    from: {
      opacity: 0,
      transform: "scale3d(1, 0, 1)",
    },
    to: {
      opacity: 1,
      transform: "scale3d(1, 1, 1)",
    },
    immediate: inline,
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });

  const {
    springs: buttonsAppear,
    ref: buttonsAppearRef,
  } = useButtonsAppear(buttons, ([id]) => id, inline);

  useChain([buttonsAppearRef, barAppearRef], inline ? [0, 0] : [0, 0.1], 800);

  const barTop = useBarTop();

  return (
    <div
      css={{
        width: inline ? "auto" : 128,
        paddingLeft: inline ? 0 : 64,
      }}
    >
      <a.div
        style={{ top: barTop, ...barAppear }}
        css={{
          position: inline ? "static" : "fixed",
          left: 64,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: inline ? "row" : "column",
            alignItems: "center",
            justifyContent: inline ? "space-between" : "center",
            width: inline ? "100%" : 64,
            height: inline ? 64 : 312,
            padding: inline ? "0 8px" : "16px 0",
            background: inline ? COLORS.white : COLORS.grey,
            borderRadius: 64,
          }}
        >
          {buttonsAppear((style, _item, _state, index) => {
            const [id, background, label] = buttons[index];
            return (
              <a.div style={style} key={id}>
                {id === "preview"
                  ? (
                    <PreviewButton
                      inline={inline}
                      onClick={() => onPreviewToggle()}
                      preview={preview}
                      title={preview ? "Edit" : "Preview"}
                    />
                  )
                  : (
                    <ColorButton
                      color={background}
                      inline={inline}
                      onClick={() => onColor(id)}
                      selected={id === color}
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
  inline,
  onClick,
  selected,
  title,
}: {
  color: string;
  inline: boolean;
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
        title={inline ? title : undefined}
        onClick={onClick}
        {...buttonProps}
        css={{
          position: "relative",
          display: "grid",
          placeItems: "center",
          width: inline ? 56 : 64,
          height: 56,
          padding: 0,
          border: 0,
          background: "none",
          cursor: "pointer",
          "&:active > div": {
            transform: "translate(1px, 1px)",
          },
          "&:focus-visible": {
            outline: 0,
          },
          "&:focus-visible > div": {
            outline: `2px solid ${COLORS.pink}`,
            outlineOffset: 4,
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
            height={40}
            viewBox="0 0 40 40"
            width={40}
            css={{
              position: "absolute",
              inset: 0,
            }}
          >
            <circle
              cx={20}
              cy={20}
              fill={color}
              r={20}
            />
            <a.circle
              cx={20}
              cy={20}
              r={17}
              stroke={COLORS.grey}
              strokeWidth={4}
              style={selectedSpring}
              css={{ transformOrigin: "50% 50%" }}
            />
          </svg>
        </div>
      </button>
      {!inline && tooltip}
    </div>
  );
}

function PreviewButton({
  onClick,
  inline,
  preview,
  title,
}: {
  onClick: () => void;
  inline: boolean;
  preview: boolean;
  title: string;
}) {
  const { tooltip, buttonProps } = useLabelTooltip(COLORS.pink, title);
  return (
    <div css={{ position: "relative" }}>
      <button
        onClick={onClick}
        aria-label={title}
        title={inline ? title : undefined}
        {...buttonProps}
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: inline ? 56 : 64,
          height: 56,
          padding: 0,
          background: "transparent",
          border: 0,
          borderRadius: "50%",
          cursor: "pointer",
          "&:active > div": {
            transform: "translate(1px, 1px)",
          },
          "&:focus-visible": {
            outline: 0,
          },
          "&:focus-visible > div": {
            outline: `2px solid ${COLORS.pink}`,
            outlineOffset: 4,
          },
        }}
      >
        <div
          css={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        >
          <IconEye opened={preview} />
        </div>
      </button>
      {!inline && tooltip}
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
        fillRule="evenodd"
        d="M12 9.46a19.897 19.897 0 0 0-2.186 4.874L0 20l9.814 5.666A19.896 19.896 0 0 0 12 30.541V9.459Z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M12 9.46a19.897 19.897 0 0 0-2.186 4.874L0 20l9.814 5.666A19.896 19.896 0 0 0 12 30.541v-4.608a17.73 17.73 0 0 1-.268-.833l-.226-.766L4 20l7.506-4.334.226-.766c.083-.28.172-.558.268-.833V9.46Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function useBarTop() {
  const getBarTop = useCallback(
    (scrollY: number, winHeight: number) => {
      return Math.max(
        winHeight / 2 - 304 / 2, // desired top
        120 - Math.min(scrollY, 120) + 16, // prevent overlaping the header + 16px
      );
    },
    [],
  );

  const config = { mass: 1, friction: 80, tension: 1600 };
  const topSpring = useSpringValue(0, { config });

  const scrollY = useRef(0);
  const winHeight = useRef(0);

  useEffect(() => {
    scrollY.current = window.scrollY;
    winHeight.current = window.innerHeight;
    topSpring.start(
      getBarTop(scrollY.current, winHeight.current),
    );
  }, [getBarTop, topSpring]);

  useScroll({
    config,
    onChange({ value }) {
      scrollY.current = value.scrollY;
      topSpring.start(
        getBarTop(value.scrollY, winHeight.current),
      );
    },
  });

  useResize({
    config,
    onChange({ value }) {
      winHeight.current = value.height;
      topSpring.start(
        getBarTop(scrollY.current, value.height),
      );
    },
  });

  return topSpring;
}

function useButtonsAppear<T>(
  items: T[],
  key: (v: T) => string,
  immediate: boolean = false,
) {
  const ref = useSpringRef();
  const springs = useTransition(items, {
    ref,
    key,
    delay: immediate ? 0 : 200,
    from: { opacity: 0, transform: `scale3d(0.5, 0.5, 1)` },
    enter: { opacity: 1, transform: `scale3d(1, 1, 1)` },
    immediate,
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
    trail: immediate ? 0 : 50,
  });
  return { springs, ref };
}
