import { liveCategories, type LiveCategory } from "~/features/events/LiveCategory.ts";
export type StageHistoryFilter = "all" | LiveCategory;

export interface StageHistorySeries {
  key: LiveCategory;
  label: string;
}

export const stageHistorySeries: StageHistorySeries[] = [
  { key: "solo", label: liveCategories["solo"].abbrevName },
  { key: "hosted", label: liveCategories["hosted"].abbrevName },
  { key: "joint", label: liveCategories["joint"].abbrevName },
  { key: "release-event", label: liveCategories["release-event"].abbrevName },
  { key: "event-live", label: liveCategories["event-live"].abbrevName },
];
