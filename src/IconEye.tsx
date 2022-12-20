import { a, useSpring } from "react-spring";
import { COLORS } from "./constants";

export function IconEye({ opened }: { opened: boolean }) {
  const spring = useSpring({
    maskHeight: opened ? 0 : 32,
    eyeY: opened ? 0 : 2,
    config: {
      mass: 1,
      friction: 100,
      tension: 2000,
    },
  });
  return (
    <svg width="33" height="32" fill="none">
      <path
        stroke={COLORS.pink}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M25.737 19.563 28.59 24.5M19.866 22.308l.89 5.043M13.31 22.305l-.89 5.044M7.445 19.559 4.58 24.52M16.594 4.648c-10 0-14 9.001-14 9.001s4 9 14 9 14-9 14-9-4-9-14-9Z"
      />

      <a.path
        fill={COLORS.pink}
        stroke={COLORS.pink}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16.594 18.65a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        style={{
          transform: spring.eyeY.to((v) => `translateY(${v}px)`),
        }}
      />

      <a.rect
        width={33}
        height={spring.maskHeight}
        fill={COLORS.grey}
      />

      <path
        stroke={COLORS.pink}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M25.737 19.563 28.59 24.5M19.866 22.308l.89 5.043M13.31 22.305l-.89 5.044M7.445 19.559 4.58 24.52M2.594 13.65s4 8.998 14 8.998 14-8.999 14-8.999"
      />
    </svg>
  );
}
