import { useLocation } from 'preact-iso';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export function Header() {
  const { url } = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🧈 Butter
          </Typography>
          <Button color="inherit" href="/" variant={url === '/' ? 'contained' : ''}>Home</Button>
          <Button color="inherit" href="/404" variant={url === '/404' ? 'contained' : ''}>404</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

