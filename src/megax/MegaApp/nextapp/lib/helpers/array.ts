export const makeArr = (count: number) => {
  return new Array(count).fill(0).map((_, i) => i);
}

export function makeArrOf<T>(count: number, fac: (i: number) => T) {
  return makeArr(count).map(fac);
}

export const uniqBy = <T>(arr: T[], key: keyof T): T[] => {
  return Object.values(
    arr.reduce(
      (map, item) => ({
        ...map,
        [`${item[key]}`]: item,
      }),
      {},
    ),
  );
};
