import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { REACT_STRICT } from "./environment";
import { Ethereum } from "./Ethereum";

const queryClient = new QueryClient();

const tree = (
  <QueryClientProvider client={queryClient}>
    <Ethereum>
      <App />
    </Ethereum>
  </QueryClientProvider>
);

ReactDOM
  .createRoot(document.getElementById("root") as HTMLElement)
  .render(REACT_STRICT ? <React.StrictMode>{tree}</React.StrictMode> : tree);
