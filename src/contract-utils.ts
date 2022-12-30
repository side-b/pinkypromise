import type { Log } from "./types";

import { utils as ethersUtils } from "ethers";
import { PinkyPromiseAbi } from "./abis";

export function promiseIdFromTxLogs(logs: Log[]): string | null {
  const PinkyPromiseInterface = new ethersUtils.Interface(PinkyPromiseAbi);
  const draftUpdateEvent = logs
    .map((log: Log) => PinkyPromiseInterface.parseLog(log))
    .find(event => event.name === "PromiseUpdate" && event.args.state === 1);

  return draftUpdateEvent?.args.promiseId?.toString() ?? null;
}
