import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import { useGunState, useGunCollectionState } from '../utils/hooks.js';
import { TodoList } from './TodoList.js';
import { ListDetailFooter } from './ListDetailFooter.js';
import { ListHeader } from './ListHeader.js';
import { ShareModal } from './ShareModal.js';

export const ListDetail = ({
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
  const { encryptionKey, readOnly } = currentList;
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [profile, { put }] = useGunState(
    user.get(sharedResourceRootNodeName).get('profile'),
    { appKeys: encryptionKey, SEA },
  );
  const [
    todos,
    { addToSet, updateInSet, removeFromSet },
  ] = useGunCollectionState(user.get(sharedResourceRootNodeName).get('todos'), {
    appKeys: encryptionKey,
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

  const shareUrl = async (passphrase, readOnly = true) => {
    if (!showLink) {
      let { id, keys, name, encryptionKey, pub } = currentList;
      let unencryptedSharedKeys;

      if (readOnly) {
        unencryptedSharedKeys = { name, encryptionKey, pub };
      } else {
        unencryptedSharedKeys = { keys, name, encryptionKey };
      }

      const sharedKeys = await SEA.encrypt(unencryptedSharedKeys, passphrase);
      const shareString = JSON.stringify({ sharedList: sharedKeys });
      const shareUrl = `${baseURL}/detail/${id.replace(
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

      <ListHeader
        readOnly={readOnly}
        addTodo={addTodo}
        setNewTodo={setNewTodo}
        updateName={updateName}
        newTodo={newTodo}
        name={name}
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
            if (!showLink) {
              setShowShareDialog(true);
            } else {
              setShowLink(!showLink);
            }
          }}
        >
          {!showLink ? 'Share' : 'Hide link'}
        </button>

        <ShareModal
          showDialog={showShareDialog}
          setShowDialog={setShowShareDialog}
          onDismiss={shareUrl}
        />
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
      <ListDetailFooter
        activeTodoCount={activeTodoListCount}
        nowShowing={nowShowing}
        setNowShowing={setNowShowing}
        readOnly={readOnly}
      />
    </div>
  );
};
