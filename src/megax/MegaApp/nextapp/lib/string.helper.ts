export const trimRight = (s: string, trim: string): string => {
  if (!s || !s.length) {
    return s;
  }

  s = s.trim();
  if (s.at(-1) !== trim) {
    return s;
  }

  return s.substring(0, s.length - 1);
};

export const trimLeft = (s: string, trim: string): string => {
  if (!s || !s.length) {
    return s;
  }

  s = s.trim();
  if (s.at(0) !== trim) {
    return s;
  }

  return s.substring(1, s.length);
};

export const shortenLink = (url: string) => {
  const trimmed = trimRight(url, "/");
  const short = trimmed.split("/").at(-1);

  return short;
};

/**
 * Quang -> Q
 * Quang Phan -> QP
 * Phan Tien Quang -> QP
 * @param s the input string
 * @returns the initial of given input
 */
export const getInitial = (s: string) => {
  if (!s || !s.trim()) {
    return "";
  }

  const arr = s.split(" ");
  if (arr.length === 1) {
    return arr[0][0];
  }

  if (arr.length === 2) {
    return arr[0][0] + arr[1][0];
  }

  const last = arr.at(-1);
  return last ? last[0] + arr[0][0] : arr[0][0];
};
