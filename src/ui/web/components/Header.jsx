import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { AppMenu } from './AppMenu';

export function Header({ noMenu, children }) {
  return (
    <Box sx={{ flexGrow: 1, pb: 1 }}>
      <HideOnScroll>
        <AppBar sx={{ maxWidth: 600, left: 'auto', right: 'auto'}}>
          <Toolbar>
            { noMenu ? null : <AppMenu /> }
            { children }
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      {/* for spacing, so the top content isn't hidden */}
      {/* https://github.com/mui/material-ui/issues/16844#issuecomment-517205129 */}
      <Toolbar />
    </Box>
  );
}

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};
