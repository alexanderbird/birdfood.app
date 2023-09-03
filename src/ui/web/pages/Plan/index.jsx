import { useState, useEffect } from 'preact/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { Header } from '../../components/Header.jsx';
import { StaticData } from '../../../../data/static';
import { Core } from '../../../../core';

export function Plan() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const addItem = item => setSelectedItems(items => [item, ...items]);
  const core = new Core(new StaticData());
  useEffect(() => {
    setItems(core.listItems()); 
  }, []);
  return (<>
    <Header>
      Plan the next shop
    </Header>
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Container maxWidth="sm">
        <ComboBox items={asItems(items)} onSelect={addItem}/>
        Coming soon
      </Container>
      <TheList items={selectedItems} />
    </Box>
  </>);
}

function asItems(groceryItems) {
  return groceryItems.map(x => ({
    label: x.Name,
    value: x
  }));
}

const TheList = ({ items }) => {

  return (
    <List>{ items.map(item => 
      <ListItem disablePadding>
        <ListItemText primary={item.label} />
      </ListItem>
    ) }</List>
  );
}


function ComboBox({ items, onSelect }) {
  const [value, setValue] = useState(" ");
  return (
    <Autocomplete disablePortal
      handleHomeEndKeys
      autoComplete
      autoHighlight
      blurOnSelect
      freeSolo
      clearOnBlur
      includeInputInList
      inputValue={value}
      options={items}
      onChange={(event, item) => {
        setValue(" ");
        if (item) {
          onSelect(item);
        }
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Add Item" />}
    />
  );
}
