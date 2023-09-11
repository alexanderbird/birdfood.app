import { useLocalStorage } from './useLocalStorage.js';
import { StaticData } from '../../../data/static';
import { BrowserStorageData } from '../../../data/browser';
import { withSimulatedNetworkLatency } from '../../../data/proxy';

export const DataSource = {
  demo: {
    key: "demo",
    name: "Demo Mode",
    explanation: "All your changes will be reset when you refresh the page.",
    factory: () => withSimulatedNetworkLatency(new StaticData(), { minLatency: 25, maxLatency: 50 }),
  },
  browser: {
    key: "browser",
    name: "Device (Browser)",
    explanation: "Your data is stored on this device in your browser.",
    factory: () => new BrowserStorageData(window.localStorage),
  },
  acount: {
    key: "account",
    name: "Account"
  }
};

export function useDataSource() {
  const [dataSource, setDataSource] = useLocalStorage('data-source');

  return [DataSource[dataSource], setDataSource];
}
