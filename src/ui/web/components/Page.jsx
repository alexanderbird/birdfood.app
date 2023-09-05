import Box from '@mui/material/Box';

export const Page = ({ header, body, dialogs }) => {
  return (<>
    { header }
    <Box sx={{ width: '100%', maxWidth: 520, marginX: 'auto', bgcolor: 'background.paper' }}>
      { body }
    </Box>
    { dialogs }
  </>);
};
