import { useSerial } from './useSerial';
import { useState, useEffect } from 'preact/hooks';

export function useUpdatingState(initialState, getState) {
  const [serial, triggerUpdate] = useSerial();
  const [state, setState] = useState(initialState);
  useEffect(async () => {
    setState(await getState());
  }, [serial]);
  return [state, triggerUpdate];
}
