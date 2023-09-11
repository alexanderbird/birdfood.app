import { useLocation, Router, Route } from 'preact-iso';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';

import { useDataSource } from './hooks/useDataSource.js';
import { Footer } from './components/Footer.jsx';
import { Schedule } from './pages/Schedule/index.jsx';
import { Plan } from './pages/Plan/index.jsx';
import { Landing } from './pages/Landing/index.jsx';
import { Shop, ShoppingHistory, StartShopping, ShoppingRouter } from './pages/Shop/index.jsx';
import { NotFound } from './pages/_404.jsx';
import { Core } from '../../core';

function coreFactory(dataSource) {
  const dataFactory = dataSource?.factory;
  if (!dataFactory) {
    return false;
  }
  return new Core(dataFactory());
}

export function Main() {
  const location = useLocation();
  const [dataSource, setDataSource] = useDataSource();
  const core = coreFactory(dataSource);
  if (!core && location.url !== "/") {
    location.route("/");
  } else if (core && location.url === "/") {
    location.route("/plan");
  }
  return (
    <>
      <CssBaseline />
      <Box>
        <Box sx={{ pb: 8 }}>
          <Router>
            <Schedule path="/schedule" core={core} />
            <Plan path="/plan" core={core} />
            <StartShopping path="/shop/start" core={core} />
            <Shop path="/shop/:shoppingEventId" core={core} />
            <Shop path="/history/:shoppingEventId" core={core} />
            <ShoppingRouter path="/shop" core={core} />
            <ShoppingHistory path="/history" core={core} />
            <Landing path="/" setDataSource={setDataSource} />
            <Route default component={NotFound} />
          </Router>
        </Box>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} elevation={3}>
          { core ? <Footer core={core} /> : null }
        </Paper>
      </Box>
    </>
  );
}
