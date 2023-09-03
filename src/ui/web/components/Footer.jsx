import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useLocation } from 'preact-iso';
import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

const assembleAction = ({ href, label, IconComponent }) =>
  <BottomNavigationAction
    component="a"
    value={href}
    href={href}
    label={label}
    icon={<IconComponent />}
    />

export function Footer() {
  const { url } = useLocation();
  return (
    <BottomNavigation showLabels={true} value={url} >{[
      assembleAction({ href:"/add", label: "Add", IconComponent: AddIcon }),
      assembleAction({ href:"/plan", label: "Plan", IconComponent: ShoppingCartIcon }),
      assembleAction({ href:"/shop", label: "Shop", IconComponent: CheckBoxIcon })
    ]}
    </BottomNavigation>
  );
}
