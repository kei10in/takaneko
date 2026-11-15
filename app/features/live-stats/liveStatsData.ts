import { z } from "zod/v4";
import { LiveCounts } from "./liveCounts.ts";

const Count = z.number().int().nonnegative();

const MonthlyLiveCounts = LiveCounts.extend({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/u),
});
export type MonthlyLiveCounts = z.infer<typeof MonthlyLiveCounts>;

const CareerYearlyLiveCounts = LiveCounts.extend({ year: z.number().int().positive() });

export const LiveStatsData = z.object({
  aggregatedOn: z.iso.date(),
  summary: z.object({
    events: Count,
    stages: Count,
    days: Count,
    soloStages: Count,
    jointStages: Count,
  }),
  monthlyEvents: z.array(MonthlyLiveCounts),
  careerYearlyEvents: z.array(CareerYearlyLiveCounts),
  monthlyStages: z.array(MonthlyLiveCounts),
  careerYearlyStages: z.array(CareerYearlyLiveCounts),
});

export type LiveStatsData = z.infer<typeof LiveStatsData>;
