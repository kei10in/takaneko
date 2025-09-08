import { useEffect, useState } from "react";

export const useAutoRevokeImageSource = (data: { blob: Blob; objectURL: string }[] | undefined) => {
  const [current, setCurrent] = useState<{ blob: Blob; objectURL: string }[]>([]);

  useEffect(() => {
    if (current == data) {
      return;
    }

    current.forEach((v) => URL.revokeObjectURL(v.objectURL));
    setCurrent(data ?? []);
    return () => current.forEach((v) => URL.revokeObjectURL(v.objectURL));
  }, [current, data]);
};
