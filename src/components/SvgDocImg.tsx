import type { ComponentPropsWithoutRef } from "react";

import Image from "next/image";
import { renderToStaticMarkup } from "react-dom/server";
import { SvgDoc } from "./SvgDoc";

export const DOC_WIDTH = 800;

export function SvgDocImg({ alt, ...props }: {
  alt: string;
} & ComponentPropsWithoutRef<typeof SvgDoc>) {
  return (
    <div
      css={{
        display: "flex",
        "img": {
          display: "block",
          width: "100%",
          height: "auto",
        },
      }}
    >
      <Image
        alt={alt}
        src={`data:image/svg+xml;charset=UTF-8,${
          encodeURIComponent(renderToStaticMarkup(<SvgDoc {...props} />))
        }`}
        width={DOC_WIDTH}
      />
    </div>
  );
}
