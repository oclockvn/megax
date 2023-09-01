import datetime from "./datetime";

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

export const toFormData = (
  obj: Record<string, any>,
  files?: File[]
): FormData => {
  const form = new FormData();
  for (let key in obj) {
    form.append(key, obj[key]);
  }

  if (files?.length) {
    for (let file of files) {
      form.append('files', file, file.name);
    }
  }

  return form;
};

export const normalizeDateTimePayload = (src: Record<string, any>) => {
  const result: Record<string, any> = {}

  for (let k in src) {
    if (src[k] instanceof Date) {
      result[k] = datetime.formatToServer(src[k]);
    } else {
      result[k] = src[k]
    }
  }

  return result;
}
