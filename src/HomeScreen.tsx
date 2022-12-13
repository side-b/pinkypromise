import { useEffect, useState } from "react";
import { a } from "react-spring";
import { AnimatableFingers } from "./AnimatableFingers";
import { Button } from "./Button";
import { COLORS, PROMISE_SYNONYMS } from "./constants";
import { Footer } from "./Footer";
import { HomeSteps } from "./HomeSteps";
import {
  useChainedProgress,
  useResetScroll,
  useWindowDimensions,
} from "./react-utils";
import { lerp } from "./utils";
import { WordsLoop } from "./WordsLoop";

export function HomeScreen() {
  const [animateWords, setAnimateWords] = useState(false);
  const [onlyFingers, setOnlyFingers] = useState(true);

  const springs = useChainedProgress([
    [0, "leftFinger", { onStart: () => setOnlyFingers(true) }],
    [0.1, "rightFinger"],
    [0.5, "closeFingers"],
    [0.9, "reveal", {
      config: { mass: 1, friction: 80, tension: 1400 },
      onStart: () => setOnlyFingers(false),
    }],
    [1, "pause", { config: { duration: 600 } }],
  ], {
    duration: 1200,
    onComplete: () => setAnimateWords(true),
    props: { config: { mass: 2, friction: 70, tension: 1200 } },
  });

  const dimensions = useWindowDimensions();

  useEffect(() => {
    const cl = document.documentElement.classList;
    if (onlyFingers) cl.add("no-scroll");
    return () => cl.remove("no-scroll");
  }, [onlyFingers]);

  useResetScroll();

  return (
    <div
      css={{
        flexGrow: "1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        css={{
          overflow: "hidden",
          flexGrow: "1",
          flexShrink: "0",
          position: "relative",
          marginTop: "-120px",
          zIndex: "1",
        }}
      >
        <a.div
          style={{
            transform: springs.reveal.progress.to((p: number) => `
              translateY(${lerp(p, -120, 40)}px)
              scale(${lerp(p, 1, 140 / (dimensions.height * 1.8))})
            `),
          }}
          css={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            css={{
              position: "absolute",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <AnimatableFingers
              springValues={{
                closeFingers: springs.closeFingers.progress,
                leftFingerAppear: springs.leftFinger.progress,
                rightFingerAppear: springs.rightFinger.progress,
              }}
              openDistance={dimensions.width / 3}
              size={dimensions.height * 1.8}
            />
          </div>
        </a.div>
        <a.div
          css={{
            display: onlyFingers ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "240px",
          }}
          style={{
            opacity: springs.reveal.progress.to([0, 0.2, 1], [0, 1, 1]),
            transform: springs.reveal.progress
              .to([0, 0.8, 1], [0, 0, 1])
              .to((p: number) => `translateY(${lerp(p, dimensions.height, 0)}px)`),
          }}
        >
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: "60px",
            }}
          >
            <div
              css={{
                paddingBottom: "48px",
                textAlign: "center",
                fontSize: "200px",
                fontWeight: 500,
                lineHeight: "1",
                textTransform: "uppercase",
                color: "#FFF",
                userSelect: "none",
                "span": {
                  display: "block",
                },
              }}
            >
              <div>On-chain</div>
              <WordsLoop
                animate={animateWords}
                word="Promises"
                words={PROMISE_SYNONYMS}
              />
            </div>
            <Button
              color={COLORS.blue}
              href="/new"
              label="Cool, cool"
              size="giant"
            />
          </div>
          <div css={{ display: onlyFingers ? "none" : "block", width: "100%" }}>
            <HomeSteps />
          </div>
          <div
            css={{
              display: onlyFingers ? "none" : "flex",
              justifyContent: "center",
              height: "104px",
            }}
          >
            <Footer />
          </div>
        </a.div>
      </div>
    </div>
  );
}
