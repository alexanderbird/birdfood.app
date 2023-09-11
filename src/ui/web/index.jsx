import { render } from 'preact';
import { LocationProvider } from 'preact-iso';
import { useRegisterSW } from 'virtual:pwa-register/preact';

import { Main } from './Main';

export const App = () => {
  useRegisterSW();
  return (
    <LocationProvider>
      <Main />
    </LocationProvider>
  );
};

render(<App />, document.getElementById('app'));
