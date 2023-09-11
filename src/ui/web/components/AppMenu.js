import { useState, useRef } from 'preact/hooks';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';

import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { BirdFoodIcon } from './icons/BirdFoodIcon';

export const AppMenu = () => {
  const [,setDataSource] = useLocalStorage('data-source');
  const anchorRef = useRef();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const onLogout = () => {
    setDataSource(false);
    handleClose();
    window.location.reload();
  };
  return (
    <>
      <IconButton
        ref={anchorRef}
        aria-label="open menu"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={() => setOpen(true)}
        color="inherit"
      >
        <BirdFoodIcon sx={{ mr: 1 }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

