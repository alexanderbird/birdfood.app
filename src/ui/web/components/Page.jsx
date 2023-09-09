import Box from '@mui/material/Box';
import { Spinner } from './Spinner';

export const Page = ({ isLoading, header, body, dialogs }) => {
  return (<>
    { header }
    <Box sx={{ width: '100%', marginX: 'auto', bgcolor: 'background.paper' }}>
      { isLoading ? <Spinner /> : body ? body() : null}
    </Box>
    { isLoading ? null : dialogs ? dialogs() : null }
  </>);
};
