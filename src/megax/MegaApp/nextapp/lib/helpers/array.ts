export const makeArr = (count: number) => {
  return new Array(count).fill(0).map((_, i) => i);
}

export function makeArrOf<T>(count: number, fac: (i: number) => T) {
  return makeArr(count).map(fac);
}
