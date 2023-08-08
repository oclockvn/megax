const getItem = (
  key: string,
  defaultValue: string | null = null
): string | null | undefined => {
  if (typeof localStorage === 'undefined')
    return defaultValue;

  return localStorage[key] || defaultValue;
};

const setItem = (key: string, value: string) => {
  if (typeof localStorage !== 'undefined')
    localStorage[key] = value;
};

export default {
  get: getItem,
  set: setItem,
  getToken: () => getItem("token"),
  setToken: (token: string) => setItem("token", token),
  getRefreshToken: () => getItem("refresh-token"),
  setRefreshToken: (refreshToken: string) =>
    setItem("refresh-token", refreshToken),
};
