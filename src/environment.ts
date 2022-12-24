export const NETWORKS = (import.meta.env.VITE_NETWORKS ?? "").split(",");
export const INFURA_KEY = import.meta.env.VITE_INFURA_KEY ?? "";
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS ?? "";
export const REACT_STRICT = (import.meta.env.VITE_REACT_STRICT ?? "true").trim() !== "false";
