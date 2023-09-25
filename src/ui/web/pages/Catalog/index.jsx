import { Fragment } from 'preact';

import LabelIcon from '@mui/icons-material/Label';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import * as colors from '@mui/material/colors';

import { useAsyncResource } from '../../hooks/useAsyncResource';
import { ItemTypeIcon, ItemType } from '../../components/ItemTypeIcon';
import { Header } from '../../components/Header.jsx';
import { Page } from '../../components/Page';

export function Catalog({ core }) {
  const { all: catalog } = useAsyncResource(() => core.getShoppingPlan(), {});
  const groupedCatalog = catalog ? Object.values(catalog.reduce((groups, one) => {
    groups[one.Type] = groups[one.Type] || { type: one.Type, items: [] };
    groups[one.Type].items.push(one);
    return groups;
  }, {})) : {};
  return (
    <Page
      isLoading={!catalog}
      header={
        <Header >
          <Typography variant="h6" component="div">Catalog</Typography>
        </Header>
      }
      body={() =>
        <Container sx={{ pb: '60vh' }}>
          <List sx={{ mt: -2 }}>
            { groupedCatalog.map(group => (<Fragment key={group.type}>
              <ListSubheader
                sx={{
                  ml: -4, pl: 4,
                  mr: -4, pr: 4,
                  mt: 2, pt: 2,
                  pb: 2,
                  flexDirection: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  backgroundColor: colors.grey[50]
                }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: colors.blue[50] }}>
                    <ItemTypeIcon type={group.type} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={ ItemType[group.type].label } />
              </ListSubheader>
              { group.items.sort((lhs, rhs) => lhs.Name < rhs.Name ? -1 : 1).map(item => (
                <ListItem key={item.Id} disableGutters>
                  <LabelIcon sx={{ mr: 1, color: colors.grey[200] }} />
                  <ListItemText primary={ item.Name } />
                </ListItem>
              )) }
            </Fragment>)) }
          </List>
        </Container>
      }
      dialogs={() => null}
    />
  );
}
