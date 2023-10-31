export const extractErrors = (response: any, defaultMessage = 'Something went wrong'): string => {
  console.log(response);
  if (!response || typeof response !== 'object') {
    return defaultMessage;
  }

  // internal server error
  if (response.code === 'INTERNAL_SERVER_ERROR') {
    return response.message as string || defaultMessage;
  }

  if (!response.errors || typeof response.errors !== 'object') {
    return defaultMessage;
  }

  return Object.values(response.errors)[0] as string || defaultMessage;
}
