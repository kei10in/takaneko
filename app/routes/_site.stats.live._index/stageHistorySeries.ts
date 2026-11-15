import { liveCategories } from "~/features/events/LiveCategory.ts";
export type StageHistorySeriesKey =
  "soloStages" | "hostedStages" | "jointStages" | "releaseEventStages" | "otherStages";

export type StageHistoryFilter = "all" | StageHistorySeriesKey;

export interface StageHistorySeries {
  key: StageHistorySeriesKey;
  label: string;
}

export const stageHistorySeries: StageHistorySeries[] = [
  { key: "soloStages", label: liveCategories["solo"].abbrevName },
  { key: "hostedStages", label: liveCategories["hosted"].abbrevName },
  { key: "jointStages", label: liveCategories["joint"].abbrevName },
  { key: "releaseEventStages", label: liveCategories["release-event"].abbrevName },
  { key: "otherStages", label: liveCategories["event-live"].abbrevName },
];
