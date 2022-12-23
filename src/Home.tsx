import { useEffect } from "react";
import { a, useChain, useSpring, useSpringRef } from "react-spring";
import { Link } from "wouter";
import { AnimatableFingers } from "./AnimatableFingers";
import { ButtonLink } from "./ButtonLink";
import { COLORS } from "./constants";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useWindowDimensions } from "./react-utils";
import { lerp } from "./utils";

const bouncyConfig = {
  mass: 2,
  friction: 70,
  tension: 1200,
};

export function Home() {
  const dimensions = useWindowDimensions();

  const springRefs = {
    leftFingerAppear: useSpringRef(),
    rightFingerAppear: useSpringRef(),
    closeFingers: useSpringRef(),
    reveal: useSpringRef(),
    footer: useSpringRef(),
  };

  const leftFingerAppear = useSpring({
    ref: springRefs.leftFingerAppear,
    from: { progress: 0 },
    to: { progress: 1 },
    config: bouncyConfig,
  });

  const rightFingerAppear = useSpring({
    ref: springRefs.rightFingerAppear,
    from: { progress: 0 },
    to: { progress: 1 },
    config: bouncyConfig,
  });

  const closeFingers = useSpring({
    ref: springRefs.closeFingers,
    from: { progress: 0 },
    to: { progress: 1 },
    config: bouncyConfig,
  });

  const reveal = useSpring({
    ref: springRefs.reveal,
    from: { progress: 0 },
    to: { progress: 1 },
    config: {
      mass: 1,
      friction: 80,
      tension: 1400,
    },
  });

  const footer = useSpring({
    ref: springRefs.footer,
    from: { progress: 0 },
    to: { progress: 1 },
    config: {
      mass: 1,
      friction: 80,
      tension: 800,
    },
  });

  useChain(
    [
      springRefs.leftFingerAppear,
      springRefs.rightFingerAppear,
      springRefs.closeFingers,
      springRefs.reveal,
      springRefs.footer,
    ],
    [0, 0.1, 0.5, 0.9, 1],
    1200,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            transform: reveal.progress.to((p) => `
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
                closeFingers: closeFingers.progress,
                leftFingerAppear: leftFingerAppear.progress,
                rightFingerAppear: rightFingerAppear.progress,
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
            opacity: reveal.progress.to([0, 0.2, 1], [0, 1, 1]),
            transform: reveal.progress.to([0, 0.8, 1], [0, 0, 1]).to((p) => `
              translateY(${lerp(p, dimensions.height, 0)}px)
            `),
          }}
        >
          <h1
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
            <span>On-chain</span>
            <span>promises</span>
          </h1>
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
            opacity: footer.progress,
            transform: footer.progress.to((v) => (
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
