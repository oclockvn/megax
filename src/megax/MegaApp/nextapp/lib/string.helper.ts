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
}
