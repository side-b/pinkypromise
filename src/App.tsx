import { Route, Router, Switch } from "wouter";
import { CreatePromise } from "./CreatePromise";
import { Dev } from "./Dev";
import { GlobalStyles } from "./GlobalStyles";
import { Home } from "./Home";
import { Pact } from "./Pact";
import { Pacts } from "./Pacts";

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
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
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
              <Route path="/pacts/:address">
                {({ address }: { address: string }) => <Pacts address={address} />}
              </Route>
              <Route path="/pact/:pactId">
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
