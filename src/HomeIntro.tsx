import { useInView } from "react-cool-inview";
import { a, useSpring } from "@react-spring/web";
import { COLORS, HOME_INTRO } from "./constants";
import { SvgDoc, SvgDocSignees } from "./SvgDoc";

import fingersImg from "./intro-fingers.svg";

export function HomeIntro() {
  const { observe, inView } = useInView({
    threshold: 0.4,
    unobserveOnEnter: true,
  });
  const textSpringStyles = useSpring({
    opacity: Number(inView),
    transform: `translate3d(${inView ? 0 : -400}px, 0, 0)`,
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });
  const imageSpringStyles = useSpring({
    opacity: Number(inView),
    transform: `translate3d(${inView ? 0 : 400}px, 0, 0)`,
    config: {
      mass: 4,
      friction: 80,
      tension: 1000,
    },
    delay: 100,
  });
  return (
    <div
      ref={observe}
      css={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        background: COLORS.red,
        userSelect: "none",
      }}
    >
      <div
        css={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 2000,
        }}
      >
        <a.div
          style={textSpringStyles}
          css={{
            position: "relative",
            zIndex: 2,
            width: 780 + 120,
            padding: 120,
            paddingRight: 0,
            fontSize: 110,
            fontWeight: 600,
            lineHeight: 1.1,
            color: COLORS.white,
          }}
        >
          {HOME_INTRO}
        </a.div>
        <a.div
          style={imageSpringStyles}
          css={{
            position: "absolute",
            right: -300,
            zIndex: 2,
            display: "flex",
            filter: "drop-shadow(0 80px 120px rgba(43, 8, 28, 0.20))",
          }}
        >
          <IntroPromise />
        </a.div>

        <img
          src={fingersImg}
          alt=""
          width={1800}
          css={{
            position: "absolute",
            zIndex: 1,
            bottom: "0",
            left: "50%",
            transform: "translate(-50%, 40%)",
          }}
        />
      </div>
    </div>
  );
}

function IntroPromise() {
  return (
    <div
      css={{
        padding: 40,
        background: COLORS.white,
        borderRadius: 64,
        transform: "scale(0.85)",
      }}
    >
      <SvgDoc
        bodyHtml={`
        <p>
          Dave will brew 6000 liters of his “Pretty Pale Dave Ale” for Omni Brew by
          September 2023, delivered in 30L kegs.* Omni Brew will pay Dave 4000 DAI
          for every 1000 liters delivered.
        </p>
        <p>
          *Kegs to be returned or bought (50 DAI / keg).
        </p>
      `}
        classPrefix="intro"
        height={800}
        htmlMode={true}
        padding={[0, 0, 0]}
        promiseId={"E-12"}
        signedOn={"test"}
        signees={
          <SvgDocSignees
            signees={[
              ["davesbrewery.eth", "signed"],
              ["omnibrew.eth", "signed"],
            ]}
          />
        }
        status="Signed"
        title="Dave x Omni Brew #1"
        color={COLORS.white}
        contentColor={COLORS.red}
      />
    </div>
  );
}
