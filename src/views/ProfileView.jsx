import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import { useAuth } from '@altrx/gundb-react-auth';
import { useGunState } from '@altrx/gundb-react-hooks';

export const ProfileView = () => {
  const { appKeys, sea, user, logout } = useAuth();
  const [clipboard, setClipboard] = useState(null);
  let navigate = useNavigate();
  const appName = 'todomvc';
  const { fields: profile, put } = useGunState(
    user.get(appName).get('profile'),
    { appKeys, sea }
  );
  const { name = '' } = profile;
  const [nameValue, setNameValue] = useState(name);

  useEffect(() => {
    if (nameValue && nameValue !== name) {
      put({ name: nameValue });
    }
  }, [nameValue]);

  useEffect(() => {
    if (name && nameValue !== name) {
      setNameValue(name);
    }
  }, [name]);

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

  return (
    <div className="todoapp profile">
      <Link to={'/'}>
        <i className="gg-mail-reply"></i>
      </Link>
      <h2>My Profile</h2>
      <input
        value={nameValue}
        onChange={(e) => {
          setNameValue(e.target.value);
        }}
      />
      <p>
        These are your private keys, you can use them to log into other devices,{' '}
        <b>DO NOT SHARE THEM</b>.
      </p>
      <textarea
        className="new-todo link"
        id="shareLink"
        readOnly
        value={JSON.stringify(appKeys)}
        style={{
          minHeight: 215,
        }}
      />
      <button className="btn copy-btn" data-clipboard-target="#shareLink">
        Copy to clipboard
      </button>
      <button
        onClick={() => {
          logout(() => {
            navigate('/');
            window.location.reload();
          });
        }}
      >
        Logout
      </button>
    </div>
  );
};
