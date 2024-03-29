import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import { useGunState, useGunCollectionState } from '@altrx/gundb-react-hooks';
import { TodoList } from './TodoList';
import { ListDetailFooter } from './ListDetailFooter';
import { ListHeader } from './ListHeader';
import { ShareModal } from './ShareModal';

export const ListDetail = ({
  node,
  sea,
  updateListName,
  sharedResourceRootNodeName,
  currentList,
}) => {
  const baseURL =
    process.env.NODE_ENV === 'production'
      ? 'https://gun-react-todoapp.vercel.app'
      : 'http://localhost:3000';
  const [nowShowing, setNowShowing] = useState('all');
  const [currentShareLink, setCurrentShareLink] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [clipboard, setClipboard] = useState(null);
  const { encryptionKey } = currentList;
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const { fields: profile, put } = useGunState(
    node.get(sharedResourceRootNodeName).get('profile'),
    { appKeys: encryptionKey, sea }
  );
  const {
    collection: todos,
    addToSet,
    updateInSet,
    removeFromSet,
  } = useGunCollectionState(node.get(sharedResourceRootNodeName).get('todos'), {
    appKeys: encryptionKey,
    sea,
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
    if (!passphrase) {
      return;
    }
    if (!showLink) {
      let { id, keys, name, encryptionKey, pub } = currentList;
      let unencryptedSharedKeys;

      if (readOnly) {
        unencryptedSharedKeys = { name, encryptionKey, pub };
      } else {
        unencryptedSharedKeys = { keys, name, encryptionKey };
      }

      const sharedKeys = await sea.encrypt(unencryptedSharedKeys, passphrase);
      const shareString = JSON.stringify({ sharedList: sharedKeys });
      const shareUrl = `${baseURL}/detail?listID=${id}#share=${encodeURI(
        shareString
      )}`;

      console.log(`Share URL: ${shareUrl} | Passhphrase: ${passphrase}`);
      setCurrentShareLink(shareUrl);
    } else {
      setCurrentShareLink('');
    }
    setShowLink(!showLink);
  };

  let todoList = Array.from(todos.values());
  let activeTodoListCount = todoList.filter(
    ({ status }) => status === 'active'
  ).length;

  if (nowShowing !== 'all') {
    todoList = todoList.filter(({ status }) => status === nowShowing);
  }

  return (
    <div className="todoapp todo-list-detail">
      <Link to={'/'}>
        <i className="gg-mail-reply"></i>
      </Link>

      <ListHeader
        readOnly={currentList?.readOnly}
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
          readOnly={currentList?.readOnly}
        />
      </section>
      {!currentList?.readOnly && (
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
      )}
      <ListDetailFooter
        activeTodoCount={activeTodoListCount}
        nowShowing={nowShowing}
        setNowShowing={setNowShowing}
        readOnly={currentList?.readOnly}
      />
    </div>
  );
};
