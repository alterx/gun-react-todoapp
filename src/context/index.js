import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Gun from 'gun';
import sea from 'gun/sea';
import { GunProvider } from '@altrx/gundb-react-auth';

const peers = ['https://gun-us.herokuapp.com/gun'];

const AppProviders = ({ children }) => {
  return (
    <Router>
      <GunProvider peers={peers} sea={sea} Gun={Gun} keyFieldName="todoKeys">
        {children}
      </GunProvider>
    </Router>
  );
};

export { AppProviders };
