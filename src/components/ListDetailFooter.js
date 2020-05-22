import React from 'react';

export const ListDetailFooter = ({
  activeTodoCount = 0,
  nowShowing = 'all',
  setNowShowing,
}) => {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeTodoCount}</strong> item(s) left
      </span>
      <ul className="filters">
        <li onClick={setNowShowing.bind(this, 'all')}>
          <a href="#/" className={nowShowing === 'all' ? 'selected' : ''}>
            All
          </a>
        </li>{' '}
        <li onClick={setNowShowing.bind(this, 'active')}>
          <a
            href="#/active"
            className={nowShowing === 'active' ? 'selected' : ''}
          >
            Active
          </a>
        </li>{' '}
        <li onClick={setNowShowing.bind(this, 'completed')}>
          <a
            href="#/completed"
            className={nowShowing === 'completed' ? 'selected' : ''}
          >
            Completed
          </a>
        </li>
      </ul>
    </footer>
  );
};
