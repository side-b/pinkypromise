import type { Address, Log } from "./types";

import { useMemo, useState } from "react";
import { COLORS, PLACEHOLDER_BODY, PLACEHOLDER_TITLE } from "./constants";
import { SvgDoc } from "./SvgDoc";
import { blocksToHtml, isAddress, textToBlocks } from "./utils";

export function Dev() {
  const [docHeight, setDocHeight] = useState(0);
  const [body] = useState<string>(PLACEHOLDER_BODY);
  const [title] = useState<string>(PLACEHOLDER_TITLE);
  const [signees] = useState<string[]>([
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x8F6F4ce6aB8827279cffFb92266f39Fd6e51aad8",
    "0xB8827279cffFb92266f39Fd6e51aad88F6F4ce6a",
  ]);

  const validSignees = useMemo<Address[]>(() => (
    signees.filter(isAddress)
  ), [signees]);

  const bodyHtml = useMemo(() => (
    blocksToHtml(textToBlocks(body))
  ), [body]);

  return (
    <div>
      <div
        css={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          padding: "16px 0 64px",
        }}
      >
        <SvgDoc
          bodyHtml={bodyHtml}
          color={COLORS.blue}
          height={docHeight}
          onHeight={setDocHeight}
          signees={validSignees}
          title={title}
        />
      </div>
    </div>
  );
}
