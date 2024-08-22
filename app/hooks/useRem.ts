import { useEffect, useState } from "react";

export const useRem = () => {
  const [remSize, setRemSize] = useState(16);

  useEffect(() => {
    if (document == undefined) {
      return;
    }
    const x = getComputedStyle(document.documentElement).fontSize;
    setRemSize(parseFloat(x));
  }, []);

  return remSize;
};
