import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { useState } from 'preact/hooks';
import { useLocalStorage } from './useLocalStorage.js';
import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { StaticData } from '../../../data/static';
import { BrowserStorageData } from '../../../data/browser';
import { DynamoDbData } from '../../../data/dynamodb';
import { withSimulatedNetworkLatency } from '../../../data/proxy';

export const DataSource = {
  demo: {
    key: "demo",
    name: "Demo Mode",
    factory: () => withSimulatedNetworkLatency(new StaticData(), { minLatency: 250, maxLatency: 500 }),
    LoginDialog: ({ dialog, onDialogConfirm }) => (
      <ConfirmDialog open={dialog.isOpen} onCancel={dialog.close}
        onConfirm={() => onDialogConfirm({
          key: 'demo',
        })}
        titleText="Demo Mode"
        confirmText="Got it"
      >
        All your changes will be reset when you refresh the page.
      </ConfirmDialog>
    )
  },
  browser: {
    key: "browser",
    name: "Device (Browser)",
    factory: () => new BrowserStorageData(window.localStorage),
    LoginDialog: ({ dialog, onDialogConfirm }) => (
      <ConfirmDialog open={dialog.isOpen} onCancel={dialog.close}
        onConfirm={() => onDialogConfirm({
          key: 'browser',
        })}
        titleText="Device (Browser)"
        confirmText="Got it"
      >
        Your data is stored on this device in your browser.
      </ConfirmDialog>
    )
  },
  account: {
    key: "account",
    name: "Account",
    factory: ({ username, password }) => new DynamoDbData({
      household: username.split('|')[0],
      region: 'ca-central-1',
      credentials: {
        accessKeyId: username.split('|')[1],
        secretAccessKey: password,
      }
    }),
    LoginDialog: ({ dialog, onDialogConfirm }) => {
      const [formData, setFormData] = useState({});
      return (
        <ConfirmDialog open={dialog.isOpen} onCancel={dialog.close}
          onConfirm={() => onDialogConfirm({
            key: 'account',
            factoryProps: formData,
          })}
          canConfirm={formData.username?.length > 3 && formData.password?.length > 3}
          titleText="Account Login"
          confirmText="Login"
        >
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Username"
              value={formData.username}
              onChange={e => setFormData(current => ({ ...current, username: e.target.value }))}
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={e => setFormData(current => ({ ...current, password: e.target.value }))}
            />
          </Box>
        </ConfirmDialog>
      );
    }
  }
};

export function useDataSource() {
  const [dataSourceId, setDataSource] = useLocalStorage('data-source');

  const dataSource = DataSource[dataSourceId?.key];
  const factory = dataSource?.factory;
  const boundFactory = () => {
    try {
      return factory(dataSourceId.factoryProps);
    } catch(e) {
      console.error(`Failed to instantiate the data source with parameters ${  JSON.stringify(dataSource.factoryProps)}`, e);
      setDataSource(false);
    }
  };
  return [
    dataSource ? { ...dataSource, factory: boundFactory } : false,
    setDataSource
  ];
}
