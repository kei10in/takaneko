import type { Act } from "~/features/events/act.ts";
import type { EventMeta } from "~/features/events/eventMeta.ts";
import type { LiveStatsSummary } from "./liveStatsData.ts";

const isPerformedLiveAct = (act: Act) => act.types.includes("LIVE") && act.status == undefined;

export const aggregateLiveStats = (events: EventMeta[], today: string): LiveStatsSummary => {
  // 当日は公演が終了しているとは限らないため、前日までの出演を集計する。
  const liveEvents = events.filter(
    (event) =>
      event.date < today && event.status == undefined && event.acts.some(isPerformedLiveAct),
  );
  const stages = liveEvents.map((event) => ({
    type: event.liveType,
    count: event.acts.filter(isPerformedLiveAct).length,
  }));

  return {
    events: liveEvents.length,
    days: new Set(liveEvents.map((event) => event.date)).size,
    stages: stages.reduce((sum, stage) => sum + stage.count, 0),
    soloStages: stages
      .filter((stage) => stage.type === "SOLO")
      .reduce((sum, stage) => sum + stage.count, 0),
    jointStages: stages
      .filter((stage) => ["JOINT", "HOSTED", "FESTIVAL"].some((type) => type === stage.type))
      .reduce((sum, stage) => sum + stage.count, 0),
  };
};
