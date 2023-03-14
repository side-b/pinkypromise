import type { SpringValue } from "@react-spring/web";

import { a } from "@react-spring/web";

import pinkyLeft from "./pinky-left.svg?raw";
import pinkyRight from "./pinky-right.svg?raw";

// Size of the frame the two SVG files are exported from
export const FINGERS_SIZE_ORIGINAL = 1000;

// SVG sizes / positions
const PINKY_LEFT_GEOMETRY = { w: 625, h: 787, y: 212.65 };
const PINKY_RIGHT_GEOMETRY = { w: 650, h: 830, y: 169.17 };

const PINKY_LEFT_URL = `data:image/svg+xml,${encodeURIComponent(pinkyLeft)}`;
const PINKY_RIGHT_URL = `data:image/svg+xml,${encodeURIComponent(pinkyRight)}`;

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
        userSelect: "none",
      }}
    >
      <a.div
        style={{
          opacity: springValues.leftFingerAppear,
          transform: springValues.leftFingerAppear.to((v) => (`
            translate3d(0, ${500 * ratio * (1 - v)}px, 0)
          `)),
        }}
      >
        <a.img
          alt=""
          src={PINKY_LEFT_URL}
          width={ratio * PINKY_LEFT_GEOMETRY.w}
          height={ratio * PINKY_LEFT_GEOMETRY.h}
          style={{
            transform: springValues.closeFingers.to((v) => (`
              translate3d(
                ${-(openDistance / 2) * ratio * (1 - v)}px,
                ${20 * ratio * (1 - v)}px,
                0
              )
              rotate3d(0, 0, 1, ${-20 * (1 - v)}deg)
            `)),
          }}
          css={{
            position: "absolute",
            top: ratio * PINKY_LEFT_GEOMETRY.y,
            left: "0",
          }}
        />
      </a.div>
      <a.div
        style={{
          opacity: springValues.rightFingerAppear,
          transform: springValues.rightFingerAppear.to((v) => (`
            translate3d(0, ${500 * ratio * (1 - v)}px, 0)
          `)),
        }}
      >
        <a.img
          alt=""
          src={PINKY_RIGHT_URL}
          width={ratio * PINKY_RIGHT_GEOMETRY.w}
          height={ratio * PINKY_RIGHT_GEOMETRY.h}
          style={{
            transform: springValues.closeFingers.to((v) => (`
              translate3d(
                ${(openDistance / 2) * ratio * (1 - v)}px,
                ${20 * ratio * (1 - v)}px,
                0
              )
              rotate3d(0, 0, 1, ${20 * (1 - v)}deg)
            `)),
          }}
          css={{
            position: "absolute",
            top: ratio * PINKY_RIGHT_GEOMETRY.y,
            right: "0",
          }}
        />
      </a.div>
    </a.div>
  );
}
