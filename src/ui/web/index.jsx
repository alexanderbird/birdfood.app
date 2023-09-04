import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';

import { Footer } from './components/Footer.jsx';
import { Schedule } from './pages/Schedule/index.jsx';
import { Plan } from './pages/Plan/index.jsx';
import { Placeholder } from './pages/Placeholder/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
  return (
    <LocationProvider>
      <CssBaseline />
      <Box>
        <Box sx={{ pb: 8 }}>
          <Router>
            <Route path="/schedule" component={Schedule} />
            <Route path="/plan" component={Plan} />
            <Route path="/shop" component={Placeholder} />
            <Route default component={NotFound} />
          </Router>
        </Box>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} elevation={3}>
          <Footer />
        </Paper>
      </Box>
    </LocationProvider>
  );
}

render(<App />, document.getElementById('app'));
