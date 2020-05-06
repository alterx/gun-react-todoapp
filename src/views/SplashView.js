import React from 'react';

export const SplashView = ({ initApp }) => {
  const getApp = async (type, { target } = {}) => {
    try {
      let value = null;
      let keys = null;
      value = target.value;
      target.value = '';

      if (type !== 'new') {
        if (typeof value === 'string') {
          keys = JSON.parse(value);
        } else {
          keys = value;
        }
      }
      initApp(keys);
    } catch (e) {}
  };

  return (
    <div className="todoapp" id="splash">
      <h1 id="appName">TODOs App</h1>
      <button className="new-list" onClick={getApp.bind(this, 'new')}>
        New user
      </button>
      <h2>Already have one?</h2>
      <input
        className="new-todo"
        onChange={getApp.bind(this, 'existing')}
        placeholder="Paste keys here"
      />
    </div>
  );
};
