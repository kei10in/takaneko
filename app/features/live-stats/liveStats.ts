import { DebutDate } from "~/constants.ts";
import type { Act } from "~/features/events/act.ts";
import type { EventMeta } from "~/features/events/eventMeta.ts";
import { getLiveCategory } from "~/features/events/LiveCategory.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import type { LiveStatsData, LiveStatsMetrics } from "./liveStatsData.ts";

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

const aggregatePeriod = (events: EventMeta[]): LiveStatsMetrics => {
  const stages = events.map((event) => ({
    category: event.liveType == undefined ? undefined : getLiveCategory(event.liveType),
    count: event.acts.filter(isPerformedLiveAct).length,
  }));
  const count = stages.reduce((sum, stage) => sum + stage.count, 0);
  const solo = stages.filter((stage) => stage.category === "solo");
  const hosted = stages.filter((stage) => stage.category === "hosted");
  const joint = stages.filter((stage) => stage.category === "joint");
  const release = stages.filter((stage) => stage.category === "release-event");
  const eventLive = stages.filter((stage) => stage.category === "event-live");
  const soloStages = solo.reduce((sum, stage) => sum + stage.count, 0);
  const hostedStages = hosted.reduce((sum, stage) => sum + stage.count, 0);
  const jointStages = joint.reduce((sum, stage) => sum + stage.count, 0);
  const releaseEventStages = release.reduce((sum, stage) => sum + stage.count, 0);
  return {
    events: events.length,
    soloEvents: solo.length,
    hostedEvents: hosted.length,
    jointEvents: joint.length,
    releaseEvents: release.length,
    otherEvents: eventLive.length,
    days: new Set(events.map((event) => event.date)).size,
    count,
    soloStages,
    hostedStages,
    jointStages,
    releaseEventStages,
    otherStages: eventLive.reduce((sum, stage) => sum + stage.count, 0),
  };
};

export const aggregateStageHistory = (
  events: EventMeta[],
  today: string,
): Pick<LiveStatsData, "monthly" | "careerYearly"> => {
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
  return { monthly, careerYearly };
};
