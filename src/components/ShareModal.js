import React from 'react';
import {
  AlertDialog,
  AlertDialogLabel,
  AlertDialogDescription,
} from '@reach/alert-dialog';
import '@reach/dialog/styles.css';

export const ShareModal = ({ showDialog, setShowDialog, onDismiss }) => {
  const [passphrase, setPassphrase] = React.useState('');
  const [readOnly, setReadOnly] = React.useState('readonly');
  const cancelRef = React.useRef();

  const onClose = (result) => {
    if (result === 'success') {
      onDismiss(passphrase, readOnly === 'readonly');
    }
    setShowDialog(false);
  };

  return (
    <div>
      {showDialog && (
        <AlertDialog
          onDismiss={onClose.bind(this, 'success')}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogLabel>
            <h2>Sharing</h2>
          </AlertDialogLabel>
          <AlertDialogDescription>
            Choose wheter you want to share this list as read-only or with fully
            fledged read/write privileges:{' '}
            <select
              onChange={(event) => {
                setReadOnly(event.target.value);
              }}
              value={readOnly}
            >
              <option value={true}>Read-only</option>
              <option value={false}>Full access</option>
            </select>
            <br />
            <br />
            Then enter a passphrase (and memorize it!):{' '}
            <input
              onChange={(event) => {
                setPassphrase(event.target.value);
              }}
              value={passphrase}
              type="text"
            />
            <br />
            <br />
            Anyone with this link will also need to know this passphrase to open
            it.
            <br />
          </AlertDialogDescription>
          <div className="alert-buttons">
            <button onClick={onClose.bind(this, 'success')}>
              Generate URL
            </button>{' '}
            <button ref={cancelRef} onClick={onClose.bind(this, 'canceled')}>
              Cancel
            </button>
          </div>
        </AlertDialog>
      )}
    </div>
  );
};
