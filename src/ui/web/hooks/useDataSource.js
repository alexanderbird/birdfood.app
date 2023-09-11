import { useLocalStorage } from './useLocalStorage.js';
import { StaticData } from '../../../data/static';
import { withSimulatedNetworkLatency } from '../../../data/proxy';

const DataSource = {
  demo: {
    name: "Demo Mode",
    factory: () => withSimulatedNetworkLatency(new StaticData(), { minLatency: 150, maxLatency: 400 })
  },
  browser: {
    name: "Browser Storage",
  },
  acount: {
    name: "Account Storage"
  }
};

export function useDataSource() {
  const [dataSource, setDataSource] = useLocalStorage('data-source');

  return [DataSource[dataSource], setDataSource];
}
