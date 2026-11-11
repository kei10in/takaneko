import { z } from "zod/v4";

const Count = z.number().int().nonnegative();

const LiveStatsSummary = z.object({
  events: Count,
  days: Count,
  stages: Count,
  soloStages: Count,
  jointStages: Count,
});

export type LiveStatsSummary = z.infer<typeof LiveStatsSummary>;

export const LiveStatsData = z.object({
  aggregatedOn: z.iso.date(),
  summary: LiveStatsSummary,
});

export type LiveStatsData = z.infer<typeof LiveStatsData>;
