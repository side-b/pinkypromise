import type { Log } from "./types";

import { utils as ethersUtils } from "ethers";
import { PinkySwearPactsAbi } from "./abis";

export function promiseIdFromTxLogs(logs: Log[]): string | null {
  const PinkySwearPactsInterface = new ethersUtils.Interface(PinkySwearPactsAbi);
  const draftUpdateEvent = logs
    .map((log: Log) => PinkySwearPactsInterface.parseLog(log))
    .find(event => event.name === "PactUpdate" && event.args.state === 1);

  return draftUpdateEvent?.args.pactId?.toString() ?? null;
}
