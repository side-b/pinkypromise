import { Route, Router, Switch } from "wouter";
import { CreatePromiseScreen } from "./CreatePromiseScreen";
import { DevScreen } from "./DevScreen";
import { FocusVisible } from "./FocusVisible";
import { GlobalStyles } from "./GlobalStyles";
import { Header } from "./Header";
import { HomeScreen } from "./HomeScreen";
import { NftScreen } from "./NftScreen";
import { NotFoundScreen } from "./NotFoundScreen";
import { PromiseScreen } from "./PromiseScreen";
import { PromisesScreen } from "./PromisesScreen";

function pageFromParams(params: { page?: string }) {
  const page = Math.max(parseInt(params.page ?? "", 10), 1);
  return isNaN(page) ? 1 : page;
}

export function App() {
  return (
    <FocusVisible>
      <GlobalStyles>
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            minWidth: "1140px",
          }}
        >
          <div css={{ position: "relative", zIndex: 2 }}>
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
            <Router>
              <Switch>
                <Route path="/">
                  <HomeScreen />
                </Route>
                <Route path="/new">
                  <CreatePromiseScreen />
                </Route>
                <Route path="/promises/:page?">
                  {(p) => <PromisesScreen page={pageFromParams(p)} />}
                </Route>
                <Route path="/mine/:page?">
                  {(p) => (
                    <PromisesScreen
                      page={pageFromParams(p)}
                      mineOnly={true}
                    />
                  )}
                </Route>
                <Route path="/promise/:prefix-:id/:action?">
                  {(p) => (
                    <PromiseScreen
                      action={p.action ?? ""}
                      id={`${p.prefix}-${p.id}` ?? ""}
                    />
                  )}
                </Route>
                <Route path="/nft/:id">{(p) => <NftScreen id={p.id ?? ""} />}</Route>
                <Route path="/dev">
                  <DevScreen />
                </Route>
                <Route>
                  <NotFoundScreen />
                </Route>
              </Switch>
            </Router>
          </div>
        </div>
      </GlobalStyles>
    </FocusVisible>
  );
}
