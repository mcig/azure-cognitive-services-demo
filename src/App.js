import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Speech from "./views/Speech";
import Search from "./views/Search";
import Decision from "./views/Decision";
import Vision from "./views/Vision";
import BACKGROUND from "./bg.png";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/speech">
          <Speech />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/decision">
          <Decision />
        </Route>
        <Route path="/vision">
          <Vision />
        </Route>
        <Route path="/">
          <div
            className="container"
            style={{ background: `url(${BACKGROUND}) round` }}
          >
            <Link
              to="/vision"
              className="welcomeButton"
              style={{
                backgroundColor: "	#2c4c3b",
                color: "white",
                marginLeft: "400px",
              }}
            >
              Vision API
            </Link>
            <Link
              to="/decision"
              className="welcomeButton"
              style={{
                backgroundColor: "	#306844",
                color: "white",
                marginRight: "400px",
              }}
            >
              Decision API
            </Link>
            <Link
              to="/speech"
              className="welcomeButton"
              style={{
                backgroundColor: "	#182c25",
                color: "white",
                marginLeft: "400px",
              }}
            >
              Speech API
            </Link>
            <Link
              to="/search"
              className="welcomeButton"
              style={{
                backgroundColor: "	#455b55",
                color: "white",
                marginRight: "400px",
              }}
            >
              Search API
            </Link>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
