import { Route, Router, Switch } from "wouter";
import { ConnectButton } from "./ConnectButton";
import { CreatePromise } from "./CreatePromise";
import { GlobalStyles } from "./GlobalStyles";
import { Home } from "./Home";
import { Pact } from "./Pact";

export function App() {
  return (
    <GlobalStyles>
      <div>
        <div
          css={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "20px 20px 0 0",
          }}
        >
          <ConnectButton />
        </div>
        <Router>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
            <Route path="/new">
              <CreatePromise />
            </Route>
            <Route path="/pact/:pactId">
              {({ pactId }: { pactId: string }) => (
                <Pact pactId={pactId} />
              )}
            </Route>
            <Route>
              <div>
                Not found
              </div>
            </Route>
          </Switch>
        </Router>
      </div>
    </GlobalStyles>
  );
}
