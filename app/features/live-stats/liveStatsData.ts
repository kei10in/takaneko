import { z } from "zod/v4";

const Count = z.number().int().nonnegative();

const StageCounts = z.object({
  count: Count,
  soloStages: Count,
  jointStages: Count,
  releaseEventStages: Count,
  otherStages: Count,
});

export type StageCounts = z.infer<typeof StageCounts>;

const LiveStatsMetrics = StageCounts.extend({
  events: Count,
  days: Count,
});

export type LiveStatsMetrics = z.infer<typeof LiveStatsMetrics>;

export const LiveStatsData = z.object({
  aggregatedOn: z.iso.date(),
  monthly: z.array(
    LiveStatsMetrics.extend({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/u) }),
  ),
  careerYearly: z.array(LiveStatsMetrics.extend({ year: z.number().int().positive() })),
});

export type LiveStatsData = z.infer<typeof LiveStatsData>;
