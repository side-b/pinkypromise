import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import { Breakpoint } from "../components/Breakpoint";
import { Ethereum } from "../components/Ethereum";
import { FocusVisible } from "../components/FocusVisible";
import { GlobalStyles } from "../components/GlobalStyles";
import { Header } from "../components/Header";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pinky Promise</title>
        <meta
          name="description"
          content="Onchain accountability from jolly commitments between friends and foes"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="Pinky Promise" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="data:," />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Ethereum>
          <Breakpoint>
            <FocusVisible>
              <GlobalStyles>
                <div
                  css={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    minWidth: 360,
                  }}
                >
                  <div
                    css={{
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <Header />
                  </div>
                  <div
                    css={{
                      flexGrow: 1,
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Component {...pageProps} />
                  </div>
                </div>
              </GlobalStyles>
            </FocusVisible>
          </Breakpoint>
        </Ethereum>
      </QueryClientProvider>
    </>
  );
}
