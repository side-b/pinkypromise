import type { ComponentPropsWithoutRef } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { SvgDoc } from "./SvgDoc";

export const DOC_WIDTH = 800;

export function SvgDocImg({ alt, ...props }: {
  alt: string;
} & ComponentPropsWithoutRef<typeof SvgDoc>) {
  return (
    <img
      alt={alt}
      src={`data:image/svg+xml;charset=UTF-8,${
        encodeURIComponent(renderToStaticMarkup(<SvgDoc {...props} />))
      }`}
      width={DOC_WIDTH}
      css={{
        display: "block",
        width: "100%",
        height: "auto",
      }}
    />
  );
}
