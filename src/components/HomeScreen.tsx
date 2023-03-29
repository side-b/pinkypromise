import type { Dimensions } from "../types";

import { a } from "@react-spring/web";
import { useEffect, useState } from "react";
import { COLORS, HOME_BUTTON, PROMISE_SYNONYMS } from "../constants";
import {
  useBreakpoint,
  useChainedProgress,
  useWindowDimensions,
} from "../lib/react-utils";
import { lerp } from "../lib/utils";
import { AnimatableFingers } from "./AnimatableFingers";
import { Button } from "./Button";
import { Footer } from "./Footer";
import { HomeFaq } from "./HomeFaq";
import { HomeIntro } from "./HomeIntro";
import { HomeSteps } from "./HomeSteps";
import { WordsLoop } from "./WordsLoop";

export function HomeScreen() {
  const [animateWords, setAnimateWords] = useState(false);
  const [fingersAnimRunning, setFingersAnimRunning] = useState(true);

  const springs = useChainedProgress([
    [0, "leftFinger", { onStart: () => setFingersAnimRunning(true) }],
    [0.1, "rightFinger"],
    [0.5, "closeFingers"],
    [0.9, "reveal", {
      config: { mass: 1, friction: 80, tension: 1400 },
      onStart: () => setFingersAnimRunning(false),
    }],
    [1, "pause", { config: { duration: 600 } }],
  ], {
    duration: 1200,
    onComplete: () => setAnimateWords(true),
    props: { config: { mass: 2, friction: 70, tension: 1200 } },
  });

  const [winDims, setWinDims] = useState<Dimensions>({ width: 0, height: 0 });
  useWindowDimensions(setWinDims);

  const breakpoint = useBreakpoint();
  const fingersSize = breakpoint === "medium" ? 120 : 64;

  useEffect(() => {
    const cl = document.documentElement.classList;
    if (fingersAnimRunning) cl.add("no-scroll");
    return () => cl.remove("no-scroll");
  }, [fingersAnimRunning]);

  return (
    <>
      <div
        css={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          css={{
            overflow: "hidden",
            flexGrow: 1,
            flexShrink: 0,
            position: "relative",
            marginTop: -120,
            zIndex: 1,
          }}
        >
          <a.div
            style={{
              transform: springs.reveal.progress.to((p: number) => `
                translateY(${
                lerp(p, -fingersSize, breakpoint === "medium" ? 40 : 24)
              }px)
                scale(${lerp(p, 1, fingersSize / (winDims.height * 1.8))})
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
                top: 0,
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
                openDistance={winDims.width / 3}
                size={winDims.height * 1.8}
              />
            </div>
          </a.div>
          <a.div
            css={{
              display: fingersAnimRunning ? "none" : "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            style={{
              opacity: springs.reveal.progress.to([0, 0.2, 1], [0, 1, 1]),
              transform: springs.reveal.progress
                .to([0, 0.8, 1], [0, 0, 1])
                .to((p: number) => `translateY(${lerp(p, winDims.height, 0)}px)`),
            }}
          >
            {breakpoint === "small" && (
              <div
                css={{
                  color: COLORS.white,
                  paddingTop: 96,
                  textTransform: "lowercase",
                  fontWeight: 500,
                  fontSize: 24,
                }}
              >
                Pinky Promise
              </div>
            )}
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: breakpoint === "medium" ? 224 : 48,
                paddingBottom: breakpoint === "medium" ? 112 : 48,
              }}
            >
              <div
                css={{
                  paddingBottom: 48,
                  textAlign: "center",
                  fontSize: breakpoint === "medium" ? 200 : 64,
                  fontWeight: breakpoint === "medium" ? 500 : 600,
                  lineHeight: breakpoint === "medium" ? 1 : 1.1,
                  textTransform: "uppercase",
                  color: "#FFF",
                  userSelect: "none",
                  "span": {
                    display: "block",
                  },
                }}
              >
                <div
                  css={{
                    fontSize: breakpoint === "medium" ? 160 : 64,
                  }}
                >
                  Onchain
                </div>
                <WordsLoop
                  height={breakpoint === "medium" ? 200 : 48}
                  animate={animateWords}
                  word="Promises"
                  words={PROMISE_SYNONYMS}
                />
              </div>
              <Button
                color={COLORS.blue}
                href="/new"
                label={HOME_BUTTON}
                size={breakpoint === "medium" ? "giant" : "large"}
              />
            </div>
            <div
              css={{
                display: fingersAnimRunning ? "none" : "block",
                width: "100%",
              }}
            >
              {breakpoint !== "small" && <HomeIntro />}
              <HomeSteps />
              <HomeFaq />
              <Footer />
            </div>
          </a.div>
        </div>
      </div>
    </>
  );
}
