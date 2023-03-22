import { a, useTransition } from "@react-spring/web";
import { memo, useEffect, useRef, useState } from "react";
import { COLORS } from "../constants";

export const WordsLoop = memo(function WordsLoop({
  animate,
  interval = 250,
  word,
  words,
}: {
  animate: boolean;
  interval?: number;
  word: string;
  words: string[];
}) {
  const [index, setIndex] = useState(0);
  const [color, setColor] = useState("#FFF");

  const _words = useRef([word, ...words]);

  const transitions = useTransition(index, {
    from: { opacity: 1, transform: "scale(0.85)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, immediate: true },
    config: { mass: 1, friction: 80, tension: 1800 },
  });

  const stopAnim = useRef(() => {});

  useEffect(() => {
    if (!animate) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const update = () => {
      setIndex((i: number) => (i + 1) % _words.current.length);
      timer = setTimeout(update, interval);
      stopAnim.current = () => {
        clearTimeout(timer);
        setIndex(0);
        setColor("#FFF");
      };
    };
    update();

    return stopAnim.current;
  }, [animate, interval]);

  useEffect(() => {
    if (animate) {
      setColor(COLORS.red);
    }
  }, [animate]);

  const hasStarted = useRef(false);
  useEffect(() => {
    if (animate && index > 0) {
      hasStarted.current = true;
    } else if (!animate) {
      hasStarted.current = false;
    }

    if (animate && index === _words.current.length - 1) {
      stopAnim.current();
    }
  }, [animate, index]);

  return (
    <div
      css={{
        position: "relative",
        height: "200px",
      }}
    >
      {transitions((styles, index) => (
        <div
          css={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            color,
          }}
        >
          <a.div style={styles}>
            {_words.current[index]}
          </a.div>
        </div>
      ))}
    </div>
  );
});
