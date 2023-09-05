import { useState } from 'preact/hooks';

export function useDialogState() {
  const [data, setData] = useState(false);
  const isOpen = !!data;
  const open = x => setData(x || true);
  const close = () => setData(false);
  return { data, isOpen, open, close };
}
