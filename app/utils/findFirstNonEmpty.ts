export const findFirstNonEmpty = <T>(xs: (T | undefined)[]): T | undefined => {
  if (xs.every((x) => typeof x === "string" || x == undefined)) {
    return xs.find((x) => x != undefined && (x as string).length > 0);
  }

  return xs.find((x) => x != undefined);
};
