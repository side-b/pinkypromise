import type { ReactNode } from "react";

import { useState } from "react";
import useDimensions from "react-cool-dimensions";
import { a, useSpring } from "react-spring";
import { COLORS, FAQ_ITEMS } from "./constants";
import { PlusMinusButton } from "./PlusMinusButton";

export function HomeFaq() {
  const [openedItem, setOpenedItem] = useState(-1);
  return (
    <div
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
  const { height } = useSpring({
    height: 64 + (opened ? answerDimensions.height : 0),
    config: {
      mass: 2,
      friction: 100,
      tension: 2000,
    },
  });
  return (
    <a.li
      style={{ height }}
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
            height: 64,
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
            height: 64,
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
        <div css={{ padding: "0 64px 24px 24px" }}>
          {answer}
        </div>
      </div>
    </a.li>
  );
}
