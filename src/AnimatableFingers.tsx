import type { SpringValue } from "react-spring";

import { a, useSpring } from "react-spring";

import pinkyLeft from "./pinky-left.svg";
import pinkyRight from "./pinky-right.svg";

export const FINGERS_SIZE_ORIGINAL = 1125;

export function AnimatableFingers({
  springValues,
  openDistance = 400,
  size = 140,
}: {
  openDistance?: number;
  size?: number;
  springValues: {
    closeFingers: SpringValue;
    leftFingerAppear: SpringValue;
    rightFingerAppear: SpringValue;
  };
}) {
  const ratio = size / FINGERS_SIZE_ORIGINAL;
  return (
    <a.div
      css={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      <a.div
        style={{
          opacity: springValues.leftFingerAppear,
          transform: springValues.leftFingerAppear.to(v => (`
            translateY(${500 * ratio * (1 - v)}px)
          `)),
        }}
      >
        <a.img
          alt=""
          src={pinkyLeft}
          width={ratio * 675}
          height={ratio * 867}
          style={{
            transform: springValues.closeFingers.to(v => (`
              translate(
                ${-(openDistance / 2) * ratio * (1 - v)}px,
                ${20 * ratio * (1 - v)}px
              )
              rotate(${-20 * (1 - v)}deg)
            `)),
          }}
          css={{
            position: "absolute",
            top: ratio * 242,
            left: "0",
          }}
        />
      </a.div>
      <a.div
        style={{
          opacity: springValues.rightFingerAppear,
          transform: springValues.rightFingerAppear.to(v => (`
            translateY(${500 * ratio * (1 - v)}px)
          `)),
        }}
      >
        <a.img
          alt=""
          src={pinkyRight}
          width={ratio * 711}
          height={ratio * 927}
          style={{
            transform: springValues.closeFingers.to(v => (`
              translate(
                ${(openDistance / 2) * ratio * (1 - v)}px,
                ${20 * ratio * (1 - v)}px
              )
              rotate(${20 * (1 - v)}deg)
            `)),
          }}
          css={{
            position: "absolute",
            top: ratio * 198,
            right: "0",
          }}
        />
      </a.div>
    </a.div>
  );
}
