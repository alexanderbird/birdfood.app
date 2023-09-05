import { useState } from 'preact/hooks';

export function useSerial() {
  const [serial, setSerial] = useState(Date.now());
  const triggerUpdate = () => setSerial(Date.now());
  return [serial, triggerUpdate];
}
