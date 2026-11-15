import { LiveCategoryEnum } from "~/features/events/LiveCategory.ts";
import type { LiveCounts } from "./liveStatsData.ts";

export const emptyLiveCounts = (): LiveCounts => ({
  total: 0,
  solo: 0,
  hosted: 0,
  joint: 0,
  "event-live": 0,
  "release-event": 0,
});

export const aggregateLiveCounts = (rows: LiveCounts[], divisor = 1): LiveCounts => {
  const sum = (key: keyof LiveCounts) => rows.reduce((total, row) => total + row[key], 0) / divisor;
  return LiveCategoryEnum.options.reduce(
    (counts, category) => ({ ...counts, [category]: sum(category) }),
    { ...emptyLiveCounts(), total: sum("total") },
  );
};
