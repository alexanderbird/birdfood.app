import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

export const ConfirmDialog = ({ open, onCancel, onConfirm, confirmText, titleText, children }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{ titleText || "Confirm" }</DialogTitle>
      <DialogContent dividers>
        { children }
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onConfirm}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
};
