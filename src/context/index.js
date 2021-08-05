import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Gun from 'gun';
import sea from 'gun/sea';
import { GunProvider } from '@altrx/gundb-react-auth';
import { GunSpawnerProvider } from './gunSpawnerContext';

const peers = ['https://gun-us.herokuapp.com/gun'];

const AppProviders = ({ children }) => {
  return (
    <Router>
      <GunProvider peers={peers} sea={sea} Gun={Gun} keyFieldName="todoKeys">
        <GunSpawnerProvider peers={peers} Gun={Gun}>
          {children}
        </GunSpawnerProvider>
      </GunProvider>
    </Router>
  );
};

export { AppProviders };
