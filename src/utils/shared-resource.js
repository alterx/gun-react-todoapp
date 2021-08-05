import { useState } from 'react';

export const createSharedResource = async (appName, newGunInstance, sea) => {
  return new Promise(async (resolve) => {
    const newGun = newGunInstance();
    const keys = await sea.pair();
    const sharedKeyString = JSON.stringify(keys);
    let keyId = await sea.work(sharedKeyString, undefined, undefined, {
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

export const openSharedResource = async (nodeID, newGunInstance, keys, pub) => {
  return new Promise((resolve) => {
    const newGun = newGunInstance();
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

// key<sha1({Company:'mycompany123',companyid:321,Name:'My Company'})> or "da39a3ee5e6b4b0d3255bfef95601890afd80709" substringed to  da39a3ee5e -> value<Gun refpointer>

// try await SEA.work("hey", "ho", null,{name:'SHA-1',encode:'hex'})

/// or 'SHA-256'
const index = async (data, sea, name = 'SHA-1', max = 10) => {
  const message = await sea.work(JSON.stringify(data), null, null, {
    name,
    encode: 'hex',
  });
  console.log(message);
  return message.slice(0, max);
};
// -> ce06092fb948d9ffac7d1a376e404b26b7575bcc11ee05a4615fef4fec3a308b

export function encode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

export function decode(base64) {
  // Add removed at end '='
  base64 += Array(5 - (base64.length % 4)).join('=');
  base64 = base64
    .replace(/\-/g, '+') // Convert '-' to '+'
    .replace(/\_/g, '/'); // Convert '_' to '/'

  return new Buffer(base64, ['base64']);
}
