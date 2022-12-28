import type { Address } from "./types";

import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { DOC_SHADOW_OFFSET, DOC_WIDTH } from "./constants";

export function SvgDoc({
  height,
  html,
  onHeight,
  signees,
  title,
  width = DOC_WIDTH,
}: {
  height: number;
  html: string;
  onHeight?: (height: number) => void;
  signees: Address[] | string;
  title?: string;
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

  const [backgroundColor, setBackgroundColor] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    const t = setInterval(() => {
      setBackgroundColor(v => ((v) % 4) + 1 as 1 | 2 | 3 | 4);
    });
    return () => clearInterval(t);
  }, []);

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
                  font-size: 26px;
                  font-weight: normal;
                }
                svg h2 {
                  margin: 24px 0;
                  line-height: 32px;
                  font-size: 22px;
                  font-weight: normal;
                }
              `
                .replace(/\n/g, "")
                .replace(/  /g, "")}
            </style>
            <div className="main">
              <div
                ref={contentRef}
                className="content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              {typeof signees === "string"
                ? signees
                : <SvgDocSignees signees={signees} />}
            </div>
          </>,
        )}
      </foreignObject>
    </svg>
  );
}

function SvgDocSignees({ signees }: { signees: Address[] }) {
  return (
    <div className="signees">
      <h2>Signees</h2>
      {signees.map((account) => <div key={account}>{account}</div>)}
    </div>
  );
}
