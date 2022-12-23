import { useEffect, useRef, useState } from "react";

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
