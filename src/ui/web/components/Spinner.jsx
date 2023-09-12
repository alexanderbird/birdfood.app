import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const Spinner = () => 
  <Box display="flex" justifyContent="space-around" flexDirection="column" alignItems="center" sx={{ minHeight: '80vh' }}>
    <CircularProgress />
  </Box>;
