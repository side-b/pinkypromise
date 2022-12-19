import { Route, Router, Switch } from "wouter";
import { CreatePromise } from "./CreatePromise";
import { Dev } from "./Dev";
import { GlobalStyles } from "./GlobalStyles";
import { Header } from "./Header";
import { Home } from "./Home";
import { Pact } from "./Pact";
import { Pacts } from "./Pacts";

export function App() {
  return (
    <GlobalStyles>
      <div>
        <Header />
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
    </GlobalStyles>
  );
}
