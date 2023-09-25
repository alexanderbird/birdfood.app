import { useLocation } from 'preact-iso';
import { useState, useRef } from 'preact/hooks';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

import { useDataSource } from '../hooks/useDataSource.js';
import { BirdFoodIcon } from './icons/BirdFoodIcon';

export const AppMenu = () => {
  const location = useLocation();
  const [dataSource, setDataSource] = useDataSource();
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
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuList dense>
          <MenuItem disabled sx={{ opacity: 'inherit' }}>
            <ListItemIcon>
              <SdStorageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Storage: { dataSource?.name }</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => location.route('/schedule')}>
            <ListItemIcon>
              <EventRepeatIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Schedule Recurring Items</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

