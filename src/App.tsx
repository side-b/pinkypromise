import { Route, Router, Switch } from "wouter";
import { CreatePromiseScreen } from "./CreatePromiseScreen";
import { DevScreen } from "./DevScreen";
import { GlobalStyles } from "./GlobalStyles";
import { Header } from "./Header";
import { HomeScreen } from "./HomeScreen";
import { PromiseScreen } from "./PromiseScreen";
import { PromisesScreen } from "./PromisesScreen";

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
                <DevScreen />
              </Route>
              <Route path="/">
                <HomeScreen />
              </Route>
              <Route path="/new">
                <CreatePromiseScreen />
              </Route>
              <Route path="/promise/:id">
                {({ id }: { id: string }) => <PromiseScreen id={id} />}
              </Route>
              <Route path="/promises">
                <PromisesScreen />
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
