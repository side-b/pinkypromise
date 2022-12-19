import type { FormEventHandler } from "react";
import type { Address, Log } from "./types";

import { useCallback, useMemo, useState } from "react";
import { placeholder } from "./placeholder";
import { SvgDoc } from "./SvgDoc";
import { SvgDocImg } from "./SvgDocImg";
import { blocksToHtml, isAddress, textToBlocks } from "./utils";

const placeholderData = placeholder();

export function Dev() {
  const [docHeight, setDocHeight] = useState(0);
  const [text, setText] = useState<string>(placeholderData.text);
  const [signees, setSignees] = useState<string[]>(placeholderData.signees);

  const validSignees = useMemo<Address[]>(() => (
    signees.filter(isAddress)
  ), [signees]);

  const html = useMemo(() => blocksToHtml(textToBlocks(text)), [text]);

  return (
    <div>
      <div css={{ position: "relative" }}>
        <SvgDoc
          height={docHeight}
          html={html}
          onHeight={setDocHeight}
          signees={validSignees}
        />
        <div css={{ position: "relative", overflow: "hidden" }}>
          <div
            css={{
              position: "absolute",
              top: "0",
              left: "0",
              visibility: "hidden",
            }}
          >
            <SvgDoc
              height={docHeight}
              html={html}
              onHeight={setDocHeight}
              signees={validSignees}
            />
          </div>
        </div>
        <SvgDocImg
          alt={text}
          height={docHeight}
          html={html}
          signees={validSignees}
        />
        <div
          css={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "20px",
          }}
        >
          <button type="submit">
            go
          </button>
        </div>
      </div>
    </div>
  );
}
