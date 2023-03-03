import type { UseSpringProps } from "react-spring";
import type { Address } from "./types";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChain, useSpring, useSpringRef } from "react-spring";
import { useNetwork } from "wagmi";
import { uid } from "./utils";

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

export function useChainedProgress(
  steps: Array<[number, string, UseSpringProps?]>,
  options: {
    duration?: number;
    onComplete?: () => void;
    props?: Parameters<typeof useProgress>[0];
  } = {},
) {
  options.duration ??= 1000;

  const springs = steps.reduce<
    Record<string, ReturnType<typeof useProgress>>
  >((springs, [, name, props = {}], index) => {
    const props_ = { ...options.props, ...props };
    return ({
      ...springs,
      [name]: useProgress(
        index === steps.length - 1
          ? { ...props_, onRest: () => options.onComplete?.() }
          : props_,
      ),
    });
  }, {});

  useChain(
    steps.map(([, name]) => springs[name].ref),
    steps.map(([value]) => value),
    options.duration,
  );

  return springs;
}

export function useExplorerBaseUrl() {
  const { chain } = useNetwork();
  return chain?.blockExplorers?.etherscan.url ?? undefined;
}

export function useTxUrl() {
  const baseUrl = useExplorerBaseUrl();
  return useCallback((hash: string) => {
    return baseUrl ? `${baseUrl}/tx/${hash}` : null;
  }, [baseUrl]);
}

export function useContractUrl() {
  const baseUrl = useExplorerBaseUrl();
  return useCallback((address: Address, file: number = 1, line: number = 1) => {
    return baseUrl ? `${baseUrl}/address/${address}#code#F${file}#L${line}` : null;
  }, [baseUrl]);
}

export function useUid(prefix = "uid"): string {
  return useRef(uid(prefix)).current;
}

export function useResetScroll(dependencies: unknown[] = []) {
  useEffect(() => {
    const id = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(id);
  }, dependencies);
}
