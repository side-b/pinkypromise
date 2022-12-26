import { useEffect, useState } from "react";
import { a } from "react-spring";
import { Link } from "wouter";
import { AnimatableFingers } from "./AnimatableFingers";
import { ButtonLink } from "./ButtonLink";
import { COLORS, PROMISE_SYNONYMS } from "./constants";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useChainedProgress, useWindowDimensions } from "./react-utils";
import { lerp } from "./utils";
import { WordsLoop } from "./WordsLoop";

export function Home() {
  const [animateWords, setAnimateWords] = useState(false);

  const springs = useChainedProgress([
    [0, "leftFinger", { config: { mass: 2, friction: 70, tension: 1200 } }],
    [0.1, "rightFinger", { config: { mass: 2, friction: 70, tension: 1200 } }],
    [0.5, "closeFingers", { config: { mass: 2, friction: 70, tension: 1200 } }],
    [0.9, "reveal", { config: { mass: 1, friction: 80, tension: 1400 } }],
    [1, "footer", {
      config: { mass: 1, friction: 80, tension: 800 },
      onRest: () => setAnimateWords(true),
    }],
  ], 1200);

  const dimensions = useWindowDimensions();

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div css={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
      <div
        css={{
          flexGrow: "0",
          flexShrink: "0",
          position: "relative",
          zIndex: "2",
        }}
      >
        <Header />
      </div>
      <div
        css={{
          overflowX: "hidden",
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
              scale(${lerp(p, 1, 140 / (dimensions.height * 1.8))})
              translateY(${lerp(p, -120, 40)}px)
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
        <a.main
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "240px",
            paddingBottom: "60px",
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
              paddingBottom: "48px",
              textAlign: "center",
              fontSize: "200px",
              fontWeight: "500",
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
          <Link href="/new">
            <ButtonLink label="Cool, cool" size="big" color={COLORS.blue} />
          </Link>
        </a.main>
      </div>
      <div
        css={{
          flexGrow: "0",
          flexShrink: "0",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          height: "104px",
        }}
      >
        <a.div
          css={{ height: "100%" }}
          style={{
            opacity: springs.footer.progress,
            transform: springs.footer.progress.to((v: number) => (
              `translateY(${lerp(v, 100, 0)}px)`
            )),
          }}
        >
          <Footer />
        </a.div>
      </div>
    </div>
  );
}
