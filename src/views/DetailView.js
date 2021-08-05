import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useGunCollectionState } from '@altrx/gundb-react-hooks';
import { useAuth } from '@altrx/gundb-react-auth';
import {
  openSharedResource,
  createSharedResource,
} from '../utils/shared-resource.js';
import { ListDetail } from '../components/ListDetail.js';

export const DetailView = () => {
  const { appKeys, user, sea, newGunInstance } = useAuth();
  let { listID: lId } = useParams();
  const listID = lId ? decodeURIComponent(lId) : null;
  let history = useHistory();
  // Profile information
  const appName = 'todomvc';
  const sharedResourceRootNodeName = 'todolist';
  const {
    collection: todolists,
    addToSet,
    updateInSet,
  } = useGunCollectionState(user.get(appName).get('todolists'), {
    appKeys,
    sea,
  });

  // Shared Resource
  const [{ node }, setSharedResource] = useState({});
  const [listReady, setListReady] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const todoKeyArray = Object.keys(todolists);
  const sharedTodos = todoKeyArray.reduce((arr, key) => {
    let item = todolists[key];
    const { id } = item;
    arr[id] = item;
    return arr;
  }, {});

  const loadList = useCallback(
    async (list) => {
      const { id, keys, pub } = list;
      const node = await openSharedResource(id, newGunInstance, keys, pub);
      setSharedResource({ node: node() });
      setCurrentList(list);
    },
    [newGunInstance]
  );

  const createNewList = useCallback(async () => {
    const newResource = await createSharedResource(
      sharedResourceRootNodeName,
      newGunInstance,
      sea
    );
    const { shareKeys, keys } = newResource;
    const { nodeID } = shareKeys;
    console.log(`App keys for new list: ${JSON.stringify(keys)}`);
    const list = {
      name: '',
      id: nodeID,
      keys,
      status: 'active',
      encryptionKey: sea.random(16).toString(),
      pub: `~${keys.pub}`,
    };
    loadList(list);
  }, [sea, loadList, newGunInstance]);

  const addNewSharedList = useCallback(
    async (listID, encodedKeys, passphrase) => {
      try {
        const decoded = decodeURI(encodedKeys);
        const { sharedList } = JSON.parse(decoded);
        const listData = await sea.decrypt(sharedList, passphrase);
        const { keys, name, encryptionKey, pub } = listData;
        window.location.hash = '';
        const list = {
          name,
          id: listID,
          keys,
          encryptionKey,
          pub,
          status: keys ? 'active' : 'readonly',
          readOnly: !keys,
        };
        addToSet(list);
        loadList(list);
      } catch (e) {
        alert(
          "failed to add new list, it seems like you don't have access or the passphrase is incorrect."
        );
      }
    },
    [sea, addToSet, loadList]
  );

  useEffect(() => {
    if (!listReady) {
      if (listID) {
        let sharedList;
        const fullId = sharedResourceRootNodeName + '/' + listID;
        let passphrase;
        const hash = window.location.hash;
        if (hash.indexOf('share=') !== -1) {
          sharedList = hash.split('#share=')[1];
          passphrase = prompt(
            'Please enter the passphrase in order to add this list to your profile.'
          );
        }
        if (sharedList && !sharedTodos[fullId]) {
          addNewSharedList(fullId, sharedList, passphrase);
          setListReady(true);
        } else {
          let list = sharedTodos[fullId];
          if (list) {
            loadList(list);
            setListReady(true);
          }
        }
      } else {
        createNewList();
        setListReady(true);
      }
    }
  }, [
    listID,
    listReady,
    sharedTodos,
    addNewSharedList,
    createNewList,
    loadList,
  ]);

  const updateListName = (name) => {
    const todolist = sharedTodos[currentList.id];
    if (todolist) {
      updateInSet(todolist.nodeID, { ...currentList, name });
      setCurrentList(todolist);
    } else {
      addToSet({ ...currentList, name });
      const path = `/detail/${encodeURIComponent(
        currentList.id.replace(sharedResourceRootNodeName + '/', '')
      )}`;
      history.push(path);
    }
  };

  return (
    <div className="todoapp" id="app">
      {currentList && (
        <ListDetail
          sea={sea}
          user={node}
          updateListName={updateListName}
          sharedResourceRootNodeName={sharedResourceRootNodeName}
          currentList={currentList}
        />
      )}
    </div>
  );
};
