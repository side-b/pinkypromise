import type { Address } from "./types";

import { createElement, useEffect, useRef } from "react";
import { DOC_SHADOW_OFFSET, DOC_WIDTH } from "./constants";

export function SvgDoc({
  height,
  html,
  onHeight,
  signees,
  width = DOC_WIDTH,
}: {
  height: number;
  html: string;
  onHeight?: (height: number) => void;
  signees: Address[];
  width?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onHeight) {
      return;
    }

    const docPadding = 40 + DOC_SHADOW_OFFSET;
    const contentHeight = contentRef.current?.clientHeight ?? 0;
    const signeesHeight = 80 + 28 * signees.length;

    onHeight(contentHeight + docPadding + signeesHeight);
  }, [html, onHeight, signees]);

  height = Math.max(DOC_WIDTH, height);

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${DOC_WIDTH} ${height}`}
    >
      <foreignObject x="0" y="0" width={DOC_WIDTH} height={height}>
        {createElement(
          "div",
          // createElement() accepts the xmlns prop while the JSX types complain, so we use createElement()
          { className: "root", xmlns: "http://www.w3.org/1999/xhtml" },
          <>
            <style>
              {`
                svg * {
                  box-sizing: border-box;
                }
                svg .root {
                  height: ${height}px;
                  padding: 0 ${DOC_SHADOW_OFFSET}px ${DOC_SHADOW_OFFSET}px 0;
                }
                svg .main {
                  position: relative;
                  height: ${height - DOC_SHADOW_OFFSET}px;
                  padding: 10px 40px 30px;
                  font: 18px/28px "Courier New", monospace;
                  color: #333;
                  background: #FFF;
                  box-shadow: ${DOC_SHADOW_OFFSET}px ${DOC_SHADOW_OFFSET}px #333;
                }
                svg .content {
                  overflow: hidden;
                }
                svg .signees {
                  overflow: hidden;
                }
                svg p {
                  margin: 24px 0;
                }
                svg h1 {
                  position: relative;
                  margin: 32px 0;
                  padding-bottom: 5px;
                  line-height: 36px;
                  font-size: 24px;
                  font-weight: normal;
                }
                svg h1:after {
                  content: "";
                  position:absolute;
                  inset: auto 0 0;
                  height: 2px;
                  background: #333;
                }
                svg h2 {
                  margin: 24px 0;
                  line-height: 32px;
                  font-size: 22px;
                  font-weight: normal;
                }
              `}
            </style>
            <div className="main">
              <div
                ref={contentRef}
                className="content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <div className="signees">
                <h2>Signees</h2>
                {signees.map((account) => (
                  <div key={account}>{account}</div>
                ))}
              </div>
            </div>
          </>,
        )}
      </foreignObject>
    </svg>
  );
}
