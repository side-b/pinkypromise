import type { UseSpringProps } from "@react-spring/web";
import type { Address, Dimensions } from "../types";

import { useChain, useSpring, useSpringRef } from "@react-spring/web";
import { useCallback, useEffect, useState } from "react";
import { useThrottledCallback } from "use-debounce";
import { useNetwork } from "wagmi";
export { useBreakpoint } from "../components/Breakpoint";

type UseWindowDimensionsCallback = (dimensions: Dimensions) => void;

function getWindowDimensions(): Dimensions {
  return typeof window === "undefined"
    ? { height: 0, width: 0 }
    : { height: window.innerHeight, width: window.innerWidth };
}

export function useWindowDimensions(
  callback: UseWindowDimensionsCallback,
  { delay = 300 }: { delay?: number } = {},
): void {
  const onResize = useThrottledCallback(() => {
    callback(getWindowDimensions());
  }, delay);

  useEffect(() => {
    if (typeof window !== "undefined") {
      onResize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, [onResize]);
}

export function useProgress(springProps?: UseSpringProps, enabled: boolean = true) {
  const ref = useSpringRef();
  const spring = useSpring({
    ref,
    from: { progress: 0 },
    to: { progress: Number(enabled) },
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
    enabled?: boolean;
    onComplete?: () => void;
    props?: Parameters<typeof useProgress>[0];
  } = {},
) {
  const { duration = 1000, enabled = true } = options;

  const springs = steps.reduce<
    Record<
      (typeof steps)[number][1],
      ReturnType<typeof useProgress>
    >
  >((springs, [, name, props = {}], index) => {
    const props_ = { ...options.props, ...props };
    return ({
      ...springs,
      /* eslint-disable react-hooks/rules-of-hooks */
      [name]: useProgress(
        index === steps.length - 1
          ? { ...props_, onRest: () => options.onComplete?.() }
          : props_,
        enabled,
      ),
      /* eslint-enable react-hooks/rules-of-hooks */
    });
  }, {});

  useChain(
    steps.map(([, name]) => springs[name].ref),
    steps.map(([value]) => value),
    duration,
  );

  return springs;
}

export function useExplorerBaseUrl(chainId?: number) {
  const ready = useReady();
  const { chain, chains } = useNetwork();

  if (!ready) {
    return undefined;
  }

  chainId ??= chain?.id;

  if (chainId === 1) {
    return "https://etherscan.io";
  }

  const chain_ = chains.find((chain) => chain.id === chainId);
  return chain_?.blockExplorers?.etherscan.url ?? undefined;
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

export function useResetScroll(dependencies: unknown[] = []) {
  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    }, 0);
    return () => clearTimeout(id);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, dependencies);
}

export function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
