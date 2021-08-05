import React from 'react';
import { useAuth } from '@altrx/gundb-react-auth';

export default function LoginView() {
  const { login } = useAuth();
  async function getApp(type, value) {
    try {
      let keys;

      if (type !== 'new') {
        if (typeof value === 'string') {
          keys = JSON.parse(value);
        } else {
          keys = value;
        }
      }
      login(keys);
    } catch (e) {}
  }

  return (
    <div className="todoapp" id="splash">
      <h1 id="appName">TODOs App</h1>
      <button
        className="new-list"
        onClick={(e) => {
          getApp('new');
        }}
      >
        New user
      </button>
      <h2>Already have one?</h2>
      <input
        className="new-todo"
        onChange={(e) => {
          const { target } = e;
          getApp('existing', target.value);
        }}
        placeholder="Paste keys here"
      />
    </div>
  );
}
