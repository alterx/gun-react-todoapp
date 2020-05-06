import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useGunCollectionState } from '../utils/hooks.js';
import { Footer } from '../components/Footer.js';

export const MainView = ({ appKeys, user, SEA }) => {
  // Profile information
  const sharedResourceRootNodeName = 'todolist';
  const appName = 'todomvc';
  let history = useHistory();
  const [todolists, { updateInSet }] = useGunCollectionState(
    user.get(appName).get('todolists'),
    { appKeys, SEA, route: 'main' },
  );
  const [nowShowing, setNowShowing] = useState('active');
  const todoKeyArray = Object.keys(todolists);

  const changeStatus = async (list, status) => {
    const { nodeID } = list;
    await updateInSet(nodeID, { ...list, status });
  };

  let todoList = todoKeyArray.map((k) => todolists[k]);
  let activeListCount = todoList.filter(({ status }) => status === 'active')
    .length;

  todoList = todoList.filter(({ status }) => status === nowShowing);

  return (
    <div className="todoapp" id="app">
      <button
        className="new-list"
        onClick={() => {
          history.push('/detail');
        }}
      >
        Create List
      </button>
      <h2>My Lists</h2>
      <ul className="todo-list lists">
        {todoList.map((list) => (
          <li
            key={list.nodeID}
            className="view"
            onClick={() => {
              const path = `/detail/${encodeURIComponent(
                list.id.replace(sharedResourceRootNodeName + '/', ''),
              )}`;
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
                  list.status === 'active' ? 'archived' : 'active',
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
