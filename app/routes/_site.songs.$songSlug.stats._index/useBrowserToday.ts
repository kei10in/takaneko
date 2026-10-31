import { useEffect, useState } from "react";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";

export const useBrowserToday = () => {
  // SSR の日時を使わず、ブラウザの暦日で集計します。
  const [today, setToday] = useState<NaiveDate>();
  useEffect(() => {
    const update = () => {
      const date = NaiveDate.today();
      setToday((previous) => (previous?.equals(date) ? previous : date));
    };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return today;
};
