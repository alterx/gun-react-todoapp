import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGunCollectionState } from '@altrx/gundb-react-hooks';
import { useAuth } from '@altrx/gundb-react-auth';
import {
  openSharedResource,
  createSharedResource,
} from '../utils/shared-resource.js';
import { ListDetail } from '../components/ListDetail';

export const DetailView = () => {
  const { appKeys, user, sea, newGunInstance } = useAuth();
  let [searchParams] = useSearchParams();
  const lId = searchParams.get('listID');
  const listID = lId ? decodeURIComponent(lId) : null;
  let navigate = useNavigate();
  // Profile information
  const appName = 'todomvc';
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
  const sharedTodos = Array.from(todolists.values()).reduce((arr, item) => {
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
    const newResource = await createSharedResource(newGunInstance, sea);
    const { shareKeys, keys } = newResource;
    const { nodeID } = shareKeys;
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
        const fullId = listID;
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
      const path = `/detail?listID=${encodeURIComponent(currentList.id)}`;
      navigate(path);
    }
  };

  return (
    <div className="todoapp">
      {currentList && (
        <ListDetail
          sea={sea}
          node={node}
          updateListName={updateListName}
          currentList={currentList}
          sharedResourceRootNodeName={currentList.id}
        />
      )}
    </div>
  );
};
