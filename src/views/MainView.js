import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useGunCollectionState } from '@altrx/gundb-react-hooks';
import { useAuth } from '@altrx/gundb-react-auth';
import { Footer } from '../components/Footer.js';

export const MainView = () => {
  const { appKeys, user, sea } = useAuth();
  // Profile information
  const appName = 'todomvc';
  let history = useHistory();
  const { collection: todolists, updateInSet } = useGunCollectionState(
    user.get(appName).get('todolists'),
    { appKeys, sea }
  );

  const [nowShowing, setNowShowing] = useState('active');

  const changeStatus = async (list, status) => {
    const { nodeID } = list;
    await updateInSet(nodeID, { ...list, status });
  };

  let todoList = Array.from(todolists.values());
  let activeListCount = todoList.filter(
    ({ status }) => status === 'active'
  ).length;

  todoList = todoList.filter(({ status }) => status === nowShowing);

  return (
    <div className="todoapp">
      <button
        className="new-list"
        onClick={() => {
          history.push('/detail');
        }}
      >
        Create List
      </button>
      <button
        style={{ margin: '0 auto', display: 'block', padding: '10px 0 0 0' }}
        onClick={() => {
          history.push('/profile');
        }}
      >
        View profile
      </button>
      <h2>My Lists</h2>
      <ul className="todo-list lists">
        {todoList.map((list) => (
          <li
            key={list.nodeID}
            className="view"
            onClick={() => {
              const path = `/detail/${encodeURIComponent(list.id)}`;
              history.push(path);
            }}
          >
            <label>{list.name}</label>
            <button
              className="archive"
              onClick={(e) => {
                e.stopPropagation();
                changeStatus(
                  list,
                  list.status !== 'archived' ? 'archived' : 'active'
                );
              }}
            >
              {list.status === 'active' && <i className="gg-box"></i>}
              {list.status === 'archived' && <i className="gg-undo"></i>}
            </button>
          </li>
        ))}
      </ul>
      <Footer
        activeListCount={activeListCount}
        nowShowing={nowShowing}
        setNowShowing={setNowShowing}
      />
    </div>
  );
};
