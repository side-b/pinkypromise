import type { Address, ColorId } from "./types";

import { useMemo } from "react";
import { COLORS, footerImageUrl, PLACEHOLDER_BODY, PLACEHOLDER_TITLE } from "./constants";
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
          padding: "16px 24px 0",
          font: "400 16px/1.5 'Courier New', monospace",
        }}
      >
        <h1 css={{ fontSize: "26px" }}>
          {title || PLACEHOLDER_TITLE}
        </h1>
        <div
          css={{
            paddingTop: "46px",
            fontSize: "18px",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
        <div
          css={{
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
            display: "flex",
            justifyContent: "center",
            padding: "88px 0 40px",
          }}
        >
          <img src={footerImageUrl(color)} alt="" width="64" height="64" />
        </div>
      </div>
    </Container>
  );
}
