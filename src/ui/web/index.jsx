import { render } from 'preact';
import { LocationProvider } from 'preact-iso';

import { Main } from './Main';

export const App = () => (
  <LocationProvider>
    <Main />
  </LocationProvider>
);

render(<App />, document.getElementById('app'));
