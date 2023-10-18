export const extractErrors = (response: any, defaultMessage = 'Something went wrong') => {
  if (!response || typeof response !== 'object') {
    return defaultMessage;
  }

  if (!response.errors || typeof response.errors !== 'object') {
    return defaultMessage;
  }

  return Object.values(response.errors)[0] || defaultMessage;
}
