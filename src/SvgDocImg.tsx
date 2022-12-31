import type { ComponentPropsWithoutRef } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { DOC_WIDTH } from "./constants";
import { SvgDoc } from "./SvgDoc";

export function SvgDocImg({ alt, ...props }: { alt: string } & ComponentPropsWithoutRef<typeof SvgDoc>) {
  const src = "data:image/svg+xml" + encodeURIComponent(
    renderToStaticMarkup(<SvgDoc {...props} />),
  );
  return (
    <img
      alt={alt}
      src={src}
      width={DOC_WIDTH}
      css={{
        display: "block",
        width: "100%",
        height: "auto",
      }}
    />
  );
}
