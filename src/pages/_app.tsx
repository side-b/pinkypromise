import type { AppContext, AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import { Breakpoint } from "../components/Breakpoint";
import { Ethereum } from "../components/Ethereum";
import { FocusVisible } from "../components/FocusVisible";
import { GlobalStyles } from "../components/GlobalStyles";
import { Header } from "../components/Header";
import { TAGLINE } from "../constants";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps,
  host,
}: AppProps & { host: "string" }) {
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = host ? `${protocol}://${host}` : "";
  return (
    <>
      <Head>
        <title>Pinky Promise</title>
        <meta name="description" content={`${TAGLINE}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="data:," />

        <meta property="og:site_name" content="Pinky Promise" />
        <meta property="og:title" content="Pinky Promise" />
        <meta property="og:description" content={`${TAGLINE}.`} />
        <meta name="twitter:title" content="Pinky Promise" />
        <meta name="twitter:description" content={`${TAGLINE}.`} />

        <meta name="twitter:image:src" content={`${baseUrl}/pinky-promise.png`} />
        <meta property="og:image" content={`${baseUrl}/pinky-promise.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />

        <meta name="twitter:site" content="@pinkypromise_gg" />
        <meta name="twitter:card" content="summary_large_image" />
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

App.getInitialProps = async ({ ctx }: AppContext) => {
  const host = ctx.req?.headers.host;
  return { host };
};
