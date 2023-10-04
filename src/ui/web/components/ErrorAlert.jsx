import { useState } from 'preact/hooks';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export function useErrorAlert() {
  const [alert, onError] = useState();
  const ErrorAlert = () => (
    <Snackbar open={!!alert} autoHideDuration={6000} onClose={() => onError(false)}>
      <Alert severity="error" onClose={() => onError(false)} sx={{ width: '100%' }}>
        { alert?.toString() }
      </Alert>
    </Snackbar>
  );
  return [ErrorAlert, onError];
}
