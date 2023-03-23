import { useAccount as useAccountWagmi } from "wagmi";
import { useReady } from "./react-utils";

const accountDefault: ReturnType<typeof useAccountWagmi> = {
  address: undefined,
  connector: undefined,
  isConnected: false,
  isConnecting: false,
  isDisconnected: true,
  isReconnecting: false,
  status: "disconnected",
};

export function useAccount() {
  const accountWagmi = useAccountWagmi();
  return useReady() ? accountWagmi : accountDefault;
}
