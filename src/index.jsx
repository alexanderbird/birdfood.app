import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './pages/Home/index.jsx';
import { Placeholder } from './pages/Placeholder/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
  return (
    <LocationProvider>
      <Box>
          <Header />
          <Router>
            <Route path="/search" component={Placeholder} />
            <Route path="/plan" component={Placeholder} />
            <Route path="/shop" component={Placeholder} />
            <Route path="/" component={Home} />
            <Route default component={NotFound} />
          </Router>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <Footer />
        </Paper>
      </Box>
    </LocationProvider>
  );
}

render(<App />, document.getElementById('app'));
