import React from 'react';
import { MainView } from './views/MainView';
import { DetailView } from './views/DetailView';
import { ProfileView } from './views/ProfileView';
import { Switch, Route } from 'react-router-dom';

function AuthenticatedApp() {
  return (
    <Switch>
      <Route exact path="/">
        <MainView />
      </Route>
      <Route path="/detail/:listID?">
        <DetailView />
      </Route>
      <Route path="/profile">
        <ProfileView />
      </Route>
    </Switch>
  );
}

export default AuthenticatedApp;
