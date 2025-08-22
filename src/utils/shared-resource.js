export const getHash = async (
  data,
  sea,
  max = 12,
  name = 'SHA-1',
  salt = null
) => {
  const message = await sea.work(data, salt, null, {
    name,
    encode: 'hex',
  });
  return message.slice(0, max);
};

export const createSharedResource = async (newGunInstance, sea) => {
  const keys = await sea.pair();
  const sharedKeyString = JSON.stringify(keys);
  let keyId = await getHash(sharedKeyString, sea);
  const nodeID = `${keyId}`;
  return new Promise(async (resolve) => {
    const newGun = newGunInstance({
      peers: ['http://localhost:8765/gun'],
      localStorage: false,
      radisk: true,
      file: nodeID,
    });

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
    const newGun = newGunInstance({
      peers: ['http://localhost:8765/gun'],
      localStorage: false,
      radisk: true,
      file: nodeID,
    });
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
