import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useGunCollectionState } from '../utils/hooks.js';
import {
  openSharedResource,
  createSharedResource,
} from '../utils/sharedResource.js';
import { ListDetail } from '../components/ListDetail.js';

export const DetailView = (props) => {
  const { appKeys, user, SEA, spawnNewGun } = props;
  let { listID: lId } = useParams();
  const listID = lId ? decodeURIComponent(lId) : null;
  let history = useHistory();
  // Profile information
  const appName = 'todomvc';
  const sharedResourceRootNodeName = 'todolist';
  const [todolists, { addToSet, updateInSet }] = useGunCollectionState(
    user.get(appName).get('todolists'),
    { appKeys, SEA },
  );

  // Shared Resource
  const [{ node, sharedKeys }, setSharedResource] = useState({});
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
      const { id, keys } = list;
      const node = await openSharedResource(id, spawnNewGun, keys);
      setSharedResource({ node: node(), sharedKeys: keys });
      setCurrentList(list);
    },
    [spawnNewGun],
  );

  const createNewList = useCallback(async () => {
    const newResource = await createSharedResource(
      sharedResourceRootNodeName,
      spawnNewGun,
      SEA,
    );
    const { shareKeys, keys } = newResource;
    const { nodeID } = shareKeys;
    console.log(`App keys for new list: ${JSON.stringify(keys)}`);
    const list = { name: '', id: nodeID, keys, status: 'active' };
    loadList(list);
  }, [SEA, loadList, spawnNewGun]);

  const addNewSharedList = useCallback(
    async (listID, encodedKeys, passphrase) => {
      const decoded = decodeURI(encodedKeys);
      const { sharedList } = JSON.parse(decoded);
      const { keys, name } = await SEA.decrypt(sharedList, passphrase);
      window.location.hash = '';
      const list = { name, id: listID, keys };
      addToSet(list);
      loadList(list);
    },
    [SEA, addToSet, loadList],
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
            'Please enter the passphrase in order to add this list to your profile.',
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
        currentList.id.replace(sharedResourceRootNodeName + '/', ''),
      )}`;
      history.push(path);
    }
  };

  return (
    <div className="todoapp" id="app">
      {currentList && (
        <ListDetail
          SEA={SEA}
          user={node}
          appKeys={sharedKeys}
          updateListName={updateListName}
          sharedResourceRootNodeName={sharedResourceRootNodeName}
          currentList={currentList}
        />
      )}
    </div>
  );
};
