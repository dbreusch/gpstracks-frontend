// the GPS Tracks app
//
// uses AuthContext to globally manage user authentication status
// recognized routes depend on login status
// Navigation and routes wrapped by React Router

import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  // get global information from Context
  const { token, login, logout, userId } = useAuth();

  // define Routes based on login-status (via token)
  let routes;
  if (token) {  // logged in, show everything
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        {/* <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route> */}
        <Redirect to="/" />
      </Switch>
    );
  } else {  // not logged in, show unrestricted and Authenticate
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        {/* <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route> */}
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    // wrap with the Context for global sharing of data
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
    {/* wrap MainNavigation and Routes in the Router */}
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
