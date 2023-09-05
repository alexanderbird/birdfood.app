import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export function Header({ children }) {
  return (
    <Box sx={{ flexGrow: 1, pb: 2 }}>
      <AppBar position="static">
        <Toolbar>{ children }</Toolbar>
      </AppBar>
    </Box>
  );
}

