import type { ReactNode } from "react";

import { a, useSpring } from "@react-spring/web";
import { useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useInView } from "react-cool-inview";
import { COLORS, FAQ_ITEMS } from "../constants";
import { useBreakpoint } from "../lib/react-utils";
import { PlusMinusButton } from "./PlusMinusButton";

const QUESTION_HEIGHT = 64;

export function HomeFaq() {
  const [openedItem, setOpenedItem] = useState(-1);
  const breakpoint = useBreakpoint();
  return breakpoint && (
    <div
      css={{
        padding: breakpoint === "small" ? "64px 0" : "128px 0",
        background: "#FFD372",
      }}
    >
      <ul
        css={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 848,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {FAQ_ITEMS.map(([question, shortQuestion, answer], index) => (
          <HomeFaqItem
            key={index}
            answer={answer}
            opened={index === openedItem}
            onToggle={() => {
              setOpenedItem((index_) => index_ === index ? -1 : index);
            }}
            question={breakpoint === "small" && shortQuestion
              ? shortQuestion
              : question}
            small={breakpoint === "small"}
          />
        ))}
      </ul>
    </div>
  );
}

function HomeFaqItem({
  answer,
  onToggle,
  opened,
  question,
  small,
}: {
  answer: ReactNode;
  onToggle: () => void;
  opened: boolean;
  question: string;
  small?: boolean;
}) {
  const { observe, inView } = useInView({
    threshold: 1,
    unobserveOnEnter: true,
  });
  const answerDimensions = useDimensions();
  const itemShiftFrom = -200;
  const itemScaleFrom = 0.9;
  const buttonShiftFrom = -100;
  const spring = useSpring({
    from: {
      opacity: 0,
      itemHeight: QUESTION_HEIGHT,
      itemTransform: `
        scale3d(${itemScaleFrom}, ${itemScaleFrom}, 1)
        translate3d(${itemShiftFrom}px, 0, 0)
      `,
      visibility: "hidden" as const,
    },
    to: {
      opacity: Number(inView),
      itemHeight: QUESTION_HEIGHT + (opened ? answerDimensions.height : 0),
      itemTransform: `
        scale3d(${inView ? 1 : itemScaleFrom}, ${inView ? 1 : itemScaleFrom}, 1)
        translate3d(${inView ? 0 : itemShiftFrom}px, 0, 0)
      `,
      visibility: opened ? "visible" as const : "hidden" as const,
    },
    config: {
      mass: 2,
      friction: 100,
      tension: 2000,
    },
  });
  const buttonSpring = useSpring({
    from: {
      opacity: 0,
      transform: `
        scale3d(0, 0, 1)
        translate3d(${buttonShiftFrom}px, 0, 0)
      `,
    },
    to: {
      opacity: Number(inView),
      transform: `
        scale3d(${Number(inView)}, ${Number(inView)}, 1)
        translate3d(${inView ? 0 : buttonShiftFrom}px, 0, 0)
      `,
    },
    config: {
      mass: 3,
      friction: 100,
      tension: 2000,
    },
    delay: 100,
  });
  return (
    <li
      ref={observe}
      css={{
        overflow: "hidden",
        listStyle: "none",
      }}
    >
      <a.div
        style={{
          opacity: spring.opacity,
          height: spring.itemHeight,
          transform: spring.itemTransform,
        }}
        css={{
          position: "relative",
          background: COLORS.grey,
          borderRadius: 32,
        }}
      >
        <label
          css={{
            display: "block",
            cursor: "pointer",
          }}
        >
          <a.div
            style={{
              opacity: buttonSpring.opacity,
              transform: buttonSpring.transform,
            }}
            css={{
              position: "absolute",
              inset: "0 12px auto auto",
              display: "flex",
              alignItems: "center",
              height: QUESTION_HEIGHT,
            }}
          >
            <PlusMinusButton
              mode={opened ? "minus" : "plus"}
              title={opened ? "Close" : "Open"}
              color={COLORS.black}
              onClick={(event) => {
                event.preventDefault();
                onToggle();
              }}
            />
          </a.div>
          <h2
            title={question}
            css={{
              display: "flex",
              alignItems: "center",
              height: QUESTION_HEIGHT,
              padding: "0 60px 0 24px",
              fontSize: small ? 20 : 24,
              fontWeight: 400,
              userSelect: "none",
            }}
          >
            <span
              css={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {question}
            </span>
          </h2>
        </label>
        <div ref={answerDimensions.observe}>
          <a.div
            style={{ visibility: spring.visibility }}
            css={{
              padding: "0 24px 24px",
              "p:not(:first-of-type)": {
                marginTop: 16,
              },
              "a:focus-visible": {
                outline: `2px solid ${COLORS.black}`,
                outlineOffset: 2,
                borderRadius: 2,
              },
              "code": {
                padding: "0 4px",
                marginRight: 1,
                color: COLORS.white,
                background: COLORS.black,
                borderRadius: 4,
              },
            }}
          >
            {answer}
          </a.div>
        </div>
      </a.div>
    </li>
  );
}
