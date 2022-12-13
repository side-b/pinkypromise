import { useInView } from "react-cool-inview";
import { a, useSpring } from "react-spring";
import { COLORS, HOME_STEPS } from "./constants";

import home1 from "./home-1.svg";
import home2 from "./home-2.svg";
import home3 from "./home-3.svg";

type ImgGeometry = { w: number; h: number; yShift: number; xShift: number };
const STEPS = [
  {
    geometry: { w: 494, h: 761, yShift: 100, xShift: 60 },
    img: home1,
    description: HOME_STEPS[0],
  },
  {
    geometry: { w: 989, h: 519, yShift: 100, xShift: 85 },
    img: home2,
    description: HOME_STEPS[1],
  },
  {
    geometry: { w: 746, h: 834, yShift: 100, xShift: 84 },
    img: home3,
    description: HOME_STEPS[2],
  },
] satisfies { description: string; geometry: ImgGeometry; img: string }[];

export function HomeSteps() {
  return (
    <ol
      css={{
        counterReset: "a",
        width: "100%",
        padding: 0,
        fontSize: 32,
        "li": {
          listStyle: "none",
        },
      }}
    >
      {STEPS.map((step, index) => (
        <li key={index}>
          <Step {...step} index={index} />
        </li>
      ))}
    </ol>
  );
}

function Step({
  description,
  geometry: { w, h, xShift, yShift },
  img,
  index,
}: {
  description: string;
  geometry: ImgGeometry;
  img: string;
  index: number;
}) {
  const revert = Boolean(index % 2);
  const color = revert ? COLORS.blue : COLORS.pink;
  const background = revert ? COLORS.pink : COLORS.blue;
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
        flexDirection: revert ? "row-reverse" : "row",
        justifyContent: "space-between",
        width: "100%",
        height: 800,
        color,
        background,
        listStyle: "none",
      }}
    >
      <a.div
        style={{
          opacity: appear,
          transform: appear
            .to([0, 1], revert ? [100, 0] : [-100, 0])
            .to((v) => `translate3d(${v}%, 0, 0)`),
        }}
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: revert ? "flex-start" : "flex-end",
          width: 480,
          borderRight: revert ? 0 : `10px solid ${color}`,
          borderLeft: revert ? `10px solid ${color}` : 0,
        }}
      >
        <img
          alt=""
          height={h}
          src={img}
          width={w}
          css={{
            transform: `translate(
              ${xShift * (revert ? 1 : -1)}px,
              ${yShift}px
            )`,
          }}
        />
      </a.div>
      <a.div
        style={{
          opacity: appear,
          transform: appear
            .to([0, 1], revert ? [-100, 0] : [100, 0])
            .to((v) => `translate3d(${v}%, 0, 0)`),
        }}
        css={{
          flexGrow: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginLeft: 120,
          marginRight: 120,
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 190,
              height: 120,
              marginBottom: 40,
              fontSize: 80,
              fontWeight: 500,
              borderRadius: 120,
              border: `10px solid ${color}`,
            }}
          >
            {index + 1}
          </div>
          <div
            css={{
              maxWidth: 640,
              userSelect: "none",
            }}
          >
            {description.trim()}
          </div>
        </div>
      </a.div>
    </div>
  );
}