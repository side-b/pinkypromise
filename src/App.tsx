import { Route, Router, Switch } from "wouter";
import { CreatePromise } from "./CreatePromise";
import { Dev } from "./Dev";
import { GlobalStyles } from "./GlobalStyles";
import { Header } from "./Header";
import { Home } from "./Home";
import { Pact } from "./Pact";
import { Promises } from "./Promises";

export function App() {
  return (
    <GlobalStyles>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: "1140px",
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
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Router>
            <Switch>
              <Route path="/dev">
                <Dev />
              </Route>
              <Route path="/">
                <Home />
              </Route>
              <Route path="/new">
                <CreatePromise />
              </Route>
              <Route path="/promises/:address">
                {({ address }: { address: string }) => <Promises address={address} />}
              </Route>
              <Route path="/promise/:pactId">
                {({ pactId }: { pactId: string }) => <Pact pactId={pactId} />}
              </Route>
              <Route>
                <div>
                  Not found
                </div>
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </GlobalStyles>
  );
}
