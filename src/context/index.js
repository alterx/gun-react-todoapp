import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Gun from 'gun';
import sea from 'gun/sea';
import { GunProvider } from '@altrx/gundb-react-auth';

const asyncFn =
  (fn) =>
  (...args) => {
    return new Promise((resolve) => {
      resolve(fn.call(this, ...args));
    });
  };

const storage = {
  setItem: asyncFn(localStorage.setItem.bind(localStorage)),
  getItem: asyncFn(localStorage.getItem.bind(localStorage)),
  removeItem: asyncFn(localStorage.removeItem.bind(localStorage)),
};

const peers = ['https://gun-us.herokuapp.com/gun'];

const AppProviders = ({ children }) => {
  return (
    <Router>
      <GunProvider
        peers={peers}
        sea={sea}
        Gun={Gun}
        keyFieldName="todoKeys"
        storage={storage}
      >
        {children}
      </GunProvider>
    </Router>
  );
};

export { AppProviders };
