import { useState, useEffect } from 'preact/hooks';

export function useMutableAsyncResource(getResource, initialValue) {
  const [resource, setResource] = useState(initialValue);
  useEffect(async () => {
    setResource(await getResource());
  }, []);
  return [resource, setResource];
}

export function useAsyncResource(getResource, initialValue) {
  const [resource] = useMutableAsyncResource(getResource, initialValue);
  return resource;
}
