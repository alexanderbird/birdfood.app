import { Fragment } from 'preact';

import InsightsIcon from '@mui/icons-material/Insights';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
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
          <List sx={{ mt: -2 }} dense>
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
                  borderTopWidth: 1,
                  borderTopStyle: 'solid',
                  borderTopColor: colors.grey[500],
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
                <ListItem
                  key={item.Id}
                  disableGutters={true}
                  sx={{ paddingRight: 0 }}
                  secondaryAction={
                    <IconButton
                      aria-label="Purchase History"
                      edge="end"
                      color="primary"
                      onClick={() => alert(`Insights for ${  item.Name}`)}
                    >
                      <InsightsIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    sx={{ '&.MuiListItemButton-gutters': { paddingRight: 3 }}}
                    onClick={() => alert(`Edit ${  item.Name}`)}
                  >
                    <ListItemText
                      primary={<>
                        <Box sx={{ display: 'flex', flexDirection: 'row', paddingRight: 0 }}>
                          <Typography sx={{ marginRight: 'auto', flex: 9 }}>{item.Name}</Typography>
                          <Typography color="gray" sx={{ textAlign: 'center', flexGrow: 1, flexShrink: 0 }}>
                            <Typography component="span" sx={{ fontWeight: 'bold' }}>{item.RecurringQuantity}</Typography>
                            <EventRepeatIcon fontSize="small" sx={{ color: "#CCC" }} />
                            <Typography component="span" sx={{ fontWeight: 'bold', ml: 1 }}>{item.PlannedQuantity}</Typography>
                            <ShoppingCartIcon fontSize="small" sx={{ color: "#CCC" }} />
                          </Typography>
                        </Box>
                      </>}
                    />
                  </ListItemButton>
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
