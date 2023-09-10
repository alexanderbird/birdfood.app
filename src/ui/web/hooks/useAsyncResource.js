import { useState, useEffect } from 'preact/hooks';

export function useAsyncResource(getResource, initialValue) {
  const [resource, setResource] = useState(initialValue);
  useEffect(async () => {
    setResource(await getResource());
  }, []);
  return resource;
}
