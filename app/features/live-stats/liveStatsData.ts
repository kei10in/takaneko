import { z } from "zod/v4";
import { LiveCounts } from "./liveCounts.ts";

const Count = z.number().int().nonnegative();

const StageCounts = z.object({
  count: Count,
  soloStages: Count,
  hostedStages: Count,
  jointStages: Count,
  releaseEventStages: Count,
  otherStages: Count,
});

export type StageCounts = z.infer<typeof StageCounts>;

const EventCounts = z.object({
  events: Count,
  soloEvents: Count,
  hostedEvents: Count,
  jointEvents: Count,
  releaseEvents: Count,
  otherEvents: Count,
});

export type EventCounts = z.infer<typeof EventCounts>;

const LiveStatsMetrics = StageCounts.extend({
  ...EventCounts.shape,
  days: Count,
});

export type LiveStatsMetrics = z.infer<typeof LiveStatsMetrics>;

export const LiveStatsData = z.object({
  aggregatedOn: z.iso.date(),
  summary: z.object({
    events: Count,
    stages: Count,
    days: Count,
    soloStages: Count,
    jointStages: Count,
  }),
  monthlyEvents: z.array(
    LiveCounts.extend({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/u) }),
  ),
  careerYearlyEvents: z.array(LiveCounts.extend({ year: z.number().int().positive() })),
  monthly: z.array(
    LiveStatsMetrics.extend({ month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/u) }),
  ),
  careerYearly: z.array(LiveStatsMetrics.extend({ year: z.number().int().positive() })),
});

export type LiveStatsData = z.infer<typeof LiveStatsData>;
