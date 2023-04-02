import { a, useSpring } from "@react-spring/web";
import Image from "next/image";
import { useInView } from "react-cool-inview";
import { COLORS, HOME_STEPS } from "../constants";
import { useBreakpoint } from "../lib/react-utils";

import home1 from "../assets/home-1.svg";
import home2 from "../assets/home-2.svg";
import home3 from "../assets/home-3.svg";

type ImgGeometry = {
  w: number;
  h: number;
  shift: { y: number; x: number; r?: number };
  compactShift: { y: number; x: number; r?: number };
};
const STEPS = [
  {
    geometry: {
      w: 494,
      h: 761,
      shift: { y: 100, x: 60 },
      compactShift: { y: 30, x: 40 },
    },
    img: home1.src,
    description: HOME_STEPS[0],
  },
  {
    geometry: {
      w: 989,
      h: 519,
      shift: { y: 100, x: 85 },
      compactShift: { y: 20, x: 140 },
    },
    img: home2.src,
    description: HOME_STEPS[1],
  },
  {
    geometry: {
      w: 746,
      h: 834,
      shift: { y: 100, x: 84, r: 0 },
      compactShift: { y: -20, x: 120, r: 15 },
    },
    img: home3.src,
    description: HOME_STEPS[2],
  },
] satisfies { description: string; geometry: ImgGeometry; img: string }[];

export function HomeSteps() {
  const breakpoint = useBreakpoint();
  return breakpoint && (
    <ol
      css={{
        overflow: "hidden",
        counterReset: "a",
        width: "100%",
        margin: 0,
        padding: 0,
        fontSize: breakpoint === "small" ? 32 : 52,
        fontWeight: 600,
        textTransform: "lowercase",
        "li": {
          listStyle: "none",
        },
      }}
    >
      {STEPS.map((step, index) => (
        <li key={index}>
          <Step
            {...step}
            compact={breakpoint === "small"}
            index={index}
          />
        </li>
      ))}
    </ol>
  );
}

function Step({
  compact,
  description,
  geometry: { w, h, shift, compactShift },
  img,
  index,
}: {
  compact: boolean;
  description: string;
  geometry: ImgGeometry;
  img: string;
  index: number;
}) {
  const revert = Boolean(index % 2);
  const color = revert ? COLORS.blue : COLORS.pink;
  const background = revert ? COLORS.pink : COLORS.blue;
  const { observe, inView } = useInView({
    threshold: compact ? 0.1 : 0.5,
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
        position: "relative",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        color,
        background,
        "*": {
          userSelect: "none",
        },
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: revert ? "row-reverse" : "row",
          justifyContent: "space-between",
          maxWidth: 1440,
          height: compact ? "auto" : 800,
          padding: compact ? "280px 0 64px" : 0,
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
            position: compact ? "absolute" : "static",
            top: 0,
            left: revert ? "auto" : 0,
            right: !revert ? "auto" : 0,
            display: "flex",
            alignItems: "center",
            justifyContent: revert ? "flex-start" : "flex-end",
            width: compact ? "auto" : 480,
            borderColor: color,
            borderStyle: "solid",
            borderWidth: 0,
            borderRightWidth: revert || compact ? 0 : 10,
            borderLeftWidth: !revert || compact ? 0 : 10,
          }}
        >
          <div
            css={{
              display: "flex",
              transform: `
                translate(
                  ${(compact ? compactShift : shift).x * (revert ? 1 : -1)}px,
                  ${(compact ? compactShift : shift).y}px
                )
                rotate(${(compact ? compactShift : shift).r ?? 0}deg)
              `,
            }}
          >
            <Image
              alt=""
              height={h}
              src={img}
              width={w}
              css={{
                width: compact ? w / 2 : "auto",
                height: "auto",
              }}
            />
          </div>
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
            paddingLeft: compact ? 24 : 120,
            paddingRight: compact ? 24 : 120,
          }}
        >
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              alignItems: compact ? "center" : "flex-start",
              justifyContent: "center",
            }}
          >
            <div
              css={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: compact ? 90 : 190,
                height: compact ? 48 : 120,
                marginBottom: compact ? 16 : 40,
                fontWeight: 500,
                fontSize: compact ? 32 : 80,
                borderRadius: compact ? 64 : 120,
                borderWidth: compact ? 4 : 10,
                borderColor: color,
                borderStyle: "solid",
              }}
            >
              {`0${index + 1}`}
            </div>
            <div
              css={{
                maxWidth: compact ? 400 : 640,
                textAlign: compact ? "center" : "left",
                lineHeight: compact ? 1.3 : 1.5,
              }}
            >
              {description}
            </div>
          </div>
        </a.div>
      </div>
    </div>
  );
}
