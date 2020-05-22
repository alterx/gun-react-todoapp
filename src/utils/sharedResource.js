import { useState } from 'react';

export const createSharedResource = async (appName, spawnNewGun, SEA) => {
  return new Promise(async (resolve) => {
    const newGun = spawnNewGun();
    const keys = await SEA.pair();
    const sharedKeyString = JSON.stringify(keys);
    let keyId = await SEA.work(sharedKeyString, undefined, undefined, {
      name: 'SHA-256',
    });
    keyId = keyId.slice(0, 12);
    const nodeID = `${appName}/${keyId}`;

    newGun.on('auth', () => {
      // TODO: workaround while https://github.com/amark/gun/issues/937 is fixed
      // should not need a function
      const node = () => namespace.get(nodeID);

      resolve({
        node,
        shareKeys: {
          keyId,
          sharedKeyString,
          nodeID,
        },
        keys,
      });
    });

    const namespace = newGun.user();
    namespace.auth(keys);
  });
};

export const openSharedResource = async (nodeID, spawnNewGun, keys, pub) => {
  return new Promise((resolve) => {
    const newGun = spawnNewGun();
    let namespace;

    if (keys) {
      newGun.on('auth', () => {
        // TODO: workaround while https://github.com/amark/gun/issues/937 is fixed
        // should not need a function
        const node = () => namespace.get(nodeID);
        resolve(node);
      });
      namespace = newGun.user();
      namespace.auth(keys);
    } else {
      namespace = newGun.get(pub);
      const node = () => namespace.get(nodeID);
      resolve(node);
    }
  });
};

export const useSharedResource = (appName, gun, sea) => {
  const [sharedResource, setSharedResource] = useState({
    node: null,
    shareKeys: null,
    keys: null,
  });
  const [isRetrieving, setIsRetrieving] = useState(false);

  async function getSharedResource() {
    const resource = await createSharedResource(appName, gun, sea);
    setSharedResource(resource);
  }
  if (!sharedResource.node && !isRetrieving) {
    setIsRetrieving(true);
    getSharedResource();
  }

  return [sharedResource, setSharedResource];
};
