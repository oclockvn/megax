/**
 * delay given milisecond
 * @param time delay milisecond
 * @returns a promise
 */
export function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export const qs = (obj: Record<string, string> | any) =>
  new URLSearchParams(obj).toString();
