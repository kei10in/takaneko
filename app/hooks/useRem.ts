import { useMemo } from "react";

export const useRem = () => {
  const remSize = useMemo(() => {
    if (document == undefined) {
      return 16;
    }
    const x = getComputedStyle(document.documentElement).fontSize;
    return parseFloat(x);
  }, []);

  return remSize;
};
