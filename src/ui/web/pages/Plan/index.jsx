import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Header } from '../../components/Header.jsx';
import { StaticData } from '../../../../data/static';
import { Core } from '../../../../core';

export function Plan() {
  const core = new Core(new StaticData());
  return (<>
    <Header>
      Plan the next shop
    </Header>
    <Container maxWidth="sm">
      <ComboBox items={asItems(core.listItems())} />
      Coming soon
    </Container>
  </>);
}

function asItems(groceryItems) {
  return groceryItems.map(x => ({
    label: x.Name,
    value: x
  }));
}


function ComboBox({ items }) { return ( <Autocomplete disablePortal
      options={items}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Add Item" />}
    />
  );
}
