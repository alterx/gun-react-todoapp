import React from 'react';
import { MainView } from './views/MainView';
import { DetailView } from './views/DetailView';
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
    </Switch>
  );
}

export default AuthenticatedApp;
