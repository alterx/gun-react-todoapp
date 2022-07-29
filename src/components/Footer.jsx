import React from 'react';

export const Footer = ({
  activeListCount = 0,
  nowShowing = 'active',
  setNowShowing,
}) => {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeListCount}</strong> active list(s)
      </span>
      <ul className="filters">
        <li onClick={() => setNowShowing('active')}>
          <a
            href="#/active"
            className={nowShowing === 'active' ? 'selected' : ''}
          >
            Active
          </a>
        </li>{' '}
        <li onClick={() => setNowShowing('archived')}>
          <a
            href="#/archived"
            className={nowShowing === 'archived' ? 'selected' : ''}
          >
            Archived
          </a>
        </li>{' '}
        <li onClick={() => setNowShowing('readonly')}>
          <a
            href="#/readOnly"
            className={nowShowing === 'readonly' ? 'selected' : ''}
          >
            Read-Only
          </a>
        </li>
      </ul>
    </footer>
  );
};
