
import { useState, useEffect, useRef } from 'preact/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ClearIcon from '@mui/icons-material/Clear';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { ItemType, ItemTypeIcon } from '../../components/ItemTypeIcon';
import { Header } from '../../components/Header.jsx';

export function lexicalComparison(lhs, rhs) {
  if (lhs === rhs) return 0;
  return lhs < rhs ? -1 : 1;
}

function reverseLexicalComparison(lhs, rhs) {
  return -1 * lexicalComparison(lhs, rhs);
}

export const SortMode = {
  NEWEST_FIRST: {
    key: "NEWEST_FIRST",
    label: "Newest First",
    sortFunction: (lhs, rhs) => reverseLexicalComparison(lhs.value.LastUpdated, rhs.value.LastUpdated)
  },
  BY_TYPE: {
    key: "BY_TYPE",
    label: "By Type",
    sortFunction: (lhs, rhs) => lexicalComparison(lhs.value.Type, rhs.value.Type)
  },
  ALPHABETICAL: {
    key: "ALPHABETICAL",
    label: "A-Z",
    sortFunction: (lhs, rhs) => lexicalComparison(lhs.label, rhs.label)
  },
}

export function SortModeToggle({ value, onChange }) {
  return (
    <Box flexDirection="row" justifyContent="space-around" sx={{ marginY: 2, display: 'flex' }}>
      <ToggleButtonGroup value={value} exclusive onChange={(e, v) => onChange(v)}>
      { Object.values(SortMode).map(x =>
          <ToggleButton value={x.key} sx={{ paddingY: 0 }}>{x.label}</ToggleButton>
        )}
      </ToggleButtonGroup>
    </Box>
  );
}

