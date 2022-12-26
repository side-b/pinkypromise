import type { UseSpringProps } from "react-spring";

import { useEffect, useRef, useState } from "react";
import { a, useChain, useSpring, useSpringRef } from "react-spring";

export function useWindowDimensions() {
  const latest = useRef(() => ({
    height: window.innerHeight,
    width: window.innerWidth,
  }));

  const [dimensions, set] = useState(latest.current());

  useEffect(() => {
    const onResize = () => set(latest.current());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return dimensions;
}

export function useProgress(springProps?: UseSpringProps) {
  const ref = useSpringRef();
  const spring = useSpring({
    ref,
    from: { progress: 0 },
    to: { progress: 1 },
    ...springProps,
  });
  return {
    ref,
    spring,
    progress: spring.progress,
  };
}

export function useChainedProgress(steps: Array<[number, string, UseSpringProps?]>, duration: number) {
  const springs = steps.reduce<
    Record<string, ReturnType<typeof useProgress>>
  >((springs, step) => ({
    ...springs,
    [step[1]]: useProgress(step[2]),
  }), {});

  useChain(
    steps.map(([, name]) => springs[name].ref),
    steps.map(([value]) => value),
    duration,
  );

  return springs;
}
