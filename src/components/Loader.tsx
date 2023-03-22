import { keyframes } from "@emotion/react";
import { a, useSpring } from "@react-spring/web";
import { COLORS } from "../constants";

const rotateKeyframes = keyframes`
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
`;

const OPENING_ANGLE = 30;

export function Loader({
  color,
  padding,
  size = 40,
  strokeWidth = 5,
}: {
  color?: string;
  // Some inner padding can be needed to prevent rounding
  // issues when using the Loader with animated transforms.
  padding?: number;
  size?: number;
  strokeWidth?: number;
}) {
  padding ??= 1;
  color ??= COLORS.pink;

  const rotateAnim = useSpring({
    from: { progress: 0 },
    to: { progress: 1 },
    loop: true,
    config: {
      mass: 4,
      tension: 300,
      friction: 200,
      precision: 0.05,
    },
  });

  const radius = size / 2 - padding - strokeWidth / 2;
  const circumference = 2 * radius * Math.PI;

  return (
    <div
      css={{
        position: "relative",
        width: size,
        height: size,
        background: "none",
      }}
    >
      <svg
        fill="none"
        height={size}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        css={{ position: "absolute", inset: "0" }}
      >
        <g
          css={{
            transformOrigin: "50% 50%",
            animation: `${rotateKeyframes} 2s linear infinite`,
          }}
        >
          <a.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference / 2}
            strokeLinecap="round"
            style={{
              transform: rotateAnim.progress
                .to(
                  [0, 0.2, 0.5, 1],
                  [0, 0.5, 0.8, 1],
                )
                .to((v) => `rotate3d(0, 0, 1, ${-90 + v * 360 + OPENING_ANGLE}deg)`),
            }}
            css={{ transformOrigin: "50% 50%" }}
          />
          <a.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference / 2}
            strokeLinecap="round"
            style={{
              transform: rotateAnim.progress.to((v) =>
                `rotate3d(0, 0, 1, ${90 + 360 * v - OPENING_ANGLE}deg)`
              ),
            }}
            css={{ transformOrigin: "50% 50%" }}
          />
        </g>
      </svg>
    </div>
  );
}
