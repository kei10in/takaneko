import { useEffect, useRef } from "react";

export const useAutoRevokeImageSource = (data: { blob: Blob; objectURL: string }[] | undefined) => {
  const ref = useRef<{ blob: Blob; objectURL: string }[]>([]);

  useEffect(() => {
    if (ref.current == data) {
      return;
    }

    ref.current.forEach((v) => URL.revokeObjectURL(v.objectURL));
    ref.current = data ?? [];
    return () => ref.current.forEach((v) => URL.revokeObjectURL(v.objectURL));
  }, [data]);
};
