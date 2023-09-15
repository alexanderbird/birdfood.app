import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

import { useDialogState } from '../hooks/useDialogState';

export function useConfirmDialog({ onConfirm }) {
  const dialogState = useDialogState();
  const StatefulConfirmDialog = props => (
    <ConfirmDialog
      onConfirm={() => { onConfirm(dialogState.data); dialogState.close(); }}
      onCancel={dialogState.close}
      open={dialogState.isOpen}
      confirmText={props.confirmText && dialogState.data ? props.confirmText(dialogState.data) : undefined}
      titleText={props.titleText && dialogState.data ? props.titleText(dialogState.data) : undefined}
    >
      { props.children && dialogState.data ? props.children(dialogState.data) : null }
    </ConfirmDialog>
  );
  StatefulConfirmDialog.open = dialogState.open;
  return StatefulConfirmDialog;
}
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
