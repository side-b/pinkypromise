import type { ReactNode } from "react";

import dynamic from "next/dynamic";

function NoSsrWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const NoSsr = dynamic(
  () => Promise.resolve(NoSsrWrapper),
  { ssr: false },
);
