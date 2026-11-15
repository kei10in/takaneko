import { z } from "zod/v4";
import { LiveCategoryEnum, type LiveCategory } from "~/features/events/LiveCategory.ts";

const Count = z.number().int().nonnegative();

export const LiveCounts = z.object({
  total: Count,
  solo: Count,
  hosted: Count,
  joint: Count,
  "event-live": Count,
  "release-event": Count,
}) satisfies z.ZodType<Record<"total" | LiveCategory, number>>;

export type LiveCounts = z.infer<typeof LiveCounts>;

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
