import React from "react";
import {BrowserRouter as Router,Route,Redirect,Switch,} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces"
import MainNavigation from "./shared/components/Navigation/MainNavigation"
const App = () => {
  return (
    <Router>
    <MainNavigation/> {/*MainNavigation will be render on all path since its outside of the switch  */}
      <main>        {/* The main tag is the main content of the document  */}
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
        <UserPlaces/>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Redirect to="/" />
      </Switch>
      </main>
    </Router>
  );
};

export default App;
