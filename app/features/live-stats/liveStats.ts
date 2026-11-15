import { DebutDate } from "~/constants.ts";
import type { Act } from "~/features/events/act.ts";
import type { EventMeta } from "~/features/events/eventMeta.ts";
import { getLiveCategory } from "~/features/events/LiveCategory.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { emptyLiveCounts, type LiveCounts } from "./liveCounts.ts";
import type { LiveStatsData, LiveStatsMetrics } from "./liveStatsData.ts";
import { buildLiveStatsSummary } from "./liveStatsSummary.ts";

const isPerformedLiveAct = (act: Act) => act.types.includes("LIVE") && act.status == undefined;

const performedLiveEvents = (events: EventMeta[], today: string) =>
  // 当日は公演が終了しているとは限らないため、前日までの出演を集計する。
  events.filter(
    (event) =>
      event.date < today &&
      event.liveType != undefined &&
      event.status == undefined &&
      event.acts.some(isPerformedLiveAct),
  );

const aggregatePeriod = (
  events: EventMeta[],
): LiveStatsMetrics & { eventCounts: LiveCounts; stageCounts: LiveCounts } => {
  const stages = events.map((event) => ({
    category: event.liveType == undefined ? undefined : getLiveCategory(event.liveType),
    count: event.acts.filter(isPerformedLiveAct).length,
  }));
  const eventCounts = stages.reduce(
    (counts, stage) =>
      stage.category == undefined
        ? counts
        : { ...counts, total: counts.total + 1, [stage.category]: counts[stage.category] + 1 },
    emptyLiveCounts(),
  );
  const stageCounts = stages.reduce(
    (counts, stage) =>
      stage.category == undefined
        ? counts
        : {
            ...counts,
            total: counts.total + stage.count,
            [stage.category]: counts[stage.category] + stage.count,
          },
    emptyLiveCounts(),
  );
  return {
    eventCounts,
    stageCounts,
    events: eventCounts.total,
    soloEvents: eventCounts.solo,
    hostedEvents: eventCounts.hosted,
    jointEvents: eventCounts.joint,
    releaseEvents: eventCounts["release-event"],
    otherEvents: eventCounts["event-live"],
    days: new Set(events.map((event) => event.date)).size,
    count: stageCounts.total,
    soloStages: stageCounts.solo,
    hostedStages: stageCounts.hosted,
    jointStages: stageCounts.joint,
    releaseEventStages: stageCounts["release-event"],
    otherStages: stageCounts["event-live"],
  };
};

export const aggregateStageHistory = (
  events: EventMeta[],
  today: string,
): Pick<
  LiveStatsData,
  | "monthly"
  | "careerYearly"
  | "monthlyEvents"
  | "careerYearlyEvents"
  | "monthlyStages"
  | "careerYearlyStages"
> => {
  const liveEvents = performedLiveEvents(events, today);
  const monthly = [...new Set(liveEvents.map((event) => event.date.slice(0, 7)))]
    .toSorted()
    .map((month) => ({
      month,
      ...aggregatePeriod(liveEvents.filter((event) => event.date.startsWith(month))),
    }));
  const current = NaiveDate.parseUnsafe(today);
  const anniversary = new NaiveDate(current.year, DebutDate.month, DebutDate.day);
  const careerCount = Math.max(
    0,
    current.year - DebutDate.year + (current.compareTo(anniversary) >= 0 ? 1 : 0),
  );
  // 活動年は月の途中で区切るため、月別データからではなくイベントの日付から集計する。
  const careerYearly = Array.from({ length: careerCount }, (_, index) => {
    const start = new NaiveDate(DebutDate.year + index, DebutDate.month, DebutDate.day).toString();
    const end = new NaiveDate(
      DebutDate.year + index + 1,
      DebutDate.month,
      DebutDate.day,
    ).toString();
    return {
      year: index + 1,
      ...aggregatePeriod(liveEvents.filter((event) => start <= event.date && event.date < end)),
    };
  });
  return {
    monthlyEvents: monthly.map(({ month, eventCounts }) => ({ month, ...eventCounts })),
    careerYearlyEvents: careerYearly.map(({ year, eventCounts }) => ({ year, ...eventCounts })),
    monthlyStages: monthly.map(({ month, stageCounts }) => ({ month, ...stageCounts })),
    careerYearlyStages: careerYearly.map(({ year, stageCounts }) => ({ year, ...stageCounts })),
    monthly: monthly.map(({ eventCounts: _, stageCounts: __, ...row }) => row),
    careerYearly: careerYearly.map(({ eventCounts: _, stageCounts: __, ...row }) => row),
  };
};

export const buildLiveStatsData = (events: EventMeta[], today: string): LiveStatsData => {
  const history = aggregateStageHistory(events, today);
  return {
    aggregatedOn: today,
    summary: buildLiveStatsSummary(history.monthly),
    ...history,
  };
};
