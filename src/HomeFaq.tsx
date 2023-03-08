import type { ReactNode } from "react";

import { useEffect, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { useInView } from "react-cool-inview";
import { a, useSpring } from "react-spring";
import { COLORS, FAQ_ITEMS } from "./constants";
import { PlusMinusButton } from "./PlusMinusButton";

const QUESTION_HEIGHT = 64;

export function HomeFaq() {
  const { observe, inView } = useInView({
    threshold: 0.4,
    unobserveOnEnter: true,
  });
  const [openedItem, setOpenedItem] = useState(-1);
  useEffect(() => {
    if (inView) {
      setOpenedItem((index) => index === -1 ? 0 : index);
    }
  }, [inView]);
  return (
    <div
      ref={observe}
      css={{
        padding: "128px 0",
        background: COLORS.red,
      }}
    >
      <ul
        css={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 800,
          margin: "0 auto",
          padding: 0,
        }}
      >
        {FAQ_ITEMS.map(([question, answer], index) => (
          <HomeFaqItem
            key={index}
            answer={answer ?? FAQ_ITEMS[1][1]}
            opened={index === openedItem}
            onToggle={() => {
              setOpenedItem((index_) => index_ === index ? -1 : index);
            }}
            question={question}
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
}: {
  answer: ReactNode;
  onToggle: () => void;
  opened: boolean;
  question: string;
}) {
  const answerDimensions = useDimensions();
  const spring = useSpring({
    from: {
      itemHeight: QUESTION_HEIGHT,
      visibility: "hidden" as const,
    },
    to: opened
      ? {
        itemHeight: QUESTION_HEIGHT + answerDimensions.height,
        visibility: "visible" as const,
      }
      : {
        itemHeight: QUESTION_HEIGHT,
        visibility: "hidden" as const,
      },
    config: {
      mass: 2,
      friction: 100,
      tension: 2000,
    },
  });
  return (
    <a.li
      style={{ height: spring.itemHeight }}
      css={{
        overflow: "hidden",
        position: "relative",
        background: COLORS.grey,
        borderRadius: 32,
        listStyle: "none",
      }}
    >
      <label
        css={{
          display: "block",
          cursor: "pointer",
        }}
      >
        <div
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
            onClick={onToggle}
          />
        </div>
        <h2
          css={{
            display: "flex",
            alignItems: "center",
            height: QUESTION_HEIGHT,
            padding: "0 24px",
            fontSize: 24,
            fontWeight: 400,
            userSelect: "none",
          }}
        >
          {question}
        </h2>
      </label>
      <div ref={answerDimensions.observe}>
        <a.div
          style={{ visibility: spring.visibility }}
          css={{
            padding: "0 64px 24px 24px",
            "a:focus-visible": {
              outline: `2px solid ${COLORS.black}`,
              outlineOffset: 2,
              borderRadius: 2,
            },
          }}
        >
          {answer}
        </a.div>
      </div>
    </a.li>
  );
}
