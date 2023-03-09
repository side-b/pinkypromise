import { useInView } from "react-cool-inview";
import { a, useSpring } from "react-spring";
import { COLORS, HOME_INTRO } from "./constants";

export function HomeIntro() {
  const { observe, inView } = useInView({
    threshold: 0.5,
    unobserveOnEnter: true,
  });
  const { appear } = useSpring({
    appear: Number(inView),
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });
  return (
    <div
      ref={observe}
      css={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        background: COLORS.red,
      }}
    >
      <div
        css={{
          padding: 120,
          paddingRight: 0,
          fontSize: 110,
          fontWeight: 600,
          lineHeight: 1.1,
          color: COLORS.white,
          width: 780,
        }}
      >
        {HOME_INTRO}
      </div>
    </div>
  );
}
