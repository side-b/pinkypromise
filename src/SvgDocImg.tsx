import { renderToStaticMarkup } from "react-dom/server";
import { DOC_WIDTH } from "./constants";
import { SvgDoc } from "./SvgDoc";

export function SvgDocImg(
  {
    alt,
    height,
    html,
    signees,
  }: {
    alt: string;
    height: number;
    html: string;
    signees: [string, boolean][];
  },
) {
  return (
    <img
      alt={alt}
      src={`data:image/svg+xml,${
        encodeURIComponent(
          renderToStaticMarkup(
            <SvgDoc
              height={height}
              html={html}
              signees={signees}
            />,
          ),
        )
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
