import React from 'react';
import { instantiateNewGun } from '../utils/index.js';

const GunContext = React.createContext();
GunContext.displayName = 'GunContext';

const GunSpawnerProvider = ({ peers, Gun, ...props }) => {
  const spawnNewGun = instantiateNewGun(Gun, {
    peers,
  });

  const value = React.useMemo(() => ({ spawnNewGun }), [spawnNewGun]);

  return <GunContext.Provider value={value} {...props} />;
};

function useSpawnNewGun() {
  const context = React.useContext(GunContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a GunSpawnerProvider`);
  }
  return context;
}

export { GunSpawnerProvider, useSpawnNewGun };
