import { useState, useEffect } from 'preact/hooks';

export function useLocalStorage(key) {
  const [value, setInternalValue] = useState(read(key));
  useEffect(() => {
    const onStorageEvent = (event) => {
      console.log("onStorageEvent", event);
      if (event.key === key) {
        setInternalValue(read(key));
      }
    };
    window.addEventListener("storage", onStorageEvent);
    return () => {
      window.removeEventListener("storage", onStorageEvent);
    };
  }, [key]);
  const setValue = newValue => {
    write(key, newValue);
    setInternalValue(newValue);
  };
  return [value, setValue];
}

function write(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function read(key) {
  try {
    return parse(window.localStorage.getItem(key));
  } catch(e) {
    console.warn(new Error(`Failed to read local storage "${key}"`, { cause: e }));
    write(key, null);
    return undefined;
  }
}

function parse(storageValue) {
  if (!storageValue) {
    return undefined;
  }
  try {
    return JSON.parse(storageValue);
  } catch(e) {
    throw new Error(`Could not parse the storage value: ${  storageValue}`, { cause: e });
  }
}
