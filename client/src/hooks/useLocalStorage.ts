import { useState, useEffect } from 'react';

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    const parsedItem = item ? JSON.parse(item) : defaultValue;

    return parsedItem;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
