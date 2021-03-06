import React, { useState, useEffect } from 'react';
import Gun from 'gun';
import sea from 'gun/sea';
import { useGun, useGunKeys, useGunKeyAuth } from '@altrx/gundb-react-hooks';
import { instantiateNewGun } from '../utils/index.js';

const GunContext = React.createContext();
GunContext.displayName = 'GunContext';

const GunProvider = (props) => {
  const [isReadyToAuth, setReadyToAuth] = useState(
    () => !!(localStorage.getItem('todoKeys') || '')
  );
  const spawnNewGun = instantiateNewGun(Gun, {
    peers: ['https://gun-us.herokuapp.com/gun'],
  });
  const [gun] = useGun(Gun, { peers: ['https://gun-us.herokuapp.com/gun'] });
  const [appKeys, setAppKeys] = useGunKeys(sea, () =>
    JSON.parse(localStorage.getItem('todoKeys') || null)
  );
  const [user, isLoggedIn] = useGunKeyAuth(gun, appKeys, isReadyToAuth);

  useEffect(() => {
    if (isLoggedIn) {
      // log the keys so we can grab them, probably should find a better way
      localStorage.setItem('todoKeys', JSON.stringify(appKeys));
      console.log(`App keys: ${JSON.stringify(appKeys)}`);
    }
  }, [isLoggedIn, appKeys]);

  const login = React.useCallback(
    async (keys) => {
      if (keys) {
        // This function is called by the splash view when the user inputs existing
        // keys. In that case, we wanna make sure `appKeys` contains those instead
        // of the ones that were generated by the `useGunKeys` hook.
        setAppKeys(keys);
      }
      // We tell Gun we're ready to perform the authentication, either with existing
      // keys or the ones generated by the `useGunKeys` hook.
      setReadyToAuth(true);
    },
    [setAppKeys, setReadyToAuth]
  );

  const logout = React.useCallback(() => {
    console.log('logout');
    localStorage.removeItem('todoKeys');
  }, []);

  const value = React.useMemo(
    () => ({ user, login, logout, sea, appKeys, isLoggedIn, spawnNewGun }),
    [login, logout, user, appKeys, isLoggedIn, spawnNewGun]
  );

  return <GunContext.Provider value={value} {...props} />;
};

function useAuth() {
  const context = React.useContext(GunContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a IrisGunProvider`);
  }
  return context;
}

export { GunProvider, useAuth };
