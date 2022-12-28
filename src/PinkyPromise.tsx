import type { Address, ColorId } from "./types";

import { useMemo } from "react";
import { COLORS, PLACEHOLDER_BODY, PLACEHOLDER_TITLE } from "./constants";
import { Container } from "./Container";
import { EthIcon } from "./EthIcon";
import { blocksToHtml, textToBlocks } from "./utils";

import zigzag from "./zigzag.svg";

export function PinkyPromise({
  body,
  color,
  signees,
  title,
}: {
  color: ColorId;
  body?: string;
  signees: Address[];
  title?: string;
}) {
  const bodyHtml = useMemo(() => blocksToHtml(textToBlocks(body || PLACEHOLDER_BODY)), [body]);
  return (
    <Container>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          minHeight: "640px",
          padding: "16px 24px 0",
          font: "400 16px/1.5 'Courier New', monospace",
        }}
      >
        <h1
          css={{
            flexGrow: "0",
            flexShrink: "0",
            fontSize: "26px",
          }}
        >
          {title || PLACEHOLDER_TITLE}
        </h1>
        <div
          css={{
            flexGrow: "1",
            flexShrink: "0",
            paddingTop: "46px",
            fontSize: "18px",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
        <div
          css={{
            flexGrow: "0",
            flexShrink: "0",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingTop: "120px",
          }}
        >
          {signees.map(signee => (
            <div
              key={signee}
              css={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "space-between",
                height: "64px",
                padding: "0 16px",
                border: `2px solid ${COLORS[color]}`,
                borderRadius: "20px",
              }}
            >
              <div css={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <EthIcon
                  address={signee}
                  round={true}
                  size={40}
                />
                <div>{signee}</div>
              </div>
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "80px",
                  height: "40px",
                  background: COLORS[color],
                  borderRadius: "64px",
                }}
              >
                <img alt="" height="19" src={zigzag} width="60" />
              </div>
            </div>
          ))}
        </div>
        <div
          css={{
            flexGrow: "0",
            flexShrink: "0",
            display: "flex",
            justifyContent: "center",
            padding: "88px 0 40px",
          }}
        >
          <img
            alt=""
            height="64"
            src={footerImageUrl(color)}
            width="64"
          />
        </div>
      </div>
    </Container>
  );
}

function footerImageUrl(color: ColorId) {
  return "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"65\" height=\"64\" fill=\"none\">"
      + "<mask id=\"a\" width=\"64\" height=\"64\" x=\"1\" y=\"0\" maskUnits=\"userSpaceOnUse\" style=\"mask-type:alpha\">"
      + "<circle cx=\"32.899\" cy=\"32\" r=\"31.631\" fill=\"#fff\"/>"
      + "</mask>"
      + "<g mask=\"url(#a)\">"
      + "<circle cx=\"32.898\" cy=\"31.999\" r=\"32\" fill=\"" + COLORS.grey + "\"/>"
      + "<path fill=\"" + COLORS[color] + "\" stroke=\"" + COLORS[color]
      + "\" stroke-width=\"1.5\" d=\"m33.69 54.298-5.902 14.097S13.205 64.664 7.024 58.008C.508 50.99-1.883 35.114-1.883 35.114c.633-.565 2.098-1.802 2.899-2.226 1.001-.53 2.371-.582 3.425-.424 1.054.16 3.162.848 4.69 6.148.088-.195.517-.732 1.529-1.325 1.265-.742 2.371-1.272 4.11-.848 1.74.424 1.792 1.166 2.688 2.173.896 1.007 1.423 4.133 1.845 9.645-.018 1.307.2 4.176 1.212 5.193 1.827-2.19 5.776-7.398 6.956-10.705 2.412-5.697 1.581-4.292 4.322-10.28.193-1.149 1.317-3.562 1.107-5.724-.264-2.703.046-9.088.79-10.705.745-1.616 2.51-1.895 3.096-1.756.587.14 2.418 1.1 2.853 4.373.562 3.692 1.271 13.059-.626 21.284L33.69 54.298Z\"/>"
      + "<path fill=\"" + COLORS.grey
      + "\" stroke=\"" + COLORS[color]
      + "\" stroke-width=\"1.5\" d=\"M37.513 20.84c-.704-.75-1.293-.758-1.08-6.333 0 0 1.586-.064 2.507 1.528s.969 5.547.969 5.547c-.603.117-1.783-.088-2.396-.742Z\"/>"
      + "<path stroke=\"" + COLORS.grey
      + "\" stroke-width=\"1.5\" d=\"M8.993 39.434s-.214 3.94-.526 6.996c-.385 3.768-1.238 9.619-1.238 9.619M20.534 53.398c-.864 2.607-1.555 6.438-1.792 8.028\"/>"
      + "<path fill=\"" + COLORS.grey
      + "\" stroke=\"" + COLORS[color]
      + "\" stroke-width=\"1.5\" d=\"M35.798 62.619c.843 3.9 1.054 5.494 1.265 5.882 13.608-2.834 19.51-6.78 26.666-18.548l-1.475-2.65-2.319-3.179c-.527-.954-1.96-3.2-3.478-4.558-1.518-1.356-4.568-.565-5.903 0-.562.177-1.981 1.103-3.162 3.392-1.475 2.862-.948 3.074-1.792 4.346-.843 1.271-1.264.953-2.213 0-.949-.954-2.003-3.392-4.321-6.572-1.855-2.543-2.53-3.886-2.635-4.24-1.054-2.19-2.358-5.641-2.938-9.472-.476-3.137.105-4.8 0-7.873-.085-2.46-.535-4.411-.66-4.82-.513-1.682-1.12-2.517-2.305-2.795-2.644-.62-5.48 3.365-5.89 6.625-.13 1.308-1.889 9.263.725 16.64 3.268 9.221 4.533 9.592 6.22 13.514 2.318 4.875 3.161 9.432 4.215 14.308Z\"/>"
      + "<path fill=\"" + COLORS.grey
      + "\" d=\"M55.924 39.208s.953-5.443 3.636-6.756c1.916-.938 3.325-.081 5.455-.133 0-2.332 1.475-2.932 2.213-2.941.45 2.726.444 4.249.237 6.969-.444 5.858-1.334 8.784-3.715 13.566l-2.082-3.378-2.081-2.928-3.663-4.399Z\"/>"
      + "<path stroke=\"" + COLORS[color]
      + "\" stroke-width=\"1.5\" d=\"M65.015 32.32c-2.13.05-3.54-.806-5.455.132-2.683 1.313-3.636 6.756-3.636 6.756l3.663 4.399 2.081 2.928 2.082 3.378c2.381-4.782 3.27-7.708 3.715-13.566m-2.45-4.028 2.45 4.028m-2.45-4.028c0-2.332 1.475-2.932 2.213-2.941.45 2.726.444 4.249.237 6.969M49.54 49.813s1.72 2.675 3.374 4.585m3.827 4.14s-2.416-2.51-3.827-4.14m0 0c-3.242.887-4.814.304-7.28-2.434\"/>"
      + "<path fill=\"" + COLORS.grey
      + "\" stroke=\"" + COLORS[color]
      + "\" stroke-width=\"1.5\" d=\"M28.889 16.55c1.298-1.483 1.324-3.972 1.175-5.03-.168-.133-2.098.344-3.539 2.34-1.089 1.51-1.63 4.143-1.63 4.143.14-.031 2.371.403 3.994-1.452Z\"/>"
      + "</g>"
      + "</svg>",
  );
}
