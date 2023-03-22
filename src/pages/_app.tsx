import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import { Ethereum } from "../components/Ethereum";
import { FocusVisible } from "../components/FocusVisible";
import { GlobalStyles } from "../components/GlobalStyles";
import { Header } from "../components/Header";

// import { CreatePromiseScreen } from "../components/CreatePromiseScreen";
// import { HomeScreen } from "../components/HomeScreen";
// import { NotFoundScreen } from "../components/NotFoundScreen";
// import { PromiseScreen } from "../components/PromiseScreen";
// import { PromisesScreen } from "../components/PromisesScreen";

// function pageFromParams(params: { page?: string }) {
//   const page = Math.max(parseInt(params.page ?? "", 10), 1);
//   return isNaN(page) ? 1 : page;
// }

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pinky Promise</title>
        <meta name="description" content="Onchain promises" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="data:," />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Ethereum>
          <FocusVisible>
            <GlobalStyles>
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                  minWidth: 1140,
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
        </Ethereum>
      </QueryClientProvider>
    </>
  );
}

// <Router>
//   <Switch>
//     <Route path="/">
//       <HomeScreen />
//     </Route>
//     <Route path="/new">
//       <CreatePromiseScreen />
//     </Route>
//     <Route path="/promises/:page?">
//       {(p) => <PromisesScreen page={pageFromParams(p)} />}
//     </Route>
//     <Route path="/mine/:page?">
//       {(p) => (
//         <PromisesScreen
//           page={pageFromParams(p)}
//           mineOnly={true}
//         />
//       )}
//     </Route>
//     <Route path="/promise/:prefix-:id/:action?">
//       {(p) => (
//         <PromiseScreen
//           action={p.action ?? ""}
//           id={`${p.prefix}-${p.id}` ?? ""}
//         />
//       )}
//     </Route>
//     <Route path="/dev">
//       <DevScreen />
//     </Route>
//     <Route>
//       <NotFoundScreen />
//     </Route>
//   </Switch>
// </Router>
