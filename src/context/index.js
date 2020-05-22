import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GunProvider } from './gunContext';

const AppProviders = ({ children }) => {
  return (
    <Router>
      <GunProvider>{children}</GunProvider>
    </Router>
  );
};

export { AppProviders };
