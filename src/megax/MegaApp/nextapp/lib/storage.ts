declare type StorageKeys = 'token' | 'refresh-token';

const getItem = (
  key: StorageKeys,
  defaultValue: string | null = null
): string | null | undefined => {
  if (typeof localStorage === 'undefined')
    return defaultValue;

  return localStorage[key] || defaultValue;
};

const setItem = (key: StorageKeys, value: string) => {
  if (typeof localStorage !== 'undefined')
    localStorage[key] = value;
};

export default {
  get: getItem,
  set: setItem,
};
