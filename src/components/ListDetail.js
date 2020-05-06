import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import { useGunState, useGunCollectionState } from '../utils/hooks.js';
import { TodoList } from './TodoList.js';
import { DetailListFooter } from './DetailListFooter.js';

export const ListDetail = ({
  appKeys,
  user,
  SEA,
  updateListName,
  sharedResourceRootNodeName,
  currentList,
}) => {
  const baseURL = 'http://localhost:3000';
  const [nowShowing, setNowShowing] = useState('all');
  const [currentShareLink, setCurrentShareLink] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [clipboard, setClipboard] = useState(null);
  const [profile, { put }] = useGunState(
    user.get(sharedResourceRootNodeName).get('profile'),
    { appKeys, SEA, route: 'shared' },
  );
  const [
    todos,
    { addToSet, updateInSet, removeFromSet },
  ] = useGunCollectionState(user.get(sharedResourceRootNodeName).get('todos'), {
    appKeys,
    SEA,
  });
  const { name } = profile;

  useEffect(() => {
    if (!clipboard) {
      setClipboard(new ClipboardJS('.btn'));
    }
    return () => {
      if (clipboard) {
        clipboard.destroy();
      }
    };
  }, [clipboard]);

  const changeStatus = async (todo) => {
    const { status, text, nodeID } = todo;
    let newStatus = status === 'completed' ? 'active' : 'completed';
    var data = {
      text,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    };
    updateInSet(nodeID, data);
  };

  const updateTodo = async (todo) => {
    const { status, text, nodeID } = todo;
    var data = {
      status,
      text,
      lastUpdated: new Date().toISOString(),
    };
    updateInSet(nodeID, data);
  };

  const addTodo = async (text) => {
    let data = {
      text,
      lastUpdated: new Date().toISOString(),
      status: 'active',
    };
    addToSet(data);
    setNewTodo('');
  };

  const removeTodo = ({ nodeID }) => {
    removeFromSet(nodeID);
  };

  const updateName = async (name) => {
    await put({ name });
    updateListName(name);
  };

  const shareUrl = async () => {
    if (!showLink) {
      const passphrase = prompt(
        'Please enter a passphrase (and memorize it!).' +
          'Anyone with this link will also need to know this passphrase to open it.' +
          'and will have full access to this list.' +
          'The url will be copied to your clipboard once you click "OK".',
      );

      const { id, keys, name } = currentList;
      const sharedKeys = await SEA.encrypt({ keys, name }, passphrase);
      const shareString = JSON.stringify({ sharedList: sharedKeys });
      const shareUrl = `${baseURL}/${id.replace(
        sharedResourceRootNodeName + '/',
        '',
      )}#share=${encodeURI(shareString)}`;

      console.log(`Share URL: ${shareUrl} | Passhphrase: ${passphrase}`);
      setCurrentShareLink(shareUrl);
    } else {
      setCurrentShareLink('');
    }
    setShowLink(!showLink);
  };

  let todoList = Object.keys(todos).map((k) => todos[k]);
  let activeTodoListCount = todoList.filter(({ status }) => status === 'active')
    .length;

  if (nowShowing !== 'all') {
    todoList = todoList.filter(({ status }) => status === nowShowing);
  }

  return (
    <div className="todoapp todo-list-detail" id="app">
      <Link to={'/'}>
        <i className="gg-mail-reply"></i>
      </Link>
      <h1
        id="appName"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          const name = e.target.innerText;
          updateName(name);
          e.target.innerText = '';
        }}
      >
        {name || '[Add new name]'}
      </h1>
      <input
        className="new-todo"
        value={newTodo}
        onChange={(e) => {
          setNewTodo(e.target.value);
        }}
        onBlur={(e) => {
          addTodo(newTodo);
          e.target.value = '';
        }}
        type="text"
        placeholder="What needs to be done?"
      />
      <section className="main">
        <TodoList
          todos={todoList}
          removeTodo={removeTodo}
          changeStatus={changeStatus}
          addTodo={addTodo}
          updateTodo={updateTodo}
        />
      </section>
      <section className="share-box">
        <button
          onClick={() => {
            shareUrl();
          }}
        >
          {!showLink ? 'Show link' : 'Hide link'}
        </button>
        {'   '}
        {showLink && (
          <input
            className="new-todo link"
            id="shareLink"
            readOnly
            value={currentShareLink}
          />
        )}
        {showLink && (
          <button className="btn copy-btn" data-clipboard-target="#shareLink">
            Copy to clipboard
          </button>
        )}
      </section>
      <DetailListFooter
        activeTodoCount={activeTodoListCount}
        nowShowing={nowShowing}
        setNowShowing={setNowShowing}
      />
    </div>
  );
};
